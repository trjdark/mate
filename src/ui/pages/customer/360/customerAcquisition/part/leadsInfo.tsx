/**
 * Desc: leads信息
 * User: Debby.Deng
 * Date: 2018/11/5,
 * Time: 上午10:01
 */
import * as React from "react";
import moment from 'moment';
import {appearanceType} from "../../../enum/assign";
import {RecmdModalContent} from "../../../create/part/recmdModalContent";
import {ListModal} from "@/ui/component/listModal";
import {PageTitle} from "@/ui/component/pageTitle";
import {Checkbox, Select} from "antd";
import {Input, TextArea} from "../../../../../component/input";
import {User} from "@/common/beans/user";
import {getActivityList, getPromotorList} from "@redux-actions/customer/customerAcquire";
import {getCodeInfoByType} from "@redux-actions/customerCreate";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Confirm} from "@/ui/component/customerCreateModal";

const {Option} = Select;

class LeadsInfo extends React.Component<any> {
    state = {
        isRecommend: null,// 是否推荐
        isVipRecommend: null,// 会员推荐
        isFromMarket: null,// 是否来源于市场
        promotorList: [],
        activityList: [],
        ChannelTypeList: [],
        recommend: {},
    };
    chooseRecommender = (e) => {
        const {form} = this.props;
        if (form.getFieldValue('channelType') === '72006') {
            this.setState({isVipRecommend: true});
            e.target.blur();
        }
    };
    chooseMarket = (e) => {
        const isChecked = e.target.checked;
        this.setState({
            isFromMarket: isChecked
        });
    };
    initForm = () => {
        const {form} = this.props;
        form.setFieldsValue({
            'referalName': '',
            'referalContactId': '',
            'referalPhoneNum': '',
        });
    };
    setRecommender = (channelSource) => {// 选中推荐人
        const {form} = this.props;
        if (channelSource === '72006' || channelSource === '72010') {// 72010:非会员推荐， 72006：会员推荐
            this.setState({isRecommend: true}, () => {
                this.initForm();
            });
        } else {
            this.setState({isRecommend: false}, () => {
                form.setFieldsValue({'referalContactId': ''})
            });
        }
    };
    fillRecommener = (recommend) => {
        this.setState({recommend})
    };
    handleOk = () => {
        const {form} = this.props;
        const {recommend}:any = this.state;
        const {contactName, leadsId} = recommend;
        const that = this;
        if (!contactName) {// 联系人名称不存在
            const url = `${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify({leadsId, title: 1})}`;
            Confirm({
                content: <span>该会员还没联系人姓名，请将联系人姓名补充完整, 现在去完善？</span>,
                onOk() {
                    window.open(url, "_blank");
                    that.setState({isVipRecommend: false});
                }
            })
        } else {
            this.setState({isVipRecommend: false});
            form.setFieldsValue({
                'referalName': recommend.contactName,
                'referalContactId': recommend.contactId,
                'referalPhoneNum': recommend.contactTel,
            });
        }
    };
    handleCancel = () => {
        this.setState({isVipRecommend: false});

    };
    setMarketRemark = (value) => {
        const {form} = this.props;
        let remark = '';
        this.state.activityList.some((item) => {
            if (item.marketingActivityId === value) {
                remark = item.channelRemark;
                return true;
            }
            return false;
        });
        form.setFieldsValue({'channelComment': remark});
    };
    /**
     * 检测当前promotor是否离职
     * @param id
     * @param name
     * @returns {any}
     */
    getPromotor = (id, name) => {
        const {promotorList} = this.state;
        const idx = (promotorList || []).findIndex((promotor) => {
            return promotor.promotorId == id;
        });
        if (idx > -1) {
            return id;
        } else {
            return name;
        }
    };

    componentDidMount() {
        const params = {
            currentCenterId: User.currentCenterId
        };
        // 获取promotor列表
        getPromotorList(params).then((res) => {
            this.setState({promotorList: res})
        });
        // 获取活动列表
        getActivityList(params).then((res) => {
            this.setState({activityList: res})
        });
        // 获取渠道列表
        getCodeInfoByType({
            type: 'ChannelType',
            currentCenterId: User.currentCenterId
        }).then((res) => {
            this.setState({ChannelTypeList: res})
        })
    }

