
//define(function () {
    function TextNode(options) {
        this.options = options;
        Object.assign(this, options);
    }

    TextNode.prototype.htmlText = function (data) {
        this.parse();
        var text = '';
        for (var i = 0, l = this.segs.length; i < l; i++) {
            var seg = this.segs[i];
            if (typeof seg === 'string') {
                text += seg;
            }
            else {
                seg.slotId = guid();
                text += '<script type="x-san/slot" id="' + seg.slotId + '"></script>' + getProp(data, seg, this.owner);
            }
        }
        return text;
    };

    TextNode.prototype.update = function (data) {
        for (var i = 0, l = this.segs.length; i < l; i++) {
            var seg = this.segs[i];
            if (typeof seg !== 'string') {
                console.log(document.getElementById(seg.slotId))
                document.getElementById(seg.slotId).nextSibling.textContent =  getProp(data, seg, this.owner);
            }
        }
    };

    TextNode.prototype.parse = function () {
        if (this.parsed) {
            return;
        }
        var beforeIndex = 0;
        var exprStartReg = /\{\{\s*([\s\S]+?)\s*\}\}/ig;
        var exprMatch;

        var segs = [];
        while ((exprMatch = exprStartReg.exec(this.text)) != null) {
            segs.push(this.text.slice(beforeIndex, exprStartReg.lastIndex - exprMatch[0].length));
            var exprParts = exprMatch[1].split('|');
            segs.push({
                expr: exprParts[0].split('.'),
                filter: exprParts[1] && exprParts[1].replace(/(^\s*|\s*$)/g, '')
            });
            beforeIndex = exprStartReg.lastIndex;
        }
        segs.push(this.text.slice(beforeIndex));

        this.segs = segs;
        this.parsed = 1;
    };

    TextNode.prototype.setOwner = function (owner) {
        this.owner = owner;
    };

    TextNode.prototype.clone = function () {
        var cloneNode = new TextNode(this.options);
        cloneNode.parsed = this.parsed;
        cloneNode.segs = this.segs;
        cloneNode.owner = this.owner;

        return cloneNode;
    }

    TextNode.prototype.updateDirective = function (directive) {

        for (var i = 0, l = this.segs.length; i < l; i++) {
            var seg = this.segs[i];
            if (typeof seg !== 'string' && seg.expr.join('.') === directive.path.join('.')) {
                document.getElementById(seg.slotId).nextSibling.textContent =  directive.value;
            }
        }
    };

    function getProp(data, seg, owner) {
        var expr = seg.expr;
        var val = data;
        for (var i = 0; i < expr.length; i++) {
            val = val[expr[i]];
            if (val == null) {
                break;
            }
        }

        if (seg.filter) {
            val = owner.filter[seg.filter](val);
        }

        return val;
    }
//})
