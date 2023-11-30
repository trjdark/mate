/**
 * desc: 员工管理列表
 * User:
 * Date: 2018/8/16
 * Time: 上午10:56
 */
import React from 'react';
import {Link} from "react-router-dom";
import { Button} from 'antd';
import {SearchForm} from "../../../../component/searchForm";
import {Routes} from "@/router/enum/routes";
import {connect} from "../../../../../common/decorator/connect";
import {getEmployeeList} from "@redux-actions/setting/employee";
import {selectEmployee, selectEmployeePost} from "../../../../../saga/selectors/setting/employee";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import '../style/index.scss';
import history  from '@/router/history';
import { Modal } from '@/ui/component/customerCreateModal';

@connect((state: any) => ({
    employee: selectEmployee(state),
    postList: selectEmployeePost(state)
}), {})
class EmployeeList extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            workingStatus: 1,
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
        if(!User.isHQ){
            this.handleSearch();
        }
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
            pageNo, pageSize, workingStatus, username, chineseName, englishName, postCode, currentCenterId
        } = this.state;
        getEmployeeList({
            pageNo, pageSize, workingStatus, username, chineseName, englishName, postCode, currentCenterId
        }).then((res:any) => {
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
     * 格式化在职状态
     * @param {string} status
     */
    formatWorkingStatus = (status:string) => {
        const _status = status.toString();
        const options = new Map([
            ['0','停用'],
            ['1','正常'],
            ['2','锁定'],
            ['default','-'],
        ]);
        return options.get(_status) ? options.get(_status): options.get('default');
    };
    /**
     * 点击解锁
     * HR和总部员工
     * @param {string} status
     */
    lock = (record) => {
        // hr角色发起申请
        history.push(`${Routes.解锁审批员工信息.link}/${CommonUtils.stringify({id:record.id})}`)
    }
    /**
     * 点击编辑
     * @param {string} status
     */
    edit =(record) =>{
        history.push(`${Routes.修改员工信息.link}/${CommonUtils.stringify({ id: record.id })}`)
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
            dataIndex: 'postName',
            key: 'postName',
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
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '在职状态',
            dataIndex: 'workingStatus',
            key: 'workingStatus',
            render: (text) => this.formatWorkingStatus(text)
        },
        {
            title: '手机号码',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '主中心',
            dataIndex: 'primaryCenterName',
            key: 'primaryCenterName',
            render: (text, record) => {
                return `${record.primaryCenterCode ? record.primaryCenterCode + "-" : ''}${text}`
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <button className=" gym-button-xxs gym-button-white" onClick={()=>this.edit(record)}>编辑</button>
                    {
                        (User.currentCenterId !== 'C_HQ001' && User.role.includes('HR') && record.workingStatus===2)&&
                        <Button
                            className="gym-button-xxs gym-button-white gym-button-lock"
                            onClick={()=>this.lock(record)}
                            disabled={record.approvalStatus==='1'?true:false}
                            >解锁</Button>
                    }
                </div>
            ),
        }];
    searchItem = ():any => {
        const {postList} = this.props;
        return [
            {
                type: 'text',
                label: '中文名',
                name: 'chineseName',
            }, {
                type: 'text',
                label: '英文名',
                name: 'englishName',
            }, {
                type: 'text',
                label: '用户名',
                name: 'username',
            }, {
                type: 'select',
                label: '在职状态',
                name: 'workingStatus',
                options: [{
                    postCode: 1,
                    postName: '正常'
                }, {
                    postCode: 0,
                    postName: '停用'
                }, {
                    postCode: 2,
                    postName: '锁定'
                }],
                initialValue:1
            }, {
                type: 'select',
                label: '岗位',
                name: 'postCode',
                options: postList
            },
        ];
    }
    render() {

        const {dataSource, totalSize,visible, pageNo, pageSize} = this.state;
        const shouldAddRole = User.isHQ && User.role.includes('ADMIN');
        return (
            <div className='gym-employee-list'>
                <SearchForm items={this.searchItem()} onSearch={this.onSearch}/>
                <Link to={Routes.添加员工信息.path}>
                    {shouldAddRole && <button className='gym-button-default-xs mb20 ml30'>+ 新建</button>}
                </Link>
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
                    visible={visible}
                    handleOk={this.onOk}
                    handleCancel={this.onCancel}
                    contentText={`请确认是解除锁定？`}
                />
            </div>
        )
    }
}

export {EmployeeList}
