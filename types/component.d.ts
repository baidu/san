import { NodeType, LifeCycleStage } from "./node"
import { Data, DataTypeChecker } from "./data"
import { ANode } from "./anode"


interface SlotNode {
    isScoped: boolean;
    isInserted: boolean;
    isNamed?: boolean;
    name?: string;
    nodeType: NodeType.SLOT;
}

export interface ComponentNewOptions<T extends {}> {
    data?: Partial<T>;
    owner?: Component<{}>;
    source?: string | ANode;
    el?: Element;
}

/**
 * Component 类
 */
 export interface Component<T extends {}> {
    new(option?: ComponentNewOptions<T>): Component<T>;

    el?: Element;
    data: Data<T>;
    parentComponent?: Component<{}>;

    nodeType: NodeType.CMPT;
    lifeCycle: LifeCycleStage;

    fire<TEventArg>(eventName: string, eventArg: TEventArg): void;
    on(eventName: string, listener: () => void): void;
    on<TEventArg>(eventName: string, listener: (eventArg: TEventArg) => void): void;
    un(eventName: string, listener?: Function): void;

    dispatch<TMsg>(messageName: string, message: TMsg): void;

    // TODO: any? unknown?
    watch(propName: string, watcher: (value: any, arg: {oldValue?: any, newValue?: any}) => void): void;
    
    ref<TCmpt extends Component<{}>>(refName: string): TCmpt;
    ref(refName: string): Component<{}> | Element;

    slot(name?: string): SlotNode[];

    attach(parentEl: Element, beforeEl?: Element): void;
    detach(): void;
    dispose(): void;

    nextTick(handler: () => any): void;
}

export interface ComponentDefineOptions<T extends {}> {
    trimWhitespace?: 'none' | 'blank' | 'all';
    delimiters?: [string, string];
    autoFillStyleAndId?: boolean;
    initData?(): Partial<T>;
    template?: string;

    filters?: {
        // TODO: any?unknown?
        [k: string]: (value: any, ...filterOption: any[]) => any;
    };

    components?: {
        [k: string]: Component<{}> | ComponentDefineOptions<{}> | ComponentLoader<{}> | 'self';
    };

    computed?: {
        [k: string]: (this: { data: Data<T> }) => unknown;
    };

    messages?: {
        [k: string]: (arg?: {name?: string, target?: Component<{}>, value?: unknown}) => void;
    };

    dataTypes?: {
        [k: string]: DataTypeChecker;
    },

    construct?(this: Component<T>, options?: ComponentNewOptions<T>): void;
    compiled?(this: Component<T>): void;
    inited?(this: Component<T>): void;
    created?(this: Component<T>): void;
    attached?(this: Component<T>): void;
    detached?(this: Component<T>): void;
    disposed?(this: Component<T>): void;
    updated?(this: Component<T>): void;
    error?(e: Error, instance: Component<{}>, info: string): void;

    // other methods/props on proto
    [key: string]: any;
}

export interface ComponentLoaderOptions<T> {
    load(): Promise<Component<T>>;
    placeholder?: Component<{}>;
    fallback?: Component<{}>;
}

export interface ComponentLoader<T> {
    new(option?: ComponentNewOptions<T>): ComponentLoader<T>;

    start(onload: (componentClass: Component<T>) => void): void;
    done(componentClass: Component<T> | Component<{}>): void;
}


