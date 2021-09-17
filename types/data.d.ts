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


// TODO: unknown? any? never?
type Get<T, K> = K extends `${infer L}.${infer R}`
    ? L extends keyof T
        ? Get<T[L], R>
        : unknown
    : K extends keyof T
        ? T[K]
        : unknown


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
    get<TPath extends string>(name: TPath): Get<T, TPath>;
    get(expr: ExprAccessorNode): any;

    set<TPath extends string>(expr: TPath, value: Get<T, TPath>, option?: DataChangeOption): void;
    set(expr: ExprAccessorNode, value: any, option?: DataChangeOption): void;

    assign(source: Partial<T>, options?: DataChangeOption): void;

    merge<TPath extends string>(expr: string, source: Partial<Get<T, TPath>>, option?: DataChangeOption): void;
    merge(expr: ExprAccessorNode, source: {}, option?: DataChangeOption): void;

    apply(expr: string | ExprAccessorNode, changer: (oldval: {}) => {}, option?: DataChangeOption): void;
    splice(expr: string | ExprAccessorNode, spliceArgs: Array<any>, option?: DataChangeOption): void;
    push(expr: string | ExprAccessorNode, item: any, option?: DataChangeOption): number;
    pop(expr: string | ExprAccessorNode, option?: DataChangeOption): any;
    shift(expr: string | ExprAccessorNode, option?: DataChangeOption): any;
    unshift(expr: string | ExprAccessorNode, item: any, option?: DataChangeOption): number;
    removeAt(expr: string | ExprAccessorNode, index: number, option?: DataChangeOption): void;
    remove(expr: string | ExprAccessorNode, value: any, option?: DataChangeOption): void;
}