describe("nextTick", function () {

    it("work async", function (done) {
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

});
