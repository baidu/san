/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 合并传入 ANode 的 attrs 声明，用于深层传递
 */

function mergeANodeSourceAttrs(aNode, source) {
    var startIndex = 0;

    var mergedANode = {
        directives: aNode.directives,
        props: aNode.props,
        events: aNode.events,
        children: aNode.children,
        tagName: aNode.tagName,
        attrs: [],
        vars: aNode.vars,
        _ht: aNode._ht,
        _i: aNode._i,
        _dp: aNode._dp,
        _xp: aNode._xp,
        _pi: aNode._pi,
        _b: aNode._b,
        _ce: aNode._ce
    };

    var aNodeAttrIndex = {};
    if (aNode.attrs) {
        startIndex = aNode.attrs.length;
        for (var i = 0; i < startIndex; i++) {
            var attr = aNode.attrs[i];
            aNodeAttrIndex[attr.name] = i;
            mergedANode.attrs[i] = attr;
        }
    }

    for (var i = 0; i < source.attrs.length; i++) {
        var attr = source.attrs[i];

        if (aNodeAttrIndex[attr.name] == null) {
            mergedANode.attrs[startIndex++] = {
                name: attr.name,
                expr: attr._data,
                _data: attr._data
            };
        }
    }

    return mergedANode;
}

exports = module.exports = warnSetHTML;
