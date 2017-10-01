
var elementCreate = require('./element-create')

function elementOwnCreate() {
    if (!this.lifeCycle.is('created')) {
        elementCreate(this);
        this._toPhase('created');
    }
}

exports = module.exports = elementOwnCreate;
