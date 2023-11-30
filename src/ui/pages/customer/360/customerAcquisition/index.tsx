/**
 * Desc: 客户获取
 * User: Debby.Deng
 * Date: 2018/11/5,
 * Time: 上午9:58
 */
import './style/index.scss';
import * as React from "react";
import {LeadsInfo} from "./part/leadsInfo";
import {CommonPart} from "./part/common";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Tabs} from "@/ui/component/tabs";
import {FollowInfo} from "./part/followInfo";
import {ContractInfo} from "./part/contractInfo";
import {StatusChange} from "./part/statusChange";
import {ChannelReport} from "@/ui/pages/customer/360/customerAcquisition/part/channelReport";
import {getContractList, getFollowInfo, getLeadsInfo, getUpdateList, getChannelEditReport} from "@redux-actions/customer/customerAcquire";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import {LeadsInfo_noEdit} from "./part/leadsInfo_noEdit";
import history from '@/router/history';
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {getCodeInfoByTypeRedux} from '@redux-actions/client360';
import {connect} from "@/common/decorator/connect";

@connect(state => ({}), {getCodeInfoByTypeRedux})
class CustAcquisition extends React.Component<any, any> {
    leadsId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).leadsId : null;
    state = {
        leadsInfo: {},
        followInfo: {},
        contractInfo: {},
        updateInfo: {},
        channelListReport: []
    };
    query = {
        currentCenterId: User.currentCenterId,
        leadsId: this.leadsId,
        pageNo: 1,
        pageSize: 10,
    };
    private routes: Array<any> = [
        {
            name: '客户360',
            path: '',
            link: '#',
        }, {
            name: '客户获取',
            path: '',
            link: '#',
        }
    ];
    handleReload = (title) => {// 保存后页面重新加载数据
        switch (title) {
            case 'Leads信息':
                this.getLeadsInfo();
                break;
            case '跟进信息':
                this.getFollowDetail();
                break;
            default:
                break;
        }
    };
    getPanes = () => {
        const {leadsInfo, followInfo, contractInfo, updateInfo, channelListReport} = this.state;
        // 中心营业状态：0默认；1非销售中心
        const {centerBusinessStatus} = User.tmkStatus;
        return [
            {
                tabTitle: 'Leads信息',
                tabPane: (
                    <CommonPart
                        leadsInfo={leadsInfo}
                        title={'Leads信息'}
                        type={`编辑`}
                        leadsId={this.leadsId}
                        onReload={this.handleReload}
                    >
                        <LeadsInfo leadsInfo={leadsInfo}/>
                        <LeadsInfo_noEdit leadsInfo={leadsInfo}/>
                    </CommonPart>
                )
            },
            {
                tabTitle: '跟进信息',
                tabPane: (
                    <CommonPart title={'跟进信息'} type={`编辑`} leadsId={this.leadsId} onReload={this.handleReload}>
                        <FollowInfo followInfo={followInfo}/>
                    </CommonPart>
                )
            },
            {
                tabTitle: '合同信息',
                tabPane: (
                    <CommonPart title={'合同信息'} type={`+ 新建`} addContractFlag={!!centerBusinessStatus} leadsId={this.leadsId}>
                        <ContractInfo contractInfo={contractInfo} onPageChange={this.getContractInfo}/>
                    </CommonPart>
                )
            },
            {
                tabTitle: '状态变更',
                tabPane: (
                    <CommonPart title={'状态变更'}>
                        <StatusChange tableData={updateInfo} onPageChange={this.getUpdateInfo}/>
                    </CommonPart>
                )
            },
            {
                tabTitle: '渠道编辑记录',
                tabPane: (
                    <CommonPart title={'渠道编辑记录'}>
                        <ChannelReport tableData={channelListReport} onPageChange={this.getChannelReport}/>
                    </CommonPart>
                )
            }
        ]
    };
    onTabChange = (key) => {
        history.push(`${CustomerRoutes.客户获取.link}/${CommonUtils.stringify(
            {leadsId: this.leadsId, id: key})}`);
    };
    getLeadsInfo = () => {
        // 获取leads信息
        this.setState({
            leadsInfo: {}
        });
        getLeadsInfo(this.query).then((res) => {
            this.setState({
                leadsInfo: res
            })
        });
    };
    // 获取合同信息
    getContractInfo = (option?) => {
        option = option ? option : {};
        const params = Object.assign({}, this.query, option);
        getContractList(params).then((res) => {
            this.setState({
                contractInfo: res
            })
        });
    };
    // 状态变更
    getUpdateInfo = (option?) => {
        option = option ? option : {};
        const params = Object.assign({}, this.query, option);
        getUpdateList(params).then((res) => {
            this.setState({
                updateInfo: res
            })
        });
    };
    // 获取跟进信息
    getFollowDetail = (option?) => {
        option = option ? option : {};
        const params = Object.assign({}, this.query, option);
        getFollowInfo(params).then((res) => {
            this.setState({
                followInfo: res
            })
        });
    };
    // 获取渠道编辑记录
    getChannelReport = (option?) => {
        option = option ? option : {};
        const params = Object.assign({}, this.query, option);
        getChannelEditReport(params).then((res) => {
            this.setState({
                channelListReport: res
            })
        });
    };

    componentDidMount() {
        this.props.getCodeInfoByTypeRedux({
            type: 'familyRelation',
            currentCenterId: User.currentCenterId
        });
        this.getLeadsInfo();
        this.getContractInfo();
        this.getUpdateInfo();
        this.getFollowDetail();
        this.getChannelReport();
    }
    render() {
        const routeParams = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props) : {};
        const pid = routeParams.id || '0';

        return (
            <div className='gym-customer-acquire'>
                <BreadCrumb routes={this.routes}/>
                <div>
                    <Tabs activeKey={pid} onChange={this.onTabChange} tabPanes={this.getPanes()}/>
                </div>
            </div>
        )
    }

}

export {CustAcquisition}
