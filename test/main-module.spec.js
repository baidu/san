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

    it("Data new and get", function () {
        var data = new san.Data();
        expect(data.get('a.b')).toBeUndefined();

        data.set('a.b', 1);
        expect(data.get('a.b')).toBe(1);

        data = new san.Data({a:1});
        expect(data.get('a')).toBe(1);
    });

    it("Data get by no arg, return raw object", function () {
        var data = new san.Data();

        data.set('a.b', 1);
        expect(data.get().a.b).toBe(1);
        expect(typeof data.get().a).toBe('object');
    });

    san.debug && it("Data set should throw error when arg is not accessor expr", function () {
        var data = new san.Data();


        expect(function () {
            data.set('a-b', 1);
        }).toThrowError(/Invalid Expression in Data set/);
    });

    san.debug && it("Data apply should throw error when arg is invalid", function () {
        var data = new san.Data({
            a: 1
        });

        expect(function () {
            data.apply('a-b', function (v) {
                return v;
            });
        }).toThrowError(/Invalid Expression in Data apply/);

        expect(function () {
            data.apply('a');
        }).toThrowError(/Invalid Argument/);

        data.apply('a', function (v) {
            return v + 10;
        });

        expect(data.get('a')).toBe(11);
    });

    san.debug && it("Data splice should throw error when arg is not accessor expr", function () {
        var data = new san.Data({a: []});


        expect(function () {
            data.splice('a-b', 1);
        }).toThrowError(/Invalid Expression in Data splice/);
    });

    san.debug && it("Data merge should throw error when arg is invalid", function () {
        var data = new san.Data({
            a: {a:2}
        });

        expect(function () {
            data.merge('a-b', {b:1});
        }).toThrowError(/Invalid Expression in Data merge/);


        expect(function () {
            data.merge('b', 2);
        }).toThrowError(/Merge Expects a Target of Type/);

        expect(function () {
            data.merge('a', 2);
        }).toThrowError(/Merge Expects a Source of Type/);

        data.merge('a', { b: 1 });

        expect(data.get('a.a')).toBe(2);
        expect(data.get('a.b')).toBe(1);
    });

    it("Data splice, index out of range", function () {
        var data = new san.Data({ a: [1, 2] });

        data.splice('a', [10, 0, 3]);
        expect(data.get('a.length')).toBe(3);
        expect(data.get('a[2]')).toBe(3);

        data.splice('a', [-1, 1]);
        expect(data.get('a.length')).toBe(2);
        expect(data.get('a[1]')).toBe(2);

        data.splice('a', [-5, 0, 3]);
        expect(data.get('a.length')).toBe(3);
        expect(data.get('a[2]')).toBe(2);
        expect(data.get('a[0]')).toBe(3);
    });

    it("defineComponent by function should return itself", function () {
        function a() {}
        expect(san.defineComponent(a)).toBe(a);
    });

    san.debug && it("defineComponent by string should throw Error", function () {
        expect(function () {
            san.defineComponent('test');
        }).toThrowError('[SAN FATAL] defineComponent need a plain object.');
    });



});
