/**
 * fix. убирам обработки клика по заголовку без чекбокса
 */

Ext.define('y.desktop.overrides.fix.grid.selection.Model', {
  override: 'Ext.grid.selection.Model',

  getSelMode(grid, items) {
    if (items.length === 0) {
      return 'MULTIPLE';
    }
    else if (grid.length !== items.length) {
      return 'ALL_EXCEPT';
    }
    else if (grid.length === items.length){
      return 'ALL';
    }
  },

  getSelectionIdsForAll(allGrid, checkedItems) {
    switch (this.getSelMode(allGrid, checkedItems)) {
      case 'MULTIPLE':
        return [];
      case 'ALL_EXCEPT':
        return Ext.Array.map(checkedItems, (record) => {
          return record.getId();
        });
      case 'ALL':
        return Ext.Array.map(allGrid, (record) => record.getId());
    }

    return [];
  },

  /**
   *
   */
});
