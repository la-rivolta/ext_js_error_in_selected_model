Ext.define('y.view.personnel.MainViewPersonnel',{
  extend: 'Ext.Container',
  xtype: 'mainviewpersonnel',
  controller: 'mainviewpersonnelcontroller',

  requires: [
    'Ext.layout.Fit'
  ],
  layout: 'fit',
  items: [
    { xtype: 'personnelview',
    },
    { xtype: 'button',
      reference: 'footerview',
      docked: 'bottom',
      text: 'Проверить',
      handler: 'onCheck'
    },
  ]
});
