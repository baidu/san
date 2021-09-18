/**
 * ANode 的类型文件
 */
import { Expr, AccessorExpr } from "./expr.d";

export interface ANode {
    isText?: boolean;
    text?: string;
    textExpr?: Expr;
    children?: ANode[];
    props: ANodeProperty[];
    events: SanIndexedList<Expr>;
    directives: { [k: string]: Directive<any> };
    tagName: string;
    vars?: [{
        name: string;
        expr: Expr
    }];
}

export interface ATextNode extends ANode {
    textExpr: Expr;
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

export interface Directive<T extends Expr> {
    item?: string;
    index?: number;
    trackBy?: AccessorExpr;
    value: T;
}

export interface ANodeProperty {
    name: string;
    expr: Expr;
    noValue?: 1;
    x?: number;
}
