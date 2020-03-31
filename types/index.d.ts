
declare namespace San {
    interface SanEvent<T, N> {
        target: SanComponent<T>;
        value: N;
        name: string;
    }

    type SanEventListener<T, N> = (e: SanEvent<T, N>) => any;
    interface SanData<T> {
        new(data?: {}, parent?: SanData<{}>): SanData<T>;
        parent: SanData<{}>;
        raw: T;

        listeners: SanChangeListener<T>[];
        listen(listener: SanChangeListener<T>): void;
        unlisten(listener?: SanChangeListener<T>): void;

        typeChecker: () => void;
        setTypeChecker(checker: () => void): void;

        fire(change: SanDataChangeInfo): void;
        get(expr?: string | ExprAccessorNode): any;
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

    const Data: SanData<{}>;

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
            [k: string]: ComponentConstructor<{}, {}> | SanComponentConfig<{}, {}> | SanComponentLoader<{}, {}> | 'self',
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
        new(option?: { data?: Partial<T> }): SanComponent<T> & D;
    }

    interface SanComponentLoaderOption<T, D> {
        load(): Promise<ComponentConstructor<T, D>>;
        placeholder?: ComponentConstructor<T, D>;
        fallback?: ComponentConstructor<T, D>;
    }

    class SanComponentLoader<T, D> {
        constructor(
            load: ComponentConstructor<T, D>,
            placeholder: ComponentConstructor<T, D>,
            fallback: ComponentConstructor<T, D>
        );
        start(onload: (Component: ComponentConstructor<T, D>) => void): void;
        done(Component: ComponentConstructor<T, D>): void;
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
        OBJECT = 11,
        ARRAY = 12,
        NULL = 13
    }

    interface ExprNodeTpl<T extends ExprType> {
        type: T;        // 如果只有这一个属性，去掉泛型更可读
        raw: string;
        value?: any;    // 在 eval 会统一处理，事实上作用于 null, string, number
        parenthesized?: boolean; // 在 read parenthesized expr 会统一设置
    }
    type ExprNode = ExprNodeTpl<any>;
    interface ExprStringNode extends ExprNodeTpl<ExprType.STRING> {
        value: string;
        literal?: string;
    }
    interface ExprNumberNode extends ExprNodeTpl<ExprType.NUMBER> {
        value: number;
    }
    interface ExprBoolNode extends ExprNodeTpl<ExprType.BOOL> {
        value: boolean;
    }
    interface ExprAccessorNode extends ExprNodeTpl<ExprType.ACCESSOR> {
        paths: ExprNode[];
    }
    interface ExprInterpNode extends ExprNodeTpl<ExprType.INTERP> {
        expr: ExprAccessorNode;
        filters: ExprCallNode[];
        original: boolean;
        raw: string;
    }
    interface ExprCallNode extends ExprNodeTpl<ExprType.CALL> {
        name: ExprAccessorNode;
        args: ExprNode[];
    }
    interface ExprTextNode extends ExprNodeTpl<ExprType.TEXT> {
        segs: ExprNode[];
        original?: number;
        value?: string; // segs 由一个 STRING 构成时存在
    }
    interface ExprBinaryNode extends ExprNodeTpl<ExprType.BINARY> {
        segs: [ExprNode, ExprNode];
        operator: number;
    }
    interface ExprUnaryNode extends ExprNodeTpl<ExprType.UNARY> {
        operator: number;
        expr: ExprAccessorNode;
    }
    interface ExprTertiaryNode extends ExprNodeTpl<ExprType.TERTIARY> {
        segs: ExprNode[];
    }
    interface ExprObjectNode extends ExprNodeTpl<ExprType.OBJECT> {
        items: [{
            spread: boolean;
            expr: ExprNode;
            name: ExprNode;
        }];
    }
    interface ExprArrayNode extends ExprNodeTpl<ExprType.ARRAY> {
        items: [{
            spread: boolean;
            expr: ExprNode;
        }];
    }
    interface ExprNullNode extends ExprNodeTpl<ExprType.NULL> {}

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

    interface Directive<T extends ExprNode> {
        item?: string;
        index?: number;
        trackBy?: ExprAccessorNode;
        value: T;
    }

    interface ANodeProperty {
        name: string;
        expr: ExprNode;
        raw: string;
        x?: number;
    }

    interface ANode {
        isText?: boolean;
        text?: string;
        textExpr?: ExprTextNode;
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

    interface ATextNode extends ANode {
        textExpr: ExprTextNode;
    }

    interface ATemplateNode extends ANode {
        tagName: 'template';
    }

    interface AForNode extends ANode {
        directives: {
            for: Directive<any>;
        };
    }

    interface AIfNode extends ANode {
        ifRinsed: ANode;
        elses?: ANode[];
        directives: {
            if: Directive<any>;
        };
    }

    interface ASlotNode extends ANode {
        children: ANode[];
        tagName: 'slot';
    }

    interface ParseTemplateOption {
        trimWhitespace?: 'none' | 'blank' | 'all';
        delimiters?: [string, string];
    }

    type SanRenderer<T> = (data: T) => string;

    const Component: ComponentConstructor<{}, {}>;

    function defineComponent<T, D>(config: SanComponentConfig<T, D> & D): ComponentConstructor<T, D>;
    function createComponentLoader<T, D>(options: SanComponentLoaderOption<T, D> | SanComponentLoaderOption<T, D>['load']): SanComponentLoader<T, D>;
    function compileComponent<T extends SanComponent<{}>>(component: T): void;

    function parseExpr(template: string): ExprNode;
    function evalExpr<T, D extends SanComponent<{}>>(expr: ExprNode, data: SanData<T>, owner?: D): any;
    function parseTemplate(template: string, options?: ParseTemplateOption): ANode;
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
    Data: San.SanData<{}>;

    defineComponent<T, D>(config: San.SanComponentConfig<T, D> & D): San.ComponentConstructor<T, D>;
    createComponentLoader<T, D>(options: San.SanComponentLoaderOption<T, D> | San.SanComponentLoaderOption<T, D>['load']): San.SanComponentLoader<T, D>;
    compileComponent<T extends San.SanComponent<{}>>(component: T): void;

    parseExpr(template: string): San.ExprNode;
    evalExpr<T, D extends San.SanComponent<{}>>(expr: San.ExprNode, data: San.SanData<T>, owner?: D): any;
    parseTemplate(template: string, options?: San.ParseTemplateOption): San.ANode;
    inherits(childClazz: (...args: any[]) => void, parentClazz: San.ComponentConstructor<{}, {}>): void;
    nextTick(doNextTick: () => any): void;

    ExprType: typeof San.ExprType;
    DataTypes: typeof San.DataTypes;
    NodeType: typeof San.NodeType;
    LifeCycle: typeof San.LifeCycle;

    debug: boolean;
    version: string;
}

declare global {
    const san: SanStaticGlobal;
}
