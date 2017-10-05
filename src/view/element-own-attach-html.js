var attachings = require('./attachings');

function elementOwnAttachHTML(buf) {
    this.lifeCycle.set('painting');

    genElementStartHTML(this, buf);
    genElementChildsHTML(this, buf);
    genElementEndHTML(this, buf);

    attachings.add(this);
}

exports = module.exports = elementOwnAttachHTML;