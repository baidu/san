import san, { SanComponentConfig, SanComponent } from "san";

interface ColorPickerData {
    data: string;
    datasource: string[];
}

interface ColorPicker extends SanComponent<ColorPickerData>{
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
