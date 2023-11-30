/**
 * desc: 云语音-服务类报表
 * User: Vicky.Yu
 * Date: 2020/8/28
 * Time: 11:00
 */
import React, { Fragment } from 'react';
import moment from "moment";
import { message } from "antd";
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { TablePagination } from "@/ui/component/tablePagination";
import FullScreen from '../../report/components/fullScreen';
import { formatter} from "../../report/common";
import { leadsPhase } from "../../report/enum";
import { getTaskList, exportTaskList} from "@redux-actions/telephone/serviceForm";
import { User } from "@/common/beans/user";
import { Tooltip } from "@/ui/component/toolTip";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const thumbText = text => {
    if (text) {
        text = (text || '').trim();   // 有时候从text的值可能是undefined
        const tdContent = {
            children: text,
        };

        if (text.length > 20) {
            tdContent.children = (
                <Tooltip
                    title={text}
                >
                    {`${text.slice(0, 20)}...`}
                </Tooltip>
            );
        }
        return tdContent;
    }
    return '';
};
const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectGBOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GB', 'HGB']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GB","HGB"]
    };

const selectGAOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GA', 'HGA']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GA","HGA"]
    };

const selectAllOption = {
    leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
}

@connect((state) => ({
    gbList: selectTotalEmployeeList(state, selectGBOption),
    gaList: selectTotalEmployeeList(state, selectGAOption),
    allList: selectTotalEmployeeList(state, selectAllOption),
}), {})

class TeleServiceForm extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '报表'
                },
                {
                    name: '任务跟进明细(含云语音)'
                }
            ],
            columns: [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                    width: 150,
                },
                {
                    title: '阶段',
                    dataIndex: 'phase',
                },
                {
                    title: '主题',
                    dataIndex: 'taskTheme',
                },
                {
                    title: '任务描述',
                    dataIndex: 'taskDescription',
                    width: 200,
                    render: (text, row, index) => {
                        // 描述过长时缩略展示
                        return thumbText(text);
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'createDate',
                    render: (text: number) => {
                        return text ? moment(text).format(formatter) : '';
                    }
                },
                {
                    title: '任务时间',
                    dataIndex: 'taskDate',
                    render: (text: number) => {
                        return text ? moment(text).format(formatter) : '';
                    }
                },
                {
                    title: '联系时间',
                    dataIndex: 'contactDate',
                    render: (text: number) => {
                        return text ? moment(text).format('YYYY-MM-DD HH:mm') : '';
                    }
                },
                {
                    title: '发起人',
                    dataIndex: 'sponsorStaff',
                },
                {
                    title: '执行人',
                    dataIndex: 'executor',
                    render: (text, row, index) => {
                        // 描述过长时缩略展示
                        return thumbText(text);
                    }

                },
                {
                    title: '优先级',
                    dataIndex: 'priority',
                },
                {
                    title: '状态',
                    dataIndex: 'taskStatus',
                },
                {
                    title: 'GB',
                    dataIndex: 'gbStaff',
                },
                {
                    title: 'GA',
                    dataIndex: 'gaStaff',
                },
            ],             // 表单配置
            dataSource: [],             // 数据项
            lastSyncDatetime: null,     // 数据有效时间
            jurisdiction: '',    // 判断登录者是什么岗位，0是CD，1是HGB和HGA，2是HGB,3是HGA,空字符代表HGA，HGB
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
            beginDate: moment().startOf('month'),
            endDate: moment(),
            gbStaff: '',
            gaStaff: '',
            executorStaff: '',
            phase: '',
        }
    }
    searchConfig = ():Array<any> => {
        const {gbList, gaList, allList} = this.props;
        return [
            {
                type: 'rangePicker',
                label: '任务时间',
                name: 'taskDate',
                initialValue: [moment().startOf('month'), moment()]
            },
            {
                type: 'select',
                label: '阶段',
                name: 'phase',
                options: leadsPhase,
            },
            {
                type: 'select',
                label: 'GB',
                name: 'gbStaff',
                options: (gbList || []).map(staff => ({postCode:staff.staffId, postName: `${staff.englishName} ${staff.chineseName}`})),
                initialValue: undefined,
            },
            {
                type: 'select',
                label: 'GA',
                name: 'gaStaff',
                options: (gaList || []).map(staff => ({postCode:staff.staffId, postName: `${staff.englishName} ${staff.chineseName}`})),
                initialValue: undefined,
            },
            {
                type: 'select',
                label: '执行人',
                name: 'executorStaff',
                options: (allList || []).map(staff => ({postCode:staff.staffId, postName: `${staff.englishName} ${staff.chineseName}`})),
                initialValue: undefined,
            },
        ]
    }
    render() {
        const {
            breadCrumbRoutes, columns, dataSource, lastSyncDatetime,
            totalSize, pageNo, pageSize
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes} />
                <div className="page-wrap">
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
                            scroll={{ x: 2000 }}
                            rowKey={item => item.id}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        );
    }
    componentDidMount() {
        // 页面加载时获取GA和GB的数据
        this.getTaskFollowUpList();
    }

    /*查询数据*/
    onSearch = (data) => {
        const { taskDate } = data;
        // 获取选中开始时间往后推一年
        const endTime = moment(taskDate[0]).add(moment.duration({ 'year': 1 }));
        // 判断如果选中结束时间>上面后推一年，提示：最多支持查询的1年的数据
        if (taskDate[1] > endTime) {
            message.warning('最多支持查询1年的数据');
        } else {
            this.setState(
                {
                    beginDate: taskDate[0],
                    endDate: taskDate[1],
                    ...data,
                    pageNo: 1,
                    totalSize: 0,
                },
                this.getTaskFollowUpList
            );
        }
    };

    /*重置查询条件*/
    onReset = (data) => {
        const { taskDate } = data;
        this.setState(
            {
                beginDate: taskDate[0],
                endDate: taskDate[1],
                ...data,
            }
        );
    };

    /**
     * 生成查询参数
     * @return object 参数对象
     */
    createParams = () => {
        const { beginDate, endDate, gaStaff, gbStaff, executorStaff, phase } = this.state;
        return {
            userId: User.userId,
            currentCenterId: User.currentCenterId,
            beginDate: beginDate.valueOf(),
            endDate: endDate.valueOf(),
            gaStaff,
            gbStaff,
            executorStaff,
            phase,
        }
    };

    /*查询任务跟进记录列表*/
    getTaskFollowUpList = () => {
        const { pageNo, pageSize } = this.state;
        const params = {
            ...this.createParams(),
            pageNo, pageSize,
        };
        getTaskList(params).then(res => {
            const { list, pageNo, pageSize, totalSize } = res;
            if (!list) { return }
            this.setState({
                totalSize,
                pageNo,
                pageSize,
                dataSource: list,
                lastSyncDatetime: Date.now()
            })
        });
    };

    /*翻页*/
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getTaskFollowUpList
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        const {
            pageNo, pageSize,
            beginDate, endDate, gaStaff,
            gbStaff, executorStaff, phase
        } = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageNo, pageSize,
            beginDate, endDate, gaStaff,
            gbStaff, executorStaff, phase
        };
        exportTaskList(param)
    };
}

export  {TeleServiceForm};
