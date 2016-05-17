// define(function () {
    var ElementPhase = {
        INITED: 1,
        READY: 2,
        RENDERED: 3
    };


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
                    value = evalExpr(bind.expr, element.model);
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
        this.owner = owner;

        this.model = model;
        this.childs = [];

        //this.prepare();
        if (this.el) {
            this.lifeCycle = ElementPhase.RENDERED;
        }
    }

    Element.prototype.init = function (options) {

        this.lifeCycle = ElementPhase.INITED;
    };

    Element.prototype.genHTML = function () {
        var ci = this._ci_;
        var buf = new util.StringBuffer();

        var forDirective = ci.directives && ci.directives.getByName('for');
        if (forDirective) {
            var forData = this.model.get(forDirective.list);
            for (var i = 0; i < forData.length; i++) {
                var itemModel = new Model(this.model);
                model.set(forDirective.item, forData[i]);
                forDirective.index && model.set(forDirective.index, i);

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
        this.owner = owner;
        this.model = model;
        this.expr = parser.text(ci.text);
    }

    TextNode.prototype.genHTML = function () {
        return evalExpr(this.expr, this.model);
    };


    var node = {
        Element: Element,
        Root: RootElement,
        Text: TextNode
    };
// })
