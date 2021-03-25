Ext.define('y.util.Batch', {

  singleton: true,

  BATCH_LIMIT: 2,


  getThisModel(grid){
    const allGrid = grid.store.getRange();
    let checkedItems = [];
    allGrid.map(item => {if (typeof item.previousValues === 'object'){
      if(item.previousValues.indoor === undefined || item.previousValues.indoor === false){
        checkedItems.push(item);
      }}});
    return checkedItems;
  },

  // old contract, DO NOT USE IT IN NEW PAGES
  buildBatchData(grid, filters) {
    //формирует батчевые данные для отправки на сервер
    if (Ext.isArray(grid)) {
      debugger;
      return {
        selectionMode: 'MULTIPLE',
        ids: grid,
        filter: filters || {}
      };
    }

    const allGrid = grid.store.getRange();
    let checkedItems = this.getThisModel(grid);
    //здесь добираюсь до отмеченных элементов, через grid.getSelectable().getSelectedRecords() не получается

    const p = {};
    p.selectionMode = grid.getSelectable().getSelMode(allGrid, checkedItems);
    p.ids = grid.getSelectable().getSelectionIdsForAll(allGrid, checkedItems);
    p.filter = filters || {}

    console.log(p);

    return p;

  },

  getBatchData(grid, filters) {
    filters = filters || [];
    if (Ext.isArray(grid)) {
      filters.push({
        property: 'id',
        value: grid,
        operator: 'in'
      });

      return {
        filter: filters
      };
    }

    const allGrid = grid.store.getRange();
    let checkedItems = this.getThisModel(grid);
    //здесь добираюсь до отмеченных элементов, через grid.getSelectable().getSelectedRecords() не получается

    const selectionMode = grid.getSelectable().getSelMode(allGrid, checkedItems);

    if (selectionMode !== 'ALL') {
      filters.push({
        property: grid.getStore().getModel().prototype.idProperty,
        value: grid.getSelectable().getSelectionIdsForAll(allGrid, checkedItems),
        operator: selectionMode === 'MULTIPLE' ? 'in' : 'notin'
      });
    }

    console.log(filters);

    if (filters.length === 0) {
      return {};
    }

    return {
      filter: filters
    };
  },

  getAmount(data, totalCount) {
    if (data.selectionMode === 'MULTIPLE') {
      return data.ids.length;
    }

    totalCount = totalCount || 0;
    if (data.selectionMode === 'ALL') {
      return totalCount;
    }

    if (data.selectionMode === 'ALL_EXCEPT') {
      return Math.max(totalCount - data.ids.length, 0);
    }

    return 0;
  },

  isBatchOperation(data, totalCount, limit) {
    if (totalCount === false) {
      totalCount = 9007199254740991; // Number.MAX_SAFE_INTEGER
    }

    limit = limit || this.BATCH_LIMIT;
    return (
      (data.selectionMode === 'MULTIPLE' && data.ids.length >= limit) ||
      (data.selectionMode === 'ALL' && totalCount >= limit) ||
      (data.selectionMode === 'ALL_EXCEPT' && totalCount - data.ids.length >= limit)
    );
  },

  getBatchInfo(grid) {
    const allGrid = grid.store.getRange();
    let checkedItems = this.getThisModel(grid);

    return {
      selectionMode: grid.getSelectable().getSelMode(allGrid, checkedItems),
      ids: grid.getSelectable().getSelectionIdsForAll(allGrid, checkedItems)
    };
  },
  // showProgresssWindow(config) {
  //   let destroyCallback = Ext.emptyFn;
  //   if (config.reloadOnComplete || config.clearSelection || config.callback) {
  //     destroyCallback = function () {
  //       if (config.reloadOnComplete) {
  //         if (config.grid && !config.clearSelection) {
  //           config.grid.getSelectionModel().snapshot();
  //         }
  //
  //         config.reloadOnComplete.removeAll();
  //         config.reloadOnComplete.load();
  //       }
  //
  //       if (config.clearSelection) {
  //         config.clearSelection.getSelectionModel().deselectAll();
  //       }
  //
  //       if (config.callback) {
  //         Ext.callback(config.callback);
  //       }
  //     };
  //   }

    // return Ext.create('INRIGHTS.ux.window.ProgressWindow', {
    //   title: config.title,
    //   eventId: config.id,
    //   viewModel: {
    //     data: {
    //       count: config.total || 0,
    //       processing: config.processingLabel
    //     }
    //   },
    //   listeners: {
    //     destroy: destroyCallback
    //   }
    // });
  //}
});
