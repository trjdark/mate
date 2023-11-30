/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/5/18
 * Time: 下午5:19
 */
import * as React from "react";
import {Form} from "antd";
import {form} from "@/common/decorator/form";
import {
    getGBGAlistHasLeads,
    getGBGARolelistHasLeads
} from "@redux-actions/customer/assignActions";
import {User} from "@/common/beans/user";
import {Consumer} from "@/common/decorator/context";
import {AssignAverage} from "@/ui/pages/customer/assign/part/assignAverage";
import {PageTitle} from "@/ui/component/pageTitle";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {getCenterConfig} from "@redux-actions/setting/center";

declare interface AssignLeadsProps {
    role: string,// 分配给GA/GB
    onHideClick: () => (void),
    totalLeadsNum?: number,// eads总数量
    leadsArr?: Array<any>,
    emitAssign: (param, type:string) => void,
}


const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])


@form()

class NewAssignLeads extends React.Component<AssignLeadsProps, any> {
    // TODO
    state = {
        employeeList: [],
        recycleNoReceiveTime: '',
        recycleNoContactTime: '',
        gbLeadsList: [],
        gaLeadsList: [],
    };
    handleAssign = (value, staffList) => {// 分配leads
        const {leadsArr, role} = this.props;
        const finalParams = {
            distributeObject: role,
            leadsIdList: leadsArr,
            staffList: staffList
        };
        this.props.emitAssign(finalParams, this.props.role)
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
        const {recycleNoReceiveTime, recycleNoContactTime, gbLeadsList, gaLeadsList} = this.state;
        const currentList = role === 'ga' ? gaLeadsList : gbLeadsList;
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

export {NewAssignLeads};
