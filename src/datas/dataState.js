/**
 * Created by lunachi on 2017/7/31.
 * 订单状态数据模型
 */
const dataState = {
    //订单状态
    status: '',
    //订单状态标题
    statusDes: '',
    //订单状态描述 #time#后未支付，订单将自动关闭。 其中#time#是截止时间占位符
    statusAct: '',
    //1 租客支付截至时间
    buyerPayDeadline: '',
    //2 房东确认截至时间
    sellerDeadline: '',
    //3 租客确认截至时间
    buyerDeadline: '',
    //8 待房东确认是否退款的截至时间
    sellerRefundDeadline: '',
    //9 房东拒绝退款截止时间
    buyerAppealDeadline: '',
    //11 调解截止时间
    sellerAppealDeadline: '',
    //服务器系统当前时间
    nowTime: '',
};
export default dataState;