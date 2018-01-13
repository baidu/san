
declare module 'san' {
  export = san;
}

declare const san: sanStatic;

/**
 * 
 * 
 * @interface sanStatic
 */
interface sanStatic {
  /**
   * 描述：
   *      defineComponent({san.propertiesAndMethods<T>}propertiesAndMethods)
   * 解释：
   *      方法 。定义组件的快捷方法。详细请参考组件定义文档。
    https://ecomfe.github.io/san/tutorial/component/#组件定义
   * 
   * @memberof sanStatic
   */
  defineComponent: <T>(proto: san.propertiesAndMethods<T>) => san.ComponentClass;
  /**
   * 版本：
   *      >= 3.3.0
   * 描述： 
          {void} compileComponent({san.ComponentClass}ComponentClass)
   * 解释：
   *      方法 。编译组件，组件的编译过程主要是解析 template 成 ANode，并对 components 中的 plain object 执行 defineComponent。
     组件会在其第一个实例初始化时自动编译。我们通常不会使用此方法编译组件，除非你有特殊的需求希望组件的编译过程提前。
   * 
   * @memberof sanStatic
   */
  compileComponent: (component: san.ComponentClass) => void;
  /**
   * 解释：
          方法 。一个通用的实现继承的方法，定义组件时可以使用此方法从 san.Component 继承。通常在 ES5 下通过 san.defineComponent 定义组件，在 ESNext 下使用 extends 定义组件。
    绝大多数情况不推荐使用此方法。详细请参考组件定义文档。
   * 
   * @memberof sanStatic
   */
  inherits: <T>(subClass: san.ComponentClass, superClass: san.propertiesAndMethods<T>) => void;

  /**
   * 版本：
          >= 3.1.0
   * 描述： 
          {function({san.renderProps}renderProps):string} compileToRenderer({san.ComponentClass}ComponentClass)
   * 解释：
          方法 。将组件类编译成 renderer 方法。详细请参考服务端渲染文档。
    https://ecomfe.github.io/san/tutorial/ssr/#输出HTML
   * 
   * @memberof sanStatic
   */
  compileToRenderer: (componentClass: san.ComponentClass) => (renderProps: san.renderProps) => string;
  /**
   * 版本：
          >= 3.1.0
   * 描述： 
          {string} compileToRenderer({san.ComponentClass}ComponentClass)
   * 解释：
          方法 。将组件类编译成 renderer 方法的源文件。详细请参考服务端渲染文档。
    https://ecomfe.github.io/san/tutorial/ssr/#编译NodeJS模块
   * 
   * @memberof sanStatic
   */
  compileToSource: (componentClass: san.ComponentClass) => string;

  /**
   * 版本：
          >= 3.0.3
   * 描述： 
          {san.ParseExprClass} parseExpr({string}source)
   * 解释：
          方法 。将源字符串解析成表达式对象。详细请参考ANode文档。
   * 
   * @memberof sanStatic
   */
  parseExpr: (source: string) => san.ParseExprClass;
  /**
   * 版本：
          >= 3.0.3
   * 描述： 
          {ANode} parseTemplate({string}source)
   * 解释：
          方法 。将源字符串解析成 ANode 对象。如果你想使用 San 的模板形式，但是自己开发视图渲染机制，可以使用该方法解析模板。详细请参考ANode文档。
   * 
   * @memberof sanStatic
   */
  parseTemplate: (source: string) => san.ANode;
  /**
   * 类型： 
          boolean
   * 解释：
          属性 。是否开启调试功能。当同时满足以下两个条件时，可以在 chrome 中使用 devtool 进行调试。
    主模块 debug 属性设为 true
    当前页面环境中的 San 是带有 devtool 功能的版本。查看San的打包发布版本
   * 
   * 
   * @type {boolean}
   * @memberof sanStatic
   */
  debug: boolean;
  /**
   * 类型： 
          string
   * 解释：
          属性 。当前的 San 版本号。
   * 
   * 
   * @type {string}
   * @memberof sanStatic
   */
  readonly version: string;
  /**
   * 版本： 
          < 3.3.0 (已废弃)
   * 类型： 
          Function
   * 解释：
          属性 。生命周期类。如果你想自己开发管理组件的渲染和交互更新过程，LifeCycle 可能对你有所帮助。
   * 
   * @memberof sanStatic
   */
  LifeCycle: () => san.LifeCycleClass;
}

