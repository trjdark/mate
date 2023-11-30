/**
 * desc: 到访表
 * User: katarina.yuan
 * Date: 2021/9/23
 * Time: 15:15
 */
import React, {Component} from 'react';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import moment from 'moment';
import {message} from 'antd';
import FullScreen from '../components/fullScreen';
import {exportVisitQueryReportList,visitQueryReportList} from "@redux-actions/report/messageReport";
import {finishStatusList, countScopeList, columns, enumList, visitCountList} from "@/ui/pages/report/visitForm/enum";
import {Filter} from "@/filter/filter";
import {PageTitle} from "@/ui/component/pageTitle";
import MultiCenterExportButton from '../components/multiCenterExportButton';
import { FUNC } from '../../setting/enum/functions';
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import "./style/index.scss"
import { handleVisitExport } from '@redux-actions/report/multiCenterReport';

class VisitForm extends Component<any, any>{
    // 面包屑
    private routes:Array<any> = [
        {
            name: '报表',
            path: '',
            link: '#',
            id: 'report'
        },{
            name: '市场类报表',
            path: '',
            link: '#',
            id: 'market'
        },{
            name: '到访表',
            path: '',
            link: '#',
            id: 'visit-form'
        }
    ];
    // 数据项默认选择字段
    private DEFAULT_FIELDS:Array<any> = [
        'babyName', 'babyMonth', 'babyGender', 'contactName',
        'primaryContactTel', 'visitCount',  'oppTime', 'executorName', 'createDate', 'taskTime',
        'taskStatus', 'taskFinishTime', 'lastVisitTime', 'assessDate', 'lastPreviewDate',
        'toVisitCount', 'signTime'
    ];
    constructor(props:any){
        super(props)
        this.state = {
            columns: this.DEFAULT_FIELDS,               // 查询字段
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo:1,
            canDownload: false,
            courseCode: null,
            createDateBegin: null,     // 诺访时间开始
            createDateEnd: null,       // 诺访时间结束
            taskTimeBegin: null,       // 计划到访时间开始
            taskTimeEnd: null,         // 计划到访时间结束
            taskFinishTimeBegin: null, // 任务完成时间开始
            taskFinishTimeEnd: null,   // 任务完成时间结束
            finishStatus: '65001',     // 完成状态
            visitCount: null,          // 至今已到访次数
            countScope: '1',          // 统计范围
            inquireDateBegin: null,    // 获取时间开始
            inquireDateEnd: null,      // 获取时间结束
            fields: []
        }
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        return  [
            {
                type: 'rangePicker',
                label: '诺访时间',
                name: 'createDate',
            },
            {
                type: 'rangePicker',
                label: '计划到访时间',
                name: 'taskTime',
            },
            {
                type: 'rangePicker',
                label: '任务完成时间',
                name: 'taskFinishTime',
            },
            {
                type: 'select',
                label: '首/多访',
                name: 'visitCount',
                options: visitCountList,
            },
            {
                type: 'select',
                label: '完成状态',
                name: 'finishStatus',
                options: finishStatusList,
                initialValue: '65001'
            },
            {
                type: 'rangePicker',
                label: '获取时间',
                name: 'inquireDate',
            },
            {
                type: 'select',
                label: '统计范围',
                name: 'countScope',
                options: countScopeList,
                initialValue: '1'
            },
            {
                type: 'checkbox',
                label: '数据项',
                name: 'columns',
                options: columns,
                initialValue: this.DEFAULT_FIELDS,
                handleChange: this.handleColumnsChange
            },
        ];
    }
    componentDidMount(){
        this.onReset()
    }
    // 勾选数据项改变表头（必传）
    handleColumnsChange = (arr) => {
        const newData = arr.map(item=>{
            if(item.dataIndex==='babyName'){
                return {render:(text,record)=>(
                        <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
                    ),...item}
            }
            return item
        })
        this.setState({
                          fields: newData
                      })
    }
    // 获取数据
    getContentList = () => {
        const {
            createDateBegin, createDateEnd,
            taskTimeBegin, taskTimeEnd,
            taskFinishTimeBegin, taskFinishTimeEnd,
            visitCount,
            finishStatus, countScope,
            inquireDateBegin, inquireDateEnd, columns,
            pageNo, pageSize
        } = this.state;
        const param = {
            centerId: User.currentCenterId,
            createDateBegin, createDateEnd,
            taskTimeBegin, taskTimeEnd,
            taskFinishTimeBegin, taskFinishTimeEnd,
            visitCount,
            finishStatus, countScope,
            inquireDateBegin, inquireDateEnd, columns,
            pageNo, pageSize
        };
        visitQueryReportList(param).then((res) => {
            const arr = res.list.map(item=>{
                item.createDate = item.createDate?moment(item.createDate).format('YYYY-MM-DD HH:mm:ss'):''
                item.inquireDate = item.inquireDate?moment(item.inquireDate).format('YYYY-MM-DD'):''
                item.leadsCreateDate = item.leadsCreateDate?moment(item.leadsCreateDate).format('YYYY-MM-DD'):''
                item.taskTime = item.taskTime?moment(item.taskTime).format('YYYY-MM-DD HH:mm:ss'):''
                item.taskFinishTime = item.taskFinishTime?moment(item.taskFinishTime).format('YYYY-MM-DD HH:mm:ss'):''
                item.oppTime = item.oppTime?moment(item.oppTime).format('YYYY-MM-DD'):''
                item.lastVisitTime = item.lastVisitTime?moment(item.lastVisitTime).format('YYYY-MM-DD HH:mm:ss'):''
                item.assessDate = item.assessDate?moment(item.assessDate).format('YYYY-MM-DD'):''
                item.lastPreviewDate = item.lastPreviewDate?moment(item.lastPreviewDate).format('YYYY-MM-DD'):''
                item.taskStatus = enumList.get(item.taskStatus)
                item.babyGender = item.babyGender?item.babyGender.replace(/(0)/g, '女').replace(/1/g, '男'):''
                item.appearanceType = Filter.formatAppearanceType(item.appearanceType)
                item.channelType = Filter.formatChannelType(item.channelType)
                item.intentionLevel = Filter.formatIntentionLevel(item.intentionLevel)
                return item
            })
            this.setState({
                dataSource: arr,
                totalSize: res.totalSize,
                canDownload:res.length>0,
            })
        })
    };
    /**
     * 条件搜索
     * @param values
     */
    onSearch = (values:any) => {
        if (this.state.fields.length === 0) {
            return message.warning('请选择数据项');
        }
        const param = Object.assign({}, values, {
            createDateBegin: values.createDate ? moment(values.createDate[0]).startOf('day').valueOf() : null,
            createDateEnd: values.createDate ? moment(values.createDate[1]).endOf('day').valueOf() : null,
            taskTimeBegin: values.taskTime ? moment(values.taskTime[0]).startOf('day').valueOf() : null,
            taskTimeEnd: values.taskTime ? moment(values.taskTime[1]).endOf('day').valueOf() : null,
            taskFinishTimeBegin: values.taskFinishTime ? moment(values.taskFinishTime[0]).startOf('day').valueOf() : null,
            taskFinishTimeEnd: values.taskFinishTime ? moment(values.taskFinishTime[1]).endOf('day').valueOf() : null,
            finishStatus:values.finishStatus,
            countScope:values.countScope,
            visitCount:values.visitCount,
            inquireDateBegin: values.inquireDate ? moment(values.inquireDate[0]).startOf('day').valueOf() : null,
            inquireDateEnd: values.inquireDate ? moment(values.inquireDate[1]).endOf('day').valueOf() : null,
            columns:values.checkbox,
        })
        this.setState({
            ...param,
            pageNo:1
        },
        this.getContentList);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        },
        this.getContentList);
    };
    // 重置
    onReset = () => {
        this.setState({
            fields: columns
                .filter(item => this.DEFAULT_FIELDS.includes(item.postCode))
                .map(item => {
                    switch (item.postCode) {
                        case 'appearanceType':
                            return {dataIndex: item.postCode, title: item.postName, render: (text:string) => Filter.formatAppearanceType(text)};
                            break;
                        case 'babyName':
                            return {dataIndex: item.postCode, title: item.postName, render:(text,record)=>(
                                    <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
                                )};
                            break;
                        case 'channelType':
                            return {dataIndex: item.postCode, title: item.postName, render: (text:string) => Filter.formatChannelType(text)}
                            break;
                        case 'intentionLevel':
                            return {dataIndex: item.postCode, title: item.postName, render: (text:string) => Filter.formatIntentionLevel(text)}
                            break;
                        case 'babyGender':
                            return {dataIndex: item.postCode, title: item.postName, render: (text:string) => text?text.replace(/(0)/g, '女').replace(/1/g, '男'):''}
                        default:
                            return {dataIndex: item.postCode,title: item.postName}
                            break;
                    }
                })
        })
    };
    /**
     * 导出
     */
    export = () => {
        const {
            createDateBegin, createDateEnd,
            taskTimeBegin, taskTimeEnd,
            taskFinishTimeBegin, taskFinishTimeEnd,
            visitCount,
            finishStatus, countScope,
            inquireDateBegin, inquireDateEnd, columns,} = this.state;
        const param = {
            centerId: User.currentCenterId,
            createDateBegin, createDateEnd,
            taskTimeBegin, taskTimeEnd,
            taskFinishTimeBegin, taskFinishTimeEnd,
            visitCount,
            finishStatus, countScope,
            inquireDateBegin, inquireDateEnd, columns,
        };
        exportVisitQueryReportList(param)
    };
    render(){
        const {dataSource, totalSize, pageNo, pageSize, fields} = this.state;
        const hasPermission = User.permissionList.includes(`${FUNC[`到访表多中心导出`]}`);
        return (
            <div className="gym-visit-form">
                <BreadCrumb routes={this.routes} />
                <div className="page-wrap">
                    <div className="gym-visit-form-card">
                        <SearchForm
                            items={this.searchConfig()}
                            onSearch={this.onSearch}
                            onReset={this.onReset}
                            center={true}
                        />
                    </div>
                </div>
                <div className="page-wrap">
                    <PageTitle
                        title="查询结果"
                        className="gym-report-result-title"
                    />
                    {
                        hasPermission &&
                        <div className='gym-report-multicenterexport-button'>
                            <MultiCenterExportButton
                                emitMultiCenterExport={this.handleMultiCenterExport}
                            ></MultiCenterExportButton>
                            <span className='desc'>多中心导出提交后，请前往单中心报表-下载已审批导出报表页面查看和下载！</span>
                        </div>
                    }
                    <FullScreen
                        handleDownLoadExcel={this.export}
                        canDownload={dataSource.length > 0}
                        >
                        <TablePagination
                            dataSource={dataSource}
                            columns={fields}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={(item: any, index: number) => index}
                            handleChangePage={this.handleChangePage}
                            scroll={{ x: "max-content" }}
                        />
                    </FullScreen>
                </div>
            </div>
        );
    }

    //多中心导出
    handleMultiCenterExport = (isCheckedCenter:Array<string>) => {
        const {
            createDateBegin, createDateEnd, taskTimeBegin, taskTimeEnd,
            taskFinishTimeBegin, taskFinishTimeEnd,visitCount,
            finishStatus, countScope,inquireDateBegin, inquireDateEnd, columns} = this.state;
        const params = {
            createDateBegin, createDateEnd, taskTimeBegin, taskTimeEnd,
            taskFinishTimeBegin, taskFinishTimeEnd,
            visitCount,finishStatus, countScope,inquireDateBegin,
            inquireDateEnd, columns,centerCodeList:isCheckedCenter
        };
        handleVisitExport(params)
    };

}

export { VisitForm }
