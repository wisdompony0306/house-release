webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _vue = __webpack_require__(10);

	var _vue2 = _interopRequireDefault(_vue);

	var _vue3 = __webpack_require__(11);

	var _vue4 = _interopRequireDefault(_vue3);

	var _index = __webpack_require__(100);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_vue2.default.use(_vue4.default); /**
	                                   * Created by luanchi on 17/6/12.
	                                   */


	new _vue2.default({
	  el: '#app',
	  render: function render(h) {
	    return h(_index2.default);
	  }
	});

/***/ },

/***/ 100:
/***/ function(module, exports, __webpack_require__) {

	
	/* styles */
	__webpack_require__(101)

	var Component = __webpack_require__(97)(
	  /* script */
	  __webpack_require__(102),
	  /* template */
	  __webpack_require__(104),
	  /* scopeId */
	  null,
	  /* cssModules */
	  null
	)
	Component.options.__file = "/58fe/project/fang-booking/src/views/agreement/index.vue"
	if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
	if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

	/* hot reload */
	if (false) {(function () {
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  module.hot.accept()
	  if (!module.hot.data) {
	    hotAPI.createRecord("data-v-a3c8a600", Component.options)
	  } else {
	    hotAPI.reload("data-v-a3c8a600", Component.options)
	  }
	})()}

	module.exports = Component.exports


/***/ },

/***/ 101:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 102:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _api = __webpack_require__(103);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    name: 'orderAgreement',
	    data: function data() {
	        return {
	            timer: 5, //默认倒数3秒
	            stop: false, //默认是停止的，但界面加载之后会变成false
	            Interval: null, //setInterval的对象
	            dataButton: {
	                type: Object,
	                default: function _default() {
	                    return {
	                        // text: '',
	                        class: ''
	                    };
	                }
	            },
	            infoId: this.$util.getUrlParam('infoId'),
	            loadCreateOrderPage: {
	                title: "确定租住信息",
	                url: _api2.default.pageCreateOrder.url //租客订金订单填写页面地址
	            }
	        };
	    },

	    watch: {},
	    created: function created() {
	        var _this = this;
	        _this.handlerStartTimer();
	        //页面展现埋点
	        _this.$app.webLog("show", "rentercontract");
	    },
	    mounted: function mounted() {},

	    methods: {
	        handlerSubmit: function handlerSubmit() {
	            //跳转页面
	            var _this = this;
	            //点击埋点
	            _this.$app.webLog("confirm", "rentercontract");
	            if (_this.timer >= 1) {
	                return;
	            }
	            var _loadCreateOrderPage = _this.loadCreateOrderPage;
	            var _url = window.location.protocol + _loadCreateOrderPage.url + "?infoId=" + _this.infoId;
	            _this.$app.loadPage('link', _url, _loadCreateOrderPage.title);
	        },
	        handlerUpdate: function handlerUpdate() {
	            var _this = this;
	            if (_this.timer <= 0) {
	                _this.timer = 5;
	            } else {
	                _this.timer--;
	                if (_this.timer == 0) {
	                    _this.timer = '';
	                    _this.dataButton.class = 'endTime';
	                    clearInterval(_this.Interval);
	                }
	            }
	        },
	        handlerStartTimer: function handlerStartTimer() {
	            //如果是false就开始倒计时，如果是true就停止倒计时
	            if (this.stop == false) {
	                this.href = '#';
	                this.Interval = setInterval(this.handlerUpdate, 1000);
	            } else {
	                clearInterval(this.Interval);
	            }
	            this.stop = !this.stop;
	        }
	    }
	}; //
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

/***/ },

