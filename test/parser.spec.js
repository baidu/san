describe("parser", function() {
    it("is exist", function() {
        expect(typeof parser).toBe('object');
    });

});

var interpolation = tpl('interpolation');

var component = new Component({template: interpolation})
setTimeout(function () {
component.attach(document.body)
}, 100);
