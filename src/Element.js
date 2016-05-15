
//define(function () {
    function Element(options) {
        Object.assign(this, options);
        this.options = options;
        this.attrs = {id: guid()};
        this.events = {};

        this.childs = [];
    }

    Element.prototype.htmlTextHead = function (data, extraData, elId) {
        var text = '<' + this.type;
        var itemData;
        if (elId) {
            text += ' data-context="1"';
        }
        elId = elId || this.attrs.id || guid();


        text += ' id="' + elId + '"';

        for (var key in this.attrs) {
            var value = this.attrs[key];
            if (typeof value !== 'string') {
                value = data[value];
            }

            if (key !== 'id')
                text += ' ' + key + '="' + value + '"';
        }

        for (var key in this.events) {
            var value = this.events[key];

            text += ' ' + key + '-expr="' + value.expr + '"';
        }

        text += '>';
        return text
    };

    Element.prototype.htmlTextFoot = function (data, extraData) {
        if (!SELF_CLOSE_TAG[this.type]) {
            return '</' + this.type + '>';
        }

        return ''
    };

    Element.prototype.htmlText = function (data, extraData) {
        this.parse();

        if (this.forDirective) {
            var text = ''
            var forData = data[this.forDirective.list];
            for (var i = 0, l = forData.length; i < l; i++) {
                data[this.forDirective.item] = forData[i];
                var itemId = guid();
                elementData[itemId] = {item: forData[i], index:i}
                var itemEl = new Element({parent: this, type: this.type});
                itemEl.attrs.id = itemId;
                // itemEl.attrs = this.attrs;
                this.childs.push(itemEl)

                text += this.htmlTextHead(data, extraData, itemId);
                for (var j = 0, l2 = this.templateChilds.length; j < l2; j++) {
                    var el = this.templateChilds[j].clone();
                    itemEl.childs.push(el);
                    text += el.htmlText(data, {item: forData[i], index:i});
                }
                text += this.htmlTextFoot();
                data[this.forDirective.item] = null;
            }

            return text
        }
        else {
            var text = this.htmlTextHead(data, extraData)
            for (var i = 0, j = this.childs.length; i < j; i++) {
                text += this.childs[i].htmlText(data);
            }
            text += this.htmlTextFoot();
        }

        return text;
    };

    Element.prototype.parse = function () {
        for (var key in this.attrs) {
            var value = this.attrs[key];
            if (key.indexOf('3:') === 0) {
                delete this.attrs[key];
                key = key.slice(2);
                this.attrs[key] = {
                    expr: value
                };
            }
            else if (key.indexOf('for') === 0) {

                delete this.attrs[key];
                var forMatch = /^\s*([0-9a-z_-]+)\s+in\s+([0-9a-z_-]+)\s*$/i.exec(value);
                this.forDirective = {
                    list: forMatch[2],
                    item: forMatch[1]
                };
                this.templateChilds = this.childs;
                this.childs = [];
            }
            else if (key.indexOf('on:')===0) {
                delete this.attrs[key];
                key = key.slice(3);
                var match = value.match(/^([a-z0-9_-]+)(\(([\s\S]*)\))?$/i);
                var funcName = match[1];
                var callArgs = match[3] && match[3].split(',') || [];
                this.events[key] = {
                    expr: funcName + ',' + callArgs.join(',')
                };
            }
        }
    };

    Element.prototype.setProp = function (name, value) {
        document.getElementById(this.attrs.id)[name] = value;
    };

    Element.prototype.update = function (data) {
        for (var key in this.attrs) {
            var value = this.attrs[key];

            if (typeof value !== 'string') {
                this.setProp(key, data[value.expr]);
            }
        }
        for (var i = 0, j = this.childs.length; i < j; i++) {
            this.childs[i].update(data);
        }
    };

    Element.prototype.setOwner = function (owner) {
        this.owner = owner;
        for (var i = 0, j = this.childs.length; i < j; i++) {
            this.childs[i].setOwner(owner);
        }
    };

    Element.prototype.dispose = function () {
        var el = document.getElementById(this.attrs.id);
        el.parentNode.removeChild(el)
    };

    Element.prototype.updateDirective = function (directive) {
        if (this.forDirective) {
            if (directive.type === 'OBJECT_CHANGE') {
                var forDirective = this.forDirective;
                if (forDirective.list === directive.path[0]) {
                    this.childs[directive.path[1]].updateDirective({
                        path: ['item'].concat(directive.path.slice(2)),
                        value: directive.value
                    });
                }
            }
            else if (directive.type === 'ARRAY_REMOVE') {
                this.childs[directive.index].dispose();
                this.childs.splice(directive.index)
            }
            return;
        }

        // for (var key in this.attrs) {
        //     var value = this.attrs[key];

        //     if (typeof value !== 'string') {
        //         this.setProp(key, data[value.expr]);
        //     }
        // }

        switch (directive) {

        }

        for (var i = 0, j = this.childs.length; i < j; i++) {
            this.childs[i].updateDirective(directive);
        }
    };

    Element.prototype.clone = function () {
        var Constructor = this.constructor;
        var el = new Constructor(this.options);
        el.attrs = {};
        for (var key in this.attrs) {
            if (key === 'id') continue
            el.attrs[key] = this.attrs[key]
        }
        el.owner = this.owner;
        var childs = this.templateChilds || this.childs;
        for (var i = 0, l = childs.length; i < l; i++) {
            el.childs.push(childs[i].clone())
        }

        return el;
    };
//})



var elementData = {};