/***/ 103:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by luanchi on 17/6/12.
	 * 数据请求url
	 */

	var host = "//houserent.m.58.com";
	var port = "";

	if (process && ({"NODE_ENV":"production"}) && ("production") == 'devServer') {
	    host = '//test.58.com';
	    port = ":8007";
	}

	exports.default = {
	    /**
	     * 说明:预订填写页面URL
	     * 参数:
	     *   infoId: 信息ID(infoid)
	     */
	    pageCreateOrder: {
	        url: host + port + '/order/create_order'
	    },
	    /**
	     * 说明:预订协议页面URL
	     * 参数:(无)
	     *   infoId: 信息ID(infoid)
	     */
	    pageGetAgreement: {
	        url: host + port + '/order/get_agreement'
	    },
	    /**
	     * 说明:预订协议页面URL
	     * 参数:
	     *   role: 角色 1租客 2房东
	     */
	    pageGetOrderList: {
	        url: host + port + '/order/get_order_list'
	    },
	    /**
	     * 说明:房东端订单详情页面URL
	     * 参数:
	     *   orderId: 订单id
	     */
	    pageGetOwnerDetail: {
	        url: host + port + '/order/get_owner_detail'
	    },
	    /**
	     * 说明:租客端订单详情页面URL
	     * 参数:
	     *   orderId: 订单id
	     */
	    pageGetRenterDetail: {
	        url: host + port + '/order/get_renter_detail'
	    },
	    /**
	     * 说明: 仲裁 租客端
	     * 参数:
	     *   orderNo: 订单id
	     *   redirectUrl: 当前页面的url
	     */
	    plaintiff: {
	        url: 'https://gpay.58.com/appeal/plaintiff/show'
	    },
	    /**
	     * 说明: 微信支付 租客付款
	     * 参数:
	     *   orderNo: 订单id
	     *   bizCode: 业务码(默认12)
	     *   orderExpireTime:订单过期时间
	     *   sign: 签名（用户下单，订单系统返回）
	     */
	    wxAppPay: {
	        url: 'https://gpay.58.com/wxpay/app'
	    },
	    /**
	     * 说明: 房东端申诉中的订单，提交证据页面，
	     * 参数:
	     *   orderNo: 订单id
	     *   redirectUrl: 当前页面的url
	     */
	    defendantShow: {
	        url: 'https://gpay.58.com/appeal/defendant/show'
	    },
	    /**
	     * 说明: 房东端申诉中的订单，判断是否可以提交证据，
	     * 参数:
	     *  orderNo: 订单id
	     *  callback: jsonp回调函数名称
	     * 返回:
	     *  code: 1没有提交过、-1已提交过证据
	     */
	    defendantIsUncommitted: {
	        url: 'https://gpay.58.com/appeal/defendant/isUncommitted'
	    },
	    /**
	     * 说明: 个人用户详情页
	     * 参数:
	     *   id: 用户id
	     */
	    userDetail: {
	        url: '//houserent.m.58.com/landlord/userDetail'
	    },
	    /**
	     * 说明: 生成订单接口
	     * 请求方式: post
	     * 参数:
	     *   infoId: 信息id
	     *   price:租金
	     *   checkInDate：入住日期
	     *   sellerName：房东姓名
	     *   sellerCardId：房东身份证号
	     *   buyerPhone：租客手机号
	     *   isSee：是否看房  (是否看房：1，未看房，2:已看房)
	     */
	    createOrder: {
	        url: host + port + '/order/api_create_order'
	    },
	    /**
	     * 说明: 获取订单列表接口
	     * 参数:
	     *   pageNum: 页码，1:第一页
	     *   role: 1:租客，2:房东
	     */
	    getOrderList: {
	        url: host + port + '/order/api_get_order_list'
	    },
	    /**
	     * 说明: 获取生成订单时帖子信息接口
	     * 参数:
	     *   infoId: 信息id
	     */
	    getPostInfoById: {
	        url: host + port + '/order/api_get_post_info_by_id'
	    },
	    /**
	     * 说明: 获取订单信息接口
	     * 参数:
	     *   orderId: 订单Id
	     *   role: 1:租客，2:房东
	     */
	    getOrderInfoById: {
	        url: host + port + '/order/api_get_order_info_by_id'
	    },
	    /**
	     * 说明: 取消订单接口
	     * 参数:
	     *   orderId:
	     *   role:
	     */
	    cancelOrder: {
	        url: host + port + '/order/api_cancel_order'
	    },
	    /**
	     * 说明: 租客申请退款接口
	     * 参数:
	     *   orderId:
	     */
	    applyRefund: {
	        url: host + port + '/order/api_apply_refund'
	    },
	    /**
	     * 说明: 确认订单接口 (租客确认入住接口)
	     * 参数:
	     *   orderId:
	     *   role:
	     */
	    confirmOrder: {
	        url: host + port + '/order/api_confirm_order'
	    },
	    /**
	     * 说明: 删除订单接口
	     * 参数:
	     *  orderId: 订单id
	     *  role: 角色 (1:租客，2:房东)
	     */
	    deleteOrder: {
	        url: host + port + '/order/api_delete_order'
	    },
	    /**
	     * 说明: 房东同意或拒绝退款接口
	     * 参数:
	     *   orderId: 订单标号
	     *   isAgree: 1:房东同意，2:房东拒绝
	     */
	    confirmRefund: {
	        url: host + port + '/order/api_confirm_refund'
	    },

	    /**
	     * 说明: 房东提现状态接口
	     * 请求方式: post
	     * 参数:
	     *   orderId:订单id
	     * 返回值：
	     *   code:  0成功,非0 失败
	     *   data: {
	     *      status: 0提现中 1提现成功 -1提现失败
	     *      message: 提现失败时的失败信息 (NAME_MISMATCH|V2_ACCOUNT_SIMPLE_BAN)提示微信未绑定银行卡或是人脸认证与微信不符,需重新绑定微信
	     *   }
	     */
	    getTransferResult: {
	        url: host + port + '/order/api_get_transfer_result'
	    },
	    /**
	     * 说明: 获取绑定微信头像、昵称、openId接口
	     * 方式:post
	     * 参数:
	     *   appId: 授权应用id (wxc7929cc3d3fda545)
	     * 返回值：
	     *  code: 0(未)授权 -1未绑定微信 其他
	     *  data:{
	     *      opendId: 空未收取,非空判断imageUrl、nickName是否有值,没有值重新授权操作
	     *      imageUrl: 微信头像链接
	     *      nickName: 微信昵称
	     *  }
	     */
	    bindWechat: {
	        url: host + port + '/order/api_bind_wechat?appId=wxc7929cc3d3fda545'
	    },
	    /**
	     * 说明: 订单提现(房东端)
	     * 请求方式: post
	     * 请求参数：
	     *   orderId:订单Id
	     * 返回值：
	     *   code: 0更新提现状态 1未到提现时间,提现延时打款
	     *   message: 提示信息
	     */
	    withdrawCash: {
	        url: host + port + '/order/api_withdraw_cash'
	    },
	    /**
	     * 说明: 是否人脸认证接口
	     * 请求参数：
	     *  无
	     * 返回值：
	     *  code: 0后端请求正常 非0后端请求异常
	     *  data: 1已进行人脸认证 非1未进行人脸认证
	     *
	     */
	    userFaceAuth: {
	        url: host + port + '/order/api_user_face_auth'
	    }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(60)))

