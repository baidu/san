import * as san from "san";

interface ColorPickerData {
    data: string;
    datasource: string[];
}

interface ColorPicker extends san.SanComponent<ColorPickerData> {
    itemClick(color: string): void;
}

function ColorPicker(this: ColorPicker, options: { data: ColorPickerData }) {
    san.Component.call(this, options);
}
san.inherits(ColorPicker, san.Component);

ColorPicker.prototype.template = ''
    + '<ul class="ui-colorpicker">'
    + '<li '
    + 'san-for="item in datasource" '
    + 'style="cursor:pointer; background: {{item}};{{item == value ? \'border:2px solid #ccc;\' : \'\'}}" '
    + 'on-click="itemClick(item)"'
    + '>click</li>'
    + '</ul>';

ColorPicker.prototype.initData = function () {
    return {
        datasource: [
            'red', 'blue', 'yellow', 'green'
        ]
    }
};

ColorPicker.prototype.itemClick = function (this: ColorPicker, item: string) {
    this.data.set('value', item);
};

ColorPicker.prototype.attached = function (this: ColorPicker) {
    const me = this;
    let nextValue: string;
    const value = this.data.get('value') as string;
    const datasource = this.data.get('datasource') as string[];
    for (let i = 0; i < 4; i++) {
        nextValue = datasource[i];
        if (nextValue !== value) {
            break;
        }
    }

    setTimeout(function () { me.itemClick(nextValue) }, 20);
};

interface ClickerData {
    name: string;
    email: string;
}
interface ClickerMethods {
    mainClicker(): void;
    clicker(name: string, email: string, event: Event): void;
}

let clicked = 0;
const MyComponent = san.defineComponent<ClickerData, ClickerMethods>({
    template: '<a on-click="mainClicker"><span title="{{name}}" on-click="clicker(name, email, $event)" style="color: red; cursor: pointer">{{name}}, please click here!</span></a>',

    mainClicker: function () {
        clicked++;
    },

    clicker: function (name, email, event) {
        clicked++;
    }
});

const myComponent = new MyComponent();
myComponent.data.set('name', 'errorrik');
myComponent.data.set('email', 'errorrik@gmail.com');

const wrap = document.createElement('div');
document.body.appendChild(wrap);
myComponent.attach(wrap);
myComponent.dispose();

interface TestData {
    name: string,
    otherProp: number,
}

const Test = san.defineComponent<TestData, {}>({
    template: '<div>{name}</div>',
    displayName: 'Test',
    dataTypes: {
        name(data, dataName, componentName) {
            if (data[dataName] === 'hello') {
                throw new Error('no `hello` allowed');
            }
        },
        otherProp(data, dataName, componentName) {

        }
    }
});

let app = new Test({
    data: {
        name: 'San'
    }
});

// slot.spec
const Head = san.defineComponent({
    template: '<h3><slot/></h3>'
});

const Content = san.defineComponent({
    template: '<p><slot/></p>'
});

const Folder = san.defineComponent({
    components: {
        'x-head': Head,
        'x-content': Content
    },

    template:
        '<div>'
        + '<x-head on-click="native:toggle"><slot name="head">head</slot></x-head>'
        + '<x-content style="{{isShow ? \'\' : \'display:none\'}}"><slot>content</slot></x-content>'
        + '<p style="{{isShow ? \'\' : \'display:none\'}}"><slot name="foot">foot</slot></p>'
        + '</div>',

    toggle: function () {
        this.data.set('isShow', !this.data.get('isShow'));
    }

});


const ComponentWithSlot = san.defineComponent({
    components: {
        'x-folder': Folder
    },
    template:
        '<div>'
        + '<x-folder isShow="true" s-ref="folder">'
        + '<b slot="head">{{head}}</b>'
        + '<strong slot="foot">{{foot}}</strong>'
        + '<u>{{content}}</u>'
        + '</x-folder>'
        + '</div>'

});


const slotComponent = new ComponentWithSlot({
    data: {
        head: 'Hello',
        content: 'San',
        foot: 'Bye ER'
    }
});

slotComponent.attach(wrap);

// datatypes

san.defineComponent({
    template: '<div>{name}</div>',
    displayName: 'Test',
    dataTypes: {
        arrayOf1: san.DataTypes.arrayOf(san.DataTypes.number).isRequired,
        arrayOf2: san.DataTypes.arrayOf(san.DataTypes.number),

        instanceOf1: san.DataTypes.instanceOf(ComponentWithSlot).isRequired,
        instanceOf2: san.DataTypes.instanceOf(ComponentWithSlot),

        shape1: san.DataTypes.shape({ a: san.DataTypes.number }).isRequired,
        shape2: san.DataTypes.shape({ a: san.DataTypes.number }),

        oneOf1: san.DataTypes.oneOf([1, 2, 3]).isRequired,
        oneOf2: san.DataTypes.oneOf([1, 2, 3]),

        oneOfType1: san.DataTypes.oneOfType([san.DataTypes.number]).isRequired,
        oneOfType2: san.DataTypes.oneOfType([san.DataTypes.number]),

        objectOf1: san.DataTypes.objectOf(san.DataTypes.number).isRequired,
        objectOf2: san.DataTypes.objectOf(san.DataTypes.number),

        exact1: san.DataTypes.exact({ x: san.DataTypes.number }).isRequired,
        exact2: san.DataTypes.exact({ x: san.DataTypes.number })
    }
});
