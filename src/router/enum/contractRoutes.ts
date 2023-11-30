/**
 * desc: 合同路由
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/10/31
 * Time: 下午7:01c
 */
import {OnlineContractList} from "@/ui/pages/contract/online";
import {Contract} from "../../ui/pages/contract/index";
import {ContractAction} from "../../ui/pages/contract/operation/index";
//列表页面
import {ContractActionListCenter} from "../../ui/pages/contract/operation/contractActionListCenter";
import {ContractActionListDelay} from "../../ui/pages/contract/operation/contractActionListDelay";
import {ContractActionListFree} from "../../ui/pages/contract/operation/contractActionListFree";
import {ContractActionListLeave} from "../../ui/pages/contract/operation/contractActionListLeave";
import {ContractActionListOut} from "../../ui/pages/contract/operation/contractActionListOut";
import {ContractActionListOverdue} from "../../ui/pages/contract/operation/contractActionListOverdue";
import {ContractActionListPkg} from "../../ui/pages/contract/operation/contractActionListPkg";
import {ContractActionListSpecial} from "@/ui/pages/contract/operation/contractActionListSpecial";
import {ContractActionListPartRefund} from "@/ui/pages/contract/operation/contractActionListPartRefund";
//详情操作页面
import {ContractActionDetailCenter} from "../../ui/pages/contract/operation/contractActionDetail/contractActionDetailCenter";
import {ContractActionDetailDelay} from "../../ui/pages/contract/operation/contractActionDetail/contractActionDetailDelay";
import {ContractActionDetailFree} from "../../ui/pages/contract/operation/contractActionDetail/contractActionDetailFree";
import {ContractActionDetailLeave} from "../../ui/pages/contract/operation/contractActionDetail/contractActionDetailLeave";
import {ContractActionDetailOut} from "../../ui/pages/contract/operation/contractActionDetail/contractActionDetailOut";
import {ContractActionDetailPkg} from "../../ui/pages/contract/operation/contractActionDetail/contractActionDetailPkg";
import {ContractActionReceiveContract} from "../../ui/pages/contract/payOrReceive/receiveContract";
import {ContractActionReceiveOther} from "../../ui/pages/contract/payOrReceive/receiveOther";
import {ContractActionReceiveTransfer} from "../../ui/pages/contract/payOrReceive/receiveTransfer";
import {ContractActionReceivePackage} from "../../ui/pages/contract/payOrReceive/receivePackage";
import {ContractActionPayContract} from "../../ui/pages/contract/payOrReceive/payContract";
import {ContractActionPayOther} from "../../ui/pages/contract/payOrReceive/payOther";
import {ContractActionPayTransfer} from "../../ui/pages/contract/payOrReceive/payTransfer";
import {ContractActionPayPackage} from "../../ui/pages/contract/payOrReceive/payPackage";
import {ReceiveAddApplication} from "../../ui/pages/contract/payOrReceive/receiveAdd";
import {PayAddApplication} from "../../ui/pages/contract/payOrReceive/payAdd";
import {ContractConfirm} from "../../ui/pages/contract/payOrReceive/contractConfirm";
import {OthersConfirm} from "../../ui/pages/contract/payOrReceive/othersConfirm";
import {PackageConfirm} from "../../ui/pages/contract/payOrReceive/packageConfirm";
import {CenterConfirm} from "../../ui/pages/contract/payOrReceive/centerConfirm";
import {ContractInfo} from "../../ui/pages/contract/management/contractInfo";
import {ContractManagementList} from "../../ui/pages/contract/management/contractManagementList";
import {AddContract} from "../../ui/pages/contract/management/addContract";
import {EditContract} from "../../ui/pages/contract/management/editContract";
import {Approval} from "../../ui/pages/contract/management/approval";
import {CreateApplyLeave} from "../../ui/pages/contract/management/createApplyLeave";
import {CreateChangePackage} from "../../ui/pages/contract/management/createChangePackage";
import {CreateGiveClass} from "../../ui/pages/contract/management/createGiveClass";
import {CreateDelay} from "../../ui/pages/contract/management/createDelay";
import {CreateCancelClass} from "../../ui/pages/contract/management/createCancelClass";
import {CreateChangeCenter} from "../../ui/pages/contract/management/createChangeCenter";
import {CreateRevision} from "@/ui/pages/contract/management/createRevision";
import {requirePermission} from './routeFuncIdMap';
import {ContractActionDetailSpecial} from "@/ui/pages/contract/operation/contractActionDetail/contractActionDetailSpecial";
import {ContractActionDetailPartRefund} from "@/ui/pages/contract/operation/contractActionDetail/contractActionDetailPartRefund";
import {CreatePartRefund} from "@/ui/pages/contract/management/createPartRefund";
import {PayManageList} from "@/ui/pages/contract/payOrReceive/payList";
import {ReceiveManageList} from "@/ui/pages/contract/payOrReceive/receiveList";
import {PartRefundConfirm} from "@/ui/pages/contract/payOrReceive/partRefundConfirm";

