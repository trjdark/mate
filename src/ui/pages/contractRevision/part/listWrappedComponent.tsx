/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/21
 * Time: 下午2:36
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {getContractReviseListFromHQ001} from "@redux-actions/contractRevise";
import moment from 'moment';
import {connect} from "@/common/decorator/connect";
import {selectContractReviseStatus, selectContractReviseType} from "@/saga/selectors/contract";
import {User} from "@/common/beans/user";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {exportListForCenter} from "@redux-actions/contractRevise";
import {selectBusinessSourceList} from "@/saga/selectors/home";

const listWrappedComponent = (WrappedComponent) => {
    @connect((state:any) => ({
        reviseStatus: selectContractReviseStatus(state),
        reviseType: selectContractReviseType(state),
        businessSourceMap: selectBusinessSourceList(state)
    }), {})
    class listWrappedComponentClass extends React.Component<any, any> {
        searchConfig = () => {
            const {reviseStatus, reviseType} = this.props;
            return [
                {
                    type: 'text',
                    label: '宝宝姓名',
                    name: 'babyName',
                    placeholder: '请输入'

                },
                {
                    type: 'text',
                    label: '合同编号',
                    name: 'contractCode',
                    placeholder: '请输入'
                },
                {
                    type: 'select',
                    label: '审批状态',
                    name: 'adjStatus',
                    options: reviseStatus
                                .filter(item => (item.code !== '2' && item.code !== '5') )
                                .map(item => ({postCode:item.code, postName:item.codeValue})),      // 不包含审批中，流程取消两个状态
                    placeholder: '请选择'
                },
                {
                    type: 'dates',
                    label: '审批日期',
                    name: {
                        start: 'approvalStartTime',
                        end: 'approvalEndTime'
                    }
                },
                {
                    type: 'select',
                    label: '调整类型',
                    name: 'adjTypes',
                    options: reviseType.map(item => ({postCode:item.code, postName:item.codeValue}))
                },
                {
                    type: 'text',
                    label: '中心号',
                    name: 'centerCode',
                    placeholder: '请输入'

                },
            ];
        }
        /**
         * 格式化审批状态
         * @param {string} status
         * @returns {any}
         */
        formatReviseStatus = (status:string) => {
            const {reviseStatus} = this.props;
            const date = reviseStatus.filter(item => item.code === status);
            return date.length > 0 ? date[0].codeValue : '-';
        };
        columnsConfig = () => {
            const {reviseStatus, reviseType, businessSourceMap} = this.props;
            return [
                {
                    title: '中心号',
                    dataIndex: 'centerCode'
                },
                {
                    title: '中心名称',
                    dataIndex: 'centerName'
                },
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName'
                },
                {
                    title: '合同编号',
                    dataIndex: 'contractCode'
                },
                {
                    title: '调整类型',
                    dataIndex: 'adjType',
                    render:(type:string) => {
                        const date = reviseType.filter(item => item.code === type);
                        return date.length > 0 ? date[0].codeValue : '-';
                    }
                },
                {
                    title: '申请时间',
                    dataIndex: 'applyDate',
                    render:(time:number) => moment(time).format('YYYY-MM-DD'),
                },
                {
                    title: '调整正课',
                    dataIndex: 'adjustCourseNum'
                },
                {
                    title: '调整赠课',
                    dataIndex: 'adjustFreeCourseNum'
                },
                {
                    title: '调整金额',
                    dataIndex: 'adjustCoursePrice'
                },
                {
                    title: '审批日期',
                    dataIndex: 'approvalTime',
                    render:(time:number) => time ? moment(time).format('YYYY-MM-DD') : '-',

                },
                {
                    title: '审批状态',
                    dataIndex: 'adjStatus',
                    render:(status:string) => {
                        const date = reviseStatus.filter(item => item.code === status);
                        return date.length > 0 ? date[0].codeValue : '-';
                    }
                },
                {
                    title: '业务类型',
                    dataIndex: 'businessType',
                    render: (text:string) => {
                        let res = businessSourceMap.filter((item:any) => item.businessSourceCode === text)
                        return res.length > 0 ? res[0].businessSourceValue : '-'
                    }                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    render: (text, record) => {
                        // 待审批单子，可以取消
                        const NONE_APPROVED = reviseStatus.filter(item => item.codeValue === '待审批')[0];
                        if(!NONE_APPROVED){
                            return '-'
                        }
                        return <Link to={`${Routes.合同调整详情.link}${CommonUtils.stringify({
                            id: record.id,
                            adjStatus:record.adjStatus
                        })}`}>
                            <button className='gym-button-xxs gym-button-white'>{
                                (record.adjStatus === NONE_APPROVED.code || (
                                    User.permissionList.includes(FUNC['总部财务审批']) &&
                                    this.formatReviseStatus(record.adjStatus) === '待总部审批'
                                ))
                                ? '审批'
                                : '查看'
                            }</button>
                        </Link>
                    }
                },
            ];
        }
        constructor(props){
            super(props)
            this.state = {
                list: [],
                totalSize: 0
            }
        }

        handleQuery = (arg:any) => {
            const param = Object.assign({}, arg, {
                currentCenterId: User.currentCenterId,
                approvalStartTime: arg.approvalStartTime ? moment(arg.approvalStartTime).startOf('d').valueOf() : null,
                approvalEndTime: arg.approvalEndTime ? moment(arg.approvalEndTime).endOf('d').valueOf():null,
            });
            getContractReviseListFromHQ001(param).then((res) => {
                this.setState({
                    list:res.list,
                    totalSize: res.totalSize
                })
            })
        };
        handleExport = (arg:any, name:string) => {
            const param = Object.assign({}, arg, {
                currentCenterId: User.currentCenterId,
                approvalStartTime: arg.approvalStartTime ? moment(arg.approvalStartTime).startOf('d').valueOf() : null,
                approvalEndTime: arg.approvalEndTime ? moment(arg.approvalEndTime).endOf('d').valueOf():null,
            });
            exportListForCenter(param, name)
        };
        render(){
            const {list, totalSize } = this.state;
            return(
                <Fragment>
                    <WrappedComponent
                        searchConfig={this.searchConfig()}
                        columnsConfig={this.columnsConfig()}
                        search={this.handleQuery}
                        dataSource={list}
                        totalSize={totalSize}
                        emitExport={this.handleExport}
                        {...this.props}
                    />
                </Fragment>
            )
        }
    }
    return listWrappedComponentClass;
}

export {listWrappedComponent};
