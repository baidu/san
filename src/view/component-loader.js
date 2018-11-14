

function ComponentLoader(options) {
    this.options = options;
    this.id = guid();
}

ComponentLoader.prototype._create = nodeOwnCreateStump;

ComponentLoader.prototype.attach = function (parentEl, beforeEl) {
    this._create();
    insertBefore(this.el, parentEl, beforeEl);

    var startLoad = this.load();
    if (typeof startLoad.then === 'function') {
        var me = this;
        startLoad.then(
            function (RealComponent) {
                me.done(RealComponent);
            },
            function (RealComponent) {
                me.done(RealComponent)
            }
        );
    }
};

ComponentLoader.prototype.dispose = nodeOwnSimpleDispose;

ComponentLoader.prototype.done = function (ComponentClass) {
    if (this.el) {
        ComponentClass = ComponentClass || this.fallback;

        var component = new ComponentClass(this.options);
        component.attach(this.el.parentNode, this.el);

        var parentChildren = this.options.parent.children;
        var parentChildrenLen = parentChildren.length;

        while (parentChildrenLen--) {
            if (parentChildren[parentChildrenLen] === this) {
                parentChildren[parentChildrenLen] = component;
                break;
            }
        }
    }

    this.dispose();
};

exports = module.exports = ComponentLoader;
