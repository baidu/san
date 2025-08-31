export as namespace san
export = san

type Get<T, K> = K extends `${infer L}.${infer R}`
    ? L extends keyof T
        ? Get<T[L], R>
        : any
    : K extends `${infer First}[${infer Tail}]`
        ? First extends keyof T
            ? T[First] extends Array<infer AT> ? AT : any
            : any
        : K extends keyof T
            ? T[K]
            : any

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

declare namespace san {
    const debug: boolean;
    const version: string;

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
    }

    class Data<T extends {} = {}> {
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


    interface Component<T extends {} = {}> {

        el?: Element;
        data: Data<T>;
        d: T;
        parentComponent?: Component<{}>;
    
        nodeType: NodeType.CMPT;
        lifeCycle: LifeCycleStage;
    
        fire(eventName: string):void;
        fire<TEventArg>(eventName: string, eventArg: TEventArg): void;
        on(eventName: string, listener: () => void): void;
        on<TEventArg>(eventName: string, listener: (eventArg: TEventArg) => void): void;
        un(eventName: string, listener?: Function): void;
    
        dispatch<TMsg>(messageName: string, message: TMsg): void;
    
        watch(
            propName: string, 
            watcher: (value: any, arg: {oldValue?: any, newValue?: any}) => void
        ): void;
        
        ref<TCmpt extends Component<{}>>(refName: string): TCmpt;
        ref(refName: string): Component<{}> | Element;
    
        slot(name?: string): SlotNode[];
    
        attach(parentEl: Element, beforeEl?: Element): void;
        detach(): void;
        dispose(): void;
    
        nextTick(handler: () => void): void;


        initData?(): Partial<T>;
        construct?(options?: ComponentNewOptions<T>): void;
        compiled?(): void;
        inited?(): void;
        created?(): void;
        attached?(): void;
        detached?(): void;
        disposed?(): void;
        updated?(): void;
        error?(e: Error, instance: Component<{}>, info: string): void;
    }

    class Component<T extends {} = {}> {
        constructor(option?: ComponentNewOptions<T>);
    }

    interface TemplateComponent<T extends {} = {}> {
        el?: Element;
        data: Data<T>;
        parentComponent?: Component<{}>;
    
        nodeType: NodeType.CMPT;
        lifeCycle: LifeCycleStage;
    
    
        attach(parentEl: Element, beforeEl?: Element): void;
        detach(): void;
        dispose(): void;

        initData?(): Partial<T>;
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

    const LifeCycle: {
        start: LifeCycleStage;
        compiled: LifeCycleCompiled;
        inited: LifeCycleInited;
        painting: LifeCyclePainting;
        created: LifeCycleCreated;
        attached: LifeCycleAttached;
        leaving: LifeCycleLeaving;
        detached: LifeCycleDetached;
        disposed: LifeCycleDisposed;
    }

    enum NodeType {
        TEXT = 1,
        IF = 2,
        FOR = 3,
        ELEM = 4,
        CMPT = 5,
        SLOT = 6,
        TPL = 7,
        LOADER = 8,
        IS = 9
    }
    
    interface Expr {
        type: ExprType;
        parenthesized?: boolean;
    }
    
    interface StringLiteral extends Expr {
        type: ExprType.STRING;
        value: string;
    }
    interface NumberLiteral extends Expr {
        type: ExprType.NUMBER;
        value: number;
    }
    
    interface BoolLiteral extends Expr {
        type: ExprType.BOOL;
        value: boolean;
    }
    
    interface NullLiteral extends Expr {
        type: ExprType.NULL;
    }
    
    interface AccessorExpr extends Expr {
        type: ExprType.ACCESSOR;
        paths: Expr[];
    }
    interface InterpExpr extends Expr {
        type: ExprType.INTERP;
        expr: Expr;
        filters: CallExpr[];
        original?: boolean;
    }
    
    interface CallExpr extends Expr {
        type: ExprType.CALL;
        name: AccessorExpr;
        args: Expr[];
    }
    
    interface TextExpr extends Expr {
        type: ExprType.TEXT;
        segs: Array<InterpExpr | StringLiteral>;
        original?: number;
        value?: string; // segs 由一个 STRING 构成时存在
    }
    
    interface BinaryExpr extends Expr {
        type: ExprType.BINARY;
        segs: [Expr, Expr];
        operator: number;
    }
    
    interface UnaryExpr extends Expr {
        type: ExprType.UNARY;
        operator: number;
        expr: Expr;
    }
    interface TertiaryExpr extends Expr {
        type: ExprType.TERTIARY;
        segs: [Expr, Expr, Expr];
    }
    
    interface ObjectLiteralItem {
        expr: Expr;
        name?: Expr;
        spread?: boolean;
    }
    interface ObjectLiteral extends Expr {
        type: ExprType.OBJECT;
        items: ObjectLiteralItem[];
    }
    
    interface ArrayLiteralItem {
        expr: Expr;
        spread?: boolean;
    }
    
    interface ArrayLiteral extends Expr {
        type: ExprType.ARRAY;
        items: ArrayLiteralItem[];
    }

    enum DataChangeType {
        SET = 1,
        SPLICE = 2
    }

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
    
    type DataTypeChecker = (
        data: any, 
        dataName: string, 
        componentName: string, 
        fullDataName: string, 
        secret?: any
    ) => void;

    interface ChainableDataTypeChecker extends DataTypeChecker {
        isRequired: DataTypeChecker;
    }
    
    
    interface AText {
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
    }
    
    interface AElement {
        directives: Directives;
        props: AProperty[];
        events: AEvent[];
        children: ANode[];
        tagName?: string;
        vars?: AVar[];
    }
    
    // TODO: | or &
    type ANode = AText | AElement;
    
    interface AProperty {
        name: string;
        expr: Expr;
        noValue?: number | boolean;
        x?: number | boolean;
    }
    
    interface AEvent {
        name: string;
        expr: CallExpr;
        modifier: {
            [K: string]: boolean
        }
    }
    
    interface AVar {
        name: string;
        expr: Expr;
    }
    
    interface ADirective {
        value: {}
    }
    interface ADirectiveIs extends ADirective {
        value: Expr;
    }
    interface ADirectiveShow extends ADirective {
        value: Expr;
    }
    interface ADirectiveHtml extends ADirective {
        value: Expr;
    }
    interface ADirectiveBind extends ADirective {
        value: Expr;
    }
    interface ADirectiveIf extends ADirective {
        value: Expr;
    }
    interface ADirectiveElif extends ADirective {
        value: Expr;
    }
    interface ADirectiveElse extends ADirective {}
    interface ADirectiveTransition extends ADirective {
        value: CallExpr;
    }
    interface ADirectiveRef extends ADirective {
        value: Expr;
    }
    interface ADirectiveFor extends ADirective {
        value: Expr;
        item: string;
        index?: string;
        trackBy?: AccessorExpr;
        trackByRaw?: string;
    }
    
    interface AFragmentNode extends AElement {
        tagName: 'fragment' | 'template';
    }
    
    interface AForNode extends AElement {
        directives: RequiredByKeys<Directives, 'for'>;
    }
    
    interface AIfNode extends AElement {
        elses?: AElement[];
        directives: RequiredByKeys<Directives, 'if'>;
    }
    
    interface ASlotNode extends AElement {
        tagName: 'slot';
    }

    
    
    interface LifeCycleStage {
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
    
    interface LifeCycleStart extends LifeCycleStage {
    }
    
    interface LifeCycleCompiled extends LifeCycleStage {
        compiled: true;
    }
    
    interface LifeCycleInited extends LifeCycleStage {
        compiled: true;
        inited: true;
    }
    
    interface LifeCyclePainting extends LifeCycleStage {
        compiled: true;
        inited: true;
        painting: true;
    }
    
    interface LifeCycleCreated extends LifeCycleStage {
        compiled: true;
        inited: true;
        created: true;
    }
    
    interface LifeCycleAttached extends LifeCycleStage {
        compiled: true;
        inited: true;
        created: true;
        attached: true;
    }
    
    interface LifeCycleLeaving extends LifeCycleStage {
        compiled: true;
        inited: true;
        created: true;
        attached: true;
        leaving: true;
    }
    
    interface LifeCycleDetached extends LifeCycleStage {
        compiled: true;
        inited: true;
        created: true;
        detached: true;
    }
    
    interface LifeCycleDisposed extends LifeCycleStage {
        disposed: true;
    }
    
    interface SlotNode {
        isScoped: boolean;
        isInserted: boolean;
        isNamed?: boolean;
        name?: string;
        nodeType: NodeType.SLOT;
    }
    
    interface ComponentNewOptions<T extends {} = {}> {
        data?: Partial<T>;
        owner?: Component<{}>;
        source?: string | ANode;
        el?: Element;
    }

    interface TemplateComponentNewOptions<T extends {} = {}> {
        data?: Partial<T>;
        owner?: Component<{}>;
        source?: string | ANode;
    }

    interface ComponentDefineOptionFilters {
        [k: string]: (value: any, ...filterOption: any[]) => any;
    }

    interface ComponentDefineOptionComponents {
        [k: string]: Component<{}> | ComponentDefineOptions<{}> | ComponentLoader | 'self';
    }

    interface ComponentDefineOptionComputed<T> {
        [k: string]: (this: { 
            data: {
                get<TPath extends string>(name: TPath): Get<T, TPath>;
            } 
        }) => unknown;
    }

    interface ComponentDefineOptionMessages {
        [k: string]: (arg?: {name?: string, target?: Component<{}>, value?: unknown}) => void;
    }

    type TemplateParseOptionDelimiters = [string, string]
    type TemplateParseOptionTrimWhitespace = 'none' | 'blank' | 'all'

    interface ComponentDefineOptions<T extends {} = {}> {
        template?: string;
        filters?: ComponentDefineOptionFilters;
        components?: ComponentDefineOptionComponents;
        computed?: ComponentDefineOptionComputed<T>;
        messages?: ComponentDefineOptionMessages;
        trimWhitespace?: TemplateParseOptionTrimWhitespace;
        delimiters?: TemplateParseOptionDelimiters;
        autoFillStyleAndId?: boolean;
        
        initData?(): Partial<T>;
        construct?(options?: ComponentNewOptions<T>): void;
        compiled?(): void;
        inited?(): void;
        created?(): void;
        attached?(): void;
        detached?(): void;
        disposed?(): void;
        updated?(): void;
        error?(e: Error, instance: Component<{}>, info: string): void;

        dataTypes?: {
            [k: string]: DataTypeChecker;
        };
    
        // other methods/props on proto
        [key: string]: any;
    }

    interface TemplateComponentDefineOptions<T extends {} = {}> {
        template?: string;
        trimWhitespace?: TemplateParseOptionTrimWhitespace;
        delimiters?: TemplateParseOptionDelimiters;
        autoFillStyleAndId?: boolean;
        
        initData?(): Partial<T>;
    }


    interface ComponentLoaderOptions {
        load(): Promise<DefinedComponentClass<{}, {}> | DefinedTemplateComponentClass<{}>>;
        placeholder?: DefinedComponentClass<{}, {}> | DefinedTemplateComponentClass<{}>;
        fallback?: DefinedComponentClass<{}, {}> | DefinedTemplateComponentClass<{}>;
    }
    
    interface ComponentLoader {
        new(option?: ComponentLoaderOptions): ComponentLoader;
    
        start(onload: (componentClass: DefinedComponentClass<{}, {}> | DefinedTemplateComponentClass<{}>) => void): void;
        done(componentClass: DefinedComponentClass<{}, {}> | DefinedTemplateComponentClass<{}>): void;
    }

    interface DefinedComponentClass<T extends {} = {}, M extends {} = {}> {
        new(option?: ComponentNewOptions<T>): Component<T> & M;
    }
    
    type ComponentDefineOptionsWithThis<DataT, OptionsT> = ComponentDefineOptions<DataT> & OptionsT 
        & ThisType<Component<DataT> & ComponentDefineOptions<DataT> & OptionsT>;

    function defineComponent<DataT extends {} = {}, OptionsT extends {} = {}>(
        options: ComponentDefineOptionsWithThis<DataT, OptionsT>,
        superClass?: DefinedComponentClass<{}, {}>
    ): DefinedComponentClass<DataT, OptionsT>;

    interface DefinedTemplateComponentClass<T extends {}> {
        new(option?: TemplateComponentNewOptions<T>): TemplateComponent<T>;
    }

    function defineTemplateComponent<DataT extends {} = {}>(
        options: TemplateComponentDefineOptions<DataT>
    ): DefinedTemplateComponentClass<DataT>;

    function createComponentLoader(
        options: ComponentLoaderOptions | ComponentLoaderOptions["load"]
    ): ComponentLoader;
    
    interface HydrateComponentRenderOnlyResult {
        renderOnly: true;
        components: {
            [key: string]: DefinedComponentClass<{}, {}>[];
        }
    }

    interface HydrateComponentNormalResult {
        renderOnly?: false|undefined;
        instance: DefinedComponentClass<{}, {}>;
    }

    type HydrateComponentResult = HydrateComponentRenderOnlyResult | HydrateComponentNormalResult;
    function hydrateComponent(
        ComponentClass: DefinedComponentClass, 
        options: ComponentNewOptions
    ): HydrateComponentResult;

    function parseTemplate(
        template: string, 
        options?: {
            trimWhitespace?: TemplateParseOptionTrimWhitespace;
            delimiters?: TemplateParseOptionDelimiters;
        }
    ): ANode;

    function parseComponentTemplate(componentClass: Component<{}>): ANode;
    function unpackANode(source: Array<string|number|null|undefined>): ANode;
    
    function parseExpr(template: string): Expr;
    function evalExpr<T extends {}>(expr: Expr, data: Data<T>, owner?: Component<T>): any;
    
    function inherits(subClass: Component<{}>, superClass: Component<{}>): void;
    function inherits<T>(subClass: (options: ComponentNewOptions<T>) => void, superClass: Component<{}>): void;
    function nextTick(handler: () => any): void;
}

