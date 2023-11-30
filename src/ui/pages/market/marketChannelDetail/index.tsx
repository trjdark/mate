/**
 * desc: 市场渠道
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Form, message} from "antd";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import BasicInfoForm from '../components/basicInfoForm';
import ActivityDetail from '../components/activityDetail';
import ActivityPan from '../components/activityPlan';
import ConfirmBtnGroup from '../../../component/confirmBtnGroup/index';
import {CommonUtils} from "@/common/utils/commonUtils";
import {getMarketInfo, approveMarket, refuseMarket} from "@redux-actions/market/marketDetail";
import {resetData} from "@/saga/actions/market/marketDetail";
import {connect} from "react-redux";
import {User} from "@/common/beans/user";

/*定义MarketEditState的数据结构*/
interface MarketEditState {
    [propName: string]: any
}

class MarketDetail extends Component<any, MarketEditState> {
    private currentCenterId = User.user.currentCenterId;

    constructor(props) {
        super(props);
        this.state = {
            isApprove: false,   // 判断页面是否应该显示审批按钮，默认不显示
            isView: true,       // 标志本页面是否是查看状态，查看状态不可编辑
            breadCrumbRoutes: [ // 面包屑配置
                {
                    name: '市场'
                },
                {
                    name: '市场渠道'
                },
                {
                    name: '市场渠道查看'
                }
            ]
        };
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }

    render() {
        // 结构出props和state里的值，方便调用
        const {isView, isApprove,breadCrumbRoutes} = this.state;
        const {form} = this.props;
        return (
            <Form>
                {/*面包屑导航*/}
                <BreadCrumb routes={breadCrumbRoutes}/>
                <div className='page-wrap'>
                    {/*市场渠道基本信息*/}
                    <BasicInfoForm isView={isView} form={form}/>
                    {/*本期活动规划*/}
                    <ActivityPan isView={isView} form={form}/>
                    {/*活动详情*/}
                    <ActivityDetail isView={isView} form={form}/>
                    {/*确认按钮组*/}
                    {
                        isApprove ? (
                            <ConfirmBtnGroup
                                form={form}
                                handleConfirmClick={this.handleConfirmClick}
                                handleCancelClick={this.handleCancelClick}
                                tipText='确定拒绝该渠道活动吗？'
                                okText="同意"
                                cancelText="不同意"
                                tipOkText="确定"
                                tipCancelText="取消"
                            />
                        ) : null
                    }
                </div>
            </Form>
        )
    }

    componentDidMount() {
        const state = this.props.location.state;

        // 加载页面数据
        this.props.getMarketInfo({
            currentCenterId: this.currentCenterId,
            id: CommonUtils.parse(this.props).id
        });

        // 判断是否应该显示审批按钮
        if(state&&state.isApprove){
            this.setState(prevState=>{
                const {breadCrumbRoutes} = prevState;
                breadCrumbRoutes[2].name = '市场渠道审批';
                return {
                    isApprove: state.isApprove
                };
            })
        }
    }

    componentWillUnmount(){
        // 离开页面时重置所有数据
        this.props.resetData();

    }

    handleConfirmClick() {
        this.props.approveMarket({
            data: {
                currentCenterId: this.currentCenterId,
                id: CommonUtils.parse(this.props).id
            },
            cb: () => {
                message.success('审批成功');
                this.props.history.goBack();
            }
        });
    }
    handleCancelClick(){
        this.props.refuseMarket({
            data: {
                currentCenterId: this.currentCenterId,
                id: CommonUtils.parse(this.props).id
            },
            cb: () => {
                message.success('已拒绝');
                this.props.history.goBack();
            }
        });
    }
}

const mapDispatchToProps = dispatch =>({
    getMarketInfo(params){
        dispatch(getMarketInfo(params));
    },
    approveMarket(params){
        dispatch(approveMarket(params));
    },
    refuseMarket(params){
        dispatch(refuseMarket(params));
    },
    resetData(){
        dispatch(resetData());
    }
});

export default connect(null, mapDispatchToProps)(Form.create()(MarketDetail));
