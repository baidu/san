// define(function () {
    var SELF_CLOSE_TAG = {
        'img': 1,
        'input': 1
    };

    function parse(source) {
        source = source.replace(/<!--([\s\S]*?)-->/mg, '');

        var tagReg = /<(\/)?([a-z0-9-]+)\s*/ig;
        var tagMatch;

        var attrReg = /([0-9a-z-\(\)\[\]]+)(=(['"])([^\3]+?)\3)?\s*/ig;

        var rootNode = {childs: []};
        var currentNode = rootNode;

        var beforeLastIndex = 0;

        while ((tagMatch = tagReg.exec(source)) != null) {
            var tagEnd = tagMatch[1];
            var beforeText = source.slice(beforeLastIndex, tagReg.lastIndex - tagMatch[0].length);


            beforeText && currentNode.childs.push({
                type: 'text',
                value: beforeText,
                parent: currentNode
            });

            if (tagEnd && source.charCodeAt(tagReg.lastIndex) === 62) {
                var closeTargetNode = currentNode;
                while (closeTargetNode && closeTargetNode.type !== tagMatch[2]) {
                    closeTargetNode = closeTargetNode.parent;
                }
                closeTargetNode && (currentNode = closeTargetNode.parent);
                tagReg.lastIndex++;
            }
            else if (!tagEnd) {
                var node = {type: tagMatch[2], parent: currentNode, attrs: {}, childs: []};
                currentNode.childs.push(node);
                currentNode = node;


                var nodeNotInStack = SELF_CLOSE_TAG[node.type];
                while (1) {
                    var nextCharCode = source.charCodeAt(tagReg.lastIndex);
                    if (nextCharCode === 62) {
                        tagReg.lastIndex++;
                        break;
                    }
                    else if (nextCharCode === 47 && source.charCodeAt(tagReg.lastIndex + 1) === 62) {
                        tagReg.lastIndex += 2;
                        nodeNotInStack = true;
                        break;
                    }


                    attrReg.lastIndex = tagReg.lastIndex;
                    var attrMatch = attrReg.exec(source);
                    if (attrMatch) {
                        tagReg.lastIndex = attrReg.lastIndex;
                        var attrValue = attrMatch[2] ? attrMatch[4] : true;
                        currentNode.attrs[attrMatch[1]] = attrValue;
                    }
                }

                if (nodeNotInStack) {
                    currentNode = currentNode.parent;
                }
            }

            beforeLastIndex = tagReg.lastIndex;
        }

        var tailText = source.slice(beforeLastIndex);
        if (tailText) {
            currentNode.childs.push({
                type: 'text',
                value: tailText,
                parent: currentNode
            });
        }

        return rootNode;
    }


// });
