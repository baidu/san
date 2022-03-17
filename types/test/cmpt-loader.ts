import san from '../index'
import InputComponent from './input-def-noopt'
import LabelComponent from './label-ext-static-nodata'

// AutoComplete: san.defineComponent
export default san.defineComponent({
    // AutoComplete: components
    components: {
        // AutoComplete: san.createComponentLoader
        'x-input': san.createComponentLoader({
            
            // AutoComplete: load
            load: function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(InputComponent);
                    }, 1000);
                });
            },

            
            // AutoComplete: placeholder
            placeholder: LabelComponent,

            // AutoComplete: fallback
            fallback: LabelComponent
        })
    },

    template: '<div><x-input value="{{name}}"/></div>'
});