/***/ },

/***/ 104:
/***/ function(module, exports, __webpack_require__) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('article', {
	    staticClass: "agreementBox"
	  }, [_vm._m(0), _vm._v(" "), _c('a', {
	    staticClass: "submitBtn",
	    class: [_vm.dataButton.class],
	    on: {
	      "click": _vm.handlerSubmit
	    }
	  }, [_vm._v("\n        同意 "), _c('span', [(_vm.timer) ? _c('i', [_vm._v(" ( ")]) : _vm._e(), _vm._v(_vm._s(_vm.timer) + " "), (_vm.timer) ? _c('i', [_vm._v(" 秒) ")]) : _vm._e()])])])
	},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('div', {
	    staticClass: "desc"
	  }, [_c('div', [_c('strong', [_vm._v("特别提示：")]), _vm._v(" "), _c('p', [_vm._v("1、 本租房保证协议（以下称\"本协议\"）系用户（以下“用户”）与58同城网站（www.58.com）、无线站点（包括wap.58.com,\n                m.58.com）及58同城移动应用软件（APP）（以下简称“58同城平台”或”乙方平台“）的所有者及其关联服务提供方共同签署。\n            ")]), _vm._v(" "), _c('p', [_vm._v(" 2、\n                用户一旦勾选了“同意”《租房保证协议》或者实际接受或使用了58同城平台”租房交易保障服务”，就表示用户已接受了本协议的全部约定并愿意受其约束。请用户在勾选同意或使用58同城平台”租房交易保障服务”前务必仔细阅读本协议，"), _c('strong', [_vm._v("充分理解各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款，如果用户不同意本协议或其中任何条款约定，应立即停止使用本协议项下的推广服务。")]), _vm._v("如发生纠纷，用户不能以未经仔细阅读为由进行抗辩。\n            ")]), _vm._v(" "), _c('p', [_vm._v("3、\n                本服务协议内容包括协议正文及所有58同城平台已经发布的或将来可能发布的各类规则。所有规则为协议不可分割的组成部分，与本协议正文具有同等效力。本协议是《58同城使用协议》的有效组成部分，本协议未涉及的事项依照《58同城使用协议》处理。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                4、\n                58同城平台有权根据国家法律法规的更新、产品和服务规则的调整不时地调整、修订本协议并以平台公示的方式通知用户，58同城平台无需另行以邮件、电话或任何书面函件的方式通知用户。如用户继续使用58同城平台“租房交易保障服务“的，即表示用户接受最新的协议约束。\n            ")])]), _vm._v(" "), _c('div', [_c('strong', [_vm._v("一、 定义")]), _vm._v(" "), _c('p', [_vm._v("\n                1、 用户：是指注册或登陆使用58同城平台服务且具有完全民事权利能力和完全民事行为能力的自然人，用户分为“承租人用户“及”出租人用户“。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                2、\n                “租房交易保障服务”：系指为保障承租人用户及出租人用户的合法权益，58同城根据租赁交易双方不可撤销的电子指令及授权为用户提供的房源信息存储、推广、房源锁定、部分或全部保证金在线支付的网络推广信息技术服务。\n            ")]), _vm._v(" "), _c('p', [_c('strong', [_vm._v("\n                    3、\n                    订金（也称“保证金”）：即承租人用户为表示租房诚意使用58同城的租房交易保障推广服务而向58同城缴纳的款项，承租人用户支付了该笔款项后可以与出租人用户进行自主沟通联系现场查看房源以及进行租房交易的洽谈并达成交易签署租房相关法律文件等，待出租人用户点击确认“同意出租”按钮后视为承租人用户与出租人用户达成了租赁交易，出租人用户与承租人用户需约定入住日期，待承租人用户确认入住后，承租人用户委托并同意58同城根据承租人用户发出的“确认入住“之不可撤销的电子指令将出租人用户缴纳的该笔保证金转移支付给出租人用户用于抵扣房租或押金等租房相关费用；如承租人用户在约定入住日期之日起7日内未确认入住且未申请退款的，承租人用户确认并同意58同城有权默认承租人用户已经入住，该笔保证金将于7天期满后自动转移给出租人用户；如承租人用户与出租人用户未达成租赁交易的或者承租人用户申请退还保证金经58同城审核通过的，则58同城将该笔保证金退还给承租人用户。\n                ")])]), _vm._v(" "), _c('p', [_vm._v("\n                4、 标的房源：即指出租人用户发布的当承租人用户在线支付了保障金后可以进行锁定的房源信息。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                5、 租赁交易双方：即指本协议项下的出租人用户和承租人用户。\n            ")])]), _vm._v(" "), _c('div', [_c('strong', [_vm._v("二、租赁交易保障服务内容及相关规则")]), _vm._v(" "), _c('p', [_vm._v("1、\n                【适用情形】：本协议适用于承租人用户在乙方平台页面查看了租房房源信息，经与出租人用户通过乙方平台提供的在线沟通方式进行了沟通确认或承租人用户与出租人用户先行进行了线下沟通、实际查看过标的房源、双方已经初步达成租赁意，同意通过乙方平台在线支付保证金以锁定该房源的情形。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                2、\n                【服务性质】：本协议项下的保障服务系58同城为保障租赁交易双方合法权益提升用户使用58同城的服务体验而提供，具体房源信息系由出租人用户自行编辑发布，58同城不对租赁交易双方之间就线下租赁交易过程提供任何撮合、代理、中介服务且不收取任何服务费，租赁交易双方因签订及履行租赁合同或者达成租赁交易中的任何事宜（包括但不限于签订房屋租赁合同、交房、验收、租赁费用结算、税费缴纳、备案登记及其他相关事宜）均独立承担责任。58同城不介入任何线下交易过程，58同城所提供的服务仅限于辅助性交易保障服务，58同城作为中立的第三方服务平台，应遵守公平公正合法合理以事实为依据的原则对租赁交易双方在使用该服务过程中发生的纠纷进行调解，如租赁交易双方对该调解不予接受的，租赁交易双方可另行诉讼方式解决争议。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                3、\n                【保证金的申请支付及房源锁定】：承租人用户可按乙方平台相关指示申请在线支付保证金，保证金金额以承租人用户自行填写并在乙方平台页面公示为准；承租人用户申请在线支付后，该房源信息被锁定；承租人用户需在30分钟内缴纳完毕，如承租人用户未在30分钟内缴纳的（包括承租人用户缴纳后自动取消申请或者过期未进行支付等），则该笔订单将失效关闭，如承租人用户仍有租赁意向的，可以重新申请支付；承租人提交了在线支付申请后，出租人用户有权决定拒绝或同意承租人用户的申请；承租人用户在线支付了保证金后，出租人用户确认是否同意出租前，标的房源均被锁定，即一套标的房源在同一时间段仅可被一位承租人用户锁定。承租人在连续14天内最多发起3次交保证金操作，若超过3次的则不能再使用租房交易保障服务进行房源的额锁定。如果承租人用户有未完成订单，则需完成该笔订单后才能对其他房源申请缴纳保证金进行锁定，如有未完成订单的则不能对其他房源发起缴纳保证金进行锁定的申请。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                4、\n                【保证金的缴纳】：承租人用户确定在线支付保证金的，可点击”确认支付“按钮向58同城发出不可撤销的电子指令，通过第三方支付机构向58同城支付该笔保证金，承租人用户确认支付后该笔保证金暂时托管于第三方支付机构的账户中。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                5、\n                【保证金的使用】：租赁交易用户双方均知悉并确认，保证金的缴纳不是58同城的强制性要求，承租人用户实际看房后有权选择不支付保证金，且通过乙方平台在线支付的保证金，当该笔保证金58同城根据本协议的规则即承租人用户的委托转移支付给出租人用户后，具体使用方式即用途由租赁交易双方自行协商确定。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                6、 【线下交易及出租人用户确认同意】：承租人用户缴纳保证金后，"), _c('strong', [_vm._v("出租人用户需在24小时内确认是否同意出租给该承租人用户，如出租人用户同意出租的，租赁交易用户双方需线下签署租赁合同，当出租人用户点击同意出租的，则视为出租人用户与承租人用户已经签署了租赁书面合同达成租赁交易；")]), _vm._v("如出租人用户不同意出租的，承租人用户需点击确认不同意出租或在24小时内未确认同意出租的，则该承租人的承租申请视为被拒绝。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                7、\n                【约定入住时间】承租人用户需与出租人用户自行沟通协商具体入住日期，并按双方协商确定的入住日期在58同城平台页面填写确认，出租人用户在确认是否同意出租前亦需对承租人用户填写的入住日期审核，并根据审核的结果点击确认同意或不同意出租。\n            ")]), _vm._v(" "), _c('p', [_c('strong', [_vm._v("\n                    8、\n                    【确认入住及保证金转移支付】：承租人用户需按约定的入住时间入住并点击确认是否入住，如确实入住的需点击“确认入住”按钮，确认入住后，该标的房源将被下架处理，承租人用户点击确认后视为委托并同意58同城将保证金转移支付给出租人用户；如承租人用户申请退款的，需说明申请退款原因经58同城审核确认同意后退还；如承租人用户在约定的入住日期之日起7天内未申请退款的，承租人用户知悉并确认同意58同城有权视承租人用户默认确认已经入住，默认已经入住的，该标的房源将被下架处理，7天期满后58同城将自动将保证金转移给出租人用户。\n                ")])]), _vm._v(" "), _c('p', [_vm._v("\n                9、\n                【保证金的退还】：在以下情形下，承租人用户支付的保证金可以申请退还：1）无条件退款：出租人用户点击确认同意出租前，承租人用户自己主动申请退款或者出租人用户自承租人用户在线缴纳保证金后24小时内出租人用户未确认同意出租的，则承租人用户缴纳的保证金自动退还至承租人账户；2）需审核通过后退还：出租人用户与承租人用户约定的入住日期之日起7日内，需审核确认后退还：A.出租人用户发布的房源信息虚假（包括图片虚假、价格虚假、地理位置虚假）；B.承租人用户已经将标的房屋出租给其他承租人导致交易客观无法实现；C.承租人用户因其他出租人用户的原因无法入住标的房屋；\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                10、 【保证金的不退还】承租人用户点击确认入住或者自出租人用户与承租人用户约定的入住日期之日起7日内承租人用户未申请退款的，则保证金转移给出租人用户后承租人无法申请退还。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                11、\n                【争议纠纷调解】：上述承租人申请退还保证金需审核确认后退还的情形，承租人用户向58同城提供相应的书面证据材料及申请调解的申请，58同城对承租人用户提交的书面证明材料及调解申请，协助承租人用户向承租人用户进行沟通协调，承租人用户需于收到58同城发出的协助调解反馈通知之日起3个工作日内未提供有效的相反书面证明材料的，则保证金自退还给承租人用户。书面证据材料包括但不限于承租人用户与出租人用户的电话沟通录音记录、微信沟通记录、短信沟通记录、邮件沟通记录、标的房屋室内照片（不少于3张、不小于50kb、均清晰完整）、结算单据凭证等。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                12、 【实际到账】：用户知悉并确认，保证金的实际退款或支付到账时限由第三方支付机构或银行根据实际结算时限处理，最迟不超过自办理退款或申请提现之日起的7个工作日，具体时限以银行公示为准。\n            ")])]), _vm._v(" "), _c('div', [_c('strong', [_vm._v("\n                三、用户的权利义务\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                1、\n                【陈述与保证】用户需承诺并保证均系具备合法民事权利能力及行为能力的自然人，均具备签订及履行本协议相适应的能力和资格。用户保证向58同城提交的个人信息（包括但不限于姓名、地址、联系方式、身份证号及收付款账户信息等）均真实准确合法有效，且如用户的个人信息如发生变更的，用户需及时予以更新或通知58同城，如因用户信息发生变更未及时更新产生的不利后果，由用户自行承担。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                2、\n                【出租人用户的义务】：1）出租人用户应保证对所发布的标的房源拥有合法的所有权或处分权已经获得了其他相关权利人的合法授权，本协议签订及履行不侵犯任何第三方的合法权益；2）出租人用户应保证其所发布的房源信息均真实合法准确完整有效，均符合国家法律法规相关政策及地方性法规文件等对房源信息的发布规定，且符合乙方平台关于房源信息发布审核规则的规定（58同城首页-帮助中心http://about.58.com/89.html?cateid=1）；3）出租人用户应向58同城提交证明自己具备对标的房源所有权或合法处分权的书面证明资料并应保证所提供资料的真实性合法性有效性；4）出租人用户知悉并同意按本协议约定的争议纠纷调解规则处理，并配合提供相关书面证明材料，同时应保证所提供的书面证明材料的真实准确完整合法有效。5）出租人用户应保证所提供的收款账户信息系本人的有效账户信息，如因出租人用户提供的收款账户信息错误导致支付不成功的，责任由出租人用户自行承担。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                3、 【承租人用户的义务】：1）承租人用户应在支付保证金前与出租人审慎沟通了解，并实地查看标的房源，确认该标的房屋的出租状态后及标的房屋的情况符合自身需求后再进行支付；"), _c('strong', [_vm._v("2）承租人用户应及时查看保障服务状态，按实际情况确认是否入住或者是否申请退款，如因承租人用户未及时确认或者怠于行使自己的权利导致保证金无法被退还的，责任由承租人自行承担；")]), _vm._v("3）承租人用户应保证向58同城提交的投诉举报情形及所提交的相关证明材料的真实合法有效，不虚假恶意投诉；4）承租人用户知悉并确认，非可申请退款情形的，承租人缴纳的保证金将无法退还；5）承租人用户同意遵守本协议项下的争议纠纷调解规则，并按规则规定提供相应证据材料并保证所提交证据材料的真实性合法性准确性有效性；6）承租人用户知悉并确认在58同城进行的操作发出的指令均为不可撤销的指令，一经点击或确认后将视为用户自主发出的有效指令，58同城根据用户发出的电子指令而进行的后续操作处理（包括但不限于转移支付、退款等）责任后果将有承租人用户自行承担。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                4、\n                【争议解决途径】用户进行投诉举报时必须通过58同城平台页面公示的【虚假举报】程序进行举报，如用户通过电话，短信，邮件，或者其他非在线举报方式进行举报的，视为用户举报无效，用户将无法获得有效的处理结果。\n            ")])]), _vm._v(" "), _c('div', [_c('strong', [_vm._v("四、58同城的权利义务")]), _vm._v(" "), _c('p', [_vm._v("\n                1、\n                58同城如发现用户有如下行为之一：有任何违反国家有关法律、法规及中国承认或加入的国际条约的行为（包括但不限于危害国家安全、淫秽色情、虚假、违法、诽谤、恐吓或骚扰、侵犯他人知识产权、人身权或其他合法权益或利益以及有违公序良俗的行为）；假冒、欺诈等欺骗行为；采取任何违法或者作弊的行为获取不正当交易机会；其他违反本协议约定的行为，则58同城有权直接终止为用户提供服务。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                2、\n                用户知悉并同意58同城在58同城平台服务器上保留用户的信息，包括但不限于注册信息、登陆信息、标的房源信息及保证金的支付缴纳退还等记录信息等并同意58同城基于系统升级、测试、更新、为用户提供服务等目的使用用户上述信息。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                3、\n                用户知悉58同城平台相关支付功能系由第三方提供技术支持及服务，用户在点击“确认支付”前，请用户仔细确认和了解第三方服务内容特别是风险情况，以决定是否接受第三方的服务；请合理判断用户的风险承受能力，用户应按照第三方服务提供者的相关协议与规则使用第三方服务，58同城平台不属于支付功能的服务提供方且不承担由此可能产生的任何责任。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                4、 58同城对因用户自身原因所造成的错误支付指令（包括但不限于用户未按规定操作、用户未妥善保管其账号及密码而致使他人盗用、冒用）而引起的资金损失不承担任何责任。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                5、 58同城应建立完整客服体系并承担用户服务支撑工作，及时处理用户投诉、争议事项。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                6、\n                58同城承诺在产品的合作中提供技术支持以完成技术对接，采取合理及必要的网络系统安全措施，保护自身技术系统的安全和稳定运行。但用户知悉并同意58同城有权定期或不定期地对58同城平台或相关设备进行检查和维护，如因此类情况而造成服务在合理时间内中断的，58同城无需为此承担任何责任。58同城保留不经事先通知为维修、升级或其它目的暂停全部或部分服务的权利\n            ")])]), _vm._v(" "), _c('div', [_c('strong', [_vm._v("五、不可抗力")]), _vm._v(" "), _c('p', [_vm._v("\n                1、\n                58同城平台会在现有技术基础上尽力向用户提供服务，用户完全理解并同意，58同城平台涉及互联网、移动通讯等服务，可能会受到各个环节不稳定因素的影响。因此，58同城平台对由于信息网络设备维护、连接故障，电脑、通讯或其他系统故障，计算机病毒，黑客攻击，电力故障，罢工，暴乱，火灾，洪水，风暴，爆炸，战争，政府行为等不可抗力情形给用户造成的损害不承担责任。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                2、\n                如在签订或履行本协议中发生突发疾病住院、交通事故重伤或死亡意外情形不能按时进行操作发出相关指令的，与用户有三代以内直系血亲关系的亲属或配偶向58同城提供合法证明文件，58同城按本协议约定的争议纠纷调解规则进行处理。\n            ")])]), _vm._v(" "), _c('div', [_c('strong', [_vm._v("六、其他")]), _vm._v(" "), _c('p', [_vm._v("\n                1、 本协议的订立、执行、解释及争议解决均适用中华人民共和国法律。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                2、 因本协议的履行或本协议引起的任何争议双方应通过友好协商方式解决，如无法通过友好协商方式解决的，双方一致同意通过58同城平台住所地有管辖权的人民法院以诉讼方式解决。\n            ")]), _vm._v(" "), _c('p', [_vm._v("\n                3、 本协议采用电子文本形式制成，由用户及58同城平台通过58同城平台签署并永久保存在58同城平台为此设立的专用服务器上备查，同时，双方均认可该形式的协议效力。\n            ")])])])
	}]}
	module.exports.render._withStripped = true
	if (false) {
	  module.hot.accept()
	  if (module.hot.data) {
	     require("vue-hot-reload-api").rerender("data-v-a3c8a600", module.exports)
	  }
	}

/***/ }

});