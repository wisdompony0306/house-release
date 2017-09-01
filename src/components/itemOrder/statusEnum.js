const statusEnum = {
    1: {
        desc: '待付款',
        class: 'wait',
    },
    2: {
        desc: '待房东确认',
        class: 'wait'
    },
    3: {
        desc: '待确认入住',
        class: 'wait'
    },
    4: {
        desc: '租客已确认',
        class: 'complete'
    },
    5: {
        desc: '取消订单',
        class: 'close'
    },
    6: {
        desc: '提现中',
        class: 'wait',
    },
    7: {
        desc: '交易成功',
        class: 'complete'
    },
    8: {
        desc: '申请退款中',
        class: 'wait'
    },
    9: {
        desc: '房东拒绝退款',
        class: 'wait'
    },
    10: {
        desc: '退款中',
        class: 'wait'
    },
    11: {
        desc: '调解中',
        class: 'wait'
    },
    12: {
        desc: '',
        class: 'wait'
    },
    13: {
        desc: '交易关闭',
        class: 'close',
    },
    14: {
        desc: '提现失败',
        class: 'wait'
    },
    15: {
        desc: '退款失败',
        class: 'wait'
    },
    16: {
        desc: '已提现',
        class: 'close',
    }
};
export default statusEnum;
