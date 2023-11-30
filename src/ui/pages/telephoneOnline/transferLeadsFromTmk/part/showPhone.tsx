/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/17
 * Time: 下午3:46
 */
import React from 'react';
import {Tooltip} from 'antd';
import {getPhone} from "@redux-actions/telephone/tmkTransferLeads";
import {User} from "@/common/beans/user";

class ShowPhone extends React.Component<any, any>{
    state = {
        visible:false,
        phone:null

    };
    getPhone = (id:string) => {
        const param = {
            id:id,
            currentCenterId:User.currentCenterId
        };
        getPhone(param).then((res:any) => {
            this.setState({phone: res, visible:true})
        });
    };
    hide = () => {
        this.setState({ visible:false})
    };
    render(){
        const {text, id} = this.props;
        const {visible, phone} = this.state;
        return(
            <Tooltip
                placement="top"
                title={phone}
                visible={visible}
                onVisibleChange={this.hide}
            >
                <span onClick={() => this.getPhone(id)}>{text}</span>
            </Tooltip>
        )
    }
}

export {ShowPhone}
