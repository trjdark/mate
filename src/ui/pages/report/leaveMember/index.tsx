/**
 * desc: 请假会员名单
 * User: Vicky.Yu
 * Date: 2020/9/9
 * Time: 14:50
 */
import React, {Component} from 'react';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import moment from 'moment';
import { message } from 'antd';
import FullScreen from '../components/fullScreen';
import { getLeaveClassList, exportLeaveList, getAllCourse } from "@redux-actions/report/messageReport";

class LeaveMember extends Component<any, any>{
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
            name: '请假明细',
            path: '',
            link: '#',
            id: 'course-vital'
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
            lessonStartDate: moment().startOf('month').valueOf(),
            lessonEndDate: moment().endOf('day').valueOf(),
            leaveStartDate:null,
            leaveEndDate:null,
            canDownload: false,
            courseCode: null,
            options: []
        }
    };

    /**
     * 表格头配置
     * @type {{title: string; dataIndex: string}[]}
     */
    private columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
        }, {
            title: '月龄',
            dataIndex: 'babyMonth',
        }, {
            title: '合同状态',
            dataIndex: 'contractStatus',
        },{
            title:'排课类型',
            dataIndex:'bookWay',
        },{
            title: '课程日期',
            dataIndex: 'lessonDate',
        },{
            title: '课程代码',
            dataIndex: 'courseCode',
        }, {
            title: '请假日期',
            dataIndex: 'leaveTime',
        }, {
            title: '请假人员',
            dataIndex: 'leaveStaff',
        },{
            title:'GB',
            dataIndex:'gb',
        }, {
            title: 'GA',
            dataIndex: 'ga',
        }
    ];
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const options = this.state.options
        const config = [
            {
                type: 'rangePicker',
                label: '课程日期',
                name: 'courseDate',
                initialValue: [moment().startOf('month'), moment()],
            },
            {
                type: 'rangePicker',
                label: '请假日期',
                name: 'leaveDate',
            },
            {
                type: 'select',
                label: '课程代码',
                name: 'courseId',
                options
            }
        ];
        return config;
    }
    componentDidMount(){
        getAllCourse({
            currentCenterId: User.currentCenterId,
            staffId:User.userId
        }).then(res => {
            const allCourseCode = res.map(item => ({
                postCode: item.id,
                postName: item.courseCode
            }))
            this.setState({
                options:allCourseCode
            })
        })
    }
    /**
     * 获取数据
     */
    getContentList = () => {
        const { pageSize, pageNo, lessonStartDate, lessonEndDate, leaveStartDate, leaveEndDate, courseId} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageSize, pageNo,
            lessonStartDate, lessonEndDate,
            leaveStartDate, leaveEndDate,
            courseId
        };
        getLeaveClassList(param).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
                canDownload:res.list.length>0?true:false
            })
        })
    };
    /**
     * 条件搜索
     * @param values
     */
    onSearch = (values:any) => {
        const param = Object.assign({}, values, {
            lessonStartDate: values.courseDate ? moment(values.courseDate[0]).valueOf() : null,
            lessonEndDate: values.courseDate ? moment(values.courseDate[1]).valueOf() : null,
            leaveStartDate: values.leaveDate ? moment(values.leaveDate[0]).valueOf() : null,
            leaveEndDate: values.leaveDate ? moment(values.leaveDate[1]).valueOf() : null,
            courseId:values.courseId
        })
        this.setState({
            pageNo:1,
            ...param,
        }, this.getContentList);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.getContentList);
    };
    /**
     * 导出
     */
    export = () => {
        const { startTime, endTime, lessonStartDate, lessonEndDate, leaveStartDate, leaveEndDate, canDownload, courseId} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            startTime, endTime,
            lessonStartDate, lessonEndDate,
            leaveStartDate, leaveEndDate,courseId
        }
        if (canDownload===false){
            message.error('暂无数据')
        }else{
            exportLeaveList(param)
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
                            rowKey="id"
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </div>
        )
    }
}

export { LeaveMember}