    render() {
        const {form, isEditable, leadsInfo} = this.props;// form，isEditable从CommonPart传入，其余从index传入
        const {getFieldDecorator} = form;
        let {isRecommend, isFromMarket, promotorList, activityList, ChannelTypeList} = this.state;
        if (isRecommend === null) {// 初始化
            isRecommend = (leadsInfo.channelType === '72006' || leadsInfo.channelType === '72010');
        }
        if (isFromMarket === null) {// 初始化
            isFromMarket = (!!leadsInfo.marketingActivityId);
        }
        return (
            <div className={`${isEditable ? 'show' : 'hide'}  gym-customer-acquire-leads-info`}>
                <table className='gym-customer-acquire-table-view'>
                    <tbody>
                    <tr>
                        <td style={{width: '150px'}}>
                            获取日期：
                        </td>
                        <td style={{width: 'calc(100% - 150px)'}}>
                            <span>{moment(leadsInfo.inquireDate).format('YYYY-MM-DD')}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            创建日期：
                        </td>
                        <td>
                            <span>{moment(leadsInfo.createDate).format('YYYY-MM-DD')}</span>
                        </td>

                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            出现方式：
                        </td>
                        <td>
                            {
                                getFieldDecorator(`appearanceType`, {
                                    initialValue: leadsInfo.appearanceType,
                                })(<Select>
                                    {(appearanceType || []).map((option) => {
                                        return (
                                            <Option
                                                key={option[`value`]}
                                                value={option[`value`]}
                                            >
                                                {option[`label`]}
                                            </Option>
                                        )
                                    })}
                                </Select>)
                            }

                        </td>
                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            渠道来源：
                        </td>
                        <td>
                            {
                                getFieldDecorator(`channelType`, {
                                    initialValue: leadsInfo.channelType,
                                })(<Select onSelect={this.setRecommender}>
                                    {(ChannelTypeList || []).map((option) => {
                                        return (
                                            <Option
                                                key={option[`code`]}
                                                value={option[`code`]}
                                            >
                                                {option[`codeValue`]}
                                            </Option>
                                        )
                                    })}
                                </Select>)
                            }

                        </td>

                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            渠道备注：
                        </td>
                        <td>
                            {
                                getFieldDecorator(`channelComment`, {
                                    initialValue: leadsInfo.channelComment,
                                })(
                                    <TextArea/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            是否来源于市场：
                        </td>
                        <td>
                            {
                                (
                                    <Checkbox
                                        checked={isFromMarket}
                                        onChange={this.chooseMarket}
                                    />
                                )

                            }
                        </td>

                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            市场渠道名称：
                        </td>
                        <td>
                            {
                                isFromMarket && getFieldDecorator(`marketingActivityId`, {
                                    rules: [{required: true, message: `如果勾选来源于市场，请选择市场渠道名称`}],
                                    initialValue: leadsInfo.marketingActivityId,
                                })(
                                    <Select
                                        onChange={this.setMarketRemark}
                                        showSearch={true}
                                        optionFilterProp={'children'}
                                    >
                                        {(activityList || []).map((option) => {
                                            return (
                                                <Option
                                                    key={option[`marketingActivityId`]}
                                                    value={option[`marketingActivityId`]}
                                                >
                                                    {option[`theme`]}
                                                </Option>
                                            )
                                        })}
                                    </Select>)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            Promotor：
                        </td>
                        <td>
                            {
                                isFromMarket && getFieldDecorator(`promotorId`, {
                                    initialValue: this.getPromotor(leadsInfo.promotorId, leadsInfo.promotorName),
                                })(
                                    <Select
                                        showSearch={true}
                                        optionFilterProp={'children'}
                                    >
                                        {(promotorList || []).map((option) => {
                                            return (
                                                <Option
                                                    key={option[`promotorId`]}
                                                    value={option[`promotorId`]}
                                                >
                                                    {option[`promotorName`]}
                                                </Option>
                                            )
                                        })}
                                    </Select>)
                            }
                        </td>

                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            是否推荐：
                        </td>
                        <td>
                            {
                                getFieldDecorator(`recommend`, {
                                    initialValue: leadsInfo.appearanceType,
                                })(<Checkbox disabled={true} checked={isRecommend}/>)

                            }
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            推荐人：
                        </td>
                        <td>
                            {
                                isRecommend && getFieldDecorator(`referalName`, {
                                    initialValue: leadsInfo.referalName,
                                })(
                                    <Input onClick={this.chooseRecommender}/>
                                )
                            }
                            <div className='hide'>
                                {getFieldDecorator('referalContactId', {
                                    initialValue: ''
                                })(
                                    <Input/>
                                )}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: '150px'}}>
                            推荐人手机号码：
                        </td>
                        <td>
                            {
                                isRecommend && getFieldDecorator(`referalPhoneNum`, {
                                    initialValue: leadsInfo.referalPhoneNum,
                                })(
                                    <Input/>
                                )
                            }

                        </td>
                    </tr>
                    </tbody>
                </table>
                <ListModal
                    visible={this.state.isVipRecommend}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    destroyOnClose={true}
                    okText={`关联`}
                    cancelText={`取消`}
                >
                    <div>
                        <PageTitle title={`选择推荐人`}/>
                        <RecmdModalContent callback={this.fillRecommener}/>
                    </div>
                </ListModal>
            </div>
        )
    }
}

export {LeadsInfo}
