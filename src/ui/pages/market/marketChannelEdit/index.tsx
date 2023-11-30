/**
 * desc: 市场渠道
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {connect} from "react-redux";
import {Form, message, notification, Button, Icon} from 'antd';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import BasicInfoForm from '../components/basicInfoForm';
import ActivityDetail from '../components/activityDetail';
import ActivityPan from '../components/activityPlan';
import ConfirmBtnGroup from '../../../component/confirmBtnGroup';
import {createMarketInfo, updateMarketInfo, getMarketInfo} from "@redux-actions/market/marketDetail";
import {resetData} from "@/saga/actions/market/marketDetail";
import {User} from "@/common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";
import './style/index.scss';

/*定义MarketEditState的数据结构*/
interface MarketEditState {
    [propName: string]: any
}

class MarketEdit extends Component<any, MarketEditState> {
    private currentCenterId = User.user.currentCenterId;

    constructor(props) {
        super(props);
        this.state = {
            isView: false,  // 标志本页面是否是查看状态，查看状态不可编辑
            id: '',         // 渠道id
            breadCrumbRoutes: [     // 面包屑配置
                {name: '市场'},
                {name: '市场渠道管理'},
                {name: '新建市场渠道'}
            ]
        };
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.openNotification = this.openNotification.bind(this);
    }

    render() {
        const {isView, breadCrumbRoutes} = this.state;
        const {form, approvalStatus} = this.props;
        return (
            <Form>
                {/*面包屑导航*/}
                <BreadCrumb routes={breadCrumbRoutes}/>
                <div className='page-wrap'>
                    {/*市场渠道基本信息*/}
                    <BasicInfoForm isView={isView} form={form} approvalStatus={approvalStatus}/>
                    {/*本期活动规划*/}
                    <ActivityPan isView={isView} form={form}/>
                    {/*活动详情*/}
                    <ActivityDetail isView={isView} form={form}/>
                    {/*确认按钮组*/}
                    <div className='mb15'>
                        <ConfirmBtnGroup
                            okText='保存'
                            form={form}
                            handleConfirmClick={this.handleConfirmClick}
                            tipText={
                                <div>
                                    <p>当前页面存在未保存的信息，</p>
                                    <p>是否确定放弃保存？</p>
                                </div>
                            }
                            tipOkText="确定放弃保存"
                            tipCancelText="返回编辑页面"
                            handleCancelClick={this.handleCancelClick}
                        />
                    </div>

                </div>
            </Form>
        )
    }

    componentDidMount() {
        const {hasParams, parse} = CommonUtils;
        const props = this.props;
        if (hasParams(props)) {
            // 如果id存在，请求该渠道的具体数据
            const id = parse(props).id;
            props.getMarketInfo({
                currentCenterId: this.currentCenterId,
                id
            });
            this.setState(prevState => {
                const {breadCrumbRoutes} = prevState;
                breadCrumbRoutes[2].name = '市场渠道编辑';
                return {
                    id,
                    breadCrumbRoutes
                }
            });
        }
    }

    componentWillUnmount() {
        // 离开页面时重置所有数据
        this.props.resetData();
    }

