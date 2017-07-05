/**
 * @file data types specs
 * @author leon <ludafa@outlook.com>
 */

/* globals san */
/* eslint-disable no-console */

var DataTypes = san.DataTypes;

describe('DataTypes', function () {

    it('should be a object', function () {
        expect(typeof DataTypes === 'object').toBe(true);
    });

    it('all the values of property in `dataTypes` should be a function', function () {

        expect(function () {

            var Test = san.defineComponent({
                template: '<div>{{name}}</div>',
                dataTypes: {
                    thisDataTypesWillTriggerError: 'not a function'
                }
            });

            new Test();

        }).toThrow();

    });

    it('custom checker', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                name: function (data, dataName, componentName) {
                    if (data[dataName] === 'hello') {
                        throw new Error('no `hello` allowed');
                    }
                }
            }
        });

        expect(function () {
            new Test({
                data: {
                    name: 'hello'
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    name: 1
                }
            });
        }).not.toThrow();

    });

    it('array', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                array1: DataTypes.array,
                array2: DataTypes.array.isRequired
            }
        });

        expect(typeof DataTypes.array).toBe('function');
        expect(typeof DataTypes.array.isRequired).toBe('function');

        expect(function () {
            new Test({
                data: {}
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    array1: 12321,
                    array2: []
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    array1: [1, 2, 3],
                    array2: [1, 2, 3]
                }
            });
        }).not.toThrow();

    });

    it('object', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                object1: DataTypes.object,
                object2: DataTypes.object.isRequired
            }
        });

        expect(typeof DataTypes.object).toBe('function');
        expect(typeof DataTypes.object.isRequired).toBe('function');

        expect(function () {
            new Test({
                data: {}
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    object1: [1, 2, 3],
                    object2: {}
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    object1: {object: true},
                    object2: {object: false}
                }
            });
        }).not.toThrow();

    });

    it('bool', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                bool1: DataTypes.bool,
                bool2: DataTypes.bool.isRequired
            }
        });

        expect(typeof DataTypes.bool).toBe('function');
        expect(typeof DataTypes.bool.isRequired).toBe('function');

        expect(function () {
            new Test({
                data: {}
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    bool1: 'not a bool',
                    bool2: true
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    bool1: true,
                    bool2: false
                }
            });
        }).not.toThrow();

    });

    it('number', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                number1: DataTypes.number,
                number2: DataTypes.number.isRequired
            }
        });

        expect(typeof DataTypes.number).toBe('function');
        expect(typeof DataTypes.number.isRequired).toBe('function');

        expect(function () {
            new Test({
                data: {}
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    number1: 'not a number',
                    number2: 1
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    number1: 1,
                    number2: 2
                }
            });
        }).not.toThrow();

    });

    it('func', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                func1: DataTypes.func,
                func2: DataTypes.func.isRequired
            }
        });

        expect(typeof DataTypes.func).toBe('function');
        expect(typeof DataTypes.func.isRequired).toBe('function');

        expect(function () {
            new Test({
                data: {}
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    func1: 'not a func',
                    func2: function () {}
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    func1: function () {},
                    func2: function () {}
                }
            });
        }).not.toThrow();

    });

    it('string', function () {

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                string1: DataTypes.string,
                string2: DataTypes.string.isRequired
            }
        });

        expect(typeof DataTypes.string).toBe('function');
        expect(typeof DataTypes.string.isRequired).toBe('function');

        expect(function () {
            new Test({
                data: {
                    string2: undefined
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    string1: {name: 'not a string'},
                    string2: 'a string'
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    string1: 'astring',
                    string2: 'an another string'
                }
            });
        }).not.toThrow();

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
                }),
                shape2: DataTypes.shape({
                    x: DataTypes.number
                }).isRequired,
                shape3: DataTypes.shape({
                    x: DataTypes.number
                })
            }
        });

        expect(function () {
            new Test({
                data: {
                    shape2: {
                        x: 1
                    }
                }
            });
        }).not.toThrow();


        // isRequired
        expect(function () {

            new Test({
                data: {
                }
            });

        }).toThrow();

        // 内部结构不合法
        expect(function () {
            new Test({
                data: {
                    shape2: {
                        x: 1
                    },
                    shape3: {
                        x: 'not a number'
                    }
                }
            });
        }).toThrow();

        // 数据项不是一个 object
        expect(function () {
            new Test({
                data: {
                    shape1: []
                }
            });
        }).toThrow();

        // shape 参数不合法
        expect(function () {

            var Test = san.defineComponent({
                template: '<div>{name}</div>',
                displayName: 'Test',
                dataTypes: {
                    shape: DataTypes.shape('not an object')
                }
            });

            new Test({
                data: {
                    // 这里不管你传啥 shape，一定会报错的
                    shape: {}
                }
            });

        }).toThrow();

        // shape 内部的数据项检测函数不是一个 function 会被跳过
        expect(function () {

            var Test = san.defineComponent({
                template: '<div>{name}</div>',
                displayName: 'Test',
                dataTypes: {
                    shape: DataTypes.shape({
                        x: null
                    })
                }
            });

            new Test({
                data: {
                    shape: {
                        x: 'nothing will happen'
                    }
                }
            });

        }).not.toThrow();

    });

    it('instanceOf', function () {

        expect(typeof DataTypes.instanceOf).toBe('function');
        expect(typeof DataTypes.instanceOf([]).isRequired).toBe('function');

        /* eslint-disable */
        function TestClass() {
        }
        function TestClass2() {
        }
        /* eslint-enable */

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                instanceOf1: DataTypes.instanceOf(TestClass).isRequired,
                instanceOf2: DataTypes.instanceOf(TestClass)
            }
        });

        expect(function () {
            new Test({
                data: {
                    instanceOf1: new TestClass()
                }
            });
        }).not.toThrow();

        expect(function () {
            new Test({
                data: {
                    instanceOf1: null
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    instanceOf1: new TestClass(),
                    instanceOf2: new TestClass2()
                }
            });
        }).toThrow();

    });

    it('oneOf', function () {

        expect(typeof DataTypes.oneOf).toBe('function');
        expect(typeof DataTypes.oneOf([]).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                oneOf1: DataTypes.oneOf(['a', 'b', 'c']).isRequired,
                oneOf2: DataTypes.oneOf(['a', 'b', 'c']),
                oneOf3: DataTypes.oneOf('not an array')
            }
        });

        expect(function () {
            new Test({
                data: {
                    oneOf1: 'a'
                }
            });
        }).not.toThrow();

        expect(function () {
            new Test({
                data: {
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    oneOf1: 'a',
                    oneOf2: 'd'
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    oneOf1: 'a',
                    oneOf3: 'a'
                }
            });
        }).toThrow();

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
                ]),
                oneOfType3: DataTypes.oneOfType('not an array'),
                oneOfType4: DataTypes.oneOfType([
                    null,
                    undefined,
                    'not a function',
                    DataTypes.string
                ])
            }
        });

        expect(function () {
            new Test({
                data: {
                    oneOfType1: 'a'
                }
            });
        }).not.toThrow();

        expect(function () {
            new Test({
                data: {
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    oneOfType1: 'a',
                    oneOfType2: function () {}
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    oneOfType1: 'a',
                    oneOfType3: 'a'
                }
            });
        }).toThrow();

        expect(function () {
            new Test({
                data: {
                    oneOfType1: 'a',
                    oneOfType4: 'a'
                }
            });
        }).not.toThrow();


    });

    it('arrayOf', function () {

        expect(typeof DataTypes.arrayOf).toBe('function');
        expect(typeof DataTypes.arrayOf(DataTypes.any).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                arrayOf1: DataTypes.arrayOf(DataTypes.string).isRequired,
                arrayOf2: DataTypes.arrayOf('not a function')
            }
        });

        expect(function () {
            new Test({
                data: {
                    arrayOf1: ['a']
                }
            });
        }).not.toThrow();

        // required
        expect(function () {
            new Test({
                data: {
                }
            });
        }).toThrow();

        // not an array
        expect(function () {
            new Test({
                data: {
                    arrayOf1: 'not an array'
                }
            });
        }).toThrow();

        // not every item in the array is specific type
        expect(function () {
            new Test({
                data: {
                    arrayOf1: ['a', 2]
                }
            });
        }).toThrow();

        // arrayOf 的参数不合法
        expect(function () {
            new Test({
                data: {
                    arrayOf1: ['a'],
                    arrayOf2: 'a'
                }
            });
        }).toThrow();

    });

    it('objectOf', function () {

        expect(typeof DataTypes.objectOf).toBe('function');
        expect(typeof DataTypes.objectOf(DataTypes.string).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                objectOf1: DataTypes.objectOf(DataTypes.number).isRequired,
                objectOf2: DataTypes.objectOf({})
            }
        });

        // valid
        expect(function () {
            new Test({
                data: {
                    objectOf1: {age: 1, count: 2}
                }
            });
        }).not.toThrow();

        // required
        expect(function () {
            new Test({
                data: {
                }
            });
        }).toThrow();

        // 指定属性不是一个 object
        expect(function () {
            new Test({
                data: {
                    objectOf1: 'not an object'
                }
            });
        }).toThrow();

        // 指定属性对象中的任意一个属性不符合类型要求
        expect(function () {
            new Test({
                data: {
                    objectOf1: {age: 1, count: '2'}
                }
            });
        }).toThrow();

        // objectOf 参数不合法
        expect(function () {
            new Test({
                data: {
                    objectOf1: {age: 1, count: 2},
                    objectOf2: {age: 1, count: 2}
                }
            });
        }).toThrow();

    });

    it('exact', function () {

        expect(typeof DataTypes.exact).toBe('function');
        expect(typeof DataTypes.exact({}).isRequired).toBe('function');

        var Test = san.defineComponent({
            template: '<div>{name}</div>',
            displayName: 'Test',
            dataTypes: {
                exact1: DataTypes.exact({x: DataTypes.number}).isRequired,
                exact2: DataTypes.exact(null)
            }
        });

        // valid
        expect(function () {
            new Test({
                data: {
                    exact1: {x: 1}
                }
            });
        }).not.toThrow();

        // required
        expect(function () {
            new Test({
                data: {
                }
            });
        }).toThrow();

        // 指定属性不是一个 object
        expect(function () {
            new Test({
                data: {
                    exact1: 'not an object'
                }
            });
        }).toThrow();

        // 多了属性
        expect(function () {
            new Test({
                data: {
                    exact1: {
                        x: 1,
                        y: 2
                    }
                }
            });
        }).toThrow();

        // 少了属性
        expect(function () {
            new Test({
                data: {
                    exact1: {
                    }
                }
            });
        }).toThrow();

        // 指定属性对象中的任意一个属性不符合类型要求
        expect(function () {
            new Test({
                data: {
                    exact1: {x: 'not a number'}
                }
            });
        }).toThrow();

        // exact 参数不合法
        expect(function () {
            new Test({
                data: {
                    exact1: {x: 1},
                    exact2: {x: 1}
                }
            });
        }).toThrow();

    });

    it('will trigger a validation while data change', function () {

        var Avatar = san.defineComponent({
            template: '<div>{{name}}</div>',
            dataTypes: {
                name: DataTypes.string
            }
        });

        var main;

        expect(function () {

            main = new Avatar({
                data: {
                    name: 'a string'
                }
            });

        }).not.toThrow();

        expect(function () {
            main.data.set('name', false);
        }).toThrow();

    });

    it('will check after data binding', function () {

        var MyButton = san.defineComponent({
            template: '<button>hello, {{text}}</button>',
            dataTypes: {
                text: DataTypes.string.isRequired
            }
        });

        var Avatar = san.defineComponent({
            template: ''
                + '<div>'
                +     '<my-button text="{{name}}" />'
                + '</div>',
            components: {
                'my-button': MyButton
            }
        });

        var avatar;

        expect(function () {

            avatar = new Avatar({
                data: {
                    name: 'world'
                }
            });

            avatar.attach(document.body);

            avatar.dispose();

        }).not.toThrow();

        expect(function () {
            new Avatar({
                data: {
                }
            }).attach(document.body);
        }).toThrow();

    });


});
