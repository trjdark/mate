/**
*Desc: 续约跟进
*User: Debby.Deng
*Date: 2018/11/28,
*Time: 上午10:49
*/
import * as React from "react";
import {ListModal} from "../../../../../../component/listModal";
import {form} from "../../../../../../../common/decorator/form";
import {User} from "../../../../../../../common/beans/user";
import {createRenew, intensionList} from "@redux-actions/customer/customerGrowth";
import {GrowthTable} from "../growthTable";
import * as moment from 'moment';
import {AddRenewFollow} from './addRenewFollow';

interface propsType {
    leadsId:string,
    type:string,
    [propName:string]:any,
}
@form()
class Renew extends React.Component<propsType>{
    child:any;
    state={
        showAddWrap:false,
        reNewIntension:[],
    };
    handleOk=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
                values.contactDate=moment(values.contactDate).valueOf();
                const params=Object.assign({},values,{
                    currentCenterId:User.currentCenterId,
                    leadsId:this.props.leadsId
                });
                createRenew(params).then((res)=>{
                    this.child.resetTable({});
                    this.setState({showAddWrap:false});
                })
            }
        })

        };
    handleCancel=()=>{
        this.setState({showAddWrap:false});
    };
    handleAdd=()=>{
        const {form}=this.props;
        form.resetFields();
        this.setState({showAddWrap:true});
    };
    componentDidMount(){
        intensionList({
            currentCenterId: User.currentCenterId
        }).then((res)=>{
            this.setState({
                reNewIntension:res||[]
            });
        })
    }
    render(){
        const {leadsId,type}=this.props;
        return (
            <div>
                <p>
                    <button onClick={this.handleAdd}
                            className='gym-button-default-xs mt15 mb20 ml30'>+ 新增</button>
                </p>
                <GrowthTable onRef={ref=>(this.child=ref)} leadsId={leadsId} type={type}/>
                <ListModal
                    visible={this.state.showAddWrap}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    width={650}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    okText={`确认`}
                    cancelText={`取消`}
                >
                    <AddRenewFollow intensionList={this.state.reNewIntension}
                                    form={this.props.form}
                                    onHideClick={this.handleCancel}/>
                </ListModal>
            </div>
        )
    }
}

export {Renew}
