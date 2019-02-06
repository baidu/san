
it("custom tag name", function () {
    var ieVersionMatch = typeof navigator !== 'undefined'
        && navigator.userAgent.match(/msie\s*([0-9]+)/i);

    /**
     * ie版本号，非ie时为0
     *
     * @type {number}
     */
    var ie = ieVersionMatch ? ieVersionMatch[1] - 0 : 0;


    var wrap = document.getElementById('custom-tag-name');
    expect(wrap.getElementsByTagName('x-p').length).toBe(1);

    if (!ie || ie > 8) {
        // [inject] init

        expect(wrap.getElementsByTagName('x-p')[0].innerHTML).toContain('hello san');

        myComponent.dispose();
    }

    document.body.removeChild(wrap);

});
