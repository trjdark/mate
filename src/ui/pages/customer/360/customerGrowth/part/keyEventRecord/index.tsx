/**
*Desc: 关键事件记录
*User: Debby.Deng
*Date: 2018/11/23,
*Time: 上午9:25
*/
import * as React from "react";
import {AddKeyEvent} from "./addKeyEvent";
import {ListModal} from "../../../../../../component/listModal";
import {form} from "../../../../../../../common/decorator/form";
import {User} from "../../../../../../../common/beans/user";
import {createKeyEvent} from "@redux-actions/customer/customerGrowth";
import {GrowthTable} from "../growthTable";
import * as moment from 'moment';
interface propsType {
    leadsId:string,
    type:string,
    [propName:string]:any,
}
@form()
class KeyEvent extends React.Component<propsType>{
    child:any;

    state={
        showAddEvent:false,
    };
    handleOk=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
                values.eventDate=moment(values.eventDate).valueOf();
                const params=Object.assign({},values,{
                    currentCenterId:User.currentCenterId,
                    leadsId:this.props.leadsId
                });
                createKeyEvent(params).then((res)=>{
                    this.child.resetTable({});
                    this.setState({showAddEvent:false});
                })
            }
        })

        };
    handleCancel=()=>{
        this.setState({showAddEvent:false});
    };
    handleAddEvent=()=>{
        const {form}=this.props;
        form.resetFields();
        this.setState({showAddEvent:true});
    };
    componentDidMount(){
    }
    render(){
        const {leadsId,type}=this.props;
        return (
            <div>
                <p>
                    <button onClick={this.handleAddEvent}
                            className='gym-button-default-xs ml30 mb20 mt15'>+ 新增</button>
                </p>
                <GrowthTable onRef={ref=>(this.child=ref)} leadsId={leadsId} type={type}/>
                <ListModal
                    visible={this.state.showAddEvent}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    width={650}
                    destroyOnClose={true}
                    closable={true}
                    maskClosable={true}
                    okText={`确认`}
                    cancelText={`取消`}
                >
                    <AddKeyEvent form={this.props.form} onHideClick={this.handleCancel}/>
                </ListModal>
            </div>
        )
    }
}

export {KeyEvent}
