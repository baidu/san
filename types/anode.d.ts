/**
 * ANode 的类型文件
 */
import { ExprNode, ExprAccessorNode } from "./expr.d";

export interface ANode {
    isText?: boolean;
    text?: string;
    textExpr?: ExprNode;
    children?: ANode[];
    props: ANodeProperty[];
    events: SanIndexedList<ExprNode>;
    directives: { [k: string]: Directive<any> };
    tagName: string;
    vars?: [{
        name: string;
        expr: ExprNode
    }];
}

export interface ATextNode extends ANode {
    textExpr: ExprNode;
}

export interface ATemplateNode extends ANode {
    tagName: 'template';
    children: ANode[];
}

export interface AFragmentNode extends ANode {
    tagName: 'fragment';
    children: ANode[];
}

export interface AForNode extends ANode {
    directives: {
        for: Directive<any>;
    };
}

export interface AIfNode extends ANode {
    ifRinsed: ANode;
    elses?: ANode[];
    directives: {
        if: Directive<any>;
    };
}

export interface ASlotNode extends ANode {
    children: ANode[];
    tagName: 'slot';
}

export interface SanIndexedList<T> {
    raw: T[];
    index: { [name: string]: T };

    get(bindName: string): T;
    each(handler: (bindItem: T) => any, thisArg: any): void;
    push(item: { name: string } & {}): void;
    remove(name: string): any;
    concat(other: SanIndexedList<T>): SanIndexedList<T>;
}

export interface Directive<T extends ExprNode> {
    item?: string;
    index?: number;
    trackBy?: ExprAccessorNode;
    value: T;
}

export interface ANodeProperty {
    name: string;
    expr: ExprNode;
    noValue?: 1;
    x?: number;
}
