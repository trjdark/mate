 /**
 * desc: 审批管理列表
 * User: Vicky.yu
 * Date: 20120/12/4
 * Time: 17:00
 */

import React from 'react';
import { SearchForm } from "../../../../component/searchForm";
import { Routes } from "@/router/enum/routes";
import { getApproveList } from "@redux-actions/report/approve";
import { CommonUtils } from "../../../../../common/utils/commonUtils";
import { User } from "../../../../../common/beans/user";
import { selectEmployeePost } from "../../../../../saga/selectors/setting/employee";
import { TablePagination } from "../../../../component/tablePagination";
import '../style/index.scss';
import {Popover} from "antd";
import history from '@/router/history';
import { Modal } from '@/ui/component/modal';
import moment from 'moment';
import { connect } from '@/common/decorator/connect';

const applyType = {//
    "1005001": "帐号解锁",
    "1005002": "人员信息变更",
};
@connect((state: any) => ({
    postList: selectEmployeePost(state)
}), {})
class ApproveManageList extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            username: '',
            chineseName: '',
            englishName: '',
            postCode: '',
            currentCenterId: User.currentCenterId,
            dataSource: [],
            totalSize: 0,
            visible: false,
        }
    }

    componentDidMount() {
        this.handleSearch();
    }

    /**
     * 搜索
     * @param values
     */
    onSearch = (values: any) => {
        this.setState({
            ...values,
            pageNo: 1,
        }, this.handleSearch);
    };
    /**
     * 获取数据
     * @param body
     */
    handleSearch = () => {
        const {
            pageNo, pageSize, chineseName, englishName, postCode, currentCenterId
        } = this.state;
        getApproveList({
            pageNo, pageSize, chineseName, englishName, postCode, currentCenterId
        }).then((res: any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        });
    };
    /**
     * 分页搜索
     * @param pageInfo
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, this.handleSearch);
    };

    /**
     * 点击查看
     * HR和总部员工
     * @param {string} status
     */
    detail = (record) => {
        history.push(`${Routes.审批管理解锁审批.link}/${CommonUtils.stringify({ id: record.id,isEdit:0 })}`)

    }
    /**
     * 点击审批
     * @param {string} status
     */
    approve = (record) => {
        history.push(`${Routes.审批管理解锁审批.link}/${CommonUtils.stringify({ id: record.id, isEdit:1 })}`)
    }
    // 取消
    onCancel = () => {
        this.setState({ visible: false });
    }
    onOk = () => {

    }
    // 表头设置
    columns = [
        {
            title: '岗位',
            dataIndex: 'staffPostName',
            key: 'staffPostName',
        },
        {
            title: '中文名',
            dataIndex: 'chineseName',
            key: 'chineseName',
        },
        {
            title: '英文名',
            dataIndex: 'englishName',
            key: 'englishName',
        },
        {
            title: '申请类型',
            dataIndex: 'applyType',
            key: 'applyType',
            render:(text,record)=>(applyType[text])
        },
        {
            title: '申请理由',
            dataIndex: 'applyReason',
            key: 'applyReason',
            render:(text,record)=>{
                return text && <Popover content={text}>
                    <div>
                        {CommonUtils.cutstr(text,15)}
                    </div>
                </Popover>
            }


        },
        {
            title: '申请时间',
            dataIndex: 'applyTime',
            key: 'applyTime',
            render: (text) =>text&&moment(text).format('YYYY-MM-DD')
        },
        {
            title: '通过时间',
            dataIndex: 'approvalTime',
            key: 'approvalTime',
            render: (text) => text && moment(text).format('YYYY-MM-DD')
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {
                        record.approvalStatus === '1006001'&&
                        <button className=" gym-button-xxs gym-button-white" onClick={() => this.approve(record)}>审批</button>
                    }
                    {
                        (record.approvalStatus === '1006003' || record.approvalStatus === '1006002') &&
                        <button className="gym-button-xxs gym-button-white" onClick={() => this.detail(record)}>查看</button>
                    }
                </div>
            ),
        }];
    searchItem = (): any => {
        const { postList } = this.props;
        return [
            {
                type: 'select',
                label: '岗位',
                name: 'postCode',
                options: postList
            },
            {
                type: 'text',
                label: '中文名',
                name: 'chineseName',
            }, {
                type: 'text',
                label: '英文名',
                name: 'englishName',
            },
        ];
    }
    render() {
        const { dataSource, totalSize, visible, pageNo, pageSize } = this.state;
        return (
            <div className='gym-employee-list'>
                <SearchForm items={this.searchItem()} onSearch={this.onSearch} />
                <TablePagination
                    columns={this.columns}
                    rowKey={'id'}
                    dataSource={dataSource}
                    totalSize={totalSize}
                    pageSize={pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={pageNo}
                />
                <Modal
                    title=''
                    visible={visible}
                    handleOk={this.onOk}
                    handleCancel={this.onCancel}
                />
            </div>
        )
    }
}

export { ApproveManageList }
