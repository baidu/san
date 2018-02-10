interface SanEvent<T, N> {
    target: SanComponent<T>;
    value: N;
    name: string;
}

type SanEventListener<T, N> = (e: SanEvent<T, N>) => any;
export interface SanData<T> {
    parent: SanComponent<T>;
    raw: T;

    listeners: SanChangeListener<T>[];
    listen(listener: SanChangeListener<T>): void;
    unlisten(listener?: SanChangeListener<T>): void;

    typeChecker: () => void;
    setTypeChecker(checker: () => void): void;

    fire(change: SanDataChangeInfo): void;
    get(expr: string | ExprAccessorNode): any;
    set(expr: string | ExprAccessorNode, value: any, option?: SanDataChangeOption): void;
    merge(expr: string | ExprAccessorNode, source: {}, option?: SanDataChangeOption): void;
    apply(expr: string | ExprAccessorNode, changer: (oldval: {}) => {}, option?: SanDataChangeOption): void;
    splice(expr: string | ExprAccessorNode, spliceArgs: Array<any>, option?: SanDataChangeOption): void;
    push(expr: string | ExprAccessorNode, item: any, option?: SanDataChangeOption): number;
    pop(expr: string | ExprAccessorNode, option?: SanDataChangeOption): any;
    shift(expr: string | ExprAccessorNode, option?: SanDataChangeOption): any;
    unshift(expr: string | ExprAccessorNode, item, option?: SanDataChangeOption): number;
    removeAt(expr: string | ExprAccessorNode, index, option?: SanDataChangeOption): void;
    remove(expr: string | ExprAccessorNode, value, option?: SanDataChangeOption): void;
}

interface SanChangeListener<T> {
    (this: SanData<T>, change: SanDataChangeInfo): void
}
interface SanDataChangeInfo {
    option: SanDataChangeOption,
    type: DataChangeType,
    expr: ExprAccessorNode,
    value: any,
}
interface SanDataChangeOption {
    silent?: boolean;
    silence?: boolean;
    quiet?: boolean;
}
declare enum DataChangeType {
    SET = 1,
    SPLICE = 2,
}

type DataTypeChecker = (data: any, dataName: string, componentName: string)=> void;

export interface SanComponentConfig<T extends {}, D> {
    el?: Element;
    trimWhitespace?: 'none' | 'blank' | 'all';
    data?: T;
    initData?(): T;
    displayName?: string;
    template?: string;
    filters?: {
        [k: string]: (value: any, ...filterOption: any[]) => any,
    };
    components?: {
        [k: string]: ComponentConstructor<{}, {}>,
    };
    computed?: {
        [k: string]: (this: SanComponent<T> & D) => any,
    };

    messages?: {
        [k: string]: SanEventListener<{}, {}>,
    };
    dataTypes?: {
        [k: string]: DataTypeChecker;
    },
    compiled?(this: SanComponent<T> & D): void;
    inited?(this: SanComponent<T> & D): void;
    created?(this: SanComponent<T> & D): void;
    attached?(this: SanComponent<T> & D): void;
    detached?(this: SanComponent<T> & D): void;
    disposed?(this: SanComponent<T> & D): void;
    updated?(this: SanComponent<T> & D): void;
}

export interface SanComponent<T> {
    constructor(option?: { data?: T })

    el?: Element;
    nodeType: NodeType;
    data: SanData<T>,
    fire(eventName: string, eventData: any): void;
    dispatch(eventName: string, eventData: any): void;

    on(eventName: string, listener: SanEventListener<{}, {}>): void;
    un(eventName: string, listener?: SanEventListener<{}, {}>): void;

    watch(propName: string, watcher: (newValue: any) => any): void;
    ref(refName: string): SanComponent<{}> | Element;
    slot(): SanComponent<{}>[];
    nextTick(doNextTick: () => any): void;
    attach(container: Element): void;
    detach(): void;
    dispose(): void;
}

interface ComponentConstructor<T, D> {
    new(option?: { data?: T }): SanComponent<T> & D
}
interface SanSlot {
    isScoped: boolean;
    isInserted: boolean;
    children: SanSlot[];
}

declare enum ExprType {
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
}

type ExprNode = ExprStringNode | ExprNumberNode | ExprBoolNode | ExprAccessorNode | ExprInterpNode | ExprCallNode | ExprTextNode | ExprBinaryNode | ExprUnaryNode | ExprTertiaryNode;
interface ExprStringNode {
    type: ExprType.STRING;
    value: string;
}
interface ExprNumberNode {
    type: ExprType.NUMBER;
    value: number;
}
interface ExprBoolNode {
    type: ExprType.BOOL;
    value: boolean;
}
interface ExprAccessorNode {
    type: ExprType.ACCESSOR;
    paths: ExprNode[];
}
interface ExprInterpNode {
    type: ExprType.INTERP;
    expr: ExprAccessorNode;
    filters: ExprCallNode[];
}
interface ExprCallNode {
    type: ExprType.CALL;
    name: ExprAccessorNode;
    args: ExprNode[];
}
interface ExprTextNode {
    type: ExprType.TEXT;
    segs: ExprNode[];
}
interface ExprBinaryNode {
    type: ExprType.BINARY;
    segs: [ExprNode, ExprNode];
    operator: number;
}
interface ExprUnaryNode {
    type: ExprType.UNARY;
    expr: ExprAccessorNode;
}
interface ExprTertiaryNode {
    type: ExprType.TERTIARY;
    segs: ExprNode[];
}

interface SanIndexedList {
    get(bindName: string): ExprNode;
    each(handler: (bindItem: ExprNode) => any);
    push(item: { name: string } & {});
}

declare enum NodeType {
    TEXT = 1,
    IF = 2,
    FOR = 3,
    ELEM = 4,
    CMPT = 5,
    SLOT = 6,
    TPL = 7
}

interface ANode {
    isText?: boolean;
    text?: string;
    textExpr?: ExprTextNode;
    children?: ANode[];
    props: SanIndexedList;
    events: SanIndexedList;
    directives: SanIndexedList;
    tagName: string;
}

type SanRenderer<T> = (data: T) => string;

interface SanStatic {
    Component: ComponentConstructor<{}, {}>;

    defineComponent<T, D>(config: SanComponentConfig<T, D> & D): ComponentConstructor<T, D>;
    compileComponent<T extends SanComponent<{}>>(component: T): void;
    compileToRenderer<T extends SanComponent<{}>>(component: T): SanRenderer<T>;
    compileToSource<T extends SanComponent<{}>>(component: T): string;

    parseExpr(template: string): ExprNode;
    parseTemplate(template: string): ANode;
    inherits(childClazz: (...args: any[]) => void, parentClazz: ComponentConstructor<{}, {}>);
    nextTick(doNextTick: () => any): void;
    DataTypes: {
        any: DataTypeChecker;
        array: DataTypeChecker;
        object: DataTypeChecker;
        func: DataTypeChecker;
        string: DataTypeChecker;
        number: DataTypeChecker;
        bool: DataTypeChecker;
        symbol: DataTypeChecker;
        arrayOf: DataTypeChecker;
        instanceOf: DataTypeChecker;
        shape: DataTypeChecker;
        oneOf: DataTypeChecker;
        oneOfType: DataTypeChecker;
        objectOf: DataTypeChecker;
        exact: DataTypeChecker;
    };
    debug: boolean;
    version: boolean;
}

declare const San: SanStatic;

export default San;
