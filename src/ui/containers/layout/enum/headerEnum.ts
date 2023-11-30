/**
 * desc: 顶部导航栏枚举
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/17
 * Time: 上午9:33
 */

/**
 * 业务工具枚举
 * @type {{id: number; title: string; content: string; iconUrl: string; url: string}[]}
 */
const uitlsOptions = [
    {
        id:4,
        title: "金宝贝启蒙APP",
        content:"下载“金宝贝启蒙APP”，获取丰富的线上课程，持续学习幼儿知识并和宝宝一起完成亲子游戏和互动交流。",
        iconUrl: "utils_4.png",
        url:"https://android.myapp.com/myapp/detail.htm?apkName=com.gymbo.enlighten&ADTAG=mobile"
    },
];
/**
 * 大搜索框枚举
 * @type {{手机号: string; 宝宝姓名: string; 联系人: string}}
 */
const TYPE = {
    '手机号': 'phoneNumber',
    '宝宝姓名': 'babyName',
    '联系人': 'contactName',
};

export {uitlsOptions, TYPE}
