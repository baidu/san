describe("parse", function () {

    it("template text", function () {
        var anode = san.parseTemplate('hello san');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.value).toBe('hello san');

    });

    it("leading whitespaces should be ignore", function () {
        var anode = san.parseTemplate('   \t\r\n <div></div>');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].tagName).toBe('div');

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

    it("template contain tag like text, start with string and interp", function () {
        var anode = san.parseTemplate('hello {{name}}!<dd');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.segs.length).toBe(3);
        expect(anode.children[0].textExpr.segs[0].value).toBe('hello ');
        expect(anode.children[0].textExpr.segs[2].value).toBe('!<dd');

    });

    it("template contain tag like text, start with interp", function () {
        var anode = san.parseTemplate('{{name}}<dd title="good job"');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.segs.length).toBe(2);
        expect(anode.children[0].textExpr.segs[1].value).toBe('<dd title="good job"');

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

    it("template contain tag+attr+equal like text, interp mixed", function () {
        var anode = san.parseTemplate('hello {{name}}<dd id');
        expect(anode.children.length).toBe(1);
        expect(anode.children[0].textExpr.segs.length).toBe(3);
        expect(anode.children[0].textExpr.segs[0].value).toBe('hello ');
        expect(anode.children[0].textExpr.segs[2].value).toBe('<dd id');

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

    it("template contain tag+invalid-attr like text, end with interp and text", function () {
        var anode = san.parseTemplate('hello san<dd {{id}} name value {{n}}dd');
        expect(anode.children.length).toBe(1);

        expect(anode.children[0].textExpr.segs.length).toBe(5);
        expect(anode.children[0].textExpr.segs[0].value).toBe('hello san<dd ');
        expect(anode.children[0].textExpr.segs[1].value).toBeUndefined();
        expect(anode.children[0].textExpr.segs[2].value).toBe(' name value ');
        expect(anode.children[0].textExpr.segs[3].value).toBeUndefined();
        expect(anode.children[0].textExpr.segs[4].value).toBe('dd');

    });

    it("template contain tag+attr like text and tag", function () {
        var anode = san.parseTemplate('<div id= <u>dd</u>');
        expect(anode.children.length).toBe(2);
        expect(anode.children[0].textExpr.value).toBe('<div id= ');
        expect(anode.children[1].tagName).toBe('u');

    });
});
