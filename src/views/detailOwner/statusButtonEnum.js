/**
 * Created by lunachi on 2017/8/13.
 */

import API from '../../service/api';

const statusButtonEnum = {
    /*待付款*/
    1: {
        cancel: {
            text: '取消订单',
            class: 'grey',
            action: 'cancel',
            dialog: {
                title: '',
                content: '不同意该租客预定本房源，取消后其他租客可预定本房源。',
                text1: '我再想想',
                text2: '取消订单',
            },
            log: 'dfkcancle',//埋点
        },
        connect: {
            text: '联系租客',
            class: 'orange',
            action: 'connect',
            tel: '',
        },
    },
    /*待房东确认*/
    2: {
        cancel: {
            text: '不同意出租',
            class: 'grey',
            action: 'cancel',
            dialog: {
                title: '',
                content: '未与租客达成签约意向，订金将退还给租客。',
                text1: '我再想想',
                text2: '无签约意向',
            },
            log: 'disaggrerent'
        },
        agreeRent: {
            text: '同意出租',
            class: 'orange',
            action: 'agreeRent',
            dialog: {
                title: '是否同意出租',
                content: '确认信息无误，同意将房屋出租给租客<span style="color:#FF552E;">#name#</span>,租客确认入住后订金会打给您冲抵租金。同意出租后即代表签署合同，不可取消，请谨慎选择!',
                text1: '我再想想',
                text2: '同意出租',
            },
            log: 'aggrerent',
        },
    },
    /*待确认入住*/
    3: {
        connect: {
            text: '联系租客',
            class: 'orange',
            action: 'connect',
            tel: '',
        },
    },
    /*申请退款中*/
    8: {
        disagreeRefund: {
            text: '拒绝退款',
            class: 'grey',
            action: 'disagreeRefund',
            dialog: {
                title: '',
                content: '拒绝退款后，租客可向58申请调解。您需要上传租客违约的证据，供58工作人员审核。确认拒绝退款吗？',
                text1: '我再想想',
                text2: '拒绝退款',
            },
            log: 'disaggrerefund',//埋点
        },
        agreeRefund: {
            text: '同意退款',
            class: 'orange',
            action: 'agreeRefund',
            dialog: {
                title: '',
                content: '同意退款后，订金将退还给租客。确认同意退款吗？',
                text1: '我再想想',
                text2: '同意退款',
            },
            log: 'aggrerefund',//埋点
        },
    },
    /*房东拒绝退款*/
    9: {
        connect: {
            text: '联系租客',
            class: 'orange',
            action: 'connect',
            tel: '',
        },
    },
    /*仲裁中*/
    11: {
        defendant: {
            text: '提交证据',
            class: 'orange',
            action: 'defendant',
            dialog: {
                title: '',
                content: '租客已申请调解，需要您上传证据证明租客违约。您只有一次上传证据的机会，确认提交证据吗？',
                text1: '我再想想',
                text2: '确认提交',
            },
            loadPage: {
                title: "",
                url: API.defendantShow.url,
            },
            log: 'submit evidence',//埋点
        },
    },
    /*交易关闭*/
    13: {},
    /*交易成功*/
    7: {
        withdraw: {
            text: '提取现金',
            class: 'orange',
            action: 'withdraw',
            log: 'withdrawal',//埋点
        }
    },
    /*提现失败14*/
    14: {
        withdraw: {
            text: '提取现金',
            class: 'orange',
            action: 'withdraw',
            log: 'withdrawal',//埋点
        }
    },
    /*已提现16*/
    16: {
        withdrawEnd: {
            text: '已提现',
            class: 'gray',
            action: 'withdrawEnd',
            toast: {
                content: '您已提现，请到微信零钱中查看!',
            },
            log: 'hadwithdrawal',
        }
    }
};
export default statusButtonEnum;