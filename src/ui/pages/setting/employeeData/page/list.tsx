/**
 * desc: 员工数据列表
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/1/6
 * Time: 下午6:54
 */
import React from 'react';
import {SearchForm} from "../../../../component/searchForm";
import {Routes} from "@/router/enum/routes";
import {connect} from "../../../../../common/decorator/connect";
import {getEmployeeList} from "@redux-actions/setting/employee";
import {selectEmployee, selectEmployeePost} from "../../../../../saga/selectors/setting/employee";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import history  from '@/router/history';
import { Modal } from '@/ui/component/customerCreateModal';

@connect((state: any) => ({
    employee: selectEmployee(state),
    postList: selectEmployeePost(state)
}), {})
class EmployeeDataList extends React.Component<any, any> {
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
     * 点击编辑
     * @param {string} status
     */
    edit =(record) =>{
        history.push(`${Routes.员工数据详情.link}${CommonUtils.stringify({ id: record.id })}`)
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
                    <button className=" gym-button-xxs gym-button-white" onClick={()=>this.edit(record)}>查看</button>
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
        return (
            <div className='gym-employee-list'>
                <SearchForm items={this.searchItem()} onSearch={this.onSearch}/>
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

export {EmployeeDataList}
