
Ext.define('y.desktop.overrides.fix.grid.column.Check', {
  override: 'Ext.grid.column.Check',

  setHeaderStatus(isChecked, e) {
    const checkHd = this;
    const sm = this.config.grid;
    const allGrid = sm.store.getRange();
    let checkedItems = [];
    allGrid.map(item => {if (typeof item.previousValues === 'object'){
      if(item.previousValues.indoor === undefined || item.previousValues.indoor === false){
        checkedItems.push(item);
      }}});
      if (
        allGrid.length !== checkedItems.length && checkedItems.length > 0
      ) {
        checkHd.addCls('x-grid-hd-checker-some');
        checkHd.removeCls('x-grid-hd-checker-on');
      }
      else if(allGrid.length !== checkedItems.length && checkedItems.length == 0) {
        checkHd.removeCls('x-grid-hd-checker-on');
        checkHd.removeCls('x-grid-hd-checker-some');
      }
      else if(allGrid.length === checkedItems.length){
        checkHd.addCls('x-grid-hd-checker-on');
        checkHd.removeCls('x-grid-hd-checker-some');
      }
  }

});