class ContractRoutes {
    static 合同 = {
        path: '/contract',
        component: Contract,
        authority: requirePermission('合同'),
    };
    static 新建合同 = {
        path: '/contract/add/:params',
        link:'/contract/add/',
        component: AddContract,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 修改合同 = {
        path: '/contract/edit/:params',
        link:'/contract/edit/',
        component: EditContract,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 合同管理列表 = {
        path: '/contract/contractManagement/contractManagementList',
        component: ContractManagementList,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 审批合同 = {
        path: '/contract/contractManagement/approval/:params',
        link: '/contract/contractManagement/approval/',
        component: Approval,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 合同详情 = {
        path: '/contract/contractInfo/:params',
        link:'/contract/contractInfo/',
        component: ContractInfo,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 申请请假 = {
        path: '/contract/contractManagement/applyLeave/:params',
        link: '/contract/contractManagement/applyLeave/',
        component: CreateApplyLeave,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 申请改课程包 = {
        path: '/contract/contractManagement/changePkg/:params',
        link: '/contract/contractManagement/changePkg/',
        component: CreateChangePackage,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 申请赠课 = {
        path: '/contract/contractManagement/giveClass/:params',
        link: '/contract/contractManagement/giveClass/',
        component: CreateGiveClass,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 申请延期 = {
        path: '/contract/contractManagement/delay/:params',
        link: '/contract/contractManagement/delay/',
        component: CreateDelay,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 申请退课 = {
        path: '/contract/contractManagement/cancel/:params',
        link: '/contract/contractManagement/cancel/',
        component: CreateCancelClass,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 申请转中心 = {
        path: '/contract/contractManagement/changeCenter/:params',
        link: '/contract/contractManagement/changeCenter/',
        component: CreateChangeCenter,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    // Todo
    static 申请合同调整 = {
        path: '/contract/contractManagement/revision/:params',
        link: '/contract/contractManagement/revision/',
        component: CreateRevision,
        authority: requirePermission('合同列表'),
        redirectPath: ''
    };
    static 申请部分退费 = {
        path: '/contract/contractManagement/partRefund/:params',
        link: '/contract/contractManagement/partRefund/',
        component: CreatePartRefund,
        authority: true,
        redirectPath: ''
    };
    static 合同操作 = {
        path: '/contract/contractAction',
        component: ContractAction,
        authority: requirePermission('合同操作'),
        redirectPath: ''
    };
    static 合同操作列表转中心 = {
        path: '/contract/contractAction/contractActionList/center',
        component: ContractActionListCenter,
        authority: requirePermission('转中心申请'),
        redirectPath: ''
    };
    static 合同操作列表过期确认收入 = {
        path: '/contract/contractAction/contractActionList/overdue',
        component: ContractActionListOverdue,
        authority: requirePermission('过期合同收入确认'),
        redirectPath: ''
    };
    static 合同操作列表延期 = {
        path: '/contract/contractAction/contractActionList/delay',
        component: ContractActionListDelay,
        authority: requirePermission('合同延期申请'),
        redirectPath: ''
    };
    static 合同操作列表退课 = {
        path: '/contract/contractAction/contractActionList/out',
        component: ContractActionListOut,
        authority: requirePermission('退课申请'),
        redirectPath: ''
    };
    static 合同操作列表改包 = {
        path: '/contract/contractAction/contractActionList/pkg',
        component: ContractActionListPkg,
        authority: requirePermission('改包申请'),
        redirectPath: ''
    };
    static 合同操作列表修改请假次数 = {
        path: '/contract/contractAction/contractActionList/leave',
        component: ContractActionListLeave,
        authority: requirePermission('请假次数修改申请'),
        redirectPath: ''
    };
    static 合同操作列表赠课 = {
        path: '/contract/contractAction/contractActionList/free',
        component: ContractActionListFree,
        authority: requirePermission('赠课申请'),
        redirectPath: ''
    };
    /*合同操作详情页面*/
    static 合同操作详情转中心 = {
        path: '/contract/contractAction/contractActionDetail/center/:params',
        link:'/contract/contractAction/contractActionDetail/center/',
        component: ContractActionDetailCenter,
        authority: requirePermission('转中心申请'),
        redirectPath: ''
    };
    static 合同操作详情延期 = {
        path: '/contract/contractAction/contractActionDetail/delay/:params',
        link:'/contract/contractAction/contractActionDetail/delay/',
        component: ContractActionDetailDelay,
        authority: requirePermission('合同延期申请'),
        redirectPath: ''
    };
    static 合同操作详情退课 = {
        path: '/contract/contractAction/contractActionDetail/out/:params',
        link:'/contract/contractAction/contractActionDetail/out/',
        component: ContractActionDetailOut,
        authority: requirePermission('退课申请'),
        redirectPath: ''
    };
    static 合同操作详情改包 = {
        path: '/contract/contractAction/contractActionDetail/pkg/:params',
        link:'/contract/contractAction/contractActionDetail/pkg/',
        component: ContractActionDetailPkg,
        authority: requirePermission('改包申请'),
        redirectPath: ''
    };
    static 合同操作详情修改请假次数 = {
        path: '/contract/contractAction/contractActionDetail/leave/:params',
        link:'/contract/contractAction/contractActionDetail/leave/',
        component: ContractActionDetailLeave,
        authority: requirePermission('请假次数修改申请'),
        redirectPath: ''
    };
    static 合同操作详情赠课 = {
        path: '/contract/contractAction/contractActionDetail/free/:params',
        link:'/contract/contractAction/contractActionDetail/free/',
        component: ContractActionDetailFree,
        authority: requirePermission('赠课申请'),
        redirectPath: ''
    };
    // Todo
    static 合同操作详情调整 = {
        path: '/contract/contractAction/contractActionDetail/revise/:params',
        link:'/contract/contractAction/contractActionDetail/revise/',
        component: ContractActionDetailSpecial,
        authority: requirePermission('合同调整申请'),
        redirectPath: ''
    };
    static 合同操作详情部分退费 = {
        path: '/contract/contractAction/contractActionDetail/partRefund/:params',
        link:'/contract/contractAction/contractActionDetail/partRefund/',
        component: ContractActionDetailPartRefund,
        authority: true,
        redirectPath: ''
    };

    static 合同收款管理合同 = {
        path: '/contract/contractPayOrReceive/contractActionReceiveContract',
        component: ContractActionReceiveContract,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 合同收款管理其他 = {
        path: '/contract/contractPayOrReceive/contractActionReceiveOther',
        component: ContractActionReceiveOther,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 合同收款管理转中心 = {
        path: '/contract/contractPayOrReceive/contractActionReceiveTransfer',
        component: ContractActionReceiveTransfer,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 合同收款管理改包 = {
        path: '/contract/contractPayOrReceive/contractActionReceivePackage',
        component: ContractActionReceivePackage,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 新建收款申请 = {
        path: '/contract/addReceive',
        component: ReceiveAddApplication,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 新建付款申请 = {
        path: '/contract/addPay',
        component: PayAddApplication,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 合同付款管理合同 = {
        path: '/contract/contractPayOrReceive/contractActionPayContract',
        component: ContractActionPayContract,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 合同付款管理其他 = {
        path: '/contract/contractPayOrReceive/contractActionPayOther',
        component: ContractActionPayOther,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 合同付款管理转中心 = {
        path: '/contract/contractPayOrReceive/contractActionPayTransfer',
        component: ContractActionPayTransfer,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 合同付款管理改包 = {
        path: '/contract/contractPayOrReceive/contractActionPayPackage',
        component: ContractActionPayPackage,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };

    static 合同付款管理 =  {
        path: '/contract/contractPay/:params?',
        link: '/contract/contractPay/',
        component: PayManageList,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };

    static 合同收款管理 =  {
        path: '/contract/contractReceive/:params?',
        link: '/contract/contractReceive/',
        component: ReceiveManageList,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };

    static 确认合同收款 = {
        path: '/contract/contractPayOrReceive/confirmReceive/:params',
        link:'/contract/contractPayOrReceive/confirmReceive/',
        component: ContractConfirm,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 确认合同付款 = {
        path: '/contract/contractPayOrReceive/confirmPay/:params',
        link:'/contract/contractPayOrReceive/confirmPay/',
        component: ContractConfirm,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 确认其他收款 = {
        path: '/contract/othersPayOrReceive/confirmReceive/:params',
        link:'/contract/othersPayOrReceive/confirmReceive/',
        component: OthersConfirm,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 确认其他付款 = {
        path: '/contract/othersPayOrReceive/confirmPay/:params',
        link:'/contract/othersPayOrReceive/confirmPay/',
        component: OthersConfirm,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 确认改包收款 = {
        path: '/contract/packagePayOrReceive/confirmReceive/:params',
        link:'/contract/packagePayOrReceive/confirmReceive/',
        component: PackageConfirm,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 确认改包付款 = {
        path: '/contract/packagePayOrReceive/confirmPay/:params',
        link:'/contract/packagePayOrReceive/confirmPay/',
        component: PackageConfirm,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 确认改中心收款 = {
        path: '/contract/centerPayOrReceive/confirmReceiveTrans/:params',
        link:'/contract/centerPayOrReceive/confirmReceiveTrans/',
        component: CenterConfirm,
        authority: requirePermission('收款管理'),
        redirectPath: ''
    };
    static 确认改中心付款 = {
        path: '/contract/contractPayOrReceive/confirmPayTrans/:params',
        link:'/contract/contractPayOrReceive/confirmPayTrans/',
        component: CenterConfirm,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    };
    static 线上订单交易明细 = {
        path: '/contract/contractManagement/online',
        component: OnlineContractList,
        authority: requirePermission('线上订单交易明细'),
        redirectPath: ''
    };
    // Todo
    static 合同调整申请 = {
        path: '/contract/contractAction/contractActionList/special',
        component: ContractActionListSpecial,
        authority: requirePermission('合同调整申请'),
        redirectPath: ''
    };
    static 部分退费申请 = {
        path: '/contract/contractAction/contractActionList/partRefund',
        component: ContractActionListPartRefund,
        authority: requirePermission('部分退费申请'),
        redirectPath: ''
    };
    static 确认部分退费付款 = {
        path: '/contract/contractPayOrReceive/confirmPartRefund/:params',
        link:'/contract/contractPayOrReceive/confirmPartRefund/',
        component: PartRefundConfirm,
        authority: requirePermission('付款管理'),
        redirectPath: ''
    }
}

export  {ContractRoutes}
