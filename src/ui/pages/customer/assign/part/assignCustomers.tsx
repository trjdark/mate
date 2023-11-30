/**
 *Desc: 分配会员弹框
 *User: Debby.Deng
 *Date: 2018/11/1,
 *Time: 下午3:18
 */

import * as React from "react";
import {Form} from "antd";
import {form} from "../../../../../common/decorator/form";
import {connect} from "../../../../../common/decorator/connect";
import {
    assignCustomerToGa,
    reAssignCustomerToGa, reAssignCustomerToGb, assignCustomerToGb, assignCustomerToGbInHistory,
} from "@redux-actions/customer/assignActions";
import {User} from "../../../../../common/beans/user";
import {Message} from "../../../../component/message/message";
import {Consumer} from "../../../../../common/decorator/context";
import {AssignAverage} from "./assignAverage";
import {Modal} from "../../../../component/customerCreateModal";
import {PageTitle} from "@/ui/component/pageTitle";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {FUNC} from "@/ui/pages/setting/enum/functions";

declare interface assignLeadsProps {
    role: string,//分配给GA/GB
    onHideClick: () => (void),
    totalCustomerNum?: number,//leads总数量
    customerArr?: Array<any>,
    reAssign?: boolean,//是否重新分配
    fromHistory?:boolean,
    gaCustomerList?: any,
    gbCustomerList?: any,

    [propsName: string]: any,
}
const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectGAOption = isPostTransRole
    ? {
        workingStatus: "1",
        roleList: ['GA', 'HGA']
    }
    : {
        workingStatus: "1",
        postName: ["GA", 'HGA']
    };
const selectGBOption = isPostTransRole
    ? {
        workingStatus: "1",
        roleList: ['GB', 'HGB']
    }
    : {
        workingStatus: "1",
        postName: ["GB", 'HGB']
    };


@form()
@connect((state) => ({
    gaCustomerList: selectTotalEmployeeList(state, selectGAOption),
    gbCustomerList: selectTotalEmployeeList(state, selectGBOption),
}), {})
class AssignCustomers extends React.Component<assignLeadsProps, any> {
    //TODO
    state = {
        employeeList: [],
        failNum: 0,
    };
    handleOk = () => {
        this.setState({failNum: 0});
        this.props.onHideClick();

    };
    handleCancel = () => {
        this.setState({failNum: 0});
        this.props.onHideClick();

    };
    handleAssign = (value, staffList) => {//分配leads
        const {customerArr, reAssign, role,fromHistory=false} = this.props;
        const staffVipList = staffList.map((staffObj) => {
            return {
                staffId: staffObj.staffId,
                vipNum: staffObj.leadsNum,
            }
        });
        const finalParams = {
            currentCenterId: User.currentCenterId,
            leadsIdList: customerArr,
            staffVipList: staffVipList,
            distributeObject: role,
        };
        if (reAssign) {//重新分配
            if (role === 'GA') {
                reAssignCustomerToGa(finalParams).then((res) => {
                    const failNum = res.unsuccessNum;
                    if (failNum > 0) {
                        this.setState({failNum: failNum});
                    } else {
                        Message.success(`分配成功`);
                        this.props.onHideClick();
                    }
                    value.callback && value.callback();
                });
            } else if (role === 'GB') {
                let request=null;
                if(fromHistory){
                    request=assignCustomerToGbInHistory;
                }else{
                    request=reAssignCustomerToGb;
                }
                request(finalParams).then((res) => {
                    const failNum = res.unsuccessNum;
                    if (failNum > 0) {
                        this.setState({failNum: failNum});
                    } else {
                        Message.success(`分配成功`);
                        this.props.onHideClick();
                    }
                    value.callback && value.callback();
                });
            }

        } else {//直接分配
            if (role === 'GA') {
                assignCustomerToGa(finalParams).then((res) => {
                    const failNum = res.unsuccessNum;
                    if (failNum > 0) {
                        this.setState({failNum: failNum});
                    } else {
                        Message.success(`分配成功`);
                        this.props.onHideClick();
                    }
                    value.callback && value.callback();
                });
            }else if(role==='GB'){
                assignCustomerToGb(finalParams).then((res) => {
                    const failNum = res.unsuccessNum;
                    if (failNum > 0) {
                        this.setState({failNum: failNum});
                    } else {
                        Message.success(`分配成功`);
                        this.props.onHideClick();
                    }
                    value.callback && value.callback();
                });
            }
        }

    };
    render() {
        const {gaCustomerList, totalCustomerNum, customerArr, role, reAssign, gbCustomerList} = this.props;
        const optionList = (role === 'GA' ? gaCustomerList : gbCustomerList);
        const {failNum} = this.state;
        const assigncustomers = customerArr.length;
        //TODO
        return (
            <Consumer>
                {(value) => (
                    <div>
                        <div>
                            <Form>
                                <div className='gym-leads-assign'>
                                    <PageTitle title='会员分配'/>
                                    <p className='gym-leads-assign-customer-number'>
                                        已选中<span className='cDefault'>{assigncustomers || 1}</span>
                                        个会员
                                        {(totalCustomerNum > 0) &&
                                        <span>, 共有<span className='corange'>{totalCustomerNum}</span>个会员可分配
                                        </span>}
                                        {
                                            reAssign && (<span>
                                                , 重新分配后，将更换当前的跟进人
                                            </span>)
                                        }
                                    </p>
                                    <AssignAverage
                                        type='vip'
                                        role={role}
                                        optionList={optionList}
                                        onSubmit={this.handleAssign}
                                        onCancel={this.props.onHideClick}
                                        leadsArr={customerArr}
                                        value={value}
                                    /></div>
                            </Form>
                        </div>
                        <Modal
                            visible={Number(failNum) > 0}
                            handleOk={this.handleOk}
                            handleCancel={this.handleCancel}
                            contentText={`${failNum}个会员不可分配（不可分配的原因：
                            ${reAssign ? `该会员还未分配，请先选中分配${role}）` : `该会员已经分配给${role}）`}`}
                        />
                    </div>)}
            </Consumer>
        )
    }
}

export {AssignCustomers};
