/**
 * desc: 耗课统计报表指导师维度
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/2/12
 * Time: 下午14：40
 */
import React, {Component} from 'react';
import FullScreen from '../../components/fullScreen';
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {couldDownLoad, timeIsCorrect} from "../../common";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {
    getINSConsumeCourse,
    downloadINSConsumeCourse,
} from "@redux-actions/report/serviceReport";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectINSOption = isPostTransRole
    ? {
        roleList: ['INS', 'HI']
    }
    : {
        postName: ['INS', 'HI']
    };

@connect((state) => ({
    insList: selectTotalEmployeeList(state, selectINSOption),
}), {})
class InsConsume extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'INS',
                    dataIndex: 'staffName',
                },
                {
                    title: '主/助教',
                    dataIndex: 'primaryIns',
                },
                {
                    title: '年月',
                    dataIndex: 'statisticsYearMonth',
                },
                {
                    title: '课程类别',
                    dataIndex: 'courseTypeName',
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
                    title: '上课节数',
                    dataIndex: 'lessonNum',
                },
                {
                    title: '实际开班数',
                    dataIndex: 'actualClassesNum',
                },
                {
                    title: '出席率',
                    dataIndex: 'attendRate',
                },
            ],                  // 表单配置
            dataSource: [],                         // 报表数据
            lastSyncDatetime: null,           // 数据最后同步时间
            startDate: moment(),
            endDate: moment(),
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }
    searchConfig = ():Array<any> => {
        const {insList} = this.props;
        return [
            {
                type: 'select',
                label: 'INS',
                name: 'staffId',
                options: (insList || []).map(staff => ({postCode:staff.staffId, postName: `${staff.englishName} ${staff.chineseName}`})),
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
                        handleChangePage={this.handleChangePage}
                    />
                </FullScreen>
            </div>
        );
    }

    componentDidMount() {
        this.getInsConsumeList();
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

    /*获取指导师维度的耗课记录*/
    getInsConsumeList = () => {
        const {pageNo, pageSize, startDate, endDate} = this.state;
        // 首先验证开始时间是否小于结束时间
        if (timeIsCorrect(startDate.valueOf(), endDate.valueOf())) {
            const params = {
                ...this.createParams(),
                pageNo,
                pageSize,
            };
            getINSConsumeCourse(params).then(res => {
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
            this.getInsConsumeList,
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
            this.getInsConsumeList,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            downloadINSConsumeCourse(this.createParams());
        }
    };
}

export default InsConsume;
