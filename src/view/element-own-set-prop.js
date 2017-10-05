function elementOwnSetProp(name, value) {
    getPropHandler(this, name).input.prop(this, name, value);
}

exports = module.exports = elementOwnSetProp;
