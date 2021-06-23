/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file SVG标签表
 */

var splitStr2Obj = require('../util/split-str-2-obj');

/**
 * svgTags
 *
 * @see https://www.w3.org/TR/SVG/svgdtd.html 只取常用
 * @type {Object}
 */
var svgTags = splitStr2Obj(''
    // Animation elements
    + 'animate,animateMotion,animateTransform,'

    // Basic shapes
    + 'circle,ellipse,line,polygon,polyline,rect,'

    // Container elements
    + 'defs,g,marker,mask,missing-glyph,pattern,svg,symbol,'

    // Descriptive elements
    + 'desc,metadata,'

    // Font elements
    + 'font,font-face,'

    // Gradient elements
    + 'linearGradient,radialGradient,stop,'

    // Graphics elements
    + 'image,path,use,'

    // Text elements
    + 'glyph,textPath,text,tref,tspan,'

    // Others
    + 'clipPath,cursor,filter,foreignObject,view'
);

// 把小写转驼峰：HTML中的svg标签不区分大小写，但通过document.createElementNS创建需要区分
for (var tag in svgTags) {
    if (/[A-Z]/.test(tag)) {
        svgTags[tag.toLowerCase()] = svgTags[tag];
    }
}

exports = module.exports = svgTags;
