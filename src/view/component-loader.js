

function ComponentLoader(options) {
    this.options = options;
    this.id = guid();
}

ComponentLoader.prototype._create = nodeOwnCreateStump;

ComponentLoader.prototype.attach = function (parentEl, beforeEl) {
    this._create();
    insertBefore(this.el, parentEl, beforeEl);
};

ComponentLoader.prototype.dispose = nodeOwnSimpleDispose;

exports = module.exports = ComponentLoader;
