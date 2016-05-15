
//define(function () {
    function RootElement() {
        this.childs = [];
    }

    RootElement.prototype.htmlText = function (data) {
        var text = '';
        for (var i = 0, j = this.childs.length; i < j; i++) {
            text += this.childs[i].htmlText(data);
        }
        return text;
    };

    RootElement.prototype.update = function (data) {
        for (var i = 0, j = this.childs.length; i < j; i++) {
            this.childs[i].update(data);
        }
    };

    RootElement.prototype.setOwner = function (owner) {
        this.owner = owner;
        for (var i = 0, j = this.childs.length; i < j; i++) {
            this.childs[i].setOwner(owner);
        }
    };

    RootElement.prototype.updateDirective = function (directive) {
        for (var i = 0, j = this.childs.length; i < j; i++) {
            this.childs[i].updateDirective(directive);
        }
    };
//})
