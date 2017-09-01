webpackJsonp([7],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _vue = __webpack_require__(10);

	var _vue2 = _interopRequireDefault(_vue);

	var _vue3 = __webpack_require__(11);

	var _vue4 = _interopRequireDefault(_vue3);

	var _index = __webpack_require__(595);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_vue2.default.use(_vue4.default); /**
	                                   * Created by luanchi on 17/8/30.
	                                   */


	new _vue2.default({
	  el: '#app',
	  render: function render(h) {
	    return h(_index2.default);
	  }
	});

/***/ },

/***/ 595:
/***/ function(module, exports, __webpack_require__) {

	
	/* styles */
	__webpack_require__(596)

	var Component = __webpack_require__(97)(
	  /* script */
	  __webpack_require__(597),
	  /* template */
	  __webpack_require__(598),
	  /* scopeId */
	  null,
	  /* cssModules */
	  null
	)
	Component.options.__file = "/58fe/project/fang-booking/src/views/wait/index.vue"
	if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
	if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

	/* hot reload */
	if (false) {(function () {
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  module.hot.accept()
	  if (!module.hot.data) {
	    hotAPI.createRecord("data-v-44a2e515", Component.options)
	  } else {
	    hotAPI.reload("data-v-44a2e515", Component.options)
	  }
	})()}

	module.exports = Component.exports


/***/ },

/***/ 596:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 597:
/***/ function(module, exports) {

	"use strict";

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

	exports.default = {};

/***/ },

/***/ 598:
/***/ function(module, exports, __webpack_require__) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('div', [_vm._v("等待页。。。")])
	},staticRenderFns: []}
	module.exports.render._withStripped = true
	if (false) {
	  module.hot.accept()
	  if (module.hot.data) {
	     require("vue-hot-reload-api").rerender("data-v-44a2e515", module.exports)
	  }
	}

/***/ }

});