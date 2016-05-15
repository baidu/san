//define(function () {
    function componentCallHook(component, name) {
        if (component[name]) {
            component[name].call(component, name);
        }
    }

    function Component(options) {
        options = options || {};
        this.el = options.el;
        this.tagName = options.tagName || 'div';
        this.template = options.template;
        this.model = new Model();

        util.extend(this, options.methods);

        if (this.template) {
            this._ci_ = parser.template(this.template);
        }
        else if (this.el) {
            this._ci_ = parser.fromDOM(this.el);
        }
        else {
            this._ci_ = {};
        }

        this._vdom_ = new node.Root(this._ci_, this, this.model);

        componentCallHook(this, 'compiled');

        if (this.el && this.el.parentNode) {
            componentCallHook(this, 'attached');
        }
    }

    Component.prototype.set = function () {

    };



    Component.prototype.attach = function (parent) {
        if (!this.el) {
            this.el = document.createElement(this.tagName);
        }

        this.el.innerHTML = this._vdom_.genHTML();
        parent.appendChild(this.el);

        var me = this;
        this.el.onclick = function (e) {
            var target = e.target;
            var clickExpr = target.getAttribute('click-expr');

            var contextData = {};
            while (target && target.nodeType === 1) {
                if (target.getAttribute('data-context')) {

                    contextData = elementData[target.id];
                    break;
                }
                target = target.parentNode;
            }

            if (clickExpr) {
                clickExpr = clickExpr.split(',');
                var methodName = clickExpr[0];
                var args = [];
                for (var i = 1; i < clickExpr.length; i++) {
                    var argName = clickExpr[i];
                    var arg;
                    if (argName === '$event') {
                        arg = e;
                    }
                    else {
                        argName = argName.slice(1);
                        arg = contextData[argName];
                        if (arg == null) {
                            arg = me.data[argName];
                        }
                    }

                    args[i - 1] = arg;
                }

                me.methods[methodName].apply(me, args);
            }
        };
    };

    Component.prototype.compile = function () {
        this.struction = parse(this.template || '');
    };

    Component.prototype.fromDOM = function (el) {
        this.el = el;
        this.attach();
    };

    Component.prototype.appendTo = function (target) {
        this.compile();
        this.attach();
        target.appendChild(this.el);
    };

    Component.prototype.render = function () {
        this.struction.update(this.data);
    };

    Component.prototype.$set = function (prop, value) {
        var data = this.data;
        for (var i = 0, l = prop.length; i < l - 1; i++) {
            data = data[prop[i]];
        }

        data[prop[l - 1]] = value;

        this.struction.updateDirective({type: 'OBJECT_CHANGE', path: prop, value: value});
    };

    Component.prototype.$remove = function (prop, value) {
        var data = this.data;
        for (var i = 0, l = prop.length; i < l; i++) {
            data = data[prop[i]];
        }

        var len = data.length;
        while (len--) {
            if (data[len] === value) {
                data.splice(len, 1);
                break;
            }
        }

        this.struction.updateDirective({type: 'ARRAY_REMOVE', path: prop, index: len});
    };
//})
