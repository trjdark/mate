/**
 * desc: 升班报告列表
 * User: Katarina.Yuan
 * Date: 2021/7/22
 * Time: 下午3:00
 */
import React, { Fragment } from 'react';
import {Link} from 'react-router-dom';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { User } from "@/common/beans/user";
import moment from 'moment';
import { TablePagination } from "@/ui/component/tablePagination";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getPromotionList, getUpCourseList} from "@redux-actions/teaching/feedBack";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import '../style/index'
import {FUNC} from "@/ui/pages/setting/enum/functions";

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])

const gbOption = isPostTransRole ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ["GB","HGB"]
    }
    :{
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GB","HGB"]
    };

const gaOption = isPostTransRole ?{
    leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
    roleList: ["GA","HGA"]
}:{
    leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
    postName: ["GA","HGA"]
}

@connect((state) => ({
    gbList: selectTotalEmployeeList(state, gbOption),
    gaList: selectTotalEmployeeList(state, gaOption),

}))
class PromotionReportList extends React.Component<any,any> {
    // 面包屑
    private routes: Array<any> =[
        { name: '教学' },
        { name: '教学管理' },
        { name: '升班报告管理' },

    ]
    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
            dataSource: [],       // 数据
            babyName: '',         // 宝宝名
            mobile: '',         // 手机号
            startDate: moment().startOf('month').valueOf(),     // 开始月份
            endDate: moment().endOf('day').valueOf(),         // 结束月份
            gb: '', // 选择的CB
            ga: '', // 选择的GA
            courseCode: '', // 选择的课程
            classOptions: [],                                          // 课程代码选项
            lessonCourse: null,        　　　　　　　　　　　　              // 课程代码

        }
    }
    componentDidMount() {
        this.handleSearch()
        getUpCourseList({
             currentCenterId: User.currentCenterId,
             staffId:User.userId
         }).then(res => {
            const allCourseCode = res.map(item => ({
                postCode: item.id,
                postName: item.courseCode
            }));
            this.setState({
              classOptions:allCourseCode
          })
        })
    }

    /**
     * 获取数据
     */
    handleSearch = () => {
        const {pageNo, pageSize, babyName, mobile, startDate, endDate, ga, gb, courseCode} = this.state
        const params ={pageNo, pageSize, babyName, mobile, startDate, endDate, ga, gb, courseCode, currentCenterId: User.currentCenterId,}
        getPromotionList(params).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    /* 搜索 */
    onSearch = (values:any) => {
        values.startDate = values.operateTime ? moment(values.operateTime[0]).startOf('day').valueOf() : null
        values.endDate = values.operateTime ? moment(values.operateTime[1]).endOf('day').valueOf() : null
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
            title: "宝宝姓名",
            dataIndex: 'babyName',
            key: 'babyName',
        },{
            title: "月龄",
            dataIndex: 'babyMonth',
            key: 'babyMonth',
        },{
            title: "报告时间",
            dataIndex: 'reportTime',
            key: 'reportTime',
            render: (text) => moment(text).format('YYYY-MM-DD')
        },{
            title: "GA",
            dataIndex: 'ga',
            key: 'ga',
        },{
            title: "GB",
            dataIndex: 'gb',
            key: 'gb',
        },{
            title: "课程代码",
            dataIndex: 'courseCode',
            key: 'courseCode',
        },{
            title: "操作",
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => <Link
                                        target='_blank'
                                        to={`${Routes.升班报告管理查询.link}${CommonUtils.stringify({ reportId: record.reportId, babyId: record.babyId})}`}
                                        >
                                            <button className="gym-button-xxs gym-button-white mr15">查看</button>
                                    </Link>
        },
    ]
    /**
     * 搜索配置
     */
    searchItem = ():Array<any> => {
        const {gbList, gaList} = this.props;
        const { classOptions } = this.state
        const gbOption = gbList.map((item: any) => ({ postCode: item.staffId, postName: item.userName }))
        const gaOption = gaList.map((item: any) => ({ postCode: item.staffId, postName: item.userName }))
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
                name: 'mobile',
                placeholder: '请输入'
            },
            {
                type: 'rangePicker',
                label: '报告时间',
                name: 'operateTime',
                initialValue: [moment().startOf('month'), moment().endOf('day')],
                placeholder: '请输入'
            },
            {
                type: 'select',
                label: 'GB',
                placeholder: '请选择',
                name: 'gb',
                options: gbOption
            },
            {
                type: 'select',
                label: 'GA',
                placeholder: '请选择',
                name: 'ga',
                options: gaOption
            },
            {
                type: 'select',
                label: '课程代码',
                name: 'courseCode',
                placeholder: '请选择',
                options: classOptions
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
                        rowKey='reportId'
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

export { PromotionReportList }
