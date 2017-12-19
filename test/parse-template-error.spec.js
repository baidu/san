/**
 * @file unit test for parser/parse-template.js
 * @author leon <ludafa@outlook.com>
 */

/* globals san */

describe('parseTemplate', function () {

    var ALL_TAGS = [
        "a", "abbr", "acronym", "address", "applet", "area", "article",
        "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big",
        "blockquote", "body", "br", "button", "canvas", "caption", "center",
        "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details",
        "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset",
        "figcaption", "figure", "font", "footer", "form", "frame", "frameset",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "head", "header", "hr", "html", "i", "iframe", "img", "input",
        "ins", "kbd", "label", "legend", "li", "link", "main", "map",
        "mark", "menu", "menuitem", "meta", "meter", "nav", "noframes",
        "noscript", "object", "ol", "optgroup", "option", "output", "p",
        "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby",
        "s", "samp", "script", "section", "select", "small", "source",
        "span", "strike", "strong", "style", "sub", "summary", "sup",
        "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time",
        "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"
    ];

    var OPTIONAL_CLOSE_TAGS = [
        "body", "colgroup", "dd", "dt", "head",
        "html", "li", "option", "p", "tbody", "td", "tfoot", "th", "thead", "tr"
    ];

    var AUTO_CLOSE_TAGS = [
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
        'keygen', 'param', 'source', 'track', 'wbr'
    ];

    var AUTO_CLOSE_TAGS_MAP = {};

    for (var i = 0, len = AUTO_CLOSE_TAGS.length; i < len; i++) {
        AUTO_CLOSE_TAGS_MAP[AUTO_CLOSE_TAGS[i]] = true;
    }

    var NOT_AUTO_CLOASE_TAGS = [];

    for (var i = 0, len = ALL_TAGS.length; i < len; i++) {
        if (!AUTO_CLOSE_TAGS_MAP[ALL_TAGS[i]]) {
            NOT_AUTO_CLOASE_TAGS.push(ALL_TAGS[i]);
        }
    }

    it('should throw error if open tag is not closed', function () {

        for (var i = 0, len = ALL_TAGS.length; i < len; i++) {
            var tag = ALL_TAGS[i];
            expect(function () {
                san.parseTemplate('<div> <' + tag + ' </div>');
            }).toThrowError(
                '[SAN ERROR] ROOT>div>' + tag + ' is not closed'
            );
        }

    });

    it('sholud throw error if close tag is not closed', function () {

        // 只对非 auto-close 标签做此项校验，auto-close 标签有单独的校验
        for (var i = 0, len = NOT_AUTO_CLOASE_TAGS.length; i < len; i++) {
            var tag = NOT_AUTO_CLOASE_TAGS[i];
            expect(function () {
                san.parseTemplate('<div><' + tag + '></' + tag + ' </div>');
            }).toThrowError(
                '[SAN ERROR] ROOT>div>' + tag + '\'s close tag not closed'
            );
        }

    });

    it('should throw error if close tag have attributes', function () {

        for (var i = 0, len = NOT_AUTO_CLOASE_TAGS.length; i < len; i++) {
            var tag = NOT_AUTO_CLOASE_TAGS[i];
            expect(function () {
                san.parseTemplate(
                    '<div><' + tag + '></' + tag + ' attr="1"> </div> '
                );
            }).toThrowError(
                '[SAN ERROR] ROOT>div>' + tag + '\'s close tag has attributes'
            );
        }

    });

    it('should throw error if auto-close tag is closed with a </xxx>', function () {

        for (var i = 0, len = AUTO_CLOSE_TAGS.length; i < len; i++) {
            var tag = AUTO_CLOSE_TAGS[i];
            expect(function () {
                san.parseTemplate(
                    '<div><' + tag + '>aaa</' + tag + '></div>'
                );
            }).toThrowError(''
                + '[SAN ERROR] ROOT>div>' + tag + ' is a \`auto closed\` tag, '
                + 'so it cannot be closed with </' + tag + '>'
            );
        }

    });

    it('should throw error if begin tag has no matching end tag', function () {

        var rootName = 'some-tag-cannot-match';
        for (var i = 0, len = NOT_AUTO_CLOASE_TAGS.length; i < len; i++) {

            var tag = NOT_AUTO_CLOASE_TAGS[i];

            expect(function() {
                san.parseTemplate(''
                    + '<' + rootName + '>'
                    +     '<' + tag + '>'
                    + '</' + rootName + '>'
                );
            }).toThrowError(''
                + '[SAN ERROR] ROOT>' + rootName + '>' + tag
                + ' is closed with ' + rootName
            );

            expect(function() {
                san.parseTemplate(''
                    + '<' + rootName + '>'
                    +     '<' + tag + '></' + tag + '-you-shall-not-match>'
                    + '</' + rootName + '>'
                );
            }).toThrowError(''
                + '[SAN ERROR] ROOT>' + rootName + '>'
                + tag + ' is closed with ' + tag + '-you-shall-not-match'
            );
        }

    });

    it('should pass checking auto generated tbody', function () {

        expect(function () {
            san.parseTemplate('<div><table><tr /></table></div>');
        }).not.toThrow();

    });

    it('should not throw error if tag is forbidden to be closed(aka auto close tags)', function () {
        expect(function () {

            var tags = [];

            for (var i = 0, len = AUTO_CLOSE_TAGS.length; i < len; i++) {
                var tag = AUTO_CLOSE_TAGS[i];
                tags.push('<' + tag + '><' + tag + '/>');
            }

            san.parseTemplate(''
                + '<div>'
                +     tags.join('')
                + '</div>'
            );

        }).not.toThrow();
    });

    it('should throw error if tag is not closed correctly', function () {

        expect(function () {
            san.parseTemplate('<div><h1></h2></div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 is closed with h2');

        expect(function () {
            san.parseTemplate('<div> <h1><br></h2><aaa /> </div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 is closed with h2');

        expect(function () {
            san.parseTemplate('<div><h1>aa</div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 is closed with div');

        expect(function () {
            san.parseTemplate('<table> <tr></tr> </table>');
        }).not.toThrow();

    });

    it('should throw error if attributes is not wrapped with "" or \'\'', function () {

        expect(function () {
            san.parseTemplate('<div> <h1 title=aaa></h1> </div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 attribute `title` is not wrapped with ""');

        expect(function () {
            san.parseTemplate('<div><h1 title="aaa></h1> </div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 attribute `title` is not wrapped with ""');

        expect(function () {
            san.parseTemplate('<div> <h1 title=aaa"></h1> </div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 attribute `title` is not wrapped with ""');

        expect(function () {
            san.parseTemplate('<div> <h1 title=\'aaa></h1> </div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 attribute `title` is not wrapped with ""');

        expect(function () {
            san.parseTemplate('<div> <h1 title=aaa\'></h1> </div>');
        }).toThrowError('[SAN ERROR] ROOT>div>h1 attribute `title` is not wrapped with ""');
    });

});
