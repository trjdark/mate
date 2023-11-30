/**
 * desc: 活动列表详情Modal
 * User: Vicky.Yu
 * Date: 2018/12/27
 * Time: 上午10:55
 */
import React from 'react';
import {getActivityDetails} from "@redux-actions/activity/activityDataList"
import {getActivityTypeDef} from "@redux-actions/activity/activityDetail";
import {connect} from "@/common/decorator/connect";
import {User} from "@/common/beans/user";
import {PageTitle} from "@/ui/component/pageTitle";
import moment from 'moment';
import "./index.scss";

declare interface PropsType {
    id: any,

    [propName: string]: any,
}

const mapStateToProps = state => {
    const {
        types,
        payMode, // 付费方式
    } = state.activityDetail;
    const {
        activityPayModeObj, // 活动付费方式
    } = types;
    return {
        activityPayModeObj,
        payMode
    }
};

@connect(mapStateToProps, {getActivityTypeDef, getActivityDetails})
class DetailModal extends React.Component<PropsType, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activityDetails: [],
        }
    }
    /**
     * 确认按钮
     */
    render() {
        const {activityPayModeObj} = this.props;
        const {activityDetails} = this.state;
        return (
            <div className='activity-details-content' style={{width: '100%'}}>
                <PageTitle title="活动耗课详情"/>
                <div className='activity-details'>
                    <table>
                        <tbody>
                        <tr>
                            <td>会员活动名称</td>
                            <td>{activityDetails.activityTheme}</td>
                        </tr>
                        <tr>
                            <td>活动具体时间</td>
                            <td>
                                {
                                    activityDetails.activityStartTime ? moment(activityDetails.activityStartTime).format('YYYY-MM-DD (ddd) HH:mm') : ''
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>活动付费方式</td>
                            <td>{activityPayModeObj[activityDetails.payMode]}</td>
                        </tr>
                        <tr>
                            <td>消耗课时</td>
                            <td>{activityDetails.applicationConsumption}</td>
                        </tr>
                        <tr>
                            <td>消耗费用</td>
                            <td>{activityDetails.applicationFee}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    componentDidMount() {
        getActivityDetails({
            currentCenterId: User.currentCenterId,
            id: this.props.id
        }).then((res: any) => {
            this.setState({
                activityDetails: res
            })
        })
    }
}

export {DetailModal}
