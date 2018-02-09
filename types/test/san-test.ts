import san, { SanComponentConfig, SanComponent } from "../";

interface ColorPickerData {
    data: string;
    datasource: string[];
}

interface ColorPicker extends SanComponent<ColorPickerData>{
    itemClick(color: string)
}

function ColorPicker(options) {
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
    mainClicker();
    clicker(name: string, email: string, event: Event);
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

const Test = san.defineComponent({
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
