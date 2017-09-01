/**
 * Created by lunachi on 2017/7/31.
 * 租客端订单详情操作按钮配置
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
                content: '取消后您可再次预定房源，但14天内最多预定3条。',
                text1: '我再想想',
                text2: '取消订单',
            },
            log: 'dfkcancle',//埋点
        },
        pay: {
            text: '微信付款',
            class: 'orange',
            action: 'pay',
            log: 'pay',//埋点
        },
    },
    /*待房东确认*/
    2: {
        cancel: {
            text: '取消订单',
            class: 'grey',
            action: 'cancel',
            dialog: {
                title: '',
                content: '取消后订金将于3个工作日内退还至支付账户。',
                text1: '我再想想',
                text2: '取消订单',
            },
            log: 'dfdqrcancle',//埋点
        },
    },
    /*待确认入住*/
    3: {
        refund: {
            text: '退款',
            class: 'grey',
            action: 'refund',
            dialog: {
                title: '是否退款',
                content: '申请退款后，若房东同意退款或在48小时内未操作，订金将退还至您的支付账户。确认申请退款吗？',
                text1: '我再想想',
                text2: '申请退款',
            },
            log: 'refund',//埋点
        },
        checkIn: {
            text: '确认入住',
            class: 'orange',
            action: 'checkIn',
            dialog: {
                title: '是否确认入住',
                content: '请确保和房东<span style="color:#FF552E;">#name#</span>签定租房合同并入住后再点击[确认入住]，点击后订金将直接打给房东并冲抵租金。确定已经入住吗？',
                text1: '我再想想',
                text2: '确认入住',
            },
            log: 'checkin',//埋点
        },
    },
    /*房东拒绝退款*/
    9: {
        arbitration: {
            text: '发起调解',
            class: 'orange',
            action: 'arbitration',
            dialog: {
                title: '是否发起调解',
                content: '申请调解后，您只有一次机会上传房东违约的证据，供58工作人员审核。确认申请调解吗？',
                text1: '我再想想',
                text2: '申请调解',
            },
            loadPage: {
                title: "",
                url: API.plaintiff.url,
            },
            log: 'arbitrate',//埋点
        },
    },
};
export default statusButtonEnum;