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
});
