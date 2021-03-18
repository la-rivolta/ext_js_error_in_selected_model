Ext.define('y.view.personnel.MainViewPersonnelController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.mainviewpersonnelcontroller',

  onCheck(){
    const vm = this.getViewModel();
    const grid = this.getView().lookupReference('personnelview');

    const data = y.util.Batch.buildBatchData(grid, {
      search: vm.get('searchValue')
    });

  }
});
