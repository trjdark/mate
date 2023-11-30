/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/6/3
 * Time: 上午11:09
 */
// Todo
import {ContractRevisionPopList} from "@/ui/pages/contractRevision/page/popList";
import {ContractRevisionDevList} from "@/ui/pages/contractRevision/page/devList";
import {ContractRevision} from "@/ui/pages/contractRevision";
import {ContractReviseDetail} from "@/ui/pages/contractRevision/page/detail";
import {ContractRevisionGeneralList} from "@/ui/pages/contractRevision/page/generalList";
import {ContractRevisionRefundList} from "@/ui/pages/contractRevision/page/refundList";
import {RefundDetail} from "@/ui/pages/contractRevision/page/refundDetail";
import {requirePermission} from "@/router/enum/routeFuncIdMap";

class ContractRevisionRoutes {
    static 合同调整 = {
        path: '/contractRevision',
        component: ContractRevision,
        authority: true,
        redirectPath: ''
    };
    static 合同调整POP列表 = {
        path: '/contractRevision/popList',
        component: ContractRevisionPopList,
        authority: requirePermission('POP合同调整审批'),
        redirectPath: ''
    };
    static 合同调整研发列表 = {
        path: '/contractRevision/devList',
        component: ContractRevisionDevList,
        authority: requirePermission('研发合同调整审批'),
        redirectPath: ''
    };
    static 总部审批页面 = {
        path: '/contractRevision/generalList',
        component: ContractRevisionGeneralList,
        authority: requirePermission('总部财务审批'),
        redirectPath: ''
    };
    static 合同调整详情 = {
        path: '/contractRevision/detail/:params',
        link: '/contractRevision/detail/',
        component: ContractReviseDetail,
        authority: true,
        redirectPath: ''
    };
    // todo
    static 部分退费列表 = {
        path: '/contractRevision/refundList',
        component: ContractRevisionRefundList,
        authority: requirePermission('部分退费-总部财务审批'),
        redirectPath: ''
    };
    static 部分退费详情 = {
        path: '/contractRevision/refund/:params',
        link: '/contractRevision/refund/',
        component: RefundDetail,
        authority: requirePermission('部分退费-总部财务审批'),
        redirectPath: ''
    };
}

export {ContractRevisionRoutes}
