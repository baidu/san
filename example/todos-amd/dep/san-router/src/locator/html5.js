

import EventTarget from 'mini-event/EventTarget';
import resoveURL from '../resolve-url';

function getLocation() {
    return location.pathname + location.search;
}

const POPSTATE_HANDLER_KEY = Symbol('popstate_handler_key');


export default class Locator extends EventTarget {
    constructor() {
        super();

        this.current = getLocation();
        this.referrer = '';

        this[POPSTATE_HANDLER_KEY] = () => {
            this.referrer = this.current;
            this.current = getLocation();

            this.fire('redirect', {
                url: this.current,
                referrer: this.referrer
            });
        };
    }

    start() {
        window.addEventListener('popstate', this[POPSTATE_HANDLER_KEY]);
    }

    stop() {
        window.removeEventListener('popstate', this[POPSTATE_HANDLER_KEY]);
    }

    redirect(url, options = {force: false}) {
        url = resoveURL(url, this.current);
        let referrer = this.current;

        let isChanged = url !== referrer;

        if (isChanged) {
            this.referrer = referrer;
            this.current = url;

            history.pushState({}, '', url);
        }

        if ((isChanged || options.force) && !options.silent) {
            this.fire('redirect', {url, referrer});
        }
    }

    reload() {
        this.fire('redirect', {
            url: this.current,
            referrer: this.referrer
        });
    }
}

Locator.isSupport = 'pushState' in window.history;
