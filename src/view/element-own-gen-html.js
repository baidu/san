function elementOwnGenHTML(buf) {
    genElementStartHTML(this, buf);
    genElementChildsHTML(this, buf);
    genElementEndHTML(this, buf);
}

exports = module.exports = elementOwnGenHTML;