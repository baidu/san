
var elementInit = require('./element-init');
var elementOwnGenHTML = require('./element-own-gen-html');
var elementOwnCreate = require('./element-own-create');
var elementOwnAttach = require('./element-own-attach');
var elementOwnAttached = require('./element-own-attached');
var elementOwnDetach = require('./element-own-detach');
var elementOwnDispose = require('./element-own-dispose');
var elementOwnUpdateView = require('./element-own-update-view');
var nodeOwnToPhase = require('./node-own-to-phase');
var nodeOwnToAttached = require('./node-own-to-attached');
var elementOwnPushChildANode = require('./element-own-push-child-anode');

function createElement(options) {
    var element = nodeInit(options);
    
    element.genHTML = elementOwnGenHTML;
    element.updateView = elementOwnUpdateView;
    element.create = elementOwnCreate;
    element.attach = elementOwnAttach;
    element._attached = elementOwnAttached;
    element.detach = elementOwnDetach;
    element.dispose = elementOwnDispose;
    element.setProp = elementOwnSetProp;
    element._getEl = elementOwnGetEl;
    element._toPhase = nodeOwnToPhase;
    element._toAttached = nodeOwnToAttached;
    element._pushChildANode = elementOwnPushChildANode;
    element._initFromEl = elementOwnInitFromEl;

    elementInit(element, options);
    element.lifeCycle.set('inited');
    return element;
}


exports = module.exports = createElement;
