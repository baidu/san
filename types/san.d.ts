/**
 * 本文件 export 暴露在 require('san') 上的根属性/方法
 */
import { ExprNode, ExprAccessorNode } from "./expr";
import { ANode, NodeType } from "./anode";

export { NodeType } from "./anode";
export { ExprType } from "./expr";
export function defineComponent<T extends ComponentConstructor>(config: ComponentConfig): T;
export function createComponentLoader(options: ComponentLoaderOption | ComponentLoaderOption['load']): ComponentLoader;
export function compileComponent(component: Component): void;

export function parseExpr(template: string): ExprNode;
export function evalExpr(expr: ExprNode, data: Data, owner?: Component): any;
export function parseTemplate(template: string, options?: ParseTemplateOption): ANode;
declare function parseComponentTemplate(componentClass: ComponentConstructor): ANode;
export function inherits(childClazz: (...args: any[]) => void, parentClazz: typeof Component): void;
export function nextTick(doNextTick: () => any): void;

/**
 * Component 类型的接口
 *
 * 用来继承的抽象基类，无法直接 new
 */
export abstract class Component {
    constructor(option?: ComponentInit);

    el?: Element;
    nodeType: NodeType;
    data: Data;
    parentComponent?: Component;
    fire(eventName: string, eventData: any): void;
    dispatch(eventName: string, eventData: any): void;

    on(eventName: string, listener: SanEventListener<unknown>): void;
    un(eventName: string, listener?: SanEventListener<unknown>): void;

    watch(propName: string, watcher: (newValue: any) => any): void;
    ref<T extends Component | Element>(refName: string): T;
    slot<T extends Component>(name?: string): Array<T & SanSlot>;
    nextTick(doNextTick: () => any): void;
    attach(container: Element): void;
    detach(): void;
    dispose(): void;
}

/**
 * 可以得到 Component 的构造函数
 *
 * 可以直接 new 得到具体 Component 的实例
 */
interface ComponentConstructor {
    new(option?: ComponentInit): Component;
}

export class Data {
    constructor(init?: DataInit, parent?: Data);
    parent: Data;
    raw: DataInit;

    listeners: DataChangeListener[];
    listen(listener: DataChangeListener): void;
    unlisten(listener?: DataChangeListener): void;

    typeChecker: () => void;
    setTypeChecker(checker: () => void): void;

    fire(change: DataChangeInfo): void;
    get(expr?: string | ExprAccessorNode): any;
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

export interface ComponentInit {
  data?: DataInit;
  owner?: any;
  source?: string | ANode
}

interface SanEvent<E> {
    target: Component;
    value: E;
    name: string;
}

type SanEventListener<N> = (e: SanEvent<N>) => any;

interface DataChangeListener {
    (this: Data, change: DataChangeInfo): void
}
interface DataChangeInfo {
    option: DataChangeOption,
    type: DataChangeType,
    expr: ExprAccessorNode,
    value: any,
}
interface DataChangeOption {
    silent?: boolean;
    silence?: boolean;
    quiet?: boolean;
}

declare enum DataChangeType {
    SET = 1,
    SPLICE = 2,
}

type DataTypeChecker = (data: any, dataName: string, componentName: string, fullDataName: string, secret?: any) => void;
interface ChainableDataTypeChecker extends DataTypeChecker {
    isRequired: DataTypeChecker;
}

interface ComponentConfig {
    el?: Element;
    trimWhitespace?: 'none' | 'blank' | 'all';
    data?: DataInit;
    initData?(): DataInit;
    displayName?: string;
    template?: string;
    filters?: {
        [k: string]: (value: any, ...filterOption: any[]) => any,
    };
    components?: {
        [k: string]: ComponentConstructor | ComponentConfig | ComponentLoader | 'self',
    };
    computed?: {
        [k: string]: (this: { data: Data }) => any,
    };

    messages?: {
        [k: string]: SanEventListener<SanEvent< unknown>>,
    };
    dataTypes?: {
        [k: string]: DataTypeChecker;
    },
    compiled?(this: Component): void;
    inited?(this: Component): void;
    created?(this: Component): void;
    attached?(this: Component): void;
    detached?(this: Component): void;
    disposed?(this: Component): void;
    updated?(this: Component): void;

    // other methods/props on proto
    [key: string]: any;
}

interface ComponentLoaderOption {
    load(): Promise<ComponentConstructor>;
    placeholder?: ComponentConstructor;
    fallback?: ComponentConstructor;
}

declare class ComponentLoader {
    constructor(
        load: ComponentConstructor,
        placeholder: ComponentConstructor,
        fallback: ComponentConstructor
    );
    start(onload: (ComponentClass: ComponentConstructor) => void): void;
    done(ComponentClass: ComponentConstructor): void;
}

interface SanSlot {
    isScoped: boolean;
    isInserted: boolean;
    children: SanSlot[];
}



interface ParseTemplateOption {
    trimWhitespace?: 'none' | 'blank' | 'all';
    delimiters?: [string, string];
}

type SanRenderer<T> = (data: T) => string;

export const DataTypes: {
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

export interface SanLifeCycleStage {
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

export const LifeCycle: {
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

type Primitive = | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;

export interface DataInit {
    [key: string]: Primitive | DataInit;
}

export const debug: boolean;
export const version: string;
