var san = require('../../dist/san.all');
var swig  = require('swig');


let App = san.defineComponent({
    template: `<div id='app'><ul><li san-for='item in items'>{{item}}</li></ul></div>`

});


var items = [];
for (var i = 0; i < 10000; i++) {
    items.push(i)
}



var renderer = san.compileToRenderer(App);
var swigRenderer = swig.compile(`<div id='app'><ul>{% for item in items %}<li>{{item}}</li>{% endfor %}</ul></div>`);
var data = {items};

var now2 = new Date();
for (var i = 0; i < 100; i++) {
    renderer(data);
}
var runtime2 = (new Date) - now2;
console.log(runtime2 / 100)

var now = new Date();
for (var i = 0; i < 100; i++) {
    swigRenderer(data);
}
var runtime = (new Date) - now;
console.log(runtime / 100)


