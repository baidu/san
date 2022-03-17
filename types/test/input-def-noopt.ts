import san from "../index";

interface InputData {
    value: string
}

const Input = san.defineComponent<InputData>({
    // AutoComplete: template
    template: '<input type="text" value="{{value}}"/>',

    attached() {
        let value = this.data.get('value');
    }
});

const input = new Input({
    // AutoComplete: data
    data: {
        // AutoComplete: value
        value: '22'
    }
})

export default Input