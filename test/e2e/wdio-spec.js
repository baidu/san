describe('San spec runner in browser', function() {

    it('should passed', function() {


        // open url
        browser.url('http://127.0.0.1:8009/test/?trigger=wd');

        // ready
        browser.waitForExist('body');

        // wait result
        browser.waitUntil(() => {

            // poll bridge data
            var tick = browser.executeAsync(function(done) {
                window.WDBridge.nextTick(done);
            });

            // trigger events
            var action = tick.value.action;

            if (action) {
                var act = action.split(':');
                var actName = act[0].trim();
                var actParams = act[1].trim().split('|');
                browser[actName].apply(browser, actParams);
            }

            // check alert
            var alert = browser.getText('.jasmine-alert');

            return !!alert;

        }, jasmine.DEFAULT_TIMEOUT_INTERVAL);

        // log result
        var alert = browser.getText('.jasmine-alert').replace('\n', ' - ');
        console.log(alert);

        // check result
        var failures = browser.getText('.jasmine-failures');
        expect(failures).toBe('');


    });


});
