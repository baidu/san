export enum NodeType {
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
