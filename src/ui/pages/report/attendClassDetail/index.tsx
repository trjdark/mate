/**
 * desc: 出席会员上课明细
 * User: Vicky.Yu
 * Date: 2020/9/9
 * Time: 17:30
 */
import React, {Component} from 'react';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import moment from 'moment';
import { Popover, message } from 'antd';
import { CommonUtils } from "@/common/utils/commonUtils";
import FullScreen from '../components/fullScreen';
import {attendClassList,exportAttendClassList} from "@redux-actions/report/messageReport";

class AtendClassDetail extends Component<any, any>{
    private routes:Array<any> = [
        {
            name: '报表',
            path: '',
            link: '#',
            id: 'report'
        },{
            name: '大服务类报表',
            path: '',
            link: '#',
            id: 'message'
        },{
            name: '出席会员上课明细',
            path: '',
            link: '#',
            id: 'attend-class-detail'
        }
    ];
    constructor(props:any){
        super(props)
        this.state = {
            columns: [],
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo:1,
            startDate: moment().startOf('month').valueOf(),
            endDate: moment().valueOf(),
            operator: null,
            canDownload: false,
            courseCode: null
        }
    };
    /**
     * 表头配置
     */
    private columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
        },{
            title: '合同状态',
            dataIndex: 'contractStatus',
        },{
            title:'排课类型',
            dataIndex:'bookWay',
        },{
            title: '课程代码',
            dataIndex: 'courseCode',
            render: (text) =>
                <Popover content={text}>
                    {CommonUtils.cutstr(text, 8)}
                </Popover>
        },{
            title: '课程日期',
            dataIndex: 'date',
        }, {
            title: '耗课数',
            dataIndex: 'courseNum',
        },{
            title: '上课状态',
            dataIndex: 'attendanceStatus',
        }, {
            title: '约课人员',
            dataIndex: 'operator',
        },{
            title:'GB',
            dataIndex:'gb',
        }, {
            title: 'GA',
            dataIndex: 'ga',
        }
    ];
    /**
     * 搜索框配置
     * @param {string} str
     */
    searchConfig = ():Array<any> => {
        const config = [
            {
                type: 'rangePicker',
                label: '课程日期',
                name: 'date',
                initialValue: [moment().startOf('month'), moment()],
            },{
                type: 'text',
                label: '课程代码',
                name: 'courseCode',
                placeholder: '课程代码\\活动名称'
            }
        ];
        return config;
    }
    componentDidMount(){}
    /**
     * 获取数据
     */
    getAttendClassList = () => {
        const { pageSize, pageNo, startDate, endDate, courseCode} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageSize, pageNo,
            startDate, endDate,courseCode
        };
        attendClassList(param).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
                canDownload: res.list.length>0?true:false
            })
        })
    };
    /**
     * 条件搜索
     * @param values
     */
    onSearch = (values:any) => {
        const param = Object.assign({}, values, {
            startDate: values.date ? moment(values.date[0]).valueOf() : null,
            endDate: values.date ? moment(values.date[1]).valueOf() : null,
            courseCode:values.courseCode ? values.courseCode : null
        })
        this.setState({
            pageNo:1,
            ...param,
        }, this.getAttendClassList);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.getAttendClassList);
    };
    /**
     * 导出
     */
    export = () => {
        const { startDate, endDate, canDownload,courseCode} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            startDate, endDate,courseCode
        }
        if (canDownload===true){
            exportAttendClassList(param)
        }else{
            message.error('暂无数据')
        }
    };
    render(){
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        return(
            <div id="gym-telephone-area-report" className="gym-telephone-area-report">
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />
                    <FullScreen
                        handleDownLoadExcel={this.export}
                        canDownload={dataSource.length > 0}
                    >
                        <TablePagination
                            dataSource={dataSource}
                            columns={this.columns}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={(item: any, index: number) => index}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </div>
        )
    }
}

export { AtendClassDetail}
