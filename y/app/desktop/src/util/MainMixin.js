// /**
//  *
//  */
//
// Ext.define('y.util.MainMixin', {
//
//   mixinConfig: {
//     before: {
//       init: 'beforeInit'
//     }
//   },
//
//   /**
//    * Контейнер куда вставляются дочерние панели
//    */
//   getAppViewContainer() {
//     return this.lookupReference('appView');
//   },
//
//   /**
//    *
//    */
//   beforeInit() {
//     const me = this;
//
//     me.taskTokens = [];
//
//     // перед тем как пойдет обработка onStateChange в route.Router и дальнейшие колбэки
//     // onBeforeNavigate и onNavigate тут очистим taskTokens
//     Ext.util.History.on({
//       change: {
//         fn() {
//           me.taskTokens = [];
//         },
//         order: 'before'
//       }
//     });
//
//     // сделаем updateViewByTokens с оттяжкой что бы дождаться всех token
//     me.task = new Ext.util.DelayedTask(() => {
//       me.updateViewByTokens(me.taskTokens);
//
//       me.lastTaskTokens = me.taskTokens;
//       me.taskTokens = [];
//     }, this);
//   },
//
//   showErrorStatus(errorStatus) {
//     const app = INRIGHTS.getApplication();
//     const appViewContainer = app.viewport.getController().getAppViewContainer();
//
//     appViewContainer.removeAll();
//     appViewContainer.add({
//       xtype: 'view_ux_errors_viewerror',
//       response: {
//         status: errorStatus,
//         request: {
//           url: decodeURI(window.location.href)
//         }
//       },
//       isTab: false
//     });
//
//     appViewContainer.up().updateLayout(true);
//   },
//
//   /**
//    *
//    */
//   onBeforeNavigate() {
//     if (arguments.length > 0) {
//       const { length } = arguments;
//       const action = arguments[length - 1];
//
//       // продолжаем только если url разрешен
//       if (INRIGHTS.util.routing.UrlRightsManager.hasAccessToUrl(window.location.hash)) {
//         action.resume();
//       } else if (INRIGHTS.util.routing.UrlRightsManager.validateUrl(window.location.hash) === false) {
//         this.showErrorStatus(404);
//         action.stop();
//       } else {
//         this.showErrorStatus(403);
//         action.stop();
//       }
//     }
//   },
//
//   /**
//    *
//    */
//   onNavigate() {
//     if (arguments.length > 0 && arguments[0] !== 'pages') {
//       // сделаем с задержкой
//       this.taskTokens.push(
//         this.makeTokenObject({
//           section: arguments[0],
//           // ,	xtype	: arguments[1]
//           params: arguments[1]
//         })
//       );
//
//       this.task.delay(1);
//     }
//   },
//
//   /**
//    * Специальный обработчик для старого интерфейса
//    */
//   onPagesNavigate() {
//     //	if ( arguments.length > 0 ){
//     // сделаем с задержкой
//     this.taskTokens.push(
//       this.makeTokenObject({
//         section: 'pages',
//         xtype: null,
//         params: !Ext.isDefined(arguments[0]) || arguments[0] == 'pages' ? null : arguments[0]
//       })
//     );
//
//     this.task.delay(1);
//     //	}
//   },
//
//   /**
//    * Сделаем tokenObject по строке
//    *
//    * @param token
//    */
//   makeTokenObject(token) {
//     if (Ext.isString(token)) {
//       const split = token.split('/');
//       const section = split[0].replace(/^!/, '');
//       // xtype = split[1].replace(/\./gi, '_');
//       token = {
//         section,
//         xtype: section == 'pages' ? null /* 'pages' */ : xtype,
//         params: split[2]
//       };
//     }
//
//     if (!token.section || this.isBadSection(token.section)) {
//       token.section = INRIGHTS.app.getApplication().getDefaultToken().replace(/^!/, '');
//     }
//
//     if (!(token.xtype = this.decodeXtype(token.section, token.xtype))) {
//       token.xtype = this.getDefaultXtypeBySection(token.section);
//     }
//
//     token.params = this.decodeParams(token.params);
//
//     return token;
//   },
//
//   /**
//    * Проверим section на корректность - должна быть описана в getDefaultXtypeBySection
//    *
//    * @param section
//    */
//   isBadSection(section) {
//     return !this.getDefaultXtypeBySection(section);
//   },
//
//   /**
//    * Найдем xtype реального компонента по xtype
//    *
//    * @param section
//    * @param view
//    */
//   decodeXtype(section, view) {
//     const xtype = section + (view ? `_${view}` : '');
//
//     return Ext.ClassManager.getByAlias(`widget.${xtype}`) ? xtype : null;
//   },
//
//   /**
//    * Отдать view по section
//    *
//    * @param section
//    */
//   getDefaultXtypeBySection(section) {
//     const cls = INRIGHTS.util.routing.UrlRightsManager.getClassByHash(section);
//     let alias = (cls && cls.prototype.alias) || '';
//
//     if (Ext.isArray(alias)) {
//       alias = alias[0];
//     }
//
//     return alias.replace('widget.', '');
//   },
//
//   /**
//    * Хендлер на изменение состояния компонента
//    */
//   onUpdateState() {
//     // пройдем по всем компонентам и сформируем актуальные token (сначала есть ли есть то по окнам)
//     this.redirectTo(
//       Ext.Array.map(
//         this.getViewContainerChilds(),
//         function (item) {
//           return this.makeTokenByComp(item);
//         },
//         this
//       ).join(Ext.route.Router.getMultipleToken())
//     );
//   },
//
//   /**
//    * Сделать токен по компоненту
//    *
//    * @param item
//    */
//   makeTokenByComp(item) {
//     const activeState =
//       item.getController() &&
//       item.getController().getEncodedActiveState &&
//       item.getController().getEncodedActiveState();
//
//     return this.makeTokenByXtype(item.xtype, activeState);
//   },
//
//   /**
//    * По пришедшему массиву объектов token проапдейтим или добавим
//    *
//    * @param tokenArray
//    */
//   updateViewByTokens(tokenArray) {
//     const appViewContainer = this.getAppViewContainer();
//     let removeOldItems = true;
//
//     Ext.suspendLayouts();
//     Ext.Array.each(
//       tokenArray,
//       function (tokenObject, index) {
//         const comp = this.getViewContainerChilds()[index];
//         const tokenObjectParams = tokenObject.params; /* || {} */
//         const viewModelData = {
//           activeState: tokenObjectParams
//         };
//
//         if (comp && comp.xtype == tokenObject.xtype) {
//           /* просто обновим состояние, если пришедший activeState отличается от внутреннего */
//           if (!Ext.Object.isEqual(comp.getViewModel().get('activeState'), tokenObjectParams)) {
//             comp.getViewModel().set(viewModelData);
//           }
//         } else {
//           // добавим новый компонент
//           const cmp = appViewContainer.insert(index, {
//             xtype: tokenObject.xtype,
//             viewModel: {
//               data: viewModelData
//             },
//             anchor: (function () {
//               const cls = Ext.ClassManager.getByAlias(`widget.${tokenObject.xtype}`);
//
//               return (cls && cls.prototype.mainAnchor) || '100% 100%';
//             })()
//           });
//
//           // если добавили окно
//           if (cmp.floating) {
//             // если floatingItems больше одного то удалим предыдущие из appViewContainer и History
//             // todo - мб while сделать
//             if (appViewContainer.floatingItems.getCount() > 1) {
//               const floatingItem = appViewContainer.floatingItems.getAt(0);
//               const historyRecord = Ext.getStore('History').getById(floatingItem.xtype);
//
//               if (historyRecord) {
//                 historyRecord.drop();
//               }
//
//               floatingItem.destroy();
//             }
//
//             cmp.ownerCt = null;
//             cmp.show();
//             cmp.floatParent = appViewContainer; // чтобы корректно удалялось
//
//             removeOldItems = false; // не удаляем обычные items (оставим чтобы выглядело прикольнее)
//           }
//
//           // после закрытия компонента, вернемся в истории
//           cmp.on({
//             close() {
//               // удали окно из контейнера
//               appViewContainer./* floatingItems. */ remove(cmp);
//
//               if (appViewContainer.items.length) {
//                 this.onUpdateState();
//               } else {
//                 // найдем предыдущую запись в истории
//                 Ext.getStore('History').removeAt(0);
//                 const beforeHistoryRecord = Ext.getStore('History').getAt(0);
//
//                 // и перейдем на нее
//                 if (beforeHistoryRecord) {
//                   this.redirectByXtype(beforeHistoryRecord.get('token'));
//                 }
//               }
//             },
//             scope: this
//           });
//         }
//       },
//       this
//     );
//
//     // удалить остальных детей (из items и floatingItems)
//     if (removeOldItems) {
//       Ext.Array.each([].concat(this.getViewContainerChilds().slice(tokenArray.length)), (item) => {
//         appViewContainer.remove(item);
//       });
//     }
//     Ext.resumeLayouts(true);
//
//     // TODO Релайаут добавлен как временное решение для устранения артефактов на первой загруженной вьюхе после рефреша страницы. Нужно найти причину и решение этих артефактов.
//     Ext.defer(() => {
//       appViewContainer.up().updateLayout(true);
//     }, 10);
//
//     // дернем событие
//     this.fireEvent('updatedbytokens', tokenArray, this.getViewContainerChilds());
//     Ext.GlobalEvents.fireEvent('afternavigate', tokenArray, this.getViewContainerChilds());
//   },
//
//   /**
//    * Отдать детей AppViewContainer. Если есть floating отдаются только они
//    */
//   getViewContainerChilds() {
//     const viewContainer = this.getAppViewContainer();
//     const floating = viewContainer.query('>[floating]');
//
//     return !Ext.isEmpty(floating) ? floating : viewContainer.query('>:not(toolbar)');
//   },
//
//   /**
//    * @param options
//    */
//   onLetsUpdatePath(options) {
//     this.updatePath(options);
//   },
//
//   /**
//    * @param options
//    */
//   onLetsUpdateLastPath(options) {
//     this.updateLastPath(options);
//   },
//
//   /**
//    * @param items
//    */
//   onLetsRedirectByXtype(items) {
//     this.redirectByXtype(items);
//   },
//
//   // ///// PUBLIC
//   /**
//    * @param xtype
//    * @param params
//    */
//   navigateToXtype(xtype, params) {
//     this.redirectTo(this.makeTokenByXtype(xtype, params));
//   },
//
//   /**
//    * @param options
//    */
//   updatePath(options /* xtype, params */) {
//     const me = this;
//     const { currentToken } = Ext.util.History;
//     let tokens = currentToken.split(Ext.route.Router.getMultipleToken());
//     const newToken = this.makeTokenByObject(options); // makeTokenByXtype(options.xtype, options.params);
//
//     const foundToken = (function () {
//       const o = me.getSectionByXtype(options.xtype);
//
//       return Ext.Array.findBy(tokens, (token) => {
//         const tokenArr = token.slice(1).split('.');
//
//         return tokenArr[0] == o.section && tokenArr[1] == o.view;
//       });
//     })();
//
//     if (foundToken) {
//       tokens = Ext.Array.replace(tokens, tokens.indexOf(foundToken), 1, [newToken]);
//     } else {
//       tokens.push(newToken);
//     }
//
//     this.redirectTo(
//       tokens.join(Ext.route.Router.getMultipleToken())
//       // ,	true
//     );
//   },
//
//   /**
//    * @param options
//    */
//   updateLastPath(options) {
//     const { currentToken } = Ext.util.History;
//     const tokens = currentToken.split(Ext.route.Router.getMultipleToken());
//     let newToken = this.makeTokenByObject(options); // makeTokenByXtype(options.xtype, options.params);
//
//     // смержимся с последним токеном
//     if (tokens.length > 0 /* 1 */) {
//       // прочитаем и удалим полсдений token
//       const me = this;
//       const lastToken = (function (tokens, options) {
//         let token;
//
//         if (Ext.isNumber(options.tokenNum)) {
//           token = tokens[options.tokenNum];
//
//           Ext.Array.removeAt(tokens, options.tokenNum);
//         } else {
//           token = tokens.pop();
//         }
//
//         return token ? me.makeTokenObject(token) : null;
//       })(tokens, options);
//
//       if (options.mergeParams !== false) {
//         newToken = Ext.merge(lastToken, this.makeTokenObject(newToken));
//         newToken = this.makeTokenByObject(newToken);
//       }
//     }
//
//     tokens.push(newToken);
//
//     this.redirectTo(
//       tokens.join(Ext.route.Router.getMultipleToken())
//       // ,	true
//     );
//   }
// });
