/**
 * @file data types specs
 * @author leon <ludafa@outlook.com>
 */

/* globals san */
/* eslint-disable no-console */

var DataTypes = san.DataTypes;

describe('DataTypes', function () {

    beforeAll(function () {
        spyOn(console, 'error').and.callThrough();
    });

    beforeEach(function () {
        console.error.calls.reset();
    });

    it('should be a object', function () {
        expect(typeof DataTypes === 'object').toBe(true);
    });

    it('same errors only report once', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                name: DataTypes.string.isRequired
            }
        });

        new Test({
            data: {
                name: 1
            }
        });

        new Test({
            data: {
                name: 1
            }
        });

        new Test({
            data: {
                name: 1
            }
        });

        expect(console.error.calls.count()).toBe(1);

    });

    it('cannot call validators directly', function () {

        expect(function () {
            DataTypes.string.isRequired(
                {
                    name: 'erik'
                },
                'name',
                'Test'
            );
        }).toThrow();

    });

    it('array', function () {

        expect(typeof DataTypes.array).toBe('function');
        expect(typeof DataTypes.array.isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                arr1: DataTypes.array.isRequired,
                arr2: DataTypes.array.isRequired,
                arr3: DataTypes.array
            }
        });

        new Test({
            data: {
                arr1: [],
                arr2: undefined,
                arr3: {}
            }
        });

        expect(console.error.calls.count()).toBe(2);

    });

    it('object', function () {

        expect(typeof DataTypes.object).toBe('function');
        expect(typeof DataTypes.object.isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                obj1: DataTypes.object.isRequired,
                obj2: DataTypes.object.isRequired,
                obj3: DataTypes.object
            }
        });

        new Test({
            data: {
                obj1: {},
                obj2: undefined,
                obj3: 1
            }
        });

        expect(console.error.calls.count()).toBe(2);

    });

    it('bool', function () {

        expect(typeof DataTypes.bool).toBe('function');
        expect(typeof DataTypes.bool.isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                bool1: DataTypes.bool.isRequired,
                bool2: DataTypes.bool.isRequired,
                bool3: DataTypes.bool
            }
        });

        new Test({
            data: {
                bool1: false,
                bool2: undefined,
                bool3: 1
            }
        });

        expect(console.error.calls.count()).toBe(2);

    });

    it('number', function () {

        expect(typeof DataTypes.number).toBe('function');
        expect(typeof DataTypes.number.isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                number1: DataTypes.number.isRequired,
                number2: DataTypes.number.isRequired,
                number3: DataTypes.number
            }
        });

        new Test({
            data: {
                number1: 1,
                number2: undefined,
                number3: 'string'
            }
        });

        expect(console.error.calls.count()).toBe(2);

    });

    it('func', function () {

        expect(typeof DataTypes.func).toBe('function');
        expect(typeof DataTypes.func.isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                func1: DataTypes.func.isRequired,
                func2: DataTypes.func.isRequired,
                func3: DataTypes.func
            }
        });

        new Test({
            data: {
                func1: function () {},
                func2: undefined,
                func3: 'string'
            }
        });

        expect(console.error.calls.count()).toBe(2);

    });

    it('string', function () {

        expect(typeof DataTypes.string).toBe('function');
        expect(typeof DataTypes.string.isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                string1: DataTypes.string.isRequired,
                string2: DataTypes.string.isRequired,
                string3: DataTypes.string
            }
        });

        new Test({
            data: {
                string1: 'string',
                string2: undefined,
                string3: 1
            }
        });

        expect(console.error.calls.count()).toBe(2);

    });

    it('shape', function () {

        expect(typeof DataTypes.shape).toBe('function');
        expect(typeof DataTypes.shape({}).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                shape1: DataTypes.shape({
                    x: DataTypes.number
                }).isRequired,
                shape2: DataTypes.shape({
                    x: DataTypes.number
                }).isRequired,
                shape3: DataTypes.shape({
                    x: DataTypes.number
                }),
                shape4: DataTypes.shape([]),
                shape5: DataTypes.shape({
                    x: DataTypes.number
                }),
                shape6: DataTypes.shape({
                    x: null
                })
            }
        });

        new Test({
            data: {
                // valid
                shape1: {x: 0, y: 0},
                // isRequired
                shape2: undefined,
                // 内部结构不合法
                shape3: {x: '1'},
                // shape 参数不合法
                shape4: {},
                // 数据项不是一个 object
                shape5: [],
                // shape 内部的数据项检测函数不是一个 function 会被跳过
                shape6: {x: 1}
            }
        });

        expect(console.error.calls.count()).toBe(4);

    });

    it('instanceOf', function () {

        expect(typeof DataTypes.instanceOf).toBe('function');
        expect(typeof DataTypes.instanceOf([]).isRequired).toBe('function');

        function TestClass() {
        }

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                instanceOf1: DataTypes.instanceOf(TestClass).isRequired,
                instanceOf2: DataTypes.instanceOf(TestClass).isRequired,
                instanceOf3: DataTypes.instanceOf(TestClass)
            }
        });

        new Test({
            data: {
                instanceOf1: new TestClass(),
                instanceOf2: undefined,
                instanceOf3: 1
            }
        });

        expect(console.error.calls.count()).toBe(2);

    });

    it('oneOf', function () {

        expect(typeof DataTypes.oneOf).toBe('function');
        expect(typeof DataTypes.oneOf([]).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                oneOf1: DataTypes.oneOf(['a', 'b', 'c']).isRequired,
                oneOf2: DataTypes.oneOf(['a', 'b', 'c']).isRequired,
                oneOf3: DataTypes.oneOf(['a', 'b', 'c']),
                oneOf4: DataTypes.oneOf('not an array')
            }
        });

        new Test({
            data: {
                // valid
                oneOf1: 'a',
                // isRequired
                oneOf2: undefined,
                // 不是 enum 指定的内容
                oneOf3: 'd',
                // oneOf 参数不对
                oneOf4: 'a'
            }
        });

        expect(console.error.calls.count()).toBe(3);

    });

    it('oneOfType', function () {

        expect(typeof DataTypes.oneOfType).toBe('function');
        expect(typeof DataTypes.oneOfType([]).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                oneOfType1: DataTypes.oneOfType([
                    DataTypes.string,
                    DataTypes.number
                ]).isRequired,
                oneOfType2: DataTypes.oneOfType([
                    DataTypes.string,
                    DataTypes.number
                ]).isRequired,
                oneOfType3: DataTypes.oneOfType([
                    DataTypes.string,
                    DataTypes.number
                ]),
                oneOfType4: DataTypes.oneOfType('not an array'),
                oneOfType5: DataTypes.oneOfType([
                    null,
                    undefined,
                    'not a function',
                    DataTypes.string
                ])
            }
        });

        new Test({
            data: {
                // valid
                oneOfType1: 1,
                // isRequired
                oneOfType2: undefined,
                // 不是指定的那几种类型
                oneOfType3: false,
                // oneOfType 的参数不合法
                oneOfType4: 1,
                // oneOfType 的 N 种类型中的若干个类型不是 checker，会被跳过
                oneOfType5: '1'
            }
        });

        new Test({
            data: {
                oneOfType1: '1'
            }
        });

        expect(console.error.calls.count()).toBe(3);

    });

    it('arrayOf', function () {

        expect(typeof DataTypes.arrayOf).toBe('function');
        expect(typeof DataTypes.arrayOf(DataTypes.any).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                arrayOf1: DataTypes.arrayOf(DataTypes.string).isRequired,
                arrayOf2: DataTypes.arrayOf(DataTypes.string).isRequired,
                arrayOf3: DataTypes.arrayOf(DataTypes.string),
                arrayOf4: DataTypes.arrayOf(DataTypes.string),
                arrayOf5: DataTypes.arrayOf('not a function')
            }
        });

        new Test({
            data: {
                // valid
                arrayOf1: ['a'],
                // required
                arrayOf2: undefined,
                // not an array
                arrayOf3: 'd',
                // not an array of specific item
                arrayOf4: ['1', 1],
                // arrayOf 的参数不合法
                arrayOf5: []
            }
        });

        expect(console.error.calls.count()).toBe(4);

    });

    it('objectOf', function () {

        expect(typeof DataTypes.objectOf).toBe('function');
        expect(typeof DataTypes.objectOf(DataTypes.string).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                objectOf1: DataTypes.objectOf(DataTypes.number).isRequired,
                objectOf2: DataTypes.objectOf(DataTypes.number).isRequired,
                objectOf3: DataTypes.objectOf(DataTypes.number),
                objectOf4: DataTypes.objectOf({}),
                objectOf5: DataTypes.objectOf(DataTypes.number)
            }
        });

        new Test({
            data: {
                // valid
                objectOf1: {
                    x: 1
                },
                // isRequired
                objectOf2: undefined,
                // 有些属性不符合要求
                objectOf3: {
                    x: 'string',
                    y: 1
                },
                // objectOf 参数不合法
                objectOf4: {},
                // 整个数据项不是 object
                objectOf5: 'not an object'
            }
        });

        expect(console.error.calls.count()).toBe(4);

    });

    it('exact', function () {

        expect(typeof DataTypes.exact).toBe('function');
        expect(typeof DataTypes.exact({}).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                exact1: DataTypes.exact({x: DataTypes.number}).isRequired,
                exact2: DataTypes.exact({x: DataTypes.number}).isRequired,
                exact3: DataTypes.exact({x: DataTypes.number}),
                exact4: DataTypes.exact({x: DataTypes.number}),
                exact5: DataTypes.exact({x: DataTypes.number}),
                exact6: DataTypes.exact(null),
                exact7: DataTypes.exact({x: DataTypes.number})
            }
        });

        new Test({
            data: {
                // 正确的
                exact1: {
                    x: 1
                },
                exact2: undefined,
                // 多了项
                exact3: {
                    x: 1,
                    y: 1
                },
                // 少了项
                exact4: {
                },
                // 内部不对,
                exact5: {
                    x: '1'
                },
                exact6: {},
                // 数据项不是一个 object
                exact7: 'not an object'
            }
        });

        expect(console.error.calls.count()).toBe(6);

    });


});
