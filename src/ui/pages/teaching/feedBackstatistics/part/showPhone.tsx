/**
 * desc:
 * User: y
 * Date: 2020/10/19
 * Time: 下午3:46
 */
import React from 'react';
import {Tooltip} from 'antd';
import { getFeedBackFullphone} from "@redux-actions/teaching/feedBack";
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
        getFeedBackFullphone(param).then((res:any) => {
            this.setState({ phone: res.phoneNum, visible:true})
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
