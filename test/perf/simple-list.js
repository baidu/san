var san = require('../../dist/san.ssr');
var swig  = require('swig');
var art = require('art-template');


let App = san.defineComponent({
    template: `<div id='app'><ul><li s-for='item in items'>{{item}}</li></ul></div>`
});


var items = [];
for (var i = 0; i < 10000; i++) {
    items.push(i)
}
var data = {items};



var renderer = san.compileToRenderer(App);
var swigRenderer = swig.compile(`<div id='app'><ul>{% for item in items %}<li>{{item}}</li>{% endfor %}</ul></div>`);
var artRenderer = art.compile(`<div id='app'><ul>{<% for(var i = 0; i < items.length; i++){ %><li><%= items[i] %></li><% } %></ul></div>`)




var now2 = new Date();
for (var i = 0; i < 100; i++) {
    renderer(data);
}
var runtime2 = (new Date) - now2;
console.log(`san: ${runtime2 / 100}ms`);

var now = new Date();
for (var i = 0; i < 100; i++) {
    swigRenderer(data);
}
var runtime = (new Date) - now;
console.log(`swig: ${runtime / 100}ms`);


var now3 = new Date();
for (var i = 0; i < 100; i++) {
    artRenderer(data);
}
var runtime3 = (new Date) - now3;
console.log(`artTpl: ${runtime3 / 100}ms`);


