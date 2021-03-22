Ext.define('y.view.personnel.PersonnelView',{
  extend: 'Ext.grid.Grid',
  xtype: 'personnelview',

  requires: [
    'Ext.grid.column.Check'
  ],

  reference: 'personnelview',


  cls: 'personnelview',
  controller: {type: 'personnelviewcontroller'},
  viewModel: {type: 'personnelviewmodel'},
  store: {type: 'personnelshared'},
  grouped: true,
  plugins: {
    rowedit: {
      autoConfirm: false
    }
  },
  columns: [
    {
      text: 'Name',
      dataIndex: 'name',
      editable: true,
      width: 100,
      cell: {userCls: 'bold'}
    },
    {text: 'Email',dataIndex: 'email',editable: true, width: 230},
    {
      text: 'Phone',
      dataIndex: 'phone',
      editable: true,
      width: 150
    },
    {
      text: 'Indoor?',
      itemId: 'indoor',
      xtype: 'checkcolumn',
      headerCheckbox: true,
      dataIndex: 'indoor',
      listeners: {
        beforecheckchange: function(){
          this.setHeaderStatus();
        }
      }
    }
  ],
  listeners: {
    canceledit: 'onEditCancelled'
  }
});
