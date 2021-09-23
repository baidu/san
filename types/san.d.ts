/**
 * 本文件 export 暴露在 require('san') 上的根属性/方法
 */
import { Expr } from "./expr"
import { ANode } from "./anode"
import { Data, DataTypeChecker } from "./data"
import { Component, ComponentNewOptions } from "./component"



export { ExprType } from "./expr"
export { Data } from "./data"
export { NodeType } from "./node"






interface ComponentClass<T extends {}> {
    new(option?: ComponentNewOptions<T>): Component<T>;
}

interface DefinedComponentClass<T extends {}, M> {
    new(option?: ComponentNewOptions<T>): Component<T> & M;
}

interface ComponentDefineOptions<T extends {}> {
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
        [k: string]: ComponentClass<{}> | ComponentDefineOptions<{}> | ComponentLoader<{}> | 'self';
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

export function defineComponent<T extends {}>(options: ComponentDefineOptions<T>): DefinedComponentClass<T, typeof options>;


interface ComponentLoaderOptions<T> {
    load(): Promise<ComponentClass<T>>;
    placeholder?: ComponentClass<{}>;
    fallback?: ComponentClass<{}>;
}

declare class ComponentLoader<T> {
    constructor(options: ComponentLoaderOptions<T>);
    start(onload: (componentClass: ComponentClass<T> | ComponentClass<{}>) => void): void;
    done(componentClass: ComponentClass<T> | ComponentClass<{}>): void;
}

export function createComponentLoader<T extends {}>(options: ComponentLoaderOptions<T> | ComponentLoaderOptions<T>['load']): ComponentLoader<T>;






interface ParseTemplateOption {
    trimWhitespace?: 'none' | 'blank' | 'all';
    delimiters?: [string, string];
}

export function parseTemplate(template: string, options?: ParseTemplateOption): ANode;
export function parseComponentTemplate(componentClass: ComponentClass<{}>): ANode;

export function parseExpr(template: string): Expr;
export function evalExpr<T extends {}>(expr: Expr, data: Data<T>, owner?: Component<T>): any;

export function inherits(subClass: ComponentClass<{}>, superClass: ComponentClass<{}>): void;
export function inherits<T>(subClass: (options: ComponentNewOptions<T>) => void, superClass: ComponentClass<{}>): void;
export function nextTick(handler: () => any): void;
export const debug: boolean;
export const version: string;
