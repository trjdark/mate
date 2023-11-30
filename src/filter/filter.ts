/**
 * desc: 过滤器
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/12
 * Time: 下午2:03
 */

class Filter {
    /**
     * 出现方式过滤
     */
    static formatAppearanceType(type:string){
        const map = new Map([
            ['02001', 'net-in'],
            ['02002', 'call-in'],
            ['02003', 'walk-in'],
            ['02004', 'call-out'],
            ['default', '未知']
        ]);
        return map.get(type) ? map.get(type): map.get('default');
    }

    /**
     * 渠道来源格式化
     * @param {string} type
     */
    static formatChannelType(type:string){
        const map = new Map([
            ['72001', '地推'],
            ['72002', '小区活动'],
            ['72003', '网络推广'],
            ['72004', '户外广告'],
            ['72005', '市场合作'],
            ['72006', '会员推荐'],
            ['72007', '口碑介绍'],
            ['72008', '其他'],
            ['72009', '路演/巡展'],
            ['72010', '非会员推荐'],
            ['72011', '官网'],
            ['72012', '总部微信订阅号'],
            ['72013', '总部微信服务号'],
            ['72014', '中心微信'],
            ['72015', 'Online广告'],
            ['72016', 'Gymboclub'],
            ['72017', '大众点评'],
            ['72018', '口碑APP'],
            ['72019', '糯米'],
            ['72020', '美团'],
            ['72021', '微课堂'],
            ['72022', '社交推广'],
            ['72023', '百度品专'],
            ['72024', '微信小程序'],
            ['72025', '百度SEM'],
            ['72026', 'H5平台'],
            ['72027', '天猫'],
            ['72028', '京东'],
            ['72029', '金宝贝启蒙'],
            ["72030", "金宝推推"],
            ["72031", "金宝贝启蒙服务号"],
            ["72032", "推推家长小程序"],
            ["72033", "启蒙公众号"],
            ["72034", "C位萌主"],
            ["72035", "数据挖掘"],
            ["72036", "全国总部市场活动"],
            ['default', '未知']
        ]);
        return map.get(type) ? map.get(type): map.get('default');
    }
    /**
     * 通话类型
     * @param {string} type
     */
    static formatTalkType(type:string){
        const map = new Map([
            ['94001', '空号'],
            ['94002', '未接通'],
            ['94003', '已接通'],
            ['94004', '客户挂断'],
            ['default', '未知'],
        ]);
        return map.get(type) ? map.get(type): map.get('default');
    }

    /**
     * 任务类型
     * @param {string} type
     * @returns {string | undefined}
     */
    static formatTaskStatus(type:string){
        const map = new Map([
            ["95001", "拒绝-没有需求"],
            ["95002", "拒绝-已报其他品牌"],
            ["95003", "拒绝-孩子太小"],
            ["95004", "拒绝-不在所属区域"],
            ["95005", "未诺访，待跟进"],
            ["95006", "错/空号"],
            ["95007", "联系未果-停机"],
            ["95008", "联系未果-无人接听"],
            ["95009", "其他"],
            ["96001", "参观"],
            ["96002", "试听"],
            ["96003", "活动"],
            ["96004", "测评"],
            ["97001", "已试听"],
            ["97002", "定金"],
            ['98001', '接通再跟进-在忙'],
            ['98002', '接通再跟进-挂起'],
            ['98003', '接通无效-客户拒绝'],
            ['98004', '接通无效-不符合目标客户'],
            ['98005', '接通无效--已选择其他品牌'],
            ['98006', '接通无效--不在所属区域'],
            ['98007', '接通无效--虚假信息'],
            ['98008', '接通无效--其他'],
            ['98101', '接通有效-诺访-参观'],
            ['98102', '接通有效-诺访-试听'],
            ['98103', '接通有效-诺访-活动'],
            ['98104', '接通有效-诺访-测评'],
            ['98201', '接通有效-到访-已试听'],
            ['98202', '接通有效-到访-定金'],
            ['99001', '未接通-未接通再利用'],
            ['99002', '未接通-未接通无效'],
            ['99003', '未接通-空号'],
            ['default', '-'],
        ]);
        return map.get(type) ? map.get(type): map.get('default');
    }

    /**
     * 阶段格式化
     * @param {string} type
     * @returns {string | undefined}
     */
    static formatTmkPhaseType(type:string){
        const map = new Map([
            ["4", "已联络"],
            ["5", "诺访"],
            ["6", "已到访"],
            ['default', '-'],
        ]);
        return map.get(type) ? map.get(type): map.get('default');
    }

    /**
     * 测评报告列表归属阶段格式化
     * @param {string} type
     * @returns {string | undefined}
     */
    static formatReportPhase(type:string){
        const map = new Map([
            ["0","回收站"],
            ["1","待分配"],
            ["2", "已分配"],
            ["3", "已领取"],
            ["4", "已联络"],
            ["5", "诺访"],
            ["6", "已到访"],
            ["7", "新会员"],
            ["8", "老会员"],
            ["10", "历史会员"],
        ]);
        return map.get(type) ? map.get(type) : map.get('default');
    }

    /**
     * leads意向度格式化
     * @param {string} type
     * @returns {string | undefined}
     */
    static formatIntentionLevel(type:string){
        const map = new Map([
                                ["73001","A 高"],
                                ["73002","B"],
                                ["73003", "C"],
                                ["73004", "D 低"],
                            ]);
        return map.get(type) ? map.get(type) : map.get('default');
    }
}

export {Filter}
