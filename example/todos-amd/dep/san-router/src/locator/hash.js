

import EventTarget from 'mini-event/EventTarget';
import resoveURL from '../resolve-url';

function getLocation() {
    // Firefox下`location.hash`存在自动解码的情况，
    // 比如hash的值是**abc%3def**，
    // 在Firefox下获取会成为**abc=def**
    // 为了避免这一情况，需要从`location.href`中分解
    let index = location.href.indexOf('#');
    let url = index < 0 ? '/' : location.href.slice(index + 1);

    return url;
}

const HASHCHANGE_HANDLER_KEY = Symbol('hashchange_handler_key');


export default class Locator extends EventTarget {
    constructor() {
        super();

        this.current = getLocation();
        this.referrer = '';

        this[HASHCHANGE_HANDLER_KEY] = () => {
            this.redirect(getLocation());
        };
    }

    start() {
        window.addEventListener('hashchange', this[HASHCHANGE_HANDLER_KEY], false);
    }

    stop() {
        window.removeEventListener('hashchange', this[HASHCHANGE_HANDLER_KEY], false);
    }

    redirect(url, options = {force: false}) {
        url = resoveURL(url, this.current);
        let referrer = this.current;

        let isChanged = url !== referrer;
        if (isChanged) {
            this.referrer = referrer;
            this.current = url;
            location.hash = url;
        }
        else {
            referrer = this.referrer;
        }

        if ((isChanged || options.force) && !options.silent) {
            this.fire('redirect', {url, referrer});
        }
    }

    reload() {
        this.redirect(this.current, {force: true});
    }
}
