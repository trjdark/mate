/**
 * desc: 月度回顾列表
 * User: Katarina.Yuan
 * Date: 2021/6/15
 * Time: 下午3:00
 */
import React, { Fragment } from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { User } from "@/common/beans/user";
import moment from 'moment';
import { TablePagination } from "@/ui/component/tablePagination";
import history from "@/router/history";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getManageList} from "@redux-actions/teaching/feedBack";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import '../style/index'
import {FUNC} from "@/ui/pages/setting/enum/functions";

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const gbOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ["GB","HGB"]
    }
    :{
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GB","HGB"]
    };

const gaOption = isPostTransRole
    ?{
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ["GA","HGA"]
    }
    :{
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GA","HGA"]
    };

@connect((state) => ({
    gbList: selectTotalEmployeeList(state, gbOption),
    gaList: selectTotalEmployeeList(state, gaOption),

}))
class MonthlyReportList extends React.Component<any,any> {
    // 面包屑
    private routes: Array<any> =[
        { name: '教学' },
        { name: '教学管理' },
        { name: '月度回顾管理' },

    ]
    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
            dataSource: [],       // 数据
            babyName: '',         // 宝宝名
            phoneNum: '',         // 手机号
            feedbackStartTime: moment().startOf('month').valueOf(),     // 开始月份
            feedbackEndTime: moment().endOf('month').valueOf(),         // 结束月份
            primaryGbStaffId: '', // 选择的CB
            primaryGaStaffId: ''  // 选择的GA
        }
    }
    componentDidMount() {
        this.handleSearch()
    }

    /**
     * 获取数据
     */
    handleSearch = () => {
        const {pageNo, pageSize, babyName, phoneNum, feedbackStartTime, feedbackEndTime, primaryGaStaffId, primaryGbStaffId} = this.state
        const params ={pageNo, pageSize, babyName, phoneNum, feedbackStartTime, feedbackEndTime, primaryGaStaffId, primaryGbStaffId, currentCenterId: User.currentCenterId,}
        getManageList(params).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    /* 搜索 */
    onSearch = (values:any) => {
        values.feedbackStartTime = values.feedbackStartTime.startOf('month').valueOf();
        values.feedbackEndTime = values.feedbackEndTime.endOf('month').valueOf();
        this.setState({
            ...values,
            pageNo: 1,
        }, this.handleSearch);

    }
    /* 切换页数 */
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.handleSearch);
    };
    /* 表头枚举 */
    columns = () => [
        {
            title: "反馈月份",
            dataIndex: 'feedbackTime',
            key: 'feedbackTime',
            render: (text) => moment(text).format('YYYY-MM')
        },{
            title: "宝宝姓名",
            dataIndex: 'babyAllName',
            key: 'babyAllName',
        },{
            title: "月龄",
            dataIndex: 'monthValue',
            key: 'monthValue',
        },{
            title: "GB",
            dataIndex: 'gb',
            key: 'gb',
        },{
            title: "GA",
            dataIndex: 'ga',
            key: 'ga',
        },{
            title: "出席数",
            dataIndex: 'attendNum',
            key: 'attendNum',
            sorter: (a, b) => a.attendNum - b.attendNum,
        },{
            title: "活动数",
            dataIndex: 'activityNum',
            key: 'activityNum',
            sorter: (a, b) => a.activityNum - b.activityNum,
        },{
            title: "操作",
            dataIndex: 'dddd',
            key: 'dddd',
            render: (text, record) => {
                return (
                    <div>
                        <button className="gym-button-xxs gym-button-white mr15" onClick={() => { this.detail(record) }}>查看</button>
                    </div>
                )
            }
        },
    ]
    /* 查看 */
    detail = (record: any) => {
        history.push(`${Routes.月度回顾管理查询.link}${CommonUtils.stringify({ monthlyFeedbackId: record.monthlyFeedbackId })}`)
    }
    /**
     * 搜索配置
     */
    searchItem = ():Array<any> => {
        const {gbList, gaList} = this.props;
        const gbOption = gbList.map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }))
        const gaOption = gaList.map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }))
        return [
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder: '请输入'
            },
            {
                type: 'text',
                label: '手机号码',
                name: 'phoneNum',
                placeholder: '请输入'
            },
            {
                type: 'months',
                label: '反馈月份',
                name: {
                    start: 'feedbackStartTime',
                    end: 'feedbackEndTime'
                },
                startInitialValue: moment().subtract(0,'months'), // 当月为0，上月为1
                endInitialValue: moment().subtract(0,'months'),
                placeholder: '请输入'
            },
            {
                type: 'select',
                label: 'GB',
                placeholder: '请选择',
                name: 'primaryGbStaffId',
                options: gbOption
            },
            {
                type: 'select',
                label: 'GA',
                placeholder: '请选择',
                name: 'primaryGaStaffId',
                options: gaOption
            },
        ]
    }
    render() {
        const {dataSource, pageSize, pageNo, totalSize} = this.state
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div className="gym-review-list page-wrap">
                    <SearchForm items={this.searchItem()} onSearch={this.onSearch}/>
                    <TablePagination
                        columns={this.columns()}
                        rowKey='monthlyFeedbackId'
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                    />
                </div>
            </Fragment>
        )
    }
}

export { MonthlyReportList }
