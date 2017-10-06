function elementSetElProp(element, name, value) {
    getPropHandler(element, name).prop(element, name, value);
}

exports = module.exports = elementSetElProp;
