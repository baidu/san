/**
 * ANode 的类型文件
 */
import { Expr, AccessorExpr, CallExpr } from "./expr.d";

export interface AText {
    textExpr: Expr;
}

interface Directives {
    if?: ADirectiveIf;
    is?: ADirectiveIs;
    show?: ADirectiveShow;
    html?: ADirectiveHtml;
    bind?: ADirectiveBind;
    elif?: ADirectiveElif;
    else?: ADirectiveElse;
    transition?: ADirectiveTransition;
    ref?: ADirectiveRef;
    for?: ADirectiveFor;
};

export interface AElement {
    directives: Directives;
    props: AProperty[];
    events: AEvent[];
    children: ANode[];
    tagName?: string;
    vars?: AVar[];
}

// TODO: | or &
export type ANode = AText | AElement;

export interface AProperty {
    name: string;
    expr: Expr;
    noValue?: number | boolean;
    x?: number | boolean;
}

export interface AEvent {
    name: string;
    expr: CallExpr;
    modifier: {
        [K: string]: boolean
    }
}

export interface AVar {
    name: string;
    expr: Expr;
}

export interface ADirective {
    value: {}
}
export interface ADirectiveIs extends ADirective {
    value: Expr;
}
export interface ADirectiveShow extends ADirective {
    value: Expr;
}
export interface ADirectiveHtml extends ADirective {
    value: Expr;
}
export interface ADirectiveBind extends ADirective {
    value: Expr;
}
export interface ADirectiveIf extends ADirective {
    value: Expr;
}
export interface ADirectiveElif extends ADirective {
    value: Expr;
}
export interface ADirectiveElse extends ADirective {}
export interface ADirectiveTransition extends ADirective {
    value: CallExpr;
}
export interface ADirectiveRef extends ADirective {
    value: Expr;
}
export interface ADirectiveFor extends ADirective {
    value: Expr;
    item: string;
    index?: string;
    trackBy?: AccessorExpr;
    trackByRaw?: string;
}



export interface AFragmentNode extends AElement {
    tagName: 'fragment' | 'template';
}

type Result<T> = {
    [P in keyof T]: T[P]
}
type RequiredByKeys<T, K = keyof T> = Result<
    {
        [P in keyof T as P extends K ? P : never]-?: T[P]
    } & {
        [P in Exclude<keyof T, K>]?: T[P]
    }
>

export interface AForNode extends AElement {
    directives: RequiredByKeys<Directives, 'for'>;
}

export interface AIfNode extends AElement {
    elses?: AElement[];
    directives: RequiredByKeys<Directives, 'if'>;
}

export interface ASlotNode extends AElement {
    tagName: 'slot';
}
