/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file SVG标签表
 */


/**
 * svgTags
 *
 * @see https://www.w3.org/TR/SVG/svgdtd.html 只取常用
 * @type {Object}
 */
var svgTags = {
    // Animation elements
    animate: 1,
    animateMotion: 1,
    animateTransform: 1,

    // Basic shapes
    circle: 1,
    ellipse: 1,
    line: 1,
    polygon: 1,
    polyline: 1,
    rect: 1,

    // Container elements
    defs: 1,
    g: 1,
    marker: 1,
    mask: 1,
    'missing-glyph': 1,
    pattern: 1,
    svg: 1,
    'symbol': 1,

    // Descriptive elements
    desc: 1,
    metadata: 1,

    // Font elements
    font: 1,
    'font-face': 1,

    // Gradient elements
    linearGradient: 1,
    radialGradient: 1,
    stop: 1,

    // Graphics elements
    image: 1,
    path: 1,
    use: 1,

    // Text elements
    glyph: 1,
    textPath: 1,
    text: 1,
    tref: 1,
    tspan: 1,

    // Others
    clipPath: 1,
    cursor: 1,
    filter: 1,
    foreignObject: 1,
    view: 1
};


exports = module.exports = svgTags;
