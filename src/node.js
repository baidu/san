// define(function () {
    var ElementPhase = {
        INITED: 1,
        READY: 2,
        RENDERED: 3
    };

    var elements = {};


    function elementGenStartHTML(stringBuffer, element) {
        var ci = element._ci_;
        if (!ci.tagName) {
            return;
        }

        stringBuffer.push('<');
        stringBuffer.push(ci.tagName);

        ci.id = ci.id || util.guid();

        stringBuffer.push(' id="');
        stringBuffer.push(ci.id);
        stringBuffer.push('"');

        ci.binds && ci.binds.each(function (bind) {

            var value;
            switch (bind.type) {
                case BindType.PROP:
                    value = evalExpr(bind.expr, element.owner);
                    break;

                case BindType.EVENT:
                    //value = element.model.get(item);
                    break;
            }

            stringBuffer.push(' ');
            stringBuffer.push(bind.name);
            stringBuffer.push('="');
            stringBuffer.push(value);
            stringBuffer.push('"');
        });

        // for (var key in this.attrs) {
        //     var value = this.attrs[key];
        //     if (typeof value !== 'string') {
        //         value = data[value];
        //     }

        //     if (key !== 'id')
        //         text += ' ' + key + '="' + value + '"';
        // }

        // for (var key in this.events) {
        //     var value = this.events[key];

        //     text += ' ' + key + '-expr="' + value.expr + '"';
        // }

        stringBuffer.push('>');
    }

    function elementGenChilds(element) {
        var ci = element._ci_;

        var buf = new util.StringBuffer();

        for (var i = 0; i < ci.childs.length; i++) {
            var child = createNode(ci.childs[i], element.owner, element.model);
            element.childs.push(child);
            buf.push(child.genHTML());
        }

        return buf.toString();
    }


    function elementGenCloseHTML(stringBuffer, element) {
        var tagName = element._ci_.tagName;
        if (!tagName) {
            return;
        }


        if (!util.tagIsAutoClose(tagName)) {
            stringBuffer.push('</');
            stringBuffer.push(tagName);
            stringBuffer.push('>');
        }
    }

    function createNode(ci, owner, model) {
        if (ci.type === NodeType.TEXT) {
            return new node.Text(ci, owner, model);
        }

        return new Element(ci, owner, model);
    }

    function Element(ci, owner, model) {

        this._ci_ = ci;
        ci.id = ci.id || guid();
        elements[ci.id] = this;

        this.owner = owner;

        this.model = model;
        this.childs = [];

        //this.prepare();
        if (this.el) {
            this.lifeCycle = ElementPhase.RENDERED;
        }

        var binds = this._ci_.binds;
        if (binds) {
            var me = this;
            binds.each(function (bind) {
                if (bind.type === BindType.PROP) {
                    var bindExpr = bind.expr;
                    if (bindExpr.type === ExprType.TEXT) {
                        for (var j = 0; j < bindExpr.segs.length; j++) {
                            var seg = bindExpr.segs[j];
                            if (seg.type !== ExprType.STRING) {
                                me.model.listenChange(seg.expr, util.bind(me.modelChange, me, bind.name ));
                            }
                        }
                    }
                    else {
                        me.model.listenChange(bindExpr, util.bind(me.modelChange, me, bind.name));
                    }
                }
            });
        }
    }

    Element.prototype.init = function (options) {

        this.lifeCycle = ElementPhase.INITED;
    };

    Element.prototype.modelChange = function (name) {
        this.setProp(name, evalExpr(this._ci_.binds.getByName(name).expr, this.owner));
    };

    Element.prototype.setProp = function (name, value) {
        document.getElementById(this._ci_.id)[name] = value;
    };

    Element.prototype.refresh = function () {
        var binds = this._ci_.binds;
        var me = this;

        var propNameMap = {
            'class': 'className'
        }
        this._ci_.tagName && binds && binds.each(function (bind) {
            switch (bind.type) {
                case BindType.PROP:
                    var propName = bind.name;
                    propName = propNameMap[propName] || propName;

                    document.getElementById(me._ci_.id)[propName] = evalExpr(bind.expr, me.owner);
                    break;
            }
        });

        for (var i = 0; i < this.childs.length; i++) {
            this.childs[i].refresh();
        }
    };

    Element.prototype.genHTML = function () {
        var ci = this._ci_;
        var buf = new util.StringBuffer();

        var forDirective = ci.directives && ci.directives.getByName('for');
        if (forDirective) {
            var forData = this.model.get(forDirective.list);

            for (var i = 0; i < forData.length; i++) {
                var itemModel = new Model(this.model);
                itemModel.set(forDirective.item, forData[i]);
                forDirective.index && itemModel.set(forDirective.index, i);

                var child = createNode(
                    {
                        type: ci.type,
                        childs: ci.childs,
                        tagName: ci.tagName,
                        binds: ci.binds
                    },
                    this.owner,
                    itemModel
                );
                this.childs.push(child);
                buf.push(child.genHTML());
            }
        }
        else {
            elementGenStartHTML(buf, this);
            buf.push(elementGenChilds(this));
            elementGenCloseHTML(buf, this);
        }

        return buf.toString();
    };





    function RootElement(ci, owner, model) {
        Element.call(this, ci, owner, model);
    }

    util.inherits(RootElement, Element);

    function TextNode(ci, owner, model) {
        this._ci_ = ci;
        ci.id = ci.id || guid();
        this.owner = owner;
        this.model = model;
        this.expr = parser.text(ci.text);

        var segs = this.expr.segs;
        for (var j = 0; j < segs.length; j++) {
            var seg = segs[j];
            if (seg.type === ExprType.INTERPOLATION) {
                this.model.listenChange(seg.expr, util.bind(this.refresh, this));
            }
        }
    }

    TextNode.prototype.genHTML = function () {
        return evalExpr(this.expr, this.owner) + '<script type="text/san-vm" id="' + this._ci_.id + '"></script>';
    };

    TextNode.prototype.refresh = function () {
        var node = document.getElementById(this._ci_.id).previousSibling;
        node.textContent = evalExpr(this.expr, this.owner);
    };


    var node = {
        Element: Element,
        Root: RootElement,
        Text: TextNode
    };
// })
