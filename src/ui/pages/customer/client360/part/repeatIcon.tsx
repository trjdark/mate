/**
 * desc: 重复号码
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/11/17
 * Time: 上午10:35
 */
import React, {Fragment} from 'react';
import {Icon} from '@/ui/component/icon';
import { Modal, Tooltip} from 'antd';
import {getRepeatLeadsList} from "@redux-actions/customer/customerAcquire";
import {User} from "@/common/beans/user";
import {Table} from "@/ui/component/tablePagination";

class RepeatIcon extends React.Component<any, any>{
    state = {
        visible: false,
        dataSource: []
    }
    handleShow = () => {
        const param = {
            leadsId:this.props.leadsId,
            currentCenterId: User.currentCenterId
        }
        getRepeatLeadsList(param).then(res => {
            this.setState({
                visible: true,
                dataSource: res
            })
        })
    }
    handleClose = () => {
        this.setState({visible: false})
    };
    columns = [
        {
            title: '中心名称',
            dataIndex: 'centerName',
        },{
            title: '阶段',
            dataIndex: 'phase',
        },{
            title: '手机号码',
            dataIndex: 'primaryContactTel',
        },{
            title: '最后一次获取日期',
            dataIndex: 'lastInquireDate',
        },{
            title: 'GB',
            dataIndex: 'gbName',
        },
    ]
    render(){
        const {visible, dataSource} = this.state;
        return (
            <Fragment>
                <Tooltip title='该leads的号码在其他中心登记过，点击图标查看。' placement='right'>
                    Leads信息
                    <Icon className="iconSize c-error ml5" type="zhongfu" onClick={this.handleShow}/>
                </Tooltip>
                <Modal
                    width={900}
                    visible={visible}
                    footer={false}
                    onCancel={this.handleClose}
                    closable={false}

                >
                    <Table
                        columns={this.columns}
                        dataSource={dataSource}
                        rowKey='leadsId'
                    />
                </Modal>
            </Fragment>
        )
    }
}

export {RepeatIcon};
