/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/2/10
 * Time: 上午10:41
 */
import  React, {Component, Fragment} from "react";
import {Link} from 'react-router-dom';
import {Icon, Divider, Spin} from 'antd';
import {Tooltip} from "@/ui/component/toolTip";
import {TablePagination} from "@/ui/component/tablePagination";
import {dateFields} from "@/ui/pages/customer/clientCenter/enum";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getTaskInfo} from "@redux-actions/customer/assignActions";
import {User} from "@/common/beans/user";
import {PageTitle} from "@/ui/component/pageTitle";
import {Icon as MyIcon} from "@/ui/component/icon";

class TableDiv extends Component<any, any>{
    state = {
        taskDoneInfo: null,
        taskTodoInfo: null,
        loadingFlag: false,
        selectedRowKeys: []
    };
    handleQuery = (visible, node) => {
        if(visible){
            const param = {
                leadsId: node.leadsId,
                currentCenterId: User.currentCenterId
            };
            this.setState({loadingFlag: true});
            getTaskInfo(param).then((res) => {
                this.setState({
                    taskDoneInfo: res.taskDoneInfo,
                    taskTodoInfo: res.taskTodoInfo,
                    loadingFlag: false,
                })
            }, () => {
                this.setState({loadingFlag: false})
            })
        }else{
            this.setState({
                taskDoneInfo: null,
                taskTodoInfo: null,
                loadingFlag: false,
            })
        }
    };
    renderModal = () => {
        const {taskDoneInfo, taskTodoInfo, loadingFlag}:any = this.state;
        return (
            <div style={{width: 500}} >
                <Spin spinning={loadingFlag}>
                    <div>
                        <PageTitle title='待办事项'/>
                        {
                            taskTodoInfo
                            ? (
                                <Fragment>
                                    <div className='flex mb15 flex-ai-center'>
                                        <div className='gym-client-center-typeBtn'>{taskTodoInfo.taskTheme}</div>
                                        <div>
                                            <p>{taskTodoInfo.taskThemeAndStatus}</p>
                                            <p>{taskTodoInfo.description}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-jc-between flex-ai-center'>
                                        <span>创建人：{taskTodoInfo.createBy}</span>
                                        <div>
                                            <p>创建时间：{taskTodoInfo.createTime}</p>
                                            <p>任务时间：{taskTodoInfo.taskTime}</p>
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                <p>无</p>
                            )
                        }

                    </div>
                    <Divider/>
                    <div>
                        <PageTitle title='跟进记录'/>
                        {
                            taskDoneInfo
                            ? (
                                <Fragment>
                                    <div className='flex mb15 flex-ai-center'>
                                        <div className='gym-client-center-typeBtn'>{taskDoneInfo.taskTheme}</div>
                                        <div>
                                            <p>{taskDoneInfo.taskThemeAndStatus}</p>
                                            <p>{taskDoneInfo.description}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-jc-between flex-ai-center'>
                                        <span>创建人：{taskDoneInfo.createBy}</span>
                                        <div>
                                            <p>创建时间：{taskDoneInfo.createTime}</p>
                                            <p>任务时间：{taskDoneInfo.taskTime}</p>
                                        </div>
                                    </div>
                                </Fragment>
                            ): (
                                <p>无</p>
                            )
                        }

                    </div>
                </Spin>
            </div>

        )
    };
    columns = () => {
        const {selectedColumns, sortName, sortOrder, errorLeads} = this.props;
        const list = [
            {
                title: '宝宝名',
                label: '宝宝名',
                dataIndex: 'babyName',
                render: (text, record) =>
                    <Fragment>
                        <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                            {text}
                        </Link>
                        <Tooltip
                            onVisibleChange={(e) => this.handleQuery(e, record)}
                            title={this.renderModal}
                            placement='right'
                            overlayClassName='gym-client-center-tooltip'
                        >
                            <span className='inBlock ml5'>
                                <Icon type='info-circle'/>
                            </span>
                        </Tooltip>
                        {record.tmkLock
                            ?
                            <Tooltip title='该leads在TMK中心,请联系HTMK进行解锁'
                                     placement='right'>
                                    <span className='inBlock  ml5'>
                                        <MyIcon type="suo" className='cDefault'/>
                                    </span>
                            </Tooltip>
                            :null
                        }
                    </Fragment>
            },{
                title:'',
                label:'',
                dataIndex:'error',
                render:(text, record) => {
                    const errInfo = errorLeads.filter(item => item.leadsId === record.leadsId);
                    if(errInfo.length > 0){
                        return <div className='c-error'>{errInfo[0].cause}</div>;
                    }
                }

            },{
                title: '昵称',
                label: '昵称',
                dataIndex: 'nickname',
            },
        ];
        return [...list, ...dateFields(sortName, sortOrder).filter(item => selectedColumns.includes(item.dataIndex))];
    };
    /**
     * 翻页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.props.emitChangePage(pageInfo)
    };
    /**
     * 排序
     */
    handleSort = (pagination, filters, sorter) => {
        const sortInfo = {
            sortName: sorter.columnKey || '',
            sortOrder: sorter.order || '',
        };
        this.props.emitSort(sortInfo.sortName, sortInfo.sortOrder);
    };
    rowSelection = () => {
        const {selectedRowKeys} = this.props;
        return {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
    };
    onSelectChange = selectedRowKeys => {
        this.props.emitSelectRowKeys(selectedRowKeys)

    };
    render(){
        const {pageNo, pageSize, totalSize, dataSource} = this.props;
        return(
            <div>
                <TablePagination
                    columns={this.columns()}
                    pageNo={pageNo}
                    rowKey='leadsId'
                    pageSize={pageSize}
                    totalSize={totalSize}
                    dataSource={dataSource}
                    handleChangePage={this.handleChangePage}
                    handleFilterTableChange={this.handleSort}
                    rowSelection={this.rowSelection()}
                />
            </div>
        )
    }
}

export {TableDiv }
