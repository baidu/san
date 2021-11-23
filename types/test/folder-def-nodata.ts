import san, {Component} from '../index'

class Head extends Component {
    static template = '<h3><slot/></h3>'
}

class Content extends san.Component {
    static template = '<p><slot/></p>'
}


const Folder = san.defineComponent({
    // AutoComplete: components
    components: {  
        'x-head': Head,
        'x-content': Content
    },

    // AutoComplete: template
    template: '<div>'
        + '<x-head on-click="native:toggle"><slot name="head">head</slot></x-head>'
        + '<x-content style="{{isShow ? \'\' : \'display:none\'}}"><slot>content</slot></x-content>'
        + '<p style="{{isShow ? \'\' : \'display:none\'}}"><slot name="foot">foot</slot></p>'
        + '</div>',

    toggle: function (this:Component) { // no this
        // AutoComplete: this.data.xxx
        this.data.set('isShow', !this.data.get('isShow'));
    }

});

export default Folder;

const ComponentWithSlot = san.defineComponent({
    // AutoComplete: components
    components: {  
        'x-folder': Folder
    },

    // AutoComplete: template
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
    // AutoComplete: data
    data: {  
        head: 'Hello',
        content: 'San',
        foot: 'Bye ER'
    }
});
// AutoComplete: attach
slotComponent.attach(document.body);  