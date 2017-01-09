
import HashLocator from './locator/hash';
import HTML5Locator from './locator/html5';
import parseURL from './parse-url';
import Link from './component/link'

let routeID = 0x5942b;
let guid = () => (++routeID).toString();

export let version = '1.0.0-rc.2';

export class Router {
    constructor({mode = 'hash'} = {}) {
        this.routes = [];
        this.routeAlives = [];

        this.locatorRedirectHandler = e => {
            let url = parseURL(e.url);

            for (let i = 0; i < this.routes.length; i++) {
                let routeItem = this.routes[i];
                let match = routeItem.rule.exec(url.path);

                if (match) {
                    // fill query
                    let keys = routeItem.keys || [];
                    for (let j = 1; j < match.length; j++) {
                        url.query[keys[j] || j] = match[j];
                    }

                    // fill referrer
                    url.referrer = e.referrer;

                    this.doRoute(routeItem, url);
                    return;
                }
            }

            let len = this.routeAlives.length;
            while (len--) {
                this.routeAlives[len].component.dispose();
                this.routeAlives.splice(len, 1);
            }
        };

        this.setMode(mode);
    }

    doRoute(routeItem, e) {
        let isUpdateAlive = false;
        let len = this.routeAlives.length;

        while (len--) {
            let routeAlive = this.routeAlives[len];

            if (routeAlive.id === routeItem.id) {
                routeAlive.component.data.set('route', e);
                routeAlive.component._callHook('route');
                isUpdateAlive = true;
            }
            else {
                routeAlive.component.dispose();
                this.routeAlives.splice(len, 1);
            }
        }

        if (!isUpdateAlive) {
            if (routeItem.Component) {
                let component = new routeItem.Component();
                component.data.set('route', e);
                component._callHook('route');

                let targetEl = document.querySelector(routeItem.target);
                targetEl && component.attach(targetEl);

                this.routeAlives.push({
                    component,
                    id: routeItem.id
                });
            }
            else {
                routeItem.handler.call(this, e);
            }
        }
    }

    add({rule, handler, target = '#main', Component}) {
        let keys = [''];

        if (typeof rule === 'string') {
            // 没用path-to-regexp，暂时不提供这么多功能支持
            let regText = rule.replace(
                /\/:([a-z0-9_-]+)(?=\/|$)/g,
                (match, key) => {
                    keys.push(key);
                    return '/([a-z0-9_-]+)';
                }
            );

            rule = new RegExp('^' + regText + '$', 'i');
        }

        if (!(rule instanceof RegExp)) {
            throw new Error('Rule must be string or RegExp!');
        }

        let id = guid();
        this.routes.push({id, rule, handler, keys, target, Component});

        return this;
    }

    start() {
        if (!this.isStarted) {
            this.isStarted = true;
            this.locator.on('redirect', this.locatorRedirectHandler);
            this.locator.start();
            this.locator.reload();
        }

        return this;
    }

    stop() {
        this.locator.un('redirect', this.locatorRedirectHandler);
        this.locator.stop();
        this.isStarted = false;

        return this;
    }

    setMode(mode) {
        mode = mode.toLowerCase();
        if (this.mode === mode) {
            return;
        }

        this.mode = mode;

        let restart = false;
        if (this.isStarted) {
            this.stop();
            restart = true;
        }

        switch (mode) {
            case 'hash':
                this.locator = new HashLocator();
                break;
            case 'html5':
                this.locator = new HTML5Locator();
        }

        if (restart) {
            this.start();
        }

        return this;
    }
}

export let router = new Router();
export {Link};


