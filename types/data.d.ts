import { ExprAccessorNode } from "./expr";

interface DataChangeOption {
    silent?: boolean;
    silence?: boolean;
    quiet?: boolean;
}

interface DataChangeListener<T> {
    (this: Data<T>, change: DataChangeInfo): void
}

interface DataChangeInfo {
    option: DataChangeOption,
    type: DataChangeType,
    expr: ExprAccessorNode,
    value: any,
}


export enum DataChangeType {
    SET = 1,
    SPLICE = 2
}

export class Data<T extends {}> {
    constructor(init?: Partial<T>, parent?: Data<{}>);
    parent: Data<{}>;
    raw: Partial<T>;

    listeners: DataChangeListener<T>[];
    listen(listener: DataChangeListener<T>): void;
    unlisten(listener?: DataChangeListener<T>): void;

    typeChecker: () => void;
    setTypeChecker(checker: () => void): void;

    fire(change: DataChangeInfo): void;

    get(): Partial<T>;
    get(expr: ExprAccessorNode): any;
    get(expr: string): any;

    set(expr: string | ExprAccessorNode, value: any, option?: DataChangeOption): void;
    assign(source: {}, options?: DataChangeOption): void;
    merge(expr: string | ExprAccessorNode, source: {}, option?: DataChangeOption): void;
    apply(expr: string | ExprAccessorNode, changer: (oldval: {}) => {}, option?: DataChangeOption): void;
    splice(expr: string | ExprAccessorNode, spliceArgs: Array<any>, option?: DataChangeOption): void;
    push(expr: string | ExprAccessorNode, item: any, option?: DataChangeOption): number;
    pop(expr: string | ExprAccessorNode, option?: DataChangeOption): any;
    shift(expr: string | ExprAccessorNode, option?: DataChangeOption): any;
    unshift(expr: string | ExprAccessorNode, item: any, option?: DataChangeOption): number;
    removeAt(expr: string | ExprAccessorNode, index: number, option?: DataChangeOption): void;
    remove(expr: string | ExprAccessorNode, value: any, option?: DataChangeOption): void;
}