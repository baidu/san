describe("parse", function () {

    it("template text", function () {
        var anode = san.parseTemplate('hello san');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.value).toBe('hello san');

    });

    it("template start with tag like text", function () {
        var anode = san.parseTemplate('<dd');
        expect(anode.children[0].textExpr).not.toBeUndefined();
        expect(anode.children[0].textExpr.value).toBe('<dd');

    });

    it("template contain tag like text", function () {
        var anode = san.parseTemplate('hello san<dd');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.value).toBe('hello san<dd');

    });

    it("template contain tag+attr like text", function () {
        var anode = san.parseTemplate('hello san<dd title="good job"');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.value).toBe('hello san<dd title="good job"');

    });

    it("template contain 1+ tag+attr like text", function () {
        var anode = san.parseTemplate('hello<div id= <u {{');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.value).toBe('hello<div id= <u {{');

    });

    it("template contain tag+attr+equal like text", function () {
        var anode = san.parseTemplate('hello san<dd id=');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.value).toBe('hello san<dd id=');

    });

    it("template contain tag+inter-start like text", function () {
        var anode = san.parseTemplate('hello san<dd {{');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.value).toBe('hello san<dd {{');

    });

    it("template contain tag+invalid-attr like text", function () {
        var anode = san.parseTemplate('hello san<dd {{id}}');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.segs[0].value).toBe('hello san<dd ');
        expect(anode.children[0].textExpr.segs[1].value).toBeUndefined();

    });

    it("template contain tag+attr like text and tag", function () {
        var anode = san.parseTemplate('<div id= <u>dd</u>');
        expect(anode.children.length).toBe(2);
        expect(anode.children[0].textExpr.value).toBe('<div id= ');
        expect(anode.children[1].tagName).toBe('u');

    });
});