declare namespace san {
  type propertiesAndMethods<T> = {

    components?: Array<{
      name: string,
      component: san.ComponentClass
    }>
    /**
     * 
     * 
     * @type {string}
     */
    template: string;
    /**
     * 
     * 
     */
    compiled?: () => void;
    /**
     * 
     * 
     */
    inited?: () => void;
    /**
     * 
     * 
     */
    created?: () => void;
    /**
     * 
     * 
     */
    attached?: () => void;
    /**
     * 
     * 
     */
    detached?: () => void;
    /**
     * 
     * 
     */
    disposed?: () => void;
    /**
     * 
     * 
     */
    initData?: () => T;

    readonly data?: {
      /**
       * set 方法是最常用的操作数据的方法，作用相当于 JavaScript 中的赋值 (=)。
       * 
       */
      set: <T>(name: string, data: T) => void;
      /**
       * merge 方法用于将目标数据对象（target）和传入数据对象（source）的键进行合并，作用类似于 JavaScript 中的 Object.assign(target, source)。
       * 版本：
              >= 3.4.0
       */
      merge: <T>(name: string, data: T) => void;
      /**
       * apply 方法接受一个函数作为参数，传入当前的值到函数，然后用新返回的值更新它。其行为类似 Array.prototype.map 方法。.
       * 版本：
              >= 3.4.0
       * 
       */
      apply: <T>(name: string, fn: (data: T) => any) => void;
      /**
       * 在数组末尾插入一条数据。
       * 
       */
      push: <T>(name: string, data: T) => void;
      /**
       * 在数组末尾弹出一条数据。
       * 
       */
      pop: (name: string) => void;
      /**
       * 在数组开始插入一条数据。
       * 
       */
      unshift: <T>(name: string, data: T) => void;
      /**
       * 在数组开始弹出一条数据。
       * 
       */
      shift: <T>(name: string, data: T) => void;
      /**
       * 移除一条数据。只有当数组项与传入项完全相等(===)时，数组项才会被移除。
       * 
       */
      remove: <T>(name: string, data: T) => void;
      /**
       * 通过数据项的索引移除一条数据。
       * 
       */
      removeAt: (name: string, index: number) => void;
      /**
       * 向数组中添加或删除项目。
       * 
       */
      splice: (name: string, arr: Array<number>) => void;
    };
  }

  type ComponentClass = {
    /**
     * 
     * 
     */
    attach: (element: HTMLElement) => void;
  }

  /**
   * 解释：
   *      属性 。组件类，定义组件时可以从此继承。通常通过 san.defineComponent 定义组件，不使用此方法。详细请参考组件定义文档。
    https://ecomfe.github.io/san/tutorial/component/#组件定义
   * 
   */
  type Component<T> = san.propertiesAndMethods<T>

  /**
   * 
   */
  type renderProps = {
    [key: string]: any
  }

  /**
   * San 支持的表达式类型。
   * https://github.com/ecomfe/san/blob/master/doc/anode.md#表达式类型
   */
  type ExprType = ExprTypeEnum

  /**
   * San 支持的表达式类型。
   * https://github.com/ecomfe/san/blob/master/doc/anode.md#表达式类型
   */
  type ParseExprClass = {
    type: ExprType,
    expr: {
      type: ExprType,
      paths: Array<{
        type: ExprType,
        value: string
      }>
    }
  }

  type ANode = {
    isText?: boolean;
    text: string;
    textExpr: any;
    children: Array<ANode>;
    props: IndexedList;
    events: IndexedList;
    directives: IndexedList;
    tagName: string;
  }

  type TextExprClass = {
    type: ExprType,
    segs: Array<SegsClass>
  }
  type SegsClass = {
    type: ExprType,
    expr: Array<ExprClass>,
    filters: Array<{
      type: ExprType,
      name: ExprClass,
      args: TextExprClass
    }>
  }
  type ExprClass = {
    type: ExprType,
    paths: Array<PathsClass>;
  }
  type PathsClass = {
    type: ExprType,
    value: string;
  }

  type IndexedList = {
    push: <T>(item: T) => void;
    each: <T>(callback: (object: T, index: number) => any, thisArg: any) => void;
    getAt: <T>(index: number) => T;
    get: <T>(name: string) => T;
    removeAt: (index: number) => void;
    remove: (name: string) => void;
    concat: <T>(other: IndexedList) => IndexedList;
  }

  type LifeCycleClass = {
    set: (string: LifeCycleType) => void;
    is: (string: LifeCycleType) => boolean;
  }
  type LifeCycleType = "compiled" | "inited" | "created" | "attached" | "detached" | "disposed"
}

declare enum ExprTypeEnum {
  STRING = 1,
  NUMBER = 2,
  BOOL = 3,
  ACCESSOR = 4,
  INTERP = 5,
  CALL = 6,
  TEXT = 7,
  BINARY = 8,
  UNARY = 9,
  TERTIARY = 10
}
