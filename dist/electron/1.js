(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{103:function(a,t,e){a.exports={default:e(104),__esModule:!0}},104:function(a){a.exports=function(){return Function.call.apply(Array.prototype.concat,arguments)}},106:function(a,t,e){var s=e(112);"string"==typeof s&&(s=[[a.i,s,""]]),s.locals&&(a.exports=s.locals);(0,e(9).default)("8a39211c",s,!0,{})},111:function(a,t,e){"use strict";var s=e(106);e.n(s).a},112:function(a,t,e){(a.exports=e(8)(!1)).push([a.i,".page-formulas{display:flex;margin:5px;width:100%;flex-direction:column}.page-formulas .topbar{margin:10px 0}.page-formulas .ivu-card{margin-top:1em}.page-formulas .ivu-card .ivu-card-head p{font-size:16px}.page-formulas .ivu-card .main-col{font-size:18px;margin-bottom:1.5em}.page-formulas .ivu-card .image img{width:100%;margin:auto}.page-formulas .ivu-card .attr{margin-bottom:.5rem}.page-formulas .item-list{height:300px;width:100%}.page-formulas .alias{font-size:14px;color:#999}.page-formulas .ivu-table .ivu-table-row .cell-red{background-color:#fff1f0;color:#fa541c}.page-formulas .ivu-table .ivu-table-row .cell-orange{background-color:#fff2e8;color:#fa8c16}.page-formulas .ivu-table .ivu-table-row .cell-green{background-color:#f6ffed;color:#52c41a}.page-formulas .ivu-table .ivu-table-row .cell-gold{background-color:#fffbe6;color:#faad14}",""])},119:function(a,t,e){"use strict";e.r(t);var s=e(103),o=e.n(s),i=e(100),n=e(0),l=e(3),r=e(35),c=e.n(r),g=e(101),u=e.n(g),f=(e(111),e(7)),p=Object(f.a)({name:"formula",data:function(){return{items:[],next:1,perpage:5,pageHeight:0,loading:!1,searchBarHeight:64,keywords:null,searchTimeId:null,localImages:{},analysisTableCols:[{title:"",key:"position",width:60,align:"center"},{title:"名称",key:"name",width:100},{title:"药效",key:"effect"},{title:"备注",key:"remark"}]}},methods:{loadData:function(){var a=this,t={skip:(this.next-1)*this.perpage,take:this.perpage};this.keywords&&(t.where=[{name:Object(n.Like)("%"+this.keywords+"%")},{alias:Object(n.Like)("%"+this.keywords+"%")}]),this.loading||(this.loading=!0,l.Formula.find(t).then(function(t){return 1>t.length?void(a.next=null):void Object(i.setTimeout)(function(){a.items=o()(a.items,t),a.next++,a.loading=!1},800)}))},nextPage:function(){null===this.next||this.loading||this.loadData()},search:function(){this.next=1,this.items=[],this.loading=!1,this.nextPage()},imageSrc:function(a){var t=a.key+".jpg";return this.localImages?"file://"+c.a.join(__static,"formula_images",t):a.onlineImg?a.onlineImg:null},tableData:function(a){var t=a.analysisTable;return t?(t.map(function(a){switch(a.position){case"君":a.cellClassName={position:"cell-red"};break;case"臣":a.cellClassName={position:"cell-orange"};break;case"佐":a.cellClassName={position:"cell-green"};break;case"使":a.cellClassName={position:"cell-gold"}}}),t):[]}},mounted:function(){var a=this;u.a.readdirSync(c.a.join(__static,"formula_images")).forEach(function(t){a.localImages[t]=!0}),window.onresize=function(){a.pageHeight=a.$refs.page.offsetHeight-a.searchBarHeight},this.$nextTick(function(){a.pageHeight=a.$refs.page.offsetHeight-a.searchBarHeight,a.loadData()})}},function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{ref:"page",staticClass:"page-formulas"},[e("div",{staticClass:"topbar"},[e("Input",{attrs:{search:"","enter-button":"",placeholder:"输入方名"},on:{"on-search":a.search},model:{value:a.keywords,callback:function(t){a.keywords=t},expression:"keywords"}})],1),a._v(" "),e("Scroll",{staticClass:"item-list",attrs:{"on-reach-bottom":a.nextPage,height:a.pageHeight,"distance-to-edge":1}},a._l(a.items,function(t){return e("Card",{key:t.id},[e("p",{attrs:{slot:"title"},slot:"title"},[e("Icon",{attrs:{type:"md-clipboard"}}),a._v("\n          "+a._s(t.name)+" "),t.alias&&""!=t.alias?e("span",{staticClass:"alias"},[a._v("（"+a._s(t.alias)+"）")]):a._e()],1),a._v(" "),t.onlineImg?e("p",{staticClass:"main-col image"},[e("span",{staticStyle:{"margin-left":"-0.5em"}},[a._v("【图解】")]),e("br"),e("br"),a._v(" "),e("img",{attrs:{src:a.imageSrc(t)}})]):a._e(),a._v(" "),e("p",{staticClass:"main-col analysis"},[e("span",{staticStyle:{"margin-left":"-0.5em"}},[a._v("【组成】")]),e("br"),e("br"),a._v(" "),e("Table",{attrs:{columns:a.analysisTableCols,data:a.tableData(t)}})],1),a._v(" "),e("p",{staticClass:"main-col analysis",staticStyle:{"line-height":"2"}},[e("span",{staticStyle:{"margin-left":"-0.5em"}},[a._v("【用量】")]),e("br"),e("br"),a._v("\n        "+a._s(t.components)+"\n      ")]),a._v(" "),t.category&&""!=t.category?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("分类")]),a._v("\n        "+a._s(t.category)+"\n      ")],1):a._e(),a._v(" "),t.source&&""!=t.source?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("出处")]),a._v("\n        "+a._s(t.source)+"\n      ")],1):a._e(),a._v(" "),t.effect&&""!=t.effect?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("功用")]),a._v("\n        "+a._s(t.effect)+"\n      ")],1):a._e(),a._v(" "),t.taboo&&""!=t.taboo?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("禁忌")]),a._v("\n        "+a._s(t.taboo)+"\n      ")],1):a._e(),a._v(" "),t.zhuZhi&&""!=t.zhuZhi?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("主治")]),a._v("\n        "+a._s(t.zhuZhi)+"\n      ")],1):a._e(),a._v(" "),t.bingJi&&""!=t.bingJi?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("病机")]),a._v("\n        "+a._s(t.bingJi)+"\n      ")],1):a._e(),a._v(" "),t.usage&&""!=t.usage?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("运用")]),a._v("\n        "+a._s(t.usage)+"\n      ")],1):a._e(),a._v(" "),t.fuFang&&""!=t.fuFang?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("附方")]),a._v("\n        "+a._s(t.fuFang)+"\n      ")],1):a._e(),a._v(" "),t.faq&&""!=t.faq?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("释疑")]),a._v("\n        "+a._s(t.faq)+"\n      ")],1):a._e(),a._v(" "),t.fangGe&&""!=t.fangGe?e("p",{staticClass:"attr"},[e("Tag",{attrs:{color:"volcano"}},[a._v("方歌")]),a._v("\n        "+a._s(t.fangGe)+"\n      ")],1):a._e(),a._v(" "),e("Divider",{attrs:{dashed:""}}),a._v(" "),0<t.notes.length?e("p",{staticStyle:{"margin-bottom":"1em"}},[a._v("注解：")]):a._e(),a._v(" "),a._l(t.notes,function(t){return e("p",{key:t.id,staticClass:"note"},[e("Tag",{attrs:{color:"geekblue"}},[a._v(a._s(t.key))]),a._v("\n        "+a._s(t.content)+"\n      ")],1)})],2)}),1)],1)},[],!1,null,null,null);t.default=p.exports}}]);