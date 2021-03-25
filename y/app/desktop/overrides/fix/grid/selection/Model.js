/**
 * fix. убирам обработки клика по заголовку без чекбокса
 */

Ext.define('y.desktop.overrides.fix.grid.selection.Model', {
  override: 'Ext.grid.selection.Model',

  checkAllHold: false,

  onHeaderTap(headerCt, header, e) {
    //TODO доделать с чекбоксами и посмотреть насчет selModel
    if(header.el.hasCls('x-grid-hd-checker-on')){
      this.checkAllHold = true;
    }
  },

  getSelMode(grid, items) {
    if (grid.length !== items.length && !this.checkAllHold) {
      return 'MULTIPLE';
    }
    else if (grid.length !== items.length && this.checkAllHold) {
      return 'ALL_EXCEPT';
    }
    else if (grid.length === items.length && this.checkAllHold){
      return 'ALL';
    }
  },

  getSelectionIdsForAll(allGrid, checkedItems) {
    switch (this.getSelMode(allGrid, checkedItems)) {
      case 'MULTIPLE':
        console.log('MULTIPLE');
        return Ext.Array.map(checkedItems, (record) => record.getId());
      case 'ALL_EXCEPT':
        console.log('ALL_EXCEPT');
        return Ext.Array.filter(allGrid, (record) => {
          if(!Ext.Array.contains(checkedItems, record)){
            return record.getId();
          }
        }).map(item => {return item.id});
      case 'ALL':
        console.log('ALL');
        return Ext.Array.map(allGrid, (record) => record.getId());
    }

    return [];
  },



  /**
   *
   */
});
