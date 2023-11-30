
/**
 * desc: 云语音路由
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/4
 * Time: 下午2:15
 */
import {TelephoneOnline} from "@/ui/pages/telephoneOnline";
import {Call} from "@/ui/pages/telephoneOnline/call";
import {LandLine} from "@/ui/pages/telephoneOnline/landline";
import {LandLineAdd} from "@/ui/pages/telephoneOnline/landline/add";
import {LandLineEdit} from "@/ui/pages/telephoneOnline/landline/edit";
import {CallRecords} from "@/ui/pages/telephoneOnline/callRecords";
import {Account} from "@/ui/pages/telephoneOnline/account";
import {SeatReport} from "@/ui/pages/telephoneOnline/seatReport";
import {AreaReport} from "@/ui/pages/telephoneOnline/areaReport";
import {CallbackPhone} from "@/ui/pages/telephoneOnline/callbackPhone";
import {TransferLeadsFromTmk} from "@/ui/pages/telephoneOnline/transferLeadsFromTmk";
import {TeleMarketForm } from "@/ui/pages/telephoneOnline/marketForm";
import { TeleServiceForm } from "@/ui/pages/telephoneOnline/serviceForm";
import {requirePermission} from './routeFuncIdMap';

class TelephoneOnlineRoutes {
    static 云语音 = {
        path: '/telephoneOnline',
        // link: '/telephoneOnline',
        component: TelephoneOnline,
        authority: requirePermission('客户中心'),
        redirectPath: ''
    };

    static 语音拨打 = {
        path: '/telephoneOnline/call',
        component: Call,
        authority: requirePermission('客户中心'),
        redirectPath: ''
    };

    static 坐席分配 = {
        path: '/telephoneOnline/landline',
        component: LandLine,
        exact: true,
        authority: requirePermission('坐席分配'),
        redirectPath: ''
    };

    static 添加坐席 = {
        path: '/telephoneOnline/landline/add',
        component: LandLineAdd,
        authority: requirePermission('坐席分配'),
        redirectPath: ''
    };
    static 编辑坐席 = {
        path: '/telephoneOnline/landline/edit/:params',
        link: '/telephoneOnline/landline/edit/',
        component: LandLineEdit,
        authority: requirePermission('坐席分配'),
        redirectPath: ''
    };

    static 云语音通话数据统计 = {
        path: '/telephoneOnline/callRecord',
        component: CallRecords,
        authority: requirePermission('外呼明细'),
        redirectPath: ''
    };
    static 账户余额 = {
        path: '/telephoneOnline/account',
        component: Account,
        authority: requirePermission('账户余额'),
        redirectPath: ''
    };
    static 坐席通话详情统计 = {
        path: '/telephoneOnline/seatReport',
        component: SeatReport,
        authority: requirePermission('外呼统计(按坐席)'),
        redirectPath: ''
    };
    static 技能组详情统计 = {
        path: '/telephoneOnline/areaReport',
        component: AreaReport,
        authority: requirePermission('外呼统计(按坐席组)'),
        redirectPath: ''
    };
    static 客户回拨统计 = {
        path: '/telephoneOnline/callback',
        component: CallbackPhone,
        authority: requirePermission('呼入明细'),
        redirectPath: ''
    };
    static TMK转Leads = {
        path: '/telephoneOnline/tmkTransferLeads',
        component: TransferLeadsFromTmk,
        authority: requirePermission('TMK转入Leads明细'),
        redirectPath: ''
    };
    static 云语音市场类报表 = {
        path: '/telephoneOnline/marketForm',
        component: TeleMarketForm,
        authority: requirePermission('市场名单明细(仅TMK)'),
        redirectPath: ''
    }
    static 云语音服务类报表 = {
        path: '/telephoneOnline/serviceForm',
        component: TeleServiceForm,
        authority: requirePermission('任务跟进明细(含云语音)'),
        redirectPath: ''
    }
}

export {TelephoneOnlineRoutes}
