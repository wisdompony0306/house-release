webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _vue = __webpack_require__(10);

	var _vue2 = _interopRequireDefault(_vue);

	var _index = __webpack_require__(263);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by luanchi on 17/6/12.
	 */
	new _vue2.default({
	  el: '#app',
	  render: function render(h) {
	    return h(_index2.default);
	  }
	});

/***/ },

/***/ 263:
/***/ function(module, exports, __webpack_require__) {

	
	/* styles */
	__webpack_require__(264)

	var Component = __webpack_require__(97)(
	  /* script */
	  __webpack_require__(265),
	  /* template */
	  __webpack_require__(266),
	  /* scopeId */
	  null,
	  /* cssModules */
	  null
	)
	Component.options.__file = "/58fe/project/fang-booking/_test/demo/index.vue"
	if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
	if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

	/* hot reload */
	if (false) {(function () {
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  module.hot.accept()
	  if (!module.hot.data) {
	    hotAPI.createRecord("data-v-4e3c8fd5", Component.options)
	  } else {
	    hotAPI.reload("data-v-4e3c8fd5", Component.options)
	  }
	})()}

	module.exports = Component.exports


/***/ },

/***/ 264:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 265:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//
	//

	exports.default = {
	    name: 'demo',
	    data: function data() {
	        return {
	            templates: [{
	                title: '预订协议 agreement',
	                url: "/order/get_agreement"
	            }, {
	                title: '预订填写post',
	                url: "/order/create_order"
	            }, {
	                title: '订单列表 list',
	                url: "/order/get_order_list"
	            }, {
	                title: '订单详情房东端 detailOwner',
	                url: "/order/get_owner_detail"
	            }, {
	                title: '订单详情租客端 detailRenter',
	                url: "/order/get_renter_detail"
	            }, {
	                title: '结果等待页 wait',
	                url: "/order/wait"
	            }]
	        };
	    }
	};

/***/ },

/***/ 266:
/***/ function(module, exports, __webpack_require__) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('div', {
	    staticClass: "demoBox"
	  }, _vm._l((_vm.templates), function(template) {
	    return _c('a', {
	      attrs: {
	        "href": template.url
	      }
	    }, [_vm._v(_vm._s(template.title))])
	  }))
	},staticRenderFns: []}
	module.exports.render._withStripped = true
	if (false) {
	  module.hot.accept()
	  if (module.hot.data) {
	     require("vue-hot-reload-api").rerender("data-v-4e3c8fd5", module.exports)
	  }
	}

/***/ }

});