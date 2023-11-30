import Market from '../../ui/pages/market/index';
import MarketList from '../../ui/pages/market/marketChannelList/index';
import MarketDetail from '../../ui/pages/market/marketChannelDetail/index';
import MarketEdit from '../../ui/pages/market/marketChannelEdit/index';
import {requirePermission} from './routeFuncIdMap';

class MarketRoutes {
    static 市场渠道 = {
        path: '/market',
        component: Market,
        authority: requirePermission('市场渠道'),
    };

    static 市场渠道列表 = {
        path: '/market/list',
        component: MarketList,
        authority: requirePermission('渠道管理'),
    };

    static 市场渠道明细 = {
        path: '/market/detail/:params',
        link: '/market/detail',
        component: MarketDetail,
        authority: requirePermission('渠道管理'),
    };
    static 编辑市场渠道 = {
        path: '/market/edit/:params?',
        link: '/market/edit',
        component: MarketEdit,
        authority: requirePermission('新建市场渠道'),
    };
}

export {MarketRoutes};
