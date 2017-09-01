var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.set('jsonp callback name', 'jsoncallback');

    //=S 模板页面设置
    app.get('/', function (req, res) {
        res.render('test/demo');
    });
    app.get('/demo', function (req, res) {
        res.render('test/demo');
    });
    app.get('/order/create_order', function (req, res) {
        res.render('html/post');
    });
    app.get('/order/get_agreement', function (req, res) {
        res.render('html/agreement');
    });
    app.get('/order/get_order_list', function (req, res) {
        res.render('html/list');
    });
    app.get('/order/get_owner_detail', function (req, res) {
        res.render('html/detailOwner');
    });
    app.get('/order/get_renter_detail', function (req, res) {
        res.render('html/detailRenter');
    });
    app.get('/order/wait', function (req, res) {
        res.render('html/wait');
    });

    app.get('/api_test', function (req, res) {
        var query = req.query;
        console.log("query=", query);
        var resultJson = {
            code: 0,//状态码 0表示成功,非0表示失败
            message: "api_test接口测试",//状态信息
        };
        res.jsonp(resultJson);
    });

    function getDateString() {
        let _date = new Date();
        let _s = parseInt(100 * Math.random());
        let _time = _date.getTime() + _s * 1000;
        let _date1 = new Date(_time);
        let year = _date1.getFullYear().toString();
        let month = (_date1.getMonth() + 1).toString();
        let day = _date1.getDate().toString();
        let hour = _date1.getHours().toString();//小时
        let minute = _date1.getMinutes().toString();//分
        let second = _date1.getSeconds().toString();//秒
        let _dateStr = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        return _dateStr;
    }

    //=E 模板页面设置
    //获取订单信息接口
    app.get('/order/api_get_order_info_by_id', function (req, res) {
        var query = req.query;
        console.log("query=", query);

        let {orderId, role, status, jsoncallback}=query;

        if (status == undefined) {
            status = 13;
        }

        var resultJson = {
            "code": 0,
            "message": "success",
            "data": {
                "orderId": "4769011150107196",
                "bizCode": 11,
                "status": status,//3 确认入住, 2 同意出租
                "statusDes": "\u5df2\u63d0\u73b0",
                "statusAct": "\u5df2\u63d0\u73b0\u6210\u529f\uff0c\u8bf7\u5728\u5fae\u4fe1\u96f6\u94b1\u4e2d\u67e5\u6536",
                "buyerId": 18666226342150,
                "sellerId": 40977436182805,
                "createTime": "2017-07-18 18:50:12",
                "infoDetail": {
                    "infoId": 30611034085681,
                    "title": "\u5c06\u5e9c\u5bb6\u56ed\u5c0f\u533a 2\u5ba42\u53852\u536b",
                    "picUrl": "http:\/\/pic4.58cdn.com.cn\/mobile\/big\/n_v1bkuymc6ygbnvthtjc5uq.jpg",
                    "area": "100.0",
                    "pLocalName": "\u671d\u9633",
                    "pAreaLocalName": "\u5c06\u53f0\u8def",
                    "chaoXiang": "\u5357",
                    "price": "5000",
                    "nativeApp": "{\"action\":\"pagetrans\",\"tradeline\":\"house\",\"content\":{\"action\":\"pagetrans\",\"countType\":\"\",\"full_path\":\"1,8\",\"infoID\":30611034085681,\"infoSource\":\"14\",\"list_name\":\"zufang\",\"local_name\":\"bj\",\"pagetype\":\"detail\",\"title\":\"\\u8be6\\u60c5\",\"use_cache\":true,\"userId\":40977436182805,\"data_url\":\"https:\\\/\\\/apphouse.58.com\\\/api\\\/detail\\\/\"}}"
                },
                "orderDetail": {
                    "sellerName": "\u9ad8\u5c0f\u6d32",
                    "sellerCardId": "152628199203290234",
                    "buyerPhone": "18500096333",
                    "sellerPhone": "",
                    "checkInDate": "2017-7-18",
                    "isSee": "2",
                    "mihao": 1,
                    "weiliao": 0,
                    "buyerName": "\u5218\u9633",
                    "buyerPic": "http:\/\/pic.58.com\/m1\/bigimage\/n_v21e623c29ca7243fca892774f16c4d828.jpg",
                    "sellerPic": "http:\/\/pic.58.com\/m1\/bigimage\/n_v27d4b8b5e8e0a486bad74695dedfded7f.jpg"
                },
                "totalAmount": 1,
                "buyerDeadline": "2017-07-25 00:00:00",
                "sellerDeadline": "2017-07-19 18:52:49",
                "sellerRefundDeadline": "2017-07-20 19:04:49",
                "buyerAppealDeadline": "2017-07-20 19:04:49",
                "sellerAppealDeadline": "2017-07-20 19:04:49",
                "buyerPayDeadline": "2017-07-18 20:23:41",
                "transferNo": null,
                "cateDispid": 8,
                "cateListname": "zufang",
                "cityDispid": 1,
                "cityListname": "bj",
                "payTime": "2017-07-18 18:52:49",
                "nowTime": "2017-07-18 20:23:41",//2017-07-18 20:23:41

                "agreeTime": '2017-07-18 18:52:49',//房东同意出租时间
                "checkinTime": '2017-07-18 18:52:49',//租客确认入住时间
                "closeTime": '2017-07-18 18:52:49',//交易关闭时间
                "successTime": '2017-07-18 18:52:49',//交易成功时间

                "isWithDrawCash": '1',
                "sign": 'qqq',
                "bizCode": "11",
                "tid": "1"
            }
        };

        //线上数据
        /*resultJson = {
            "code": 0,
            "message": "success",
            "data": {
                "orderId": "5417011186701073",
                "bizCode": 11,
                "status": 7,
                "statusDes": "\u8c03\u89e3\u4e2d",
                "statusAct": "#time# \u79df\u5ba2\u53d1\u8d77\u4e86\u8c03\u89e3\u7533\u8bf7\uff0c\u8bf7\u5728\u89c4\u5b9a\u65f6\u95f4\u5185\u4e0a\u4f20\u8bc1\u636e\u8bc1\u660e\u60a8\u6ca1\u6709\u8fdd\u7ea6",
                "buyerId": 49226566099986,
                "sellerId": 10449101265415,
                "createTime": "2017-08-14 18:08:46",
                "infoDetail": {
                    "infoId": 31064828222277,
                    "title": "\u671d\u9633\u5317\u82d1\u5e7f\u534e\u5c45 1\u5ba40\u5385 \u9694\u65ad",
                    "picUrl": "https:\/\/img.58cdn.com.cn\/n\/images\/list\/noimg2.gif?w=240&h=180&crop=1",
                    "area": "5.0",
                    "pLocalName": "\u671d\u9633",
                    "pAreaLocalName": "\u5317\u82d1",
                    "chaoXiang": "",
                    "price": "90000",
                    "nativeApp": "{\"action\":\"pagetrans\",\"tradeline\":\"house\",\"content\":{\"action\":\"pagetrans\",\"countType\":\"\",\"full_path\":\"1,10\",\"infoID\":31064828222277,\"infoSource\":\"0\",\"list_name\":\"hezu\",\"local_name\":\"bj\",\"pagetype\":\"detail\",\"title\":\"\\u8be6\\u60c5\",\"use_cache\":true,\"userId\":2143847663,\"data_url\":\"https:\\\/\\\/apphouse.58.com\\\/api\\\/detail\\\/\"}}"
                },
                "orderDetail": {
                    "sellerName": "cece",
                    "sellerCardId": "",
                    "buyerPhone": "17301892000",
                    "sellerPhone": "15911180903",
                    "checkInDate": "2017-8-17",
                    "isSee": "1",
                    "mihao": 1,
                    "weiliao": 0,
                    "buyerName": "qsmy67",
                    "buyerPic": "http:\/\/img.58cdn.com.cn\/ui8\/house\/detail\/images\/defaulthead.png",
                    "sellerPic": "http:\/\/pic.58.com\/m1\/bigimage\/n_v27193c23cf1484065b719953d5c6dfe90.jpg"
                },
                "totalAmount": 7,
                "buyerDeadline": "2017-08-24 00:00:00",
                "sellerDeadline": "2017-08-15 18:10:24",
                "sellerRefundDeadline": "2017-08-16 18:48:13",
                "buyerAppealDeadline": "2017-08-16 18:48:13",
                "sellerAppealDeadline": "2017-08-16 18:48:13",
                "buyerPayDeadline": "2017-08-22 10:56:07",
                "transferNo": null,
                "cateDispid": 10,
                "cateListname": "hezu",
                "cityDispid": 1,
                "cityListname": "bj",
                "payTime": "2017-08-14 18:10:24",
                "agreeTime": "2017-08-14 18:14:16",
                "nowTime": "2017-08-22 10:56:07"
            }
        };*/

        res.jsonp(resultJson);
    });

    //取消订单接口
    app.post('/order/DeleteOrder', function (req, res) {
        var query = req.query;
        var body = req.body;
        console.log("query\n", query, "body\n", body);

        var resultJson = {};
        resultJson = {
            code: 0,
            message: "success",
            data: {}
        };
        res.jsonp(resultJson);
    });


    //删除订单接口
    app.get('/order/api_cancel_order', function (req, res) {
        var query = req.query;
        var body = req.body;
        console.log("query\n", query, "body\n", body);

        var resultJson = {};
        resultJson = {
            code: 0,
            message: "success",
            data: {}
        };

        res.jsonp(resultJson);
    });


    //租客退款接口
    app.get('/order/api_apply_refund', function (req, res) {
        var query = req.query;
        var body = req.body;
        console.log("query\n", query, "body\n", body);

        var resultJson = {};
        resultJson = {
            code: 0,
            message: "success",
            data: {}
        };

        res.jsonp(resultJson);
    });

    //租客确认入住接口
    app.get('/order/api_get_order_list', function (req, res) {
        var query = req.query;
        var body = req.body;
        console.log("query\n", query, "body\n", body);

        var resultJson = {};
        resultJson = {
            "code": 0,
            "message": "success",
            "data": {
                "currentPage": 1,
                "pageSize": 5,
                "totalCount": 33,
                "totalPage": 7,
                "recordList": [{
                    "orderId": "170710011105288690",
                    "status": '1',
                    "statusDes": "待付款",
                    "totalAmount": '1',
                    "infoDetail": {
                        "infoId": 27006604788800,
                        "title": "\u6c38\u6cf0\u4e1c\u91cc 2\u5ba41\u5385 \u6b21\u5367 \u671d\u5317 \u7cbe\u88c5\u4fee\u6c38\u6cf0\u4e1c\u91cc 2\u5ba41\u5385 \u6b21\u5367 \u671d\u5317 \u7cbe\u88c5\u4fee",
                        "picUrl": "http:\/\/pic7.58cdn.com.cn\/mobile\/big\/n_v1bkuyfvoox4zvtzg6vjuq.jpg",
                        "area": "12.0",
                        "pLocalName": "\u6d77\u6dc0",
                        "pAreaLocalName": "\u897f\u4e09\u65d7",
                        "chaoXiang": "",
                        "price": "2200"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "15910610825",
                        "checkInDate": "2017-7-10",
                        "isSee": "2"
                    }
                }, {
                    "orderId": "170710011105288690",
                    "status": '2',
                    "statusDes": "待房东确认",
                    "totalAmount": '2',
                    "infoDetail": {
                        "infoId": 27006604788800,
                        "title": "\u6c38\u6cf0\u4e1c\u91cc 2\u5ba41\u5385 \u6b21\u5367 \u671d\u5317 \u7cbe\u88c5\u4fee",
                        "picUrl": "http:\/\/pic7.58cdn.com.cn\/mobile\/big\/n_v1bkuyfvoox4zvtzg6vjuq.jpg",
                        "area": "12.0",
                        "pLocalName": "\u6d77\u6dc0",
                        "pAreaLocalName": "\u897f\u4e09\u65d7",
                        "chaoXiang": "",
                        "price": "2200"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "15910610825",
                        "checkInDate": "2017-7-10",
                        "isSee": "2"
                    }
                }, {
                    "orderId": "170710011105288690",
                    "status": '3',
                    "statusDes": "待确认入住",
                    "totalAmount": '3',
                    "infoDetail": {
                        "infoId": 27006604788800,
                        "title": "\u6c38\u6cf0\u4e1c\u91cc 2\u5ba41\u5385 \u6b21\u5367 \u671d\u5317 \u7cbe\u88c5\u4fee",
                        "picUrl": "http:\/\/pic7.58cdn.com.cn\/mobile\/big\/n_v1bkuyfvoox4zvtzg6vjuq.jpg",
                        "area": "12.0",
                        "pLocalName": "\u6d77\u6dc0",
                        "pAreaLocalName": "\u897f\u4e09\u65d7",
                        "chaoXiang": "",
                        "price": "2200"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "15910610825",
                        "checkInDate": "2017-7-10",
                        "isSee": "2"
                    }
                }, {
                    "orderId": "170710011105288690",
                    "status": '4',
                    "statusDes": "租客已确认",
                    "totalAmount": '4',
                    "infoDetail": {
                        "infoId": 27006604788800,
                        "title": "\u6c38\u6cf0\u4e1c\u91cc 2\u5ba41\u5385 \u6b21\u5367 \u671d\u5317 \u7cbe\u88c5\u4fee",
                        "picUrl": "http:\/\/pic7.58cdn.com.cn\/mobile\/big\/n_v1bkuyfvoox4zvtzg6vjuq.jpg",
                        "area": "12.0",
                        "pLocalName": "\u6d77\u6dc0",
                        "pAreaLocalName": "\u897f\u4e09\u65d7",
                        "chaoXiang": "",
                        "price": "2200"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "15910610825",
                        "checkInDate": "2017-7-10",
                        "isSee": "2"
                    }
                }, {
                    "orderId": "170710011105450980",
                    "status": '5',
                    "statusDes": "取消订单",
                    "totalAmount": '5',
                    "infoDetail": {
                        "infoId": 30399190216886,
                        "title": "\u4e16\u7eaa\u4e1c\u65b9\u5609\u56ed(\u5357\u533a) 1\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic7.58cdn.com.cn\/mobile\/big\/n_v1bj3gzr2nmzbftofnyysa.jpg",
                        "area": "70.0",
                        "pLocalName": "\u671d\u9633",
                        "pAreaLocalName": "\u5357\u78e8\u623f",
                        "chaoXiang": "\u5357",
                        "price": "5600"
                    },
                    "orderDetail": {
                        "sellerName": "\u54c8\u54c8\u54c8\u54c8",
                        "sellerCardId": "555553333366666444",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "18600407338",
                        "checkInDate": "2017-7-10",
                        "isSee": "2"
                    }
                }, {
                    "orderId": "170710011105450980",
                    "status": '6',
                    "statusDes": "提现中",
                    "totalAmount": '6',
                    "infoDetail": {
                        "infoId": 30399190216886,
                        "title": "\u4e16\u7eaa\u4e1c\u65b9\u5609\u56ed(\u5357\u533a) 1\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic7.58cdn.com.cn\/mobile\/big\/n_v1bj3gzr2nmzbftofnyysa.jpg",
                        "area": "70.0",
                        "pLocalName": "\u671d\u9633",
                        "pAreaLocalName": "\u5357\u78e8\u623f",
                        "chaoXiang": "\u5357",
                        "price": "5600"
                    },
                    "orderDetail": {
                        "sellerName": "\u54c8\u54c8\u54c8\u54c8",
                        "sellerCardId": "555553333366666444",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "18600407338",
                        "checkInDate": "2017-7-10",
                        "isSee": "2"
                    }
                }, {
                    "orderId": "170710011105968872",
                    "status": '7',
                    "statusDes": "交易成功",
                    "totalAmount": '7',
                    "infoDetail": {
                        "infoId": 26440166621232,
                        "title": "\u65b0\u5bab\u5bb6\u56ed\u5317\u533a 2\u5ba41\u5385 \u6b21\u5367 \u671d\u5357\u5317 \u7cbe\u88c5\u4fee",
                        "picUrl": "http:\/\/pic1.58cdn.com.cn\/p1\/big\/n_v1bkuymczh7ruvpdh3gj5q.jpg",
                        "area": "86.0",
                        "pLocalName": "\u4e30\u53f0",
                        "pAreaLocalName": "\u65b0\u5bab",
                        "chaoXiang": "",
                        "price": "2200"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "18610827208",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170710011105211822",
                    "status": '8',
                    "statusDes": "申请退款中",
                    "totalAmount": '8',
                    "infoDetail": {
                        "infoId": 30565648973639,
                        "title": "\u9a9a\u5b50\u8425\u540e\u8857 1\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2ac6396c4e1c24e119347e6ca7a70c9e4.jpg",
                        "area": "25.0",
                        "pLocalName": "\u6d77\u6dc0",
                        "pAreaLocalName": "\u8096\u5bb6\u6cb3",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2500"
                    },
                    "orderDetail": {
                        "sellerName": "hhh",
                        "sellerCardId": "555556666633333555",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13161179794",
                        "checkInDate": "2017-7-10",
                        "isSee": "2"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": '9',
                    "statusDes": "房东拒绝退款",
                    "totalAmount": '9',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": '10',
                    "statusDes": "退款中",
                    "totalAmount": '10',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": '11',
                    "statusDes": "调解中",
                    "totalAmount": '11',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": '12',
                    "statusDes": "12",
                    "totalAmount": '12',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": '13',
                    "statusDes": "交易关闭",
                    "totalAmount": '13',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": '14',
                    "statusDes": "提现失败",
                    "totalAmount": '14',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": '15',
                    "statusDes": "退款失败",
                    "totalAmount": '15',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }, {
                    "orderId": "170701011105863460",
                    "status": "16",
                    "statusDes": "已提现",
                    "totalAmount": '16',
                    "infoDetail": {
                        "infoId": 23125638648224,
                        "title": "\u9996\u5ea7\u5fa1\u56ed 2\u5ba41\u53851\u536b",
                        "picUrl": "http:\/\/pic6.58cdn.com.cn\/p1\/big\/n_v2eae12ad12bea4b4eb90b9f2678d04797.jpg",
                        "area": "79.0",
                        "pLocalName": "",
                        "pAreaLocalName": "",
                        "chaoXiang": "\u5357\u5317",
                        "price": "2300"
                    },
                    "orderDetail": {
                        "sellerName": "\u6d4b\u6d4b",
                        "sellerCardId": "123456789012345678",
                        "buyerPhone": "18810667777",
                        "sellerPhone": "13911256362",
                        "checkInDate": "2017-7-10",
                        "isSee": "1"
                    }
                }]
            }
        };

        //线上数据
        /*resultJson = {
            "code": 0,
            "message": "success",
            "data": {
                "currentPage": 1,
                "pageSize": 1000,
                "totalCount": 2,
                "totalPage": 1,
                "recordList": [{
                    "orderId": "5420011186958838",
                    "status": 13,
                    "statusDes": "\u4ea4\u6613\u5173\u95ed",
                    "totalAmount": 1,
                    "infoDetail": {
                        "infoId": 31067996957362,
                        "title": "\u671d\u9633\u5317\u82d1\u534e\u8d38\u57ce(\u4e1c\u533a 1\u5ba40\u5385 \u4e3b\u5367",
                        "picUrl": "https:\/\/img.58cdn.com.cn\/n\/images\/list\/noimg2.gif?w=160&h=120&crop=1",
                        "area": "2.0",
                        "pLocalName": "\u671d\u9633",
                        "pAreaLocalName": "\u5317\u82d1",
                        "chaoXiang": "",
                        "price": "90000"
                    },
                    "orderDetail": {
                        "sellerName": "",
                        "sellerCardId": "",
                        "buyerPhone": "17301892000",
                        "sellerPhone": "",
                        "checkInDate": "2017-8-19",
                        "isSee": "1",
                        "mihao": 1,
                        "weiliao": 0
                    }
                }, {
                    "orderId": "5417011186701073",
                    "status": 11,
                    "statusDes": "\u8c03\u89e3\u4e2d",
                    "totalAmount": 1,
                    "infoDetail": {
                        "infoId": 31064828222277,
                        "title": "\u671d\u9633\u5317\u82d1\u5e7f\u534e\u5c45 1\u5ba40\u5385 \u9694\u65ad",
                        "picUrl": "https:\/\/img.58cdn.com.cn\/n\/images\/list\/noimg2.gif?w=160&h=120&crop=1",
                        "area": "5.0",
                        "pLocalName": "\u671d\u9633",
                        "pAreaLocalName": "\u5317\u82d1",
                        "chaoXiang": "",
                        "price": "90000"
                    },
                    "orderDetail": {
                        "sellerName": "",
                        "sellerCardId": "",
                        "buyerPhone": "17301892000",
                        "sellerPhone": "15911180903",
                        "checkInDate": "2017-8-17",
                        "isSee": "1",
                        "mihao": 1,
                        "weiliao": 0
                    }
                }, {
                    "orderId": "5417011186701073",
                    "status": 7,
                    "statusDes": "\u8c03\u89e3\u4e2d",
                    "totalAmount": 7,
                    "infoDetail": {
                        "infoId": 31064828222277,
                        "title": "\u671d\u9633\u5317\u82d1\u5e7f\u534e\u5c45 1\u5ba40\u5385 \u9694\u65ad",
                        "picUrl": "https:\/\/img.58cdn.com.cn\/n\/images\/list\/noimg2.gif?w=160&h=120&crop=1",
                        "area": "5.0",
                        "pLocalName": "\u671d\u9633",
                        "pAreaLocalName": "\u5317\u82d1",
                        "chaoXiang": "",
                        "price": "90000"
                    },
                    "orderDetail": {
                        "sellerName": "",
                        "sellerCardId": "",
                        "buyerPhone": "17301892000",
                        "sellerPhone": "15911180903",
                        "checkInDate": "2017-8-17",
                        "isSee": "1",
                        "mihao": 1,
                        "weiliao": 0
                    }
                }]
            }
        };*/

        res.jsonp(resultJson);
    });


    app.get('/order/api_user_face_auth', function (req, res) {
        var query = req.query;
        console.log("api_user_face_auth query=", query);
        var resultJson = {
            code: 0,//状态码 0表示成功,非0表示失败
            message: "1已进行人脸认证 非1未进行人脸认证",//状态信息
            data: 1,//1已进行人脸认证 非1未进行人脸认证
        };
        res.jsonp(resultJson);
    });

    app.get('/order/api_get_post_info_by_id', function (req, res) {
        var query = req.query;
        console.log("query=", query);
        var resultJson = {
            "code": 0,
            "message": "success",
            "data": {
                "infoId": 31067996957362,
                "title": "\u671d\u9633\u5317\u82d1\u534e\u8d38\u57ce(\u4e1c\u533a 1\u5ba40\u5385 \u4e3b\u5367",
                "picUrl": "https:\/\/img.58cdn.com.cn\/n\/images\/list\/noimg2.gif?w=240&h=180&crop=1",
                "area": "2.0",
                "pLocalName": "\u671d\u9633",
                "pAreaLocalName": "\u5317\u82d1",
                "chaoXiang": "",
                "price": "90000",
                "buyerPhone": "15811180906",
                "nowTime": "2017-08-15 17:47:39",
                "nativeApp": "{\"action\":\"pagetrans\",\"tradeline\":\"house\",\"content\":{\"action\":\"pagetrans\",\"countType\":\"\",\"full_path\":\"1,10\",\"infoID\":31067996957362,\"infoSource\":\"0\",\"list_name\":\"hezu\",\"local_name\":\"bj\",\"pagetype\":\"detail\",\"title\":\"\\u8be6\\u60c5\",\"use_cache\":true,\"userId\":2143847663,\"data_url\":\"https:\\\/\\\/apphouse.58.com\\\/api\\\/detail\\\/\"}}"
            }
        };
        res.jsonp(resultJson);
    });

    app.post('/order/api_create_order', function (req, res) {
        var query = req.query;
        var body = req.body;
        console.log("api_create_order query=", query, "body=", body);
        var resultJson = {
            code: 0,//状态码 0表示成功,非0表示失败
            message: "success",//状态信息
            data: {},
        };
        res.json(resultJson);
    });

    app.post('/order/api_bind_wechat', function (req, res) {
        var query = req.query;
        var body = req.body;
        console.log("api_bind_wechat query\n", query, "body\n", body);

        var resultJson = {};
        resultJson = {
            code: -1, //0授权成功 -1绑定微信
            message: "",
            data: {
                opendId: '',
                imageUrl: 'http:\/\/pic.58.com\/m1\/bigimage\/n_v21e623c29ca7243fca892774f16c4d828.jpg',
                nickName: '微信授权昵称',
            }
        };
        res.json(resultJson);
    });

    app.get('/order/api_confirm_order', function (req, res) {
        var query = req.query;
        console.log("query=", query);
        var resultJson = {
            code: 0,//状态码 0表示成功,10008
            message: "success",//状态信息
            data: {}
        };
        res.jsonp(resultJson);
    });

    app.get('/order/api_confirm_refund', function (req, res) {
        var query = req.query;
        console.log("api_confirm_refund query=", query);
        var resultJson = {
            code: 0,//状态码 0表示成功,10008
            message: "success",//状态信息
            data: {}
        };
        res.jsonp(resultJson);
    });

    app.post('/order/api_withdraw_cash', function (req, res) {
        var query = req.query;
        console.log("api_withdraw_cash query=", query);
        var resultJson = {
            code: 0,//状态码 0表示成功,10008
            message: "success",//状态信息
            data: {}
        };
        res.json(resultJson);
    });

    app.post('/order/api_get_transfer_result', function (req, res) {
        var query = req.query;
        console.log("api_get_transfer_result query=", query);
        var resultJson = {
            code: 0,
            message: "success",//状态信息
            data: {}
        };
        res.json(resultJson);
    });

    app.get('/order/api_delete_order', function (req, res) {
        var query = req.query;
        console.log("api_delete_order query=", query);
        var resultJson = {
            code: 0,//状态码 0表示成功,10008
            message: "success",//状态信息
            data: {}
        };
        res.jsonp(resultJson);
    });


};



