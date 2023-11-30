/**
 * desc: 客户列表
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/13
 * Time: 下午4:39
 */
import React, {Component, Fragment} from 'react';
import {Modal} from 'antd';
import {Table} from "@/ui/component/tablePagination";

declare interface MemberTableProps {
    memberList:Array<any>
    memberIndex:number
    isLogin: boolean
    isCalling: boolean
    callId: string
    isChangeMember: boolean
    callLeadsId: string
    emitDial:(res:any) => void
    emitSelectMember:(index:number) => void
}

class MemberTable extends Component<MemberTableProps, any>{
    state = {
        visible:false,
        selectLeadsIndex:null
    }
    columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'customerName',
        },{
            title: '月龄',
            dataIndex: 'monthValue',
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text:string, record:any) => {
                const {isLogin, isCalling, callLeadsId} = this.props;
                // 如果已经登陆并且未拨打的时候
                if(isLogin && !isCalling){
                    return <button className="gym-button-xxs gym-button-white" onClick={() => this.props.emitDial(record)} >拨打</button>
                }else{
                    if(record.leadsId === callLeadsId){
                        return <span>通话中...</span>
                    }else{
                        return <button className="gym-button-xxs gym-button-grey">拨打</button>
                    }
                }

            }
        },
    ];
    /**
     * 选择客户
     * @param index
     * @returns {boolean}
     */
    selectMember = (index) => {
        const {memberIndex, isChangeMember, isCalling} = this.props;
        // 如果在拨打中，或者点击当前客户，则不执行
        if(isCalling || index === memberIndex){
            return false;
        }
        if(!isChangeMember){
            this.setState({selectLeadsIndex: index});
            this.showModal();
            return false;
        }
        this.props.emitSelectMember(index);
    };
    /**
     * 展开弹层
     */
    showModal = () => {
        this.setState({visible: true});
    }
    /**
     * 关闭弹层
     */
    closeModal = () => {
        this.setState({visible: false});
    };

    /**
     *
     * @returns {any}
     */
    show = () => {
        const {selectLeadsIndex} = this.state;
        this.props.emitSelectMember(selectLeadsIndex);
        this.setState({visible:false});
    };
    render(){
        const {memberList, memberIndex} = this.props;
        const {visible} = this.state;
        return(
            <Fragment>
                <Table
                    dataSource={memberList}
                    columns={this.columns}
                    className='border'
                    rowKey="leadsId"
                    rowClassName={(record, index) => `gym-call-member-list ${index === memberIndex ? "active" : ""}`}
                    onRow={(record, index) => ({
                        onClick: () => {this.selectMember(index)},
                    })}
                />
                <Modal
                    visible={visible}
                    footer={false}
                    onCancel={this.closeModal}
                >
                    <div className="text-c mb24">
                        <p>当前信息未保存，是否确认退出？</p>
                    </div>
                    <div className="text-c">
                        <button className="gym-button-default tmk-button-lg mr10" onClick={this.show}>确认</button>
                        <button className="gym-button-white tmk-button-lg" onClick={this.closeModal}>取消</button>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export {MemberTable};
