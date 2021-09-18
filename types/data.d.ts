import { AccessorExpr } from "./expr";

interface DataChangeOption {
    silent?: boolean;
    force?: boolean;
}

interface DataChangeListener<T> {
    (this: Data<T>, change: DataChangeInfo): void
}

interface DataChangeInfo {
    option: DataChangeOption,
    type: DataChangeType,
    expr: AccessorExpr,
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
    get(expr: AccessorExpr): any;

    set<TPath extends string>(expr: TPath, value: Get<T, TPath>, option?: DataChangeOption): void;
    set(expr: AccessorExpr, value: any, option?: DataChangeOption): void;

    assign(source: Partial<T>, options?: DataChangeOption): void;

    merge<TPath extends string>(expr: TPath, source: Partial<Get<T, TPath>>, option?: DataChangeOption): void;
    merge(expr: AccessorExpr, source: {}, option?: DataChangeOption): void;

    apply<TPath extends string>(expr: TPath, changer: (oldValue: Get<T, TPath>) => Get<T, TPath>, option?: DataChangeOption): void;
    apply(expr: AccessorExpr, changer: (oldValue: any) => any, option?: DataChangeOption): void;
    
    splice(expr: string | AccessorExpr, spliceArgs: Array<any>, option?: DataChangeOption): void;
    push(expr: string | AccessorExpr, item: any, option?: DataChangeOption): number;
    pop(expr: string | AccessorExpr, option?: DataChangeOption): any;
    shift(expr: string | AccessorExpr, option?: DataChangeOption): any;
    unshift(expr: string | AccessorExpr, item: any, option?: DataChangeOption): number;
    removeAt(expr: string | AccessorExpr, index: number, option?: DataChangeOption): void;
    remove(expr: string | AccessorExpr, value: any, option?: DataChangeOption): void;
}