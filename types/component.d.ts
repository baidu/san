import { NodeType } from "./node"
import { Data } from "./data"
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
    source?: string | ANode
}

/**
 * Component 类
 */
 export class Component<T extends {}> {
    constructor(option?: ComponentNewOptions<T>);

    el?: Element;
    data: Data<T>;
    parentComponent?: Component<{}>;

    nodeType: NodeType.CMPT;

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


export interface LifeCycleStage {
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

export interface LifeCycleStart extends LifeCycleStage {
}

export interface LifeCycleCompiled extends LifeCycleStage {
    compiled: true;
}

export interface LifeCycleInited extends LifeCycleStage {
    compiled: true;
    inited: true;
}

export interface LifeCyclePainting extends LifeCycleStage {
    compiled: true;
    inited: true;
    painting: true;
}

export interface LifeCycleCreated extends LifeCycleStage {
    compiled: true;
    inited: true;
    created: true;
}

export interface LifeCycleAttached extends LifeCycleStage {
    compiled: true;
    inited: true;
    created: true;
    attached: true;
}

export interface LifeCycleLeaving extends LifeCycleStage {
    compiled: true;
    inited: true;
    created: true;
    attached: true;
    leaving: true;
}

export interface LifeCycleDetached extends LifeCycleStage {
    compiled: true;
    inited: true;
    created: true;
    detached: true;
}

export interface LifeCycleDisposed extends LifeCycleStage {
    disposed: true;
}

export const LifeCycle: {
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
