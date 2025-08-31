import san, {defineComponent} from "../index";



interface ClickerData {
    name: string;
    email: string;
    dep: {
        name: string;
        info: {
            du: boolean
        }
        age: number
    }
}

interface ClickerOptions {
    click(name: string, email: string): void;
    mainClick(): void;
}

let clicked = 0;
const Clicker = san.defineComponent<ClickerData, ClickerOptions>({
    
    // AutoComplete: template
    template: `
        <a on-click="mainClicker" title="{{name}}" style="color: red; cursor: pointer">
            <span on-click="clicker(name, email, $event)">{{name}}, please click here!</span>
        </a>`,

    // AutoComplete: mainClick   
    mainClick: function () {
        // AutoComplete: this.data 
        this.data

        // AutoComplete: this.d.dep.age
        this.d.dep.age
        clicked++;
    },

    // AutoComplete: click   
    click: function (name, email) {
        // AutoComplete: this.data 
        this.data
        clicked++;
    },

    // AutoComplete: initData 
    initData() {
        return {
            // AutoComplete: name 
            name: 'aa',
            email: 'dd'
        };
    },

    // AutoComplete: attached 
    attached() {
        // AutoComplete: this.data 
        this.data
    }
});

export default Clicker;

const clicker = new Clicker();
let name = clicker.data.get('dep.info.du'); // boolean
clicker.data.set('name', '22'); // Type Check
clicker.data.set('b', 50); // Type Check
clicker.data.set('email', 'errorrik@gmail.com');  // Type Check

let name2 = clicker.d.dep.info.du; // boolean

clicker.d.name = '22'; // Type Check
clicker.d.email = 'errorrik@gmail.com'; // Type Check

clicker.attach(document.body);
clicker.dispose();
