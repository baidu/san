
var san = require('../../../dist/san.ssr');

var Table = san.defineComponent({
    template: ''
        + '<div>'
        + '    <h3 s-for="col in columns">{{col.label}}</h3>'
        + '    <ul s-for="row in datasource">'
        + '      <li s-for="col in columns"><slot name="col-{{col.name}}" var-row="row" var-col="col">{{row[col.name]}}</slot></li>'
        + '    </ul>'
        + '</div>'
  });

var MyComponent = san.defineComponent({
    components: {
        'x-table': Table
    },
    template:
        '<div>'
            + '<x-table columns="{{dep.columns}}" datasource="{{dep.members}}" s-for="dep in deps">'
                + '<b slot="col-{{dep.strong}}">{{row[col.name]}}</b>'
            + '</x-table>'
        + '</div>'

});

exports = module.exports = MyComponent;

