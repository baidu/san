function elementOwnSetProp(name, value) {
    if (this.lifeCycle.is('created')) {
        getPropHandler(this, name).input.prop(this, name, value);
    }
}

exports = module.exports = elementOwnSetProp;
