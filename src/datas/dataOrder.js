/**
 * Created by lunachi on 2017/7/31.
 * 订单数据模型
 */
const dataOrder = {
    //订单Id
    orderId: '',
    //租客付款流水号
    tradeNo: '',
    //打款给房东的流水号
    transferNo: '',
    //创建时间 yyyy-MM-dd HH:mm:ss
    createTime: '',
    //租客付款时间 yyyy-MM-dd HH:mm:ss
    payTime: '',
    //房东同意出租时间 yyyy-MM-dd HH:mm:ss
    agreeTime: '',
    //租客确认入住时间 yyyy-MM-dd HH:mm:ss
    checkinTime: '',
    //交易关闭时间 yyyy-MM-dd HH:mm:ss
    closeTime: '',
    //交易成功时间 yyyy-MM-dd HH:mm:ss
    successTime: '',
};
export default dataOrder;