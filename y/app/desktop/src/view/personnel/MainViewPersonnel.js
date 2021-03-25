Ext.define('y.view.personnel.MainViewPersonnel',{
  extend: 'Ext.Container',
  xtype: 'mainviewpersonnel',
  controller: 'mainviewpersonnelcontroller',

  requires: [
    'Ext.field.Text',
    'Ext.layout.Fit',
    'Ext.layout.HBox'
  ],

  viewModel: {
    data:{
      searchValue: null
    }
  },
  layout: 'fit',
  items: [
    {
      xtype: 'container',
      reference: 'headerview',
      docked: 'top',
      layout: {
        type: 'hbox',
        align: 'stretch'
      },
      margin: '10 10 10 10',
      items:[
        { xtype: 'textfield',
          fieldValue: 'Type text in this field',
          width: 350
          // handler: 'onCheckBuildBatchData'
        },
        { xtype: 'button',
          text: 'Click',
          handler: 'doSearch'
        },
      ]
    },
    { xtype: 'personnelview',
    },
    {
      xtype: 'container',
      reference: 'footerview',
      docked: 'bottom',
      items:[
        { xtype: 'button',
          text: 'Send request with buildBatchData',
          handler: 'onCheckBuildBatchData'
        },
        { xtype: 'button',
          text: 'Send request with getBatchData',
          handler: 'onCheckGetBatchData'
        },
      ]
    }
  ]
});
