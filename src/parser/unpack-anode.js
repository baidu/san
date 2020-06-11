/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解压缩 ANode
 */

var ExprType = require('./expr-type');

/**
 * 解压缩 ANode
 *
 * @param {Array} packed ANode压缩数据
 * @return {Object}
 */
function unpackANode(packed) {
    var root;
    var nodeStack = [];
    var typeStack = [];
    var stateStack = [];
    var targetStack = [];
    var stackIndex = -1;

    for (var i = 0, l = packed.length; i < l; i++) {
        var current = nodeStack[stackIndex];
        var currentType = typeStack[stackIndex];
        var currentState = stateStack[stackIndex];
        var currentTarget = targetStack[stackIndex];

        while (current) {
            if (currentState === -3) {
                currentState = stateStack[stackIndex] = packed[i++] || -1;
            }

            if (currentState === -1) {
                current = nodeStack[--stackIndex];
                currentType = typeStack[stackIndex];
                currentState = stateStack[stackIndex];
                currentTarget = targetStack[stackIndex];
            }
            else {
                break;
            }
        }
            
        var type = packed[i];
        var node;
        var state = -1;
        var target = false;

        switch (type) {
            // Node: Tag
            case 1:
                node = {
                    directives: {},
                    props: [],
                    events: [],
                    children: []
                };
                var tagName = packed[++i];
                tagName && (node.tagName = tagName);
                state = packed[++i] || -1;
                break;

            case 3:
                node = {
                    type: ExprType.STRING,
                    value: packed[++i]
                };
                break;

            case 4:
                node = {
                    type: ExprType.NUMBER,
                    value: packed[++i]
                };
                break;

            case 5:
                node = {
                    type: ExprType.BOOL,
                    value: !!packed[++i]
                };
                break;
                
            case 19:
                node = {
                    type: ExprType.NULL
                };
                break;

            case 6:
                node = {
                    type: ExprType.ACCESSOR,
                    paths: []
                };
                state = packed[++i] || -1;
                break;

            case 7:
                node = {
                    type: ExprType.INTERP,
                    filters: []
                };
                packed[++i] && (node.original = 1);
                state = -2;
                break;
                
            case 8:
                node = {
                    type: ExprType.CALL,
                    args: []
                };
                state = -2;
                break;

            case 9:
                node = {
                    type: ExprType.TEXT,
                    segs: []
                };

                packed[++i] && (node.original = 1);
                state = packed[++i] || -1;
                break;

            case 10:
                node = {
                    type: ExprType.BINARY,
                    operator: packed[++i],
                    segs: []
                };
                state = 2;
                break;

            case 11:
                node = {
                    type: ExprType.UNARY,
                    operator: packed[++i]
                };
                state = -2;
                break;

            case 12:
                node = {
                    type: ExprType.TERTIARY,
                    segs: []
                };
                state = 3;
                break;

            case 13:
                node = {
                    type: ExprType.OBJECT,
                    items: []
                };
                state = packed[++i] || -1;
                break;

            case 14:
                node = {};
                state = -2;
                break;

            case 15:
                node = {spread: true};
                state = -2;
                break;

            case 16:
                node = {
                    type: ExprType.ARRAY,
                    items: []
                };
                state = packed[++i] || -1;
                break;

            case 17:
            case 18:
                node = type === 18 ? {spread: true} : {};
                state = -2;
                break;

            case 2:
            case 33:
            case 34:
                node = {
                    name: packed[++i]
                };
                (type === 33) && (node.noValue = 1);
                (type === 34) && (node.x = 1);
                state = -2;
                break;

            case 35:
                node = {
                    name: packed[++i],
                    modifier: {}
                };
                state = -2;
                break;

            case 36:
                node = {
                    name: packed[++i]
                };
                state = -2;
                break;

            case 37:
                node = {
                    item: packed[++i]
                };

                var forIndex = packed[++i];
                forIndex && (node.index = forIndex);

                var trackBy = packed[++i];
                if (trackBy) {
                    node.trackByRaw = trackBy;
                    node.trackBy = parseExpr(trackBy);
                }

                state = -2;
                break;
            
            case 38:
            case 39:
            case 41:
            case 42:
            case 43:
            case 44:
                node = {};
                state = -2;
                break;

            // else
            case 40:
                node = {value: {}};
                break;

            // Node: Text
            // Event modifier
            default:
                if (!type) {
                    node = {};
                    state = -2;
                }

        }

        if (!root) {
            root = node;
        }

        if (current) {

            switch (currentType) {
                // Node: Tag
                case 1:
                    if (currentTarget) {
                        current.elses = current.elses || [];
                        current.elses.push(node);
                        if (!(--stateStack[stackIndex])) {
                            stackIndex--;
                        }
                    }
                    else {
                        switch (type) {
                            case 2:
                            case 33:
                            case 34:
                                current.props.push(node);
                                break;
                            
                            case 35:
                                current.events.push(node);
                                break;

                            case 36:
                                current.vars = current.vars || [];
                                current.vars.push(node);
                                break;

                            case 37:
                                current.directives['for'] = node;
                                break;

                            case 38:
                                current.directives['if'] = node;
                                break;

                            case 39:
                                current.directives.elif = node;
                                break;

                            case 40:
                                current.directives['else'] = node;
                                break;

                            case 41:
                                current.directives.ref = node;
                                break;
                            
                            case 42:
                                current.directives.bind = node;
                                break;

                            case 43:
                                current.directives.html = node;
                                break;

                            case 44:
                                current.directives.transition = node;
                                break;

                            case 1:
                            default:
                                current.children.push(node);
                        }

                        if (!(--stateStack[stackIndex])) {
                            if (current.directives['if']) {
                                targetStack[stackIndex] = 'elses';
                                stateStack[stackIndex] = -3;
                            }
                            else {
                                stackIndex--;
                            }
                        }
                    }
                    break;

                // Expr: Accessor
                case 6:
                    current.paths.push(node);
                    if (!(--stateStack[stackIndex])) {
                        stackIndex--;
                    }
                    break;

                // Expr: Interp
                case 7:
                    if (currentState === -2) {
                        stateStack[stackIndex] = -3;
                        current.expr = node;
                    }
                    else {
                        current.filters.push(node);
                        if (!(--stateStack[stackIndex])) {
                            stackIndex--;
                        }
                    }
                    break;

                // Expr: CALL
                case 8:
                    if (currentState === -2) {
                        stateStack[stackIndex] = -3;
                        current.name = node;
                    }
                    else {
                        current.args.push(node);
                        if (!(--stateStack[stackIndex])) {
                            stackIndex--;
                        }
                    }
                    break;
                
                // Expr: TEXT, BINARY, TERTIARY
                case 9:
                case 10:
                case 12:
                    current.segs.push(node);
                    if (!(--stateStack[stackIndex])) {
                        stackIndex--;
                    }
                    break;
                
                // Expr: UNARY
                // Prop
                // var
                case 11:
                case 2:
                case 33:
                case 34:
                case 36:
                // Object Spread Item
                case 15:
                // Expr: Array Item
                case 17:
                case 18:
                    current.expr = node;
                    stackIndex--;
                    break;

                // Expr: OBJECT, ARRAY
                case 13:
                case 16:
                    current.items.push(node);
                    if (!(--stateStack[stackIndex])) {
                        stackIndex--;
                    }
                    break;

                // Expr: Object Item
                case 14:
                    if (currentState === -2) {
                        stateStack[stackIndex] = -4;
                        current.name = node;
                    }
                    else {
                        current.expr = node;
                        stackIndex--;
                    }
                    break;

                // Event
                case 35:
                    if (currentState === -2) {
                        stateStack[stackIndex] = -3;
                        current.expr = node;
                    }
                    else {
                        current.modifier[type] = true;
                        if (!(--stateStack[stackIndex])) {
                            stackIndex--;
                        }
                    }
                    break;

                // Directive: for, if, elif, ref, bind, html, transition
                case 37:
                case 38:
                case 39:
                case 41:
                case 42:
                case 43:
                case 44:
                    current.value = node;
                    stackIndex--;
                    break;

                // Node: Text
                default:
                    current.textExpr = node;
                    stackIndex--;
            }
        }

        if (state !== -1) {
            nodeStack[++stackIndex] = node;
            typeStack[stackIndex] = type;
            stateStack[stackIndex] = state;
            targetStack[stackIndex] = target;
        }
    }

    return root;
}
