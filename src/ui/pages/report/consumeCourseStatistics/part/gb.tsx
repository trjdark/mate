/**
 * desc: 耗课统计报表GB维度
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/12
 * Time: 下午14：40
 */
import React, {Component} from 'react';
import FullScreen from '../../components/fullScreen';
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {couldDownLoad, timeIsCorrect, formatNum} from "../../common";
import {getGbConsumeCourse, downloadGBConsumeCourse} from "@redux-actions/report/serviceReport";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectGBOption = isPostTransRole
    ? {
        roleList: ['GB', 'HGB']
    }
    : {
        postName: ["GB","HGB"]
    };
@connect((state) => ({
    gbList: selectTotalEmployeeList(state, selectGBOption),
}), {})
class GbConsume extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'GB',
                    dataIndex: 'staffName',
                },
                {
                    title: '应到出席人数',
                    dataIndex: 'shouldAttendanceNum',
                },
                {
                    title: '实际出席人数',
                    dataIndex: 'actualAttendanceNum',
                },
                {
                    title: '应到出席人次',
                    dataIndex: 'shouldAttendanceSecond',
                },
                {
                    title: '实际出席人次',
                    dataIndex: 'actualAttendanceSecond',
                },
                {
                    title: '出席率',
                    dataIndex: 'attendRate',
                },
                {
                    title: '人均耗课',
                    dataIndex: 'perCapitaRate',
                },
                {
                    title: '课程耗课金额',
                    dataIndex: 'courseConsumeAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '活动耗课金额',
                    dataIndex: 'activityConsumeAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '其他耗课金额',
                    dataIndex: 'otherConsumeAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '总耗课金额',
                    dataIndex: 'allConsumeAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '课程耗课数',
                    dataIndex: 'courseConsumeNum',
                },
                {
                    title: '活动耗课数',
                    dataIndex: 'activityConsumeNum',
                },
                {
                    title: '其他耗课数',
                    dataIndex: 'otherConsumeNum',
                },
                {
                    title: '总耗课数',
                    dataIndex: 'allConsumeNum',
                },
            ],         // 表单配置
            dataSource: [],         // 报表数据
            lastSyncDatetime: null, // 数据最后同步时间
            staffId: '',            // 选中的GB
            startDate: moment(),
            endDate: moment(),
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }
    searchConfig = ():Array<any> => {
        const {gbList} = this.props;
        return [
            {
                type: 'select',
                label: 'GB',
                name: 'staffId',
                options: (gbList || []).map(staff => ({postCode:staff.staffId, postName: `${staff.englishName} ${staff.chineseName}`})),
            },
            {
                type: 'months',
                label: '起止年月',
                startInitialValue: moment(),
                endInitialValue: moment(),
                name: {
                    start: 'startDate',
                    end: 'endDate',
                },
            },
        ]
    }
    render() {
        const {lastSyncDatetime, columns, dataSource, totalSize, pageNo, pageSize} = this.state;
        return (
            <div className="page-wrap gym-consumer-statistics">
                <SearchForm
                    items={this.searchConfig()}
                    onSearch={this.onSearch}
                    onReset={this.onReset}
                />
                <FullScreen
                    lastSyncDatetime={lastSyncDatetime}
                    handleDownLoadExcel={this.handleDownLoadExcel}
                    canDownload={dataSource.length > 0}
                >
                    <TablePagination
                        columns={columns}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        rowKey={item => item.id}
                        scroll={{x: 1600}}
                        handleChangePage={this.handleChangePage}
                    />
                </FullScreen>
            </div>
        );
    }

    componentDidMount() {
        // 页面加载时，初始化数据
        this.getGbConsumeList();
    }

    /**
     * 生成查询参数
     * @return object 参数对象
     */
    createParams = () => {
        const {startDate, endDate, staffId} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            startDate: startDate.valueOf(),
            endDate: endDate.valueOf(),
            staffId,
        }
    };

    /*获取GB维度的耗课记录*/
    getGbConsumeList = () => {
        const {pageNo, pageSize, startDate, endDate} = this.state;
        // 首先验证开始时间是否小于结束时间
        if (timeIsCorrect(startDate.valueOf(), endDate.valueOf())) {
            const params = {
                ...this.createParams(),
                pageNo, pageSize,
            };
            getGbConsumeCourse(params).then(res => {
                const {lastSyncDatetime, list, pageNo, pageSize, totalSize} = res;
                this.setState({
                    lastSyncDatetime: lastSyncDatetime || Date.now(),
                    pageNo, pageSize, totalSize,
                    dataSource: list,
                });
            });
        }
    };

    /*条件查询*/
    onSearch = (data) => {
        this.setState(
            {
                ...data,
                pageNo: 1,
                totalSize: 0,
            },
            this.getGbConsumeList,
        );
    };

    /*重置条件查询*/
    onReset = (data) => {
        this.setState(
            {
                ...data,
            }
        );
    };

    /*翻页*/
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getGbConsumeList,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            downloadGBConsumeCourse(this.createParams());
        }
    };
}

export default GbConsume;
