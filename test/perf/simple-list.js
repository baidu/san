var san = require('../../dist/san.ssr');
var swig  = require('swig');
var art = require('art-template');


let App = san.defineComponent({
    template: `<div id='app'><ul><li s-for='item in items'>{{item}}</li></ul></div>`
});

let Item = san.defineComponent({
    template: `<li>{{item}}</li>`
});
let App2 = san.defineComponent({
    components: {
        'x-item': Item
    },
    template: `<div id='app'><ul><x-item s-for='item in items' item="{{item}}"/></ul></div>`
});


var items = [];
for (var i = 0; i < 10000; i++) {
    items.push(i)
}
var data = {items};



var renderer = san.compileToRenderer(App);
var renderer2 = san.compileToRenderer(App2);
var swigRenderer = swig.compile(`<div id='app'><ul>{% for item in items %}<li>{{item}}</li>{% endfor %}</ul></div>`);
var artRenderer = art.compile(`<div id='app'><ul>{<% for(var i = 0; i < items.length; i++){ %><li><%= items[i] %></li><% } %></ul></div>`)




var now2 = new Date();
for (var i = 0; i < 100; i++) {
    renderer(data);
}
var runtime2 = (new Date) - now2;
console.log(`san: ${runtime2 / 100}ms`);

var now1 = new Date();
for (var i = 0; i < 100; i++) {
    renderer2(data);
}
var runtime1 = (new Date) - now1;
console.log(`san(item as component): ${runtime1 / 100}ms`);

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


