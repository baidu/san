
var san = require('../../dist/san.ssr');

var Table = san.defineComponent({
    template: ''
        + '<table width="100%" cellpadding="0" cellspacing="0">'
        + '  <thead><tr>'
        + '    <th s-for="col in columns">{{col.label}}</th>'
        + '  </tr></thead>'
        + '  <tbody>'
        + '    <tr s-for="row in datasource">'
        + '      <td s-for="col in columns"><slot name="col-{{col.name}}" var-row="row" var-col="col">{{row[col.name]}}</slot></td>'
        + '    </tr>'
        + '  </tbody>'
        + '</table>'
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

