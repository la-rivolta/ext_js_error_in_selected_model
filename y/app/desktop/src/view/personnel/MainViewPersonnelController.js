Ext.define('y.view.personnel.MainViewPersonnelController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.mainviewpersonnelcontroller',

  getFilters() {
    const grid = this.getView().lookupReference('personnelview');
    const store = grid.getStore().getFilters();
    const filters = store.getRange();
    return this.encodeFilters(filters);
  },

  encodeFilters(filters) {
    const out = [];
    const { length } = filters;

    for (let i = 0; i < length; i++) {
      const filter = filters[i];
      let value = filter.getValue();

      if (Ext.isArray(value) && value.length === 1) {
        [value] = value;
      }

      if (filter.getDisabled() || (filter.getDisableOnEmpty() && Ext.isEmpty(value))) {
        continue;
      }

      const result = filter.serialize();
      delete result.disableOnEmpty;

      // TODO убрать оборачивание в массив после того как это требование отменит бэк
      if (!Ext.isArray(result.value)) {
        result.value = [result.value];
      }

      out.push(result);
    }

    return out;
  },

  async onCheckBuildBatchData(){
    const vm = this.getViewModel();
    const grid = this.getView().lookupReference('personnelview');

    const dataRequest = y.util.Batch.buildBatchData(grid, {
      search: vm.get('searchValue')
    });

    if (this.isBatch()) {
      await fetch('/fake_url_for_batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(dataRequest)
      });
    } else {
      await fetch('/fake_url_for_notBatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(dataRequest)
      });
    }

  },

  async onCheckGetBatchData(){
    const dataRequest = this.buildBatchData(); //этот фильтр будем передавать

    if (this.isBatch()) {
      await fetch('/fake_url_for_batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(dataRequest)
      });
    } else {
      await fetch('/fake_url_for_notBatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(dataRequest)
      });
    }

  },

  doSearch() {
    const view = this.getView();
    if (!view || !view.rendered) {
      return;
    }

    console.log(view);

    const vm = this.getViewModel();
    console.log(vm);

    vm.set('searchText', vm.get('searchValue'));
    //продолжить тут
  },

  getBatchInfo() {
    const grid = this.lookupReference('personnelview');
    return y.util.Batch.getBatchInfo(grid);
  },

  isBatch() {
    const grid = this.lookupReference('personnelview');
    const store = grid.getStore();
    return y.util.Batch.isBatchOperation(this.getBatchInfo(), store.getRange().length);
  },

  buildBatchData() {
    const view = this.lookupReference('personnelview');
    return y.util.Batch.getBatchData(view, this.getFilters());
  },
});
