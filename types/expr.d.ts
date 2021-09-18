export enum ExprType {
    STRING = 1,
    NUMBER = 2,
    BOOL = 3,
    ACCESSOR = 4,
    INTERP = 5,
    CALL = 6,
    TEXT = 7,
    BINARY = 8,
    UNARY = 9,
    TERTIARY = 10,
    OBJECT = 11,
    ARRAY = 12,
    NULL = 13
}

export interface Expr {
    type: ExprType;
    parenthesized?: boolean;
}

export interface StringLiteral extends Expr {
    type: ExprType.STRING;
    value: string;
}
export interface NumberLiteral extends Expr {
    type: ExprType.NUMBER;
    value: number;
}

export interface BoolLiteral extends Expr {
    type: ExprType.BOOL;
    value: boolean;
}

export interface NullLiteral extends Expr {
    type: ExprType.NULL;
}

export interface AccessorExpr extends Expr {
    type: ExprType.ACCESSOR;
    paths: Expr[];
}
export interface InterpExpr extends Expr {
    type: ExprType.INTERP;
    expr: Expr;
    filters: CallExpr[];
    original?: boolean;
}

export interface CallExpr extends Expr {
    type: ExprType.CALL;
    name: AccessorExpr;
    args: Expr[];
}

export interface TextExpr extends Expr {
    type: ExprType.TEXT;
    segs: Array<InterpExpr | StringLiteral>;
    original?: number;
    value?: string; // segs 由一个 STRING 构成时存在
}

export interface BinaryExpr extends Expr {
    type: ExprType.BINARY;
    segs: [Expr, Expr];
    operator: number;
}

export interface UnaryExpr extends Expr {
    type: ExprType.UNARY;
    operator: number;
    expr: Expr;
}
export interface TertiaryExpr extends Expr {
    type: ExprType.TERTIARY;
    segs: [Expr, Expr, Expr];
}

interface ObjectLiteralItem {
    expr: Expr;
    name?: Expr;
    spread?: boolean;
}
export interface ObjectLiteral extends Expr {
    type: ExprType.OBJECT;
    items: ObjectLiteralItem[];
}

interface ArrayLiteralItem {
    expr: Expr;
    spread?: boolean;
}

export interface ArrayLiteral extends Expr {
    type: ExprType.ARRAY;
    items: ArrayLiteralItem[];
}