    handleConfirmClick() {
        const {form, createMarketInfo: createInfo, updateMarketInfo: updateInfo, channelData, editChannelData} = this.props;
        const {id} = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            // 处理时间对象
            const {startAndEndTime} = values;
            let startDate: string = null, endDate: string = null;
            if (startAndEndTime instanceof Array) {
                startDate = startAndEndTime[0].valueOf();
                endDate = startAndEndTime[1].valueOf();
            }
            values.startDate = startDate;
            values.endDate = endDate;

            // 添加调用接口需要的各种属性
            let params = Object.assign({}, values, channelData);
            params.currentCenterId = this.currentCenterId;

            // 删除不需要的属性
            delete params.startAndEndTime;

            // 百分比显示的数据转换成小数
            params.memberTransferRate = params.memberTransferRate / 100;
            if (id) {
                // id存在，执行update请求（先添加编辑所需要的特殊参数）
                params = Object.assign({}, params, editChannelData);
                updateInfo({
                    data: params,
                    cb: () => {
                        message.success('更新市场渠道数据成功');
                        this.props.history.push('/market/list')
                    }
                })
            } else {
                // id不存在，执行新建请求
                createInfo({
                    data: params,
                    openNotification: this.openNotification,
                    cb: () => {
                        message.success('新建市场渠道数据成功');
                        this.props.history.push('/market/list')
                    }
                });
            }

        })
    }

    handleCancelClick() {
        this.props.history.goBack();
    }

    openNotification() {
        const key = `open${Date.now()}`;
        const btn = (
            <Button htmlType="button" type="primary" size="small" onClick={() => notification.close(key)}>
                确定
            </Button>
        );
        const icon = <Icon type="info-circle" style={{color: '#faad14'}}/>;
        notification.open({
            message: '提示',
            description: '本中心未设置市场渠道审批人，请告知CD及时配置，以免影响流程审批。',
            btn,
            key,
            icon,
            onClose: close,
        });
    };
}

const mapStateToProps = state => {
    const {
        attachmentId,                // 附件url
        attachmentName,              // 附件名称
        estimatedMember,             // 规划收取会员数
        averageMemberTransferRate,   // leads会员转化率(平均值)
        maxMemberTransferRate,       // leads会员转化率(最大)
        minMemberTransferRate,       // leads会员转化率(最低)
        avgAveragePackageAmount,     // 平均每单课程包金额(平均值)
        maxAveragePackageAmount,     // 平均每单课程包金额(最高)
        minAveragePackageAmount,     // 平均每单课程包金额(最低)
        avgSaleExpendsRate,          // 营销费用占比(平均)
        maxSaleExpendsRate,          // 营销费用占比(最大)
        minSaleExpendsRate,          // 营销费用占比(最小)
        avgEachLeadsCost,            // 每leads成本(平均)
        maxEachLeadsCost,            // 每leads成本(最大)
        minEachLeadsCost,            // 每leads成本(最小)
        avgEachContractCost,         // 每合同成本(平均)
        maxEachContractCost,         // 每合同成本(最大)
        minEachContractCost,         // 每合同成本(最小)
        applyStaffId,                // 申请人员ID
        applyTime,                   // 申请时间
        approvalStaffId,             // 审批人Id
        approvalStatus,              // 审批状态
        approvalTime,                // 审批时间
        id,                          // 市场渠道Id
        marketingActivityCode,       // 市场渠道编码
        cid,
        createBy,                    // 创建人
        createDate,                  // 创建时间
        lastUpdateBy,                // 最后更新人
        lastUpdateDate,              // 最后更新日期
    } = state.marketDetail;
    return {
        approvalStatus,
        channelData: {  // 新建和编辑时会用到的参数
            attachmentId,
            attachmentName,
            estimatedMember,
            averageMemberTransferRate,
            maxMemberTransferRate,
            minMemberTransferRate,
            avgAveragePackageAmount,
            maxAveragePackageAmount,
            minAveragePackageAmount,
            avgSaleExpendsRate,
            maxSaleExpendsRate,
            minSaleExpendsRate,
            avgEachLeadsCost,
            maxEachLeadsCost,
            minEachLeadsCost,
            avgEachContractCost,
            maxEachContractCost,
            minEachContractCost,
        },
        editChannelData: {   // 编辑时会用到的参数
            applyStaffId,
            applyTime,
            approvalStaffId,
            approvalStatus,
            approvalTime,
            marketingActivityCode,
            id,
            cid,
            createBy,
            createDate,
            lastUpdateBy,
            lastUpdateDate,
        }
    }
};

const mapDispatchToProps = dispatch => ({
    createMarketInfo(params) {
        dispatch(createMarketInfo(params));
    },
    updateMarketInfo(params) {
        dispatch(updateMarketInfo(params));
    },
    getMarketInfo(params) {
        dispatch(getMarketInfo(params));
    },
    resetData() {
        dispatch(resetData());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MarketEdit));
