/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/8/24
 * Time: 下午4:39
 */
import React, {Component, Fragment} from 'react';
import {CommonUtils} from "@/common/utils/commonUtils";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {getMonthPlanDetail,  getWeekPlanDetail, getMonthDidDetail} from "@redux-actions/report/dashboard";
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import moment from 'moment';

class CenterAchievePanelDetail extends Component<any, any>{
    type:1|2|3;             // 1本周计划到访,2本月计划到访,3本月已到访
    staffId:string;         // 员工ID
    routerConfig = [
        {name: '仪表盘',path: '', link: '#', id: 'dashboard'},
        {name: 'CD面板',path: '', link: '#', id: 'dashboard_cd'},
    ];
    columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'babyName'
        },{
            title: '月龄',
            dataIndex: 'babyMonth'
        },{
            title: '联系人手机',
            dataIndex: 'phone'
        },{
            title: '出现方式',
            dataIndex: 'appearanceType'
        },{
            title: '渠道来源',
            dataIndex: 'channelType'
        },{
            title: '市场渠道名称',
            dataIndex: 'marketingActivityName'
        },{
            title: 'GB',
            dataIndex: 'gb'
        },{
            title: 'GA',
            dataIndex: 'ga'
        },{
            title: 'LeadsID',
            dataIndex: 'leadsId'
        },{
            title: 'BabyID',
            dataIndex: 'babyId'
        },
    ];
    constructor(props:any){
        super(props);
        this.type = CommonUtils.parse(props).type;
        this.staffId = CommonUtils.parse(props).staffId;
        const option = new Map([
            [1, {name: '本周计划到访',path: '', link: '#', id: 'dashboard_cd_week_plan'}],
            [2, {name: '本月计划到访',path: '', link: '#', id: 'dashboard_cd_month_plan'}],
            [3, {name: '本月已到访',path: '', link: '#', id: 'dashboard_cd_month_did'}],
        ]);
        const columnsOption = new Map([
            [1, {title: '计划到访时间', dataIndex: 'visitTime', render:(date:number) => moment(date).format("YYYY-MM-DD hh:mm:ss")}],
            [2, {title: '计划到访时间', dataIndex: 'visitTime', render:(date:number) => moment(date).format("YYYY-MM-DD hh:mm:ss")}],
            [3, {title: '到访时间', dataIndex: 'visitTime', render:(date:number) => moment(date).format("YYYY-MM-DD hh:mm:ss")}],
        ]);
        this.routerConfig = [...this.routerConfig, option.get(this.type)];
        this.columns = [...this.columns.slice(0,6), columnsOption.get(this.type), ...this.columns.slice(6)]
        this.state = {
            pageNo: 1,
            pageSize: 10,
            dataSource: [],
            totalSize: 0,
        }
    }
    componentDidMount(){
        this.queryData()
    }

    queryData = () => {
        switch (this.type){
            case 1:
                this.queryWeekPlanDetail();
                break;
            case 2:
                this.queryMonthPlanDetail();
                break;
            case 3:
                this.queryMonthDidDetail();
                break;
        }
    };
    /**
     * 本月计划到访
     */
    queryMonthPlanDetail = () => {
        const {pageNo, pageSize} = this.state;
        const param = {
            pageNo, pageSize,
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
            staffId: this.staffId
        }
        getMonthPlanDetail(param).then((res) => {
            this.setState({
                dataSource:res.list,
                totalSize:res.totalSize
            })
        })
    }
    /**
     * 本周计划到访
     */
    queryWeekPlanDetail = () => {
        const {pageNo, pageSize} = this.state;
        const param = {
            pageNo, pageSize,
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
            staffId: this.staffId
        }
        getWeekPlanDetail(param).then((res) => {
            this.setState({
                dataSource:res.list,
                totalSize:res.totalSize
            })

        })
    }
    /**
     * 本月已到访
     */
    queryMonthDidDetail = () => {
        const {pageNo, pageSize} = this.state;
        const param = {
            pageNo, pageSize,
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
            staffId: this.staffId
        }
        getMonthDidDetail(param).then((res) => {
            this.setState({
                dataSource:res.list,
                totalSize:res.totalSize
            })

        })
    };
    /**
     * 分页
     * @param pageInfo
     */
    changePage = (pageInfo:any) => {
        this.setState(pageInfo, this.queryData);
    };
    render(){
        const {pageNo, pageSize, dataSource, totalSize} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routerConfig}/>
                <div className='page-wrap'>
                    <TablePagination
                        dataSource={dataSource}
                        columns={this.columns}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        totalSize={totalSize}
                        handleChangePage={this.changePage}
                    />
                </div>
            </Fragment>
        )
    }
}

export {CenterAchievePanelDetail}
