// define(function () {
    var ElementPhase = {
        INITED: 1,
        READY: 2,
        RENDERED: 3
    };

    var BindingType = {
        STATIC: 1,
        NORMAL: 2,
        EVENT: 3
    };




    function elementGenStartHTML(stringBuffer, element) {
        var ci = element._ci_;

        stringBuffer.push('<');
        stringBuffer.push(ci.type);

        ci.id = ci.id || util.guid();

        stringBuffer.push(' id="');
        stringBuffer.push(ci.id);
        stringBuffer.push('"');

        ci.binds && ci.binds.each(function (item) {

            var value;
            switch (item.type) {
                case 'text':
                console.log(item)
                    value = evalTextSegs(item.expr, element.model)
                    break;
                case 'bind':
                    value = element.model.get(item);
            }

            stringBuffer.push(' ');
            stringBuffer.push(item.name);
            stringBuffer.push('="');
            stringBuffer.push(value);
            stringBuffer.push('"');
        });

        for (var key in this.attrs) {
            var value = this.attrs[key];
            if (typeof value !== 'string') {
                value = data[value];
            }

            if (key !== 'id')
                text += ' ' + key + '="' + value + '"';
        }

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

        if (!util.tagIsAutoClose(tagName)) {
            stringBuffer.push('</');
            stringBuffer.push(tagName);
            stringBuffer.push('>');
        }
    }

    function createNode(ci, owner, model) {
        if (ci.type === 'text') {
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
                        events: ci.events,
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
        this.segs = parser.text(ci.text);
    }

    TextNode.prototype.genHTML = function () {
        return evalTextSegs(this.segs, this.model);
    };

    function evalInterpolation(interpo, model) {
        // TODO: filters
        return evalExprValue(interpo.expr, model);
    }

    function evalTextSegs(segs, model) {
        var buf = new util.StringBuffer();
        for (var i = 0; i < segs.length; i++) {
            var seg = segs[i];
            if (typeof seg === 'string') {
                buf.push(seg);
            }
            else {
                buf.push(evalInterpolation(seg, model));
            }
        }

        return buf.toString();
    }

    var node = {
        Element: Element,
        Root: RootElement,
        Text: TextNode
    };
// })
