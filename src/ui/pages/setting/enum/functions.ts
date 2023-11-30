const functions = [
    {
        "ID": "FUNC02000000",
        "FUNCTION_NAME": "权限",
        "PARENT_ID": "0",
        "IS_SHOWED": "1"
    },
    // 设置权限
    {
        "ID": "FUNC02010000",
        "FUNCTION_NAME": "设置",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02010100",
            "FUNCTION_NAME": "用户管理",
            "PARENT_ID": "FUNC02010000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02010101",
                "FUNCTION_NAME": "默认角色设置",
                "PARENT_ID": "FUNC02010100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010102",
                "FUNCTION_NAME": "特殊角色设置",
                "PARENT_ID": "FUNC02010100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010103",
                "FUNCTION_NAME": "账号设置",
                "PARENT_ID": "FUNC02010100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010104",
                "FUNCTION_NAME": "账号变更审批",
                "PARENT_ID": "FUNC02010100",
                "IS_SHOWED": "1"
            },{
                "ID": "FUNC02010105",
                "FUNCTION_NAME": "自定义角色设置",
                "PARENT_ID": "FUNC02010100",
                "IS_SHOWED": "1"
            },{
                "ID": "FUNC02010106",
                "FUNCTION_NAME": "员工账号列表",
                "PARENT_ID": "FUNC02010100",
                "IS_SHOWED": "1"
            },{
                "ID": "FUNC02010107",
                "FUNCTION_NAME": "账号绑定",
                "PARENT_ID": "FUNC02010100",
                "IS_SHOWED": "2"
            },
        {
            "ID": "FUNC02010200",
            "FUNCTION_NAME": "运营管理",
            "PARENT_ID": "FUNC02010000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02010201",
                "FUNCTION_NAME": "总部课程包设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010202",
                "FUNCTION_NAME": "中心课程包设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010203",
                "FUNCTION_NAME": "中心管理",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010204",
                "FUNCTION_NAME": "节假日设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010205",
                "FUNCTION_NAME": "教室设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010206",
                "FUNCTION_NAME": "PR产品设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010207",
                "FUNCTION_NAME": "课程分类设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010208",
                "FUNCTION_NAME": "Promotor设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010209",
                "FUNCTION_NAME": "课程资料设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010210",
                "FUNCTION_NAME": "销售指标设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010211",
                "FUNCTION_NAME": "Net-in Leads设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010212",
                "FUNCTION_NAME": "激活码管理",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010213",
                "FUNCTION_NAME": "TMK呼叫中心设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010214",
                "FUNCTION_NAME": "约课指标设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010215",
                "FUNCTION_NAME": "试点中心设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02010216",
                "FUNCTION_NAME": "非活跃会员不提醒设置",
                "PARENT_ID": "FUNC02010200",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02010300",
            "FUNCTION_NAME": "电子合同管理",
            "PARENT_ID": "FUNC02010000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02010301",
                "FUNCTION_NAME": "电子合同用印设置",
                "PARENT_ID": "FUNC02010300",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02010400",
            "FUNCTION_NAME": "岗位转角色（非业务使用）",
            "PARENT_ID": "FUNC02010000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02010500",
            "FUNCTION_NAME": "财务管理",
            "PARENT_ID": "FUNC02010000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02010501",
                "FUNCTION_NAME": "中心费率设置",
                "PARENT_ID": "FUNC02010500",
                "IS_SHOWED": "1"
            },
    // 客户权限
    {
        "ID": "FUNC02020000",
        "FUNCTION_NAME": "客户",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02020100",
        "FUNCTION_NAME": "新建Leads",
        "PARENT_ID": "FUNC02020000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02020200",
        "FUNCTION_NAME": "批量导入Leads",
        "PARENT_ID": "FUNC02020000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02020300",
        "FUNCTION_NAME": "客户中心",
        "PARENT_ID": "FUNC02020000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02020301",
            "FUNCTION_NAME": "查看",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020302",
            "FUNCTION_NAME": "leads转中心",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020303",
            "FUNCTION_NAME": "分配给GB",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020304",
            "FUNCTION_NAME": "分配给GA",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020305",
            "FUNCTION_NAME": "领取",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020306",
            "FUNCTION_NAME": "交还主管",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020307",
            "FUNCTION_NAME": "加入回收站",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020308",
            "FUNCTION_NAME": "转移至待分配",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020309",
            "FUNCTION_NAME": "编辑leads信息",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020310",
            "FUNCTION_NAME": "转至TMK跟进",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02020311",
            "FUNCTION_NAME": "批量外呼",
            "PARENT_ID": "FUNC02020300",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02020301",
                "FUNCTION_NAME": "查看",
                "FUNCTION_DESC": "查看",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020302",
                "FUNCTION_NAME": "leads转中心",
                "FUNCTION_DESC": "leads转中心",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020303",
                "FUNCTION_NAME": "分配给GB",
                "FUNCTION_DESC": "分配给GB",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020304",
                "FUNCTION_NAME": "分配给GA",
                "FUNCTION_DESC": "分配给GA",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020305",
                "FUNCTION_NAME": "领取",
                "FUNCTION_DESC": "领取",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020306",
                "FUNCTION_NAME": "交还主管",
                "FUNCTION_DESC": "交还主管",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020307",
                "FUNCTION_NAME": "加入回收站",
                "FUNCTION_DESC": "加入回收站",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020308",
                "FUNCTION_NAME": "转移至待分配",
                "FUNCTION_DESC": "转移至待分配",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020309",
                "FUNCTION_NAME": "编辑leads信息",
                "FUNCTION_DESC": "编辑leads信息",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020310",
                "FUNCTION_NAME": "转至TMK跟进",
                "FUNCTION_DESC": "转至TMK跟进",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02020311",
                "FUNCTION_NAME": "批量外呼",
                "FUNCTION_DESC": "批量外呼",
                "PARENT_ID": "FUNC02020300",
                "IS_SHOWED": "1"
            },
    {
        "ID": "FUNC02020400",
        "FUNCTION_NAME": "转中心记录",
        "PARENT_ID": "FUNC02020000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02020500",
        "FUNCTION_NAME": "跨中心Leads查询",
        "PARENT_ID": "FUNC02020000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02020600",
        "FUNCTION_NAME": "客户查询（新）",
        "PARENT_ID": "FUNC02020000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02020700",
        "FUNCTION_NAME": "电话录音",
        "PARENT_ID": "FUNC02020000",
        "IS_SHOWED": "1"
    },
    // 工作台（任务）权限
    {
        "ID": "FUNC02030000",
        "FUNCTION_NAME": "任务",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
    // 活动权限
    {
        "ID": "FUNC02040000",
        "FUNCTION_NAME": "活动",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
    // 市场权限
    {
        "ID": "FUNC02050000",
        "FUNCTION_NAME": "市场渠道",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02050100",
        "FUNCTION_NAME": "新建市场渠道",
        "PARENT_ID": "FUNC02050000",
        "IS_SHOWED": "1"
    },
    {
        "ID": "FUNC02050200",
        "FUNCTION_NAME": "渠道管理",
        "PARENT_ID": "FUNC02050000",
        "IS_SHOWED": "1"
    },
    // 仪表盘权限
    {
        "ID": "FUNC02060000",
        "FUNCTION_NAME": "工作台",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02060100",
            "FUNCTION_NAME": "CD工作台",
            "PARENT_ID": "FUNC02060000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02060200",
            "FUNCTION_NAME": "HGA工作台",
            "PARENT_ID": "FUNC02060000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02060300",
            "FUNCTION_NAME": "GB个人工作台",
            "PARENT_ID": "FUNC02060000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02060400",
            "FUNCTION_NAME": "GA个人工作台",
            "PARENT_ID": "FUNC02060000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02060500",
            "FUNCTION_NAME": "预警日志",
            "PARENT_ID": "FUNC02060000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02060600",
            "FUNCTION_NAME": "GA工作台",
            "PARENT_ID": "FUNC02060000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02060700",
            "FUNCTION_NAME": "GB工作台",
            "PARENT_ID": "FUNC02060000",
            "IS_SHOWED": "1"
        },
    // 合同权限
    {
        "ID": "FUNC02070000",
        "FUNCTION_NAME": "合同",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02070100",
            "FUNCTION_NAME": "合同管理",
            "PARENT_ID": "FUNC02070000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02070101",
                "FUNCTION_NAME": "合同列表",
                "PARENT_ID": "FUNC02070100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070102",
                "FUNCTION_NAME": "线上订单交易明细",
                "PARENT_ID": "FUNC02070100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070103",
                "FUNCTION_NAME": "申请合同调整",
                "PARENT_ID": "FUNC02070100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070104",
                "FUNCTION_NAME": "部分退费-中心财务审批",
                "PARENT_ID": "FUNC02070100",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02070200",
            "FUNCTION_NAME": "收付款",
            "PARENT_ID": "FUNC02070000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02070201",
                "FUNCTION_NAME": "收款管理",
                "PARENT_ID": "FUNC02070200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070202",
                "FUNCTION_NAME": "付款管理",
                "PARENT_ID": "FUNC02070200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070203",
                "FUNCTION_NAME": "新建合同退回",
                "PARENT_ID": "FUNC02070200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070204",
                "FUNCTION_NAME": "改包退回",
                "PARENT_ID": "FUNC02070200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070205",
                "FUNCTION_NAME": "退费退回",
                "PARENT_ID": "FUNC02070200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070206",
                "FUNCTION_NAME": "转中心付款退回",
                "PARENT_ID": "FUNC02070200",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02070300",
            "FUNCTION_NAME": "合同操作",
            "PARENT_ID": "FUNC02070000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02070301",
                "FUNCTION_NAME": "过期合同收入确认",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070302",
                "FUNCTION_NAME": "转中心申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070303",
                "FUNCTION_NAME": "退课申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070304",
                "FUNCTION_NAME": "改包申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070305",
                "FUNCTION_NAME": "合同延期申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070306",
                "FUNCTION_NAME": "请假次数修改申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070307",
                "FUNCTION_NAME": "赠课申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070308",
                "FUNCTION_NAME": "合同调整申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070309",
                "FUNCTION_NAME": "中心财务审批",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070310",
                "FUNCTION_NAME": "赠课审批",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02070311",
                "FUNCTION_NAME": "部分退费申请",
                "PARENT_ID": "FUNC02070300",
                "IS_SHOWED": "1"
            },
    // 教学权限
    {
        "ID": "FUNC02080000",
        "FUNCTION_NAME": "教学",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02080100",
            "FUNCTION_NAME": "课程表",
            "PARENT_ID": "FUNC02080000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02080101",
                "FUNCTION_NAME": "固定排课",
                "PARENT_ID": "FUNC02080100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080102",
                "FUNCTION_NAME": "临时排课",
                "PARENT_ID": "FUNC02080100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080103",
                "FUNCTION_NAME": "上课签到",
                "PARENT_ID": "FUNC02080100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080104",
                "FUNCTION_NAME": "随堂反馈(Art)",
                "PARENT_ID": "FUNC02080100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080105",
                "FUNCTION_NAME": "随堂反馈2.0",
                "PARENT_ID": "FUNC02080100",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02080200",
            "FUNCTION_NAME": "申请管理",
            "PARENT_ID": "FUNC02080000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02080201",
                "FUNCTION_NAME": "试听申请",
                "PARENT_ID": "FUNC02080200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080202",
                "FUNCTION_NAME": "请假申请",
                "PARENT_ID": "FUNC02080200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080203",
                "FUNCTION_NAME": "GYM Guard",
                "PARENT_ID": "FUNC02080200",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02080300",
            "FUNCTION_NAME": "随堂反馈",
            "PARENT_ID": "FUNC02080000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02080301",
                "FUNCTION_NAME": "RRP配置管理",
                "PARENT_ID": "FUNC02080300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080302",
                "FUNCTION_NAME": "随堂反馈管理(Art)",
                "PARENT_ID": "FUNC02080300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080304",
                "FUNCTION_NAME": "随堂反馈管理2.0",
                "PARENT_ID": "FUNC02080300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080303",
                "FUNCTION_NAME": "随堂反馈数据统计",
                "PARENT_ID": "FUNC02080300",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02080400",
            "FUNCTION_NAME": "教学管理",
            "PARENT_ID": "FUNC02080000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02080401",
                "FUNCTION_NAME": "点评库设置(Art)",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080406",
                "FUNCTION_NAME": "点评库设置2.0",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080402",
                "FUNCTION_NAME": "课程主题设置(Art)",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080407",
                "FUNCTION_NAME": "课程主题设置2.0",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080403",
                "FUNCTION_NAME": "系统消息推送",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080404",
                "FUNCTION_NAME": "到访测评",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080405",
                "FUNCTION_NAME": "到访测评设置",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080408",
                "FUNCTION_NAME": "月度回顾管理",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080409",
                "FUNCTION_NAME": "八大领域管理设置",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080410",
                "FUNCTION_NAME": "R店主题设置",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080411",
                "FUNCTION_NAME": "R店主题资源库",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02080412",
                "FUNCTION_NAME": "app课程展示-列表",
                "PARENT_ID": "FUNC02080400",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02080500",
            "FUNCTION_NAME": "删课",
            "PARENT_ID": "FUNC02000000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02080600",
            "FUNCTION_NAME": "升班报告",
            "PARENT_ID": "FUNC02080400",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02080700",
            "FUNCTION_NAME": "试听课删课",
            "PARENT_ID": "FUNC02000000",
            "IS_SHOWED": "1"
        },
    // 绩效中心（报表）权限
    {
        "ID": "FUNC02090000",
        "FUNCTION_NAME": "绩效中心",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02090100",
            "FUNCTION_NAME": "业绩类报表",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090101",
                "FUNCTION_NAME": "中心业绩",
                "PARENT_ID": "FUNC02090100",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090102",
                "FUNCTION_NAME": "合同到期提醒",
                "PARENT_ID": "FUNC02090100",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02090200",
            "FUNCTION_NAME": "市场类报表",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090201",
                "FUNCTION_NAME": "渠道业绩(销售向)",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090202",
                "FUNCTION_NAME": "渠道业绩",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090203",
                "FUNCTION_NAME": "渠道+出现方式业绩(销售向)",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090204",
                "FUNCTION_NAME": "渠道+出现方式业绩",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090205",
                "FUNCTION_NAME": "市场名单明细（销售向）",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090206",
                "FUNCTION_NAME": "市场名单明细",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090207",
                "FUNCTION_NAME": "到访表",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },{
                "ID": "FUNC02090208",
                "FUNCTION_NAME": "市场名单明细（销售向）多中心导出",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },{
                "ID": "FUNC02090209",
                "FUNCTION_NAME": "市场名单明细多中心导出",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },{
                "ID": "FUNC02090210",
                "FUNCTION_NAME": "到访表多中心导出",
                "PARENT_ID": "FUNC02090200",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02090300",
            "FUNCTION_NAME": "服务类报表",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090301",
                "FUNCTION_NAME": "耗课统计-GB",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090302",
                "FUNCTION_NAME": "耗课统计-GA",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090303",
                "FUNCTION_NAME": "耗课统计-INS",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090304",
                "FUNCTION_NAME": "出席报告",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090305",
                "FUNCTION_NAME": "会员连续未到提醒",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090306",
                "FUNCTION_NAME": "即将升班宝宝明细",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090307",
                "FUNCTION_NAME": "会员排课耗课统计",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090308",
                "FUNCTION_NAME": "任务跟进记录",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090309",
                "FUNCTION_NAME": "特殊操作日志记录",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090310",
                "FUNCTION_NAME": "特殊操作日志记录-导出",
                "PARENT_ID": "FUNC02090300",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02090400",
            "FUNCTION_NAME": "财务类报表",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090401",
                "FUNCTION_NAME": "中心收入统计",
                "PARENT_ID": "FUNC02090400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090402",
                "FUNCTION_NAME": "日常业绩统计",
                "PARENT_ID": "FUNC02090400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090403",
                "FUNCTION_NAME": "消耗负债(按合同)",
                "PARENT_ID": "FUNC02090400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090404",
                "FUNCTION_NAME": "未消耗负债查询",
                "PARENT_ID": "FUNC02090400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090405",
                "FUNCTION_NAME": "期初数据对照",
                "PARENT_ID": "FUNC02090400",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090406",
                "FUNCTION_NAME": "收付款明细",
                "PARENT_ID": "FUNC02090400",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02090500",
            "FUNCTION_NAME": "中心订货额度",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090501",
                "FUNCTION_NAME": "订货额度",
                "PARENT_ID": "FUNC02090500",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090502",
                "FUNCTION_NAME": "对账单",
                "PARENT_ID": "FUNC02090500",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090503",
                "FUNCTION_NAME": "月度AR账单",
                "PARENT_ID": "FUNC02090500",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02090600",
            "FUNCTION_NAME": "中心综合评价",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090601",
                "FUNCTION_NAME": "星级评分",
                "PARENT_ID": "FUNC02090600",
                "IS_SHOWED": "1"
            },
        // 大服务报表
        {
            "ID": "FUNC02090700",
            "FUNCTION_NAME": "大服务报表",
            "PARENT_ID": "FUNC02090700",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090701",
                "FUNCTION_NAME": "排课耗课统计",
                "PARENT_ID": "FUNC02090701",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090702",
                "FUNCTION_NAME": "请假明细",
                "PARENT_ID": "FUNC02090702",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090703",
                "FUNCTION_NAME": "出席会员上课明细",
                "PARENT_ID": "FUNC02090703",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090704",
                "FUNCTION_NAME": "活动耗课统计/明细",
                "PARENT_ID": "FUNC02090704",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090705",
                "FUNCTION_NAME": "换/删课明细",
                "PARENT_ID": "FUNC02090705",
                "IS_SHOWED": "1"
            },
        // 其他报表
        {
            "ID": "FUNC02090800",
            "FUNCTION_NAME": "其他",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
            {
                "ID": "FUNC02090801",
                "FUNCTION_NAME": "多中心导出下载",
                "PARENT_ID": "FUNC02090800",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090802",
                "FUNCTION_NAME": "多中心导出查看",
                "PARENT_ID": "FUNC02090800",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090803",
                "FUNCTION_NAME": "查看报表导出审批进度",
                "PARENT_ID": "FUNC02090800",
                "IS_SHOWED": "1"
            },
            {
                "ID": "FUNC02090804",
                "FUNCTION_NAME": "审批报表导出申请",
                "PARENT_ID": "FUNC02090800",
                "IS_SHOWED": "1"
            },
        {
            "ID": "FUNC02090900",
            "FUNCTION_NAME": "政策管理(查看)",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02091000",
            "FUNCTION_NAME": "政策管理(编辑)",
            "PARENT_ID": "FUNC02090000",
            "IS_SHOWED": "1"
        },

    // 云语音
    {
        "ID": "FUNC02100000",
        "FUNCTION_NAME": "云语音",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02100100",
            "FUNCTION_NAME": "坐席分配",
            "PARENT_ID": "FUNC02100000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100200",
            "FUNCTION_NAME": "外呼明细",
            "PARENT_ID": "FUNC02100000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100300",
            "FUNCTION_NAME": "外呼统计(按坐席)",
            "PARENT_ID": "FUNC02100000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100400",
            "FUNCTION_NAME": "外呼统计(按坐席组)",
            "PARENT_ID": "FUNC02100000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100500",
            "FUNCTION_NAME": "账户余额",
            "PARENT_ID": "FUNC02100000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100600",
            "FUNCTION_NAME": "呼入明细",
            "PARENT_ID": "FUNC02100000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100700",
            "FUNCTION_NAME": "TMK转入Leads明细",
            "PARENT_ID": "FUNC02100000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100800",
            "FUNCTION_NAME": "市场名单明细(仅TMK)",
            "PARENT_ID": "FUNC02100800",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02100900",
            "FUNCTION_NAME": "任务跟进明细(含云语音)",
            "PARENT_ID": "FUNC02100900",
            "IS_SHOWED": "1"
        },
    // 多中心报表
    {
        "ID": "FUNC02110000",
        "FUNCTION_NAME": "多中心报表",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02110100",
            "FUNCTION_NAME": "耗课统计表",
            "PARENT_ID": "FUNC02110000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02110200",
            "FUNCTION_NAME": "工作量统计表",
            "PARENT_ID": "FUNC02110000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02110300",
            "FUNCTION_NAME": "后端产出跟进表",
            "PARENT_ID": "FUNC02110000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02110400",
            "FUNCTION_NAME": "市场销售跟进表",
            "PARENT_ID": "FUNC02110000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02110500",
            "FUNCTION_NAME": "市场销售统计表",
            "PARENT_ID": "FUNC02110000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02110600",
            "FUNCTION_NAME": "一键BR导出",
            "PARENT_ID": "FUNC02110000",
            "IS_SHOWED": "1"
        },
    {
        "ID": "FUNC02120000",
        "FUNCTION_NAME": "合同调整",
        "PARENT_ID": "FUNC02000000",
        "IS_SHOWED": "1"
    },
        {
            "ID": "FUNC02120100",
            "FUNCTION_NAME": "POP合同调整审批",
            "PARENT_ID": "FUNC02120000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02120200",
            "FUNCTION_NAME": "研发合同调整审批",
            "PARENT_ID": "FUNC02120000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02120300",
            "FUNCTION_NAME": "总部财务审批",
            "PARENT_ID": "FUNC02120000",
            "IS_SHOWED": "1"
        },
        {
            "ID": "FUNC02120400",
            "FUNCTION_NAME": "部分退费-总部财务审批",
            "PARENT_ID": "FUNC02120000",
            "IS_SHOWED": "1"
        },
];

const FUNC={};
functions.map(func=>{
    FUNC[`${func.FUNCTION_NAME}`] = func.ID;
});
export {FUNC};
