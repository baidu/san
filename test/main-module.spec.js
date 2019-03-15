describe("Main Module", function () {

    it("nextTick work async", function (done) {
        var div = document.createElement('div');
        document.body.appendChild(div);

        san.nextTick(function () {
            div.setAttribute('data-vm', 'vm');
        });

        expect(div.getAttribute('data-vm')).toBeNull();
        setTimeout(function () {
            expect(div.getAttribute('data-vm')).toBe('vm');
            document.body.removeChild(div);
            done();
        }, 10)

    });

    it("parseExpr by false value", function () {
        expect(san.parseExpr()).toBeUndefined();
    });

    it("parseExpr with a static string", function () {
        expect(san.parseExpr('"aaa\\nbbb"').value).toBe('aaa\nbbb');
    });

    it("defineComponent by function should return itself", function () {
        function a() {}
        expect(san.defineComponent(a)).toBe(a);
    });

    it("defineComponent by string should throw Error", function () {
        expect(function () {
            san.defineComponent('test');
        }).toThrowError('[SAN FATAL] defineComponent need a plain object.');
    });



});
