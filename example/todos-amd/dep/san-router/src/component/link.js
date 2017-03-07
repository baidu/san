import {router} from '../main';
import resolveURL from '../resolve-url';

export default {
    template: '<a href="{{href}}" onclick="return false;" on-click="clicker($event)" target="{{target}}" class="{{class}}" style="{{style}}"><slot></slot></a>',

    clicker(e) {
        let href = this.data.get('href');

        if (typeof href === 'string') {
            router.locator.redirect(href.replace(/^#/, ''));
        }

        e.preventDefault();
    },

    attached() {
        this.computeHref();

        if (!this._toChanger) {
            this._toChanger = () => {
                this.computeHref();
            };

            this.watch('to', this._toChanger);
        }
    },

    disposed() {
        this._toChanger = null;
    },

    computeHref() {
        let url = this.data.get('to');
        if (typeof url !== 'string') {
            return;
        }

        let href = resolveURL(url, router.locator.current);
        if (router.mode === 'hash') {
            href = '#' + href;
        }

        this.data.set('href', href);
    }
}
