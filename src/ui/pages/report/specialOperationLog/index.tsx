/*
 * @desc: 特殊操作日志记录
 * @Author: luck
 * @User: luck.yuan@gymboglobal.com
 * @Date: 2021-10-21 17:31:12
 * @LastEditTime: 2022-01-05 11:44:34
 */
import React, { Component, Fragment } from 'react';
import { User } from "@/common/beans/user";
import { FUNC } from "@/ui/pages/setting/enum/functions";
import { TablePagination } from "@/ui/component/tablePagination";
import moment from 'moment';
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import { message } from 'antd';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import FullScreen from '../components/fullScreen';
import { operateTypeOptions } from './enum';
import { exportOperateLogRecord, getOperateLogRecord } from '@redux-actions/report/messageReport';
import { Link } from 'react-router-dom';
import { CustomerRoutes } from '@/router/enum/customerRoutes';
import { CommonUtils } from '@/common/utils/commonUtils';

interface SpecialOperationLogProps{
    [propName: string]: any;
}

interface SpecialOperationLogState{
    babyName:string;                                // 宝宝姓名
    primaryTel:string;                              // 手机号码
    operator:string;                                // 操作人
    operateStartDate: number;                       // 操作时间（开始）
    operateEndDate: number;                         // 操作时间（结束）
    operateType:string;                             // 操作类型选项
    lastSyncDatetime: string | number;              // 数据更新时间
    dataSource:Array<string | number>;              // 表单数据
    totalSize?:number,
    pageNo?:number,
    pageSize?: number,
    [propName: string]: any;
}

const selectOption = {
    leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
};

@connect((state:any) => ({
    staffList: selectTotalEmployeeList(state, selectOption),
}))
class SpecialOperationLog extends Component<SpecialOperationLogProps, SpecialOperationLogState>{

    private routes = [
        {
            name: '客户',
        },{
            name: '客户信息管理',
        },{
            name: '特殊操作日志记录',
        }
    ];

    private searchConfig = ():Array<any> => {
        const {staffList} = this.props;
        const selectOption = staffList.map((item: any) => ({
            postCode: item.staffId,
            postName: `${item.englishName} ${item.chineseName}`,
        }));
        return [
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder:'请输入宝宝姓名'
            },
            {
                type: 'text',
                label: '手机号码',
                name: 'primaryTel',
                placeholder:'请输入11位手机号码'
            },
            {
                type: 'select',
                label: '操作人',
                name: 'operator',
                options:selectOption,
            },
            {
                type: 'rangePicker',
                label: '操作时间',
                name: 'operateDate',
                initialValue: [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
            },
            {
                type: 'select',
                label: '操作类型',
                name: 'operateType',
                options: operateTypeOptions,
            }
        ];
    }

    private columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            render: (text:string, record:any) => <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target='_blank'>{text}</Link>
        },
        {
            title: '昵称',
            dataIndex: 'nickName',
        },
        {
            title: '手机号码',
            dataIndex: 'primaryTel',
        },
        {
            title: '阶段',
            dataIndex: 'phase',
        },
        {
            title: '操作人',
            dataIndex: 'operator',
        },
        {
            title: '操作人岗位',
            dataIndex: 'operatePost',
        },
        {
            title: '当前GA',
            dataIndex: 'ga',
        },
        {
            title: '当前GB',
            dataIndex: 'gb',
        },
        {
            title: '操作类型',
            dataIndex: 'operateType',
        },
        {
            title: '操作明细',
            dataIndex: 'operateDetailed',
        },
        {
            title: '操作时间',
            dataIndex: 'operateDate',
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : null,
        },
        {
            title: 'leadsID',
            dataIndex: 'leadsId',
        },
    ]

    constructor(props:any){
        super(props)
        this.state = {
            currentCenterId:User.currentCenterId,
            babyName:'',
            primaryTel:'',
            operator:'',
            operateStartDate: moment().subtract(6, 'days').startOf('day').valueOf(),
            operateEndDate: moment().endOf('day').valueOf(),
            operateType:null,

            lastSyncDatetime:'',
            dataSource:[],
            totalSize: 0,
            pageSize: 10,
            pageNo:1,
        }
    }

    componentDidMount(){}

    getOperateLogRecordList = () =>{
        const {currentCenterId,pageNo,pageSize,babyName,primaryTel,operator,operateStartDate,operateEndDate,operateType} = this.state;
        const params ={currentCenterId,pageNo,pageSize,babyName,primaryTel,operator,operateStartDate,operateEndDate,operateType};
        const endTime = moment(operateStartDate).add(moment.duration({ 'year': 0.5 })).valueOf();
        if(operateEndDate > endTime){
            // 判断如果选中结束时间>上面后推半年，提示：最多支持查询的半年的数据
            message.warning('最多支持查询半年的数据');
            return;
        }else{
            getOperateLogRecord(params).then((res) =>{
                this.setState({
                    dataSource: res.list,
                    totalSize:res.totalSize,
                    operateStartDate,
                    operateEndDate,
                    lastSyncDatetime: Date.now(),
                })
            })
        }
    }

    onSearch = (values:any) => {
        const params = Object.assign({}, values, {
            babyName:values.babyName,
            primaryTel:values.primaryTel,
            operator:values.operator,
            operateStartDate:values.operateDate ? moment(values.operateDate[0]).startOf('day').valueOf():null,
            operateEndDate:values.operateDate ? moment(values.operateDate[1]).endOf('day').valueOf():null,
            operateType:values.operateType,
        });
        this.setState({
            ...params,
            pageNo:1,
        }, this.getOperateLogRecordList);
    }

    /**
     * 换页
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.getOperateLogRecordList);
    };

    /**
     * 导出
     */
    export = () => {
        const {currentCenterId,pageNo,pageSize,babyName,primaryTel,operator,operateStartDate,operateEndDate,operateType} = this.state;
        const params = {currentCenterId,pageNo,pageSize,babyName,primaryTel,operator,operateStartDate,operateEndDate,operateType};
        // 获取选中开始时间往后推一年
        const endTime = moment(operateStartDate).add(moment.duration({ 'year': 0.5 })).valueOf();
        if(operateEndDate > endTime){
            // 判断如果选中结束时间>上面后推半年，提示：最多支持导出的半年的数据
            message.warning('最多支持导出半年的数据');
            return;
        }else{
            exportOperateLogRecord(params)
        }
    };

    render(){
        const {dataSource,lastSyncDatetime,totalSize,pageNo,pageSize} = this.state;
        const permissionList = User.permissionList;
         return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />
                    <FullScreen
                        handleDownLoadExcel={this.export}
                        canDownload={(dataSource.length > 0)&&(permissionList.includes(`${FUNC[`特殊操作日志记录-导出`]}`))}
                        lastSyncDatetime={lastSyncDatetime}
                        fyi={'上线之前的数据仅供参考。'}
                    >
                        <TablePagination
                            dataSource={dataSource}
                            columns={this.columns}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={(item: any, index: number) => index}
                            handleChangePage={this.handleChangePage}
                            scroll={{ x:2200 }}
                        />
                    </FullScreen>
                </div>
            </Fragment>
         )
    }
}

export {SpecialOperationLog};
