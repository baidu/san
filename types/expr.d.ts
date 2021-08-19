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

export interface ExprNodeTpl<T extends ExprType> {
    type: T;        // 如果只有这一个属性，去掉泛型更可读
    value?: any;    // 在 eval 会统一处理，事实上作用于 null, string, number
    parenthesized?: boolean; // 在 read parenthesized expr 会统一设置
}
export type ExprNode = ExprNodeTpl<any>;
export interface ExprStringNode extends ExprNodeTpl<ExprType.STRING> {
    value: string;
}
export interface ExprNumberNode extends ExprNodeTpl<ExprType.NUMBER> {
    value: number;
}
export interface ExprBoolNode extends ExprNodeTpl<ExprType.BOOL> {
    value: boolean;
}
export interface ExprAccessorNode extends ExprNodeTpl<ExprType.ACCESSOR> {
    paths: ExprNode[];
}
export interface ExprInterpNode extends ExprNodeTpl<ExprType.INTERP> {
    expr: ExprNode;
    filters: ExprCallNode[];
    original: boolean;
}
export interface ExprCallNode extends ExprNodeTpl<ExprType.CALL> {
    name: ExprAccessorNode;
    args: ExprNode[];
}
export interface ExprTextNode extends ExprNodeTpl<ExprType.TEXT> {
    segs: ExprNode[];
    original?: number;
    value?: string; // segs 由一个 STRING 构成时存在
}
export interface ExprBinaryNode extends ExprNodeTpl<ExprType.BINARY> {
    segs: [ExprNode, ExprNode];
    operator: number;
}
export interface ExprUnaryNode extends ExprNodeTpl<ExprType.UNARY> {
    operator: number;
    expr: ExprNode;
}
export interface ExprTertiaryNode extends ExprNodeTpl<ExprType.TERTIARY> {
    segs: ExprNode[];
}
export interface ExprObjectNode extends ExprNodeTpl<ExprType.OBJECT> {
    items: [{
        spread: boolean;
        expr: ExprNode;
        name: ExprNode;
    }];
}
export interface ExprArrayNode extends ExprNodeTpl<ExprType.ARRAY> {
    items: [{
        spread: boolean;
        expr: ExprNode;
    }];
}
export interface ExprNullNode extends ExprNodeTpl<ExprType.NULL> {}
