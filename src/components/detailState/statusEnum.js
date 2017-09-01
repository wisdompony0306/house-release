/**
 * Created by lunachi on 2017/8/23.
 */
const statusEnum = {
    1: {
        desc: '待付款',
        class: 'wait',
        dataTime: 'buyerPayDeadline',//租客支付截至时间,对应dataState传递的值
    },
    2: {
        desc: '待房东确认',
        class: 'wait',
        dataTime: 'sellerDeadline',//房东确认截至时间,对应dataState传递的值
    },
    3: {
        desc: '待确认入住',
        class: 'wait',
        dataTime: 'buyerDeadline',//租客确认截至时间,对应dataState传递的值
    },
    6: {
        desc: '提现中',
        class: 'wait',
    },
    7: {
        desc: '交易成功',
        class: 'complete',
    },
    8: {
        desc: '申请退款中',
        class: 'refund',
        dataTime: 'sellerRefundDeadline',//待房东确认是否退款的截至时间,对应dataState传递的值
    },
    9: {
        desc: '房东拒绝退款',
        class: 'rejectRefund',
        dataTime: 'buyerAppealDeadline',
    },
    10: {
        desc: '退款中',
        class: 'refund',
    },
    11: {
        desc: '调解中',
        class: 'arbitration',
        dataTime: 'sellerAppealDeadline',
    },
    13: {
        desc: '交易关闭',
        class: 'close',
    },
    14: {
        desc: '提现失败',
        class: 'close',
    },
    15: {
        desc: '退款失败',
        class: 'close',
    },
    16: {
        desc: '已提现',
        class: 'complete',
    },
};
export default statusEnum;
