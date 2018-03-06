
declare namespace San {
    interface SanEvent<T, N> {
        target: SanComponent<T>;
        value: N;
        name: string;
    }

    type SanEventListener<T, N> = (e: SanEvent<T, N>) => any;
    interface SanData<T> {
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
        unshift(expr: string | ExprAccessorNode, item: any, option?: SanDataChangeOption): number;
        removeAt(expr: string | ExprAccessorNode, index: number, option?: SanDataChangeOption): void;
        remove(expr: string | ExprAccessorNode, value: any, option?: SanDataChangeOption): void;
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
    enum DataChangeType {
        SET = 1,
        SPLICE = 2,
    }

    type DataTypeChecker = (data: any, dataName: string, componentName: string, fullDataName: string, secret?: any) => void;
    interface ChainableDataTypeChecker extends DataTypeChecker {
        isRequired: DataTypeChecker;
    }

    interface SanComponentConfig<T extends {}, D> {
        el?: Element;
        trimWhitespace?: 'none' | 'blank' | 'all';
        data?: Partial<T>;
        initData?(): Partial<T>;
        displayName?: string;
        template?: string;
        filters?: {
            [k: string]: (value: any, ...filterOption: any[]) => any,
        };
        components?: {
            [k: string]: ComponentConstructor<{}, {}> | SanComponentConfig<{}, {}> | 'self',
        };
        computed?: {
            [k: string]: (this: { data: SanData<T> }) => any,
        };

        messages?: {
            [k: string]: SanEventListener<{}, {}>,
        };
        dataTypes?: {
            [k in keyof T]: DataTypeChecker;
        },
        compiled?(this: SanComponent<T> & D): void;
        inited?(this: SanComponent<T> & D): void;
        created?(this: SanComponent<T> & D): void;
        attached?(this: SanComponent<T> & D): void;
        detached?(this: SanComponent<T> & D): void;
        disposed?(this: SanComponent<T> & D): void;
        updated?(this: SanComponent<T> & D): void;
    }

    class SanComponent<T> {
        constructor(option?: { data?: Partial<T> });

        el?: Element;
        nodeType: NodeType;
        data: SanData<T>;
        fire(eventName: string, eventData: any): void;
        dispatch(eventName: string, eventData: any): void;

        on(eventName: string, listener: SanEventListener<{}, {}>): void;
        un(eventName: string, listener?: SanEventListener<{}, {}>): void;

        watch(propName: string, watcher: (newValue: any) => any): void;
        ref<T extends SanComponent<{}> | Element>(refName: string): T;
        slot<T extends SanComponent<{}>>(name?: string): Array<T & SanSlot>;
        nextTick(doNextTick: () => any): void;
        attach(container: Element): void;
        detach(): void;
        dispose(): void;
    }

    interface ComponentConstructor<T, D> {
        new(option?: { data?: Partial<T> }): SanComponent<T> & D
    }

    interface SanSlot {
        isScoped: boolean;
        isInserted: boolean;
        children: SanSlot[];
    }

    enum ExprType {
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

    interface SanIndexedList<T> {
        raw: T[];
        index: { [name: string]: T };

        get(bindName: string): T;
        each(handler: (bindItem: T) => any, thisArg: any): void;
        push(item: { name: string } & {}): void;
        remove(name: string): any;
        concat(other: SanIndexedList<T>): SanIndexedList<T>;
    }

    enum NodeType {
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
        props: ExprNode[];
        events: SanIndexedList<ExprNode>;
        directives: { [k: string]: ExprNode };
        tagName: string;
    }

    type SanRenderer<T> = (data: T) => string;

    const Component: ComponentConstructor<{}, {}>;

    function defineComponent<T, D>(config: SanComponentConfig<T, D> & D): ComponentConstructor<T, D>;
    function compileComponent<T extends SanComponent<{}>>(component: T): void;
    function compileToRenderer<T extends SanComponent<{}>>(component: T): SanRenderer<T>;
    function compileToSource<T extends SanComponent<{}>>(component: T): string;

    function parseExpr(template: string): ExprNode;
    function parseTemplate(template: string): ANode;
    function inherits(childClazz: (...args: any[]) => void, parentClazz: ComponentConstructor<{}, {}>): void;
    function nextTick(doNextTick: () => any): void;
    const DataTypes: {
        any: ChainableDataTypeChecker;
        array: ChainableDataTypeChecker;
        object: ChainableDataTypeChecker;
        func: ChainableDataTypeChecker;
        string: ChainableDataTypeChecker;
        number: ChainableDataTypeChecker;
        bool: ChainableDataTypeChecker;
        symbol: ChainableDataTypeChecker;

        arrayOf(arrayItemChecker: DataTypeChecker): ChainableDataTypeChecker;
        instanceOf<T>(expectedClass: new () => T): ChainableDataTypeChecker;
        shape(shapeTypes: { [k: string]: DataTypeChecker }): ChainableDataTypeChecker;
        oneOf(expectedEnumValues: any[]): ChainableDataTypeChecker;
        oneOfType(expectedEnumOfTypeValues: DataTypeChecker[]): ChainableDataTypeChecker;
        objectOf(typeChecker: DataTypeChecker): ChainableDataTypeChecker;
        exact(shapeTypes: { [k: string]: DataTypeChecker }): ChainableDataTypeChecker;
    };

    interface SanLifeCycleStage {
        is(stat: string): boolean;
        attached?: true;
        compiled?: true;
        created?: true;
        detached?: true;
        disposed?: true;
        inited?: true;
        leaving?: true;
        painting?: true;
    }

    const LifeCycle: {
        start: {},

        compiled: {
            is(stat: string): boolean,
            compiled: true
        },

        inited: {
            is(stat: string): boolean,
            compiled: true,
            inited: true
        },

        painting: {
            is(stat: string): boolean,
            compiled: true,
            inited: true,
            painting: true
        },

        created: {
            is(stat: string): boolean,
            compiled: true,
            inited: true,
            created: true
        },

        attached: {
            is(stat: string): boolean,
            compiled: true,
            inited: true,
            created: true,
            attached: true
        },

        leaving: {
            is(stat: string): boolean,
            compiled: true,
            inited: true,
            created: true,
            attached: true,
            leaving: true
        },

        detached: {
            is(stat: string): boolean,
            compiled: true,
            inited: true,
            created: true,
            detached: true
        },

        disposed: {
            is(stat: string): boolean,
            disposed: true
        }
    }

    const debug: boolean;
    const version: string;
}

export = San;

interface SanStaticGlobal {

    Component: San.ComponentConstructor<{}, {}>;

    defineComponent<T, D>(config: San.SanComponentConfig<T, D> & D): San.ComponentConstructor<T, D>;
    compileComponent<T extends San.SanComponent<{}>>(component: T): void;
    compileToRenderer<T extends San.SanComponent<{}>>(component: T): San.SanRenderer<T>;
    compileToSource<T extends San.SanComponent<{}>>(component: T): string;

    parseExpr(template: string): San.ExprNode;
    parseTemplate(template: string): San.ANode;
    inherits(childClazz: (...args: any[]) => void, parentClazz: San.ComponentConstructor<{}, {}>): void;
    nextTick(doNextTick: () => any): void;

    DataTypes: typeof San.NodeType;
    NodeType: typeof San.NodeType;
    LifeCycle: typeof San.LifeCycle;

    debug: boolean;
    version: string;
}

declare global {
    const san: SanStaticGlobal;
}
