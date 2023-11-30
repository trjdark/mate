/**
 * Desc: 分配leads给GA/GB
 * User: Debby.Deng
 * Date: 2018/10/10,
 * Time: 上午10:22
 */

import * as React from "react";
import {Form} from "antd";
import {form} from "@/common/decorator/form";
import {
    leadsToGa, leadsToGb,
    reLeadsToGaGb, getGBGAlistHasLeads,
    getGBGARolelistHasLeads
} from "@redux-actions/customer/assignActions";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import {Consumer} from "@/common/decorator/context";
import {AssignAverage} from "./assignAverage";
import {PageTitle} from "@/ui/component/pageTitle";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {getCenterConfig} from "@redux-actions/setting/center";

declare interface AssignLeadsProps {
    role: string,// 分配给GA/GB
    onHideClick: () => (void),
    totalLeadsNum?: number,// eads总数量
    leadsArr?: Array<any>,
    reAssign?: boolean,// 是否重新分配
    handleAssign?: any,  // 处理分配的函数

    // 以下为组件自身props

    getGaLeadsList?: any,
    getGbLeadsList?: any,
    gbLeadsList?: any,
    gaLeadsList?: any,
}


const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])


@form()

class AssignLeads extends React.Component<AssignLeadsProps, any> {
    // TODO
    state = {
        employeeList: [],
        recycleNoReceiveTime: '',
        recycleNoContactTime: '',
        gbLeadsList: [],
        gaLeadsList: [],
    };
    handleAssign = (value, staffList) => {// 分配leads
        const {leadsArr, role, reAssign, handleAssign} = this.props;
        const finalParams = {
            currentCenterId: User.currentCenterId,
            distributeObject: role,
            leadsIdList: leadsArr,
            staffList: staffList
        };
        // 如果父组件里传过来的有handleAssign方法
        if (typeof handleAssign === 'function') {
            handleAssign(finalParams);
            return;
        }

        if (reAssign) {// 重新分配
            reLeadsToGaGb(finalParams).then(() => {
                Message.success(`分配成功`);
                if (typeof value.callback === 'function') {
                    value.callback()
                }
                this.props.onHideClick();
            });
        } else {// 直接分配
            const func = role === 'GA' ? leadsToGa : leadsToGb;
            func(finalParams).then(() => {
                Message.success(`分配成功`);
                this.props.onHideClick();
                if (typeof value.callback === 'function') {
                    value.callback()
                }
            });
        }

    };

    componentDidMount() {
        if(isPostTransRole){
            const params1 = {
                currentCenterId: User.currentCenterId,
                leaveFlag:false,
                roleNameList: ["GA", "HGA"],
                primaryName: "GA"

            };
            const params2 = {
                currentCenterId: User.currentCenterId,
                leaveFlag:false,
                roleNameList: ["GB", "HGB"],
                primaryName: "GB"
            };
            Promise.all([
                getGBGARolelistHasLeads(params1),
                getGBGARolelistHasLeads(params2),
                getCenterConfig({centerId: User.currentCenterId, currentCenterId: User.currentCenterId})
            ]).then((res) => {
                this.setState({
                    gaLeadsList: res[0],
                    gbLeadsList: res[1],
                    recycleNoReceiveTime: res[2].recycleNoReceiveTime,
                    recycleNoContactTime: res[2].recycleNoContactTime,
                })
            });
        }else{
            const params1 = {
                currentCenterId: User.currentCenterId,
                leaveFlag:false,
                postNameList: ["GA", "HGA"],
                primaryName: "GA"

            };
            const params2 = {
                currentCenterId: User.currentCenterId,
                leaveFlag:false,
                postNameList: ["GB", "HGB"],
                primaryName: "GB"
            };
            Promise.all([
                getGBGAlistHasLeads(params1),
                getGBGAlistHasLeads(params2),
                getCenterConfig({centerId: User.currentCenterId, currentCenterId: User.currentCenterId})
            ]).then((res) => {
                this.setState({
                    gaLeadsList: res[0],
                    gbLeadsList: res[1],
                    recycleNoReceiveTime: res[2].recycleNoReceiveTime,
                    recycleNoContactTime: res[2].recycleNoContactTime,
                })
            });
        }
    }

    render() {
        const {totalLeadsNum, leadsArr, role} = this.props;
        const assignLeads = leadsArr.length;
        // TODO
        const {recycleNoReceiveTime, recycleNoContactTime, gbLeadsList, gaLeadsList} = this.state;
        const currentList = role === 'GA' ? gaLeadsList : gbLeadsList;
        return (
            <Consumer>
                {(value) => (
                    <Form>
                        <div className='gym-leads-assign'>
                            <PageTitle title={`Leads分配${role}`}/>

                            <p className='gym-leads-assign-notice'>
                                {parseInt(recycleNoReceiveTime, 10) > 0 && `分配${recycleNoReceiveTime}天后自动回收不领取Leads,`}
                                {parseInt(recycleNoContactTime, 10) > 0 && `领取${recycleNoContactTime}天后自动回收不联系Leads。`}
                            </p>
                            <p className='gym-leads-assign-number'>
                                已选中<span className='cDefault'>{assignLeads || 1}</span>
                                个Leads
                                {totalLeadsNum &&
                                <span>
                                (共有<span className='corange'>{totalLeadsNum}</span>个Leads待分配)
                            </span>}
                            </p>
                            <AssignAverage
                                type={'leads'}
                                role={role}
                                optionList={currentList}
                                onSubmit={this.handleAssign}
                                onCancel={this.props.onHideClick}
                                leadsArr={leadsArr}
                                value={value}
                            />
                        </div>
                    </Form>
                )}
            </Consumer>
        )
    }
}

export {AssignLeads};
