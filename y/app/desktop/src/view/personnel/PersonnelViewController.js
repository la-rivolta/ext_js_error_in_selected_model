Ext.define('y.view.personnel.PersonnelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.personnelviewcontroller',

    init(){
        console.log('12345');
        console.log(this.getView().lookupReference('personnelview'));
    },

    onEditCancelled: function (editor, value, startValue, eOpts) {
        var self = this,
          data = self.dragData,
          view = self.view,
          selectionModel = this.getSelectionModel();
        console.log(selectionModel);
        var user = Ext._find(value.record.store.config.data.items, { name: value.record.data.name });
        Ext.Msg.confirm('Confirm', value.record.data.name + ': ' + user.phone + ' is phone number', 'onConfirm', this);
    }
});
