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

        util.extend(this, options.methods);
        this.filters = options.filters || {};

        this._vdom_ = new node.Root(this._ci_, this, this.model);

        componentCallHook(this, 'compiled');

        if (this.el && this.el.parentNode) {
            componentCallHook(this, 'attached');
        }
    }

    Component.prototype.set = function (expr, value) {
        this.model.set(expr, value);
    };

    Component.prototype.get = function (expr) {
        return this.model.get(expr);
    };

    var DELEGATE_EVENT = ['click'];

    Component.prototype.attach = function (parent) {
        if (!this.el) {
            this.el = document.createElement(this.tagName);
        }

        this.el.innerHTML = this._vdom_.genHTML();
        parent.appendChild(this.el);

        var me = this;
        for (var i = 0; i < DELEGATE_EVENT.length; i++) {
            var eventName = DELEGATE_EVENT[i];
            util.on(this.el, eventName, util.bind(this.eventListeners[eventName], this));
        }
    };

    Component.prototype.eventListeners = {
        click: function (e) {
            var target = e.target;
            var targetElement = elements[target.id];
            console.log(targetElement)
            var bind = targetElement._ci_.binds.getByName('click');

            if (bind) {
                var bindExpr = bind.expr;

                var args = [];
                for (var i = 0; i < bindExpr.args.length; i++) {
                    var argExpr = bindExpr.args[i];
                    if (argExpr.type === ExprType.IDENT && argExpr.name === '$event') {
                        args.push(e);
                    }
                    else {
                        args.push(evalExpr(argExpr, targetElement.owner));
                    }
                }

                var method = this[bindExpr.name.name];
                console.log(bindExpr.name, targetElement.model)
                if (typeof method === 'function') {
                    method.apply(this, args);
                }
            }
        }
    }
//})
