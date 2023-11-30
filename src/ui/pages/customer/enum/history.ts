/*
LEADSLOSE("leadsLose","leads流失"),
    LEADSTRANSFER("leadsTransfer","leads转移"),
    LONGTIMEUNCONTACT("longTimeUncontact","长期未联系回收"),
    LONGTIMEUNSIGN("longTimeUnsign","长期未签约回收"),
    UNRECEIVE("unreceive","待领取回收"),
    MEMBERTRANSFER("memberTransfer","会员转移"),
    HISTORYMEMBER("historyMember","课程包结束"),
    UNCONTACT("uncontact","未联系回收"),
    RECYCLE("recycle","手动回收站")
*/

const historyStatus = {
    'loss': 'leadsLose',
    'transfer': 'leadsTransfer',
    'disContact': 'longTimeUncontact',
    'unSign': 'longTimeUnsign',
    'unReceive': 'unreceive',
    'customerTransfer': 'memberTransfer',
    'courseClose': 'historyMember',
    'unContact': 'uncontact',
    'recycle': 'recycle'
};
export {historyStatus};


export  enum transferSort {
    ascend='asc',
    descend='desc',
    asc='ascend',
    desc='descend'
}
