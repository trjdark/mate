/**
 * desc: 随堂反馈管理
 * User: Vicky
 * Date: 2020/10/12
 * Time: 17:30
 */
import React, { Fragment } from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { TablePagination } from "@/ui/component/tablePagination";
import { Routes } from "@/router/enum/routes";
import { User } from "@/common/beans/user";
import moment from 'moment';
import { Button } from "antd";
import { CommonUtils } from "@/common/utils/commonUtils";
import { getFeedBackManageList, exportFeedManage } from "@redux-actions/teaching/feedBack";
import { connect } from '@/common/decorator/connect';
import FullScreen from '@/ui/pages/report/components/fullScreen';
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectInsOption = isPostTransRole
    ? {
        roleList: ['INS', 'HI']
    }
    : {
        postName: ["INS", 'HI']
    };

@connect(
    (state) => ({
        insList: selectTotalEmployeeList(state, selectInsOption),
    }),
    { }
)
class FeedBackManageList extends React.Component<any, any> {
    commentsId: string;
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        }, {
            name: '随堂反馈管理(Art)',
            path: '',
            link: '#',
            id: 'feedBackManage'
        }
    ];

    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            babyName: '',   // 宝宝姓名
            courseCode: '', // 课程代码学阶
            insStaffId: '', // 点评INS
            startTime: moment().startOf('day').valueOf(),  // 开始日期
            endTime: moment().endOf('day').valueOf(),    // 结束日期
            pageSize: 10,
            dataSource: [],
            inHisList: [],
            totalSize: 0,
            commentsStatus: '', // 点评状态
            insStartTime: '',   // 点评开始时间
            insEndTime: '',     // 点评结束时间
        };
    }
    columns = () => [
        {
            title: "序号",
            dataIndex: 'a',
            width: 100,
            render: (text, record, index) => {
                return (
                    <div>{index + 1}</div>
                )
            }
        },
        {
            title: "宝宝姓名",
            dataIndex: 'babyAllName',
            width: 100,
        },
        {
            title : "课程代码(学阶)",
            dataIndex: 'courseCode',
            width: 150,
        },
        {
            title: "点评状态",
            dataIndex: 'commentsStatus',
            width: 100,
        },
        {
            title: "主题名称",
            dataIndex: 'themeName',
            width: 100,
        },
        {
            title: "点评时间",
            dataIndex: 'commentsTime',
            render: (text:any)=> text&&moment(text).format('YYYY-MM-DD HH:mm'),
            width: 200,
        },
        {
            title: "课程时间",
            dataIndex: 'courseDate',
            width: 200,
            render: (text: any,record) =>{
                return (
                    <div>
                        {moment(text).format('YYYY-MM-DD')} {record.courseStartDate}-{record.courseEndDate}
                    </div>
                )
            }
        },
        {
            title: "主教/助教",
            dataIndex: 'insStaffName',
            width: 200,
        },
        {
            title: "点评Ins",
            dataIndex: 'commentsStaffName',
            width: 100,
        },
        {
            title: "类型",
            dataIndex: 'type',
            width: 100,
        },
        {
            title: "操作",
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <div>
                        <Button className="gym-button-xxs gym-button-white mr15" onClick={() => { this.detail(record) }} disabled={record.commentsStatus === '未点评' ?true: false}>查看</Button>
                    </div>
                )
            }
        }
    ];
    componentDidMount() {
        this.handleSearch();
    }
    /**
     * 编辑
     */
    detail = (record: any) => {
        window.open(`${Routes.随堂反馈管理查看.link}${CommonUtils.stringify({ id: record.commentsId })}`)

    }
    handleSearch = () => {
        const params = {
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            currentCenterId: User.currentCenterId,
            babyName: this.state.babyName,
            courseCode: this.state.courseCode,
            insStaffId: this.state.insStaffId,
            commentsStaffId: this.state.commentsStaffId,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            commentsStatus: this.state.commentsStatus,
            insStartTime: this.state.insStartTime,
            insEndTime: this.state.insEndTime,
        };
        getFeedBackManageList(params).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    onSearch = (values: any) => {
        values.startTime = values.date ? moment(values.date[0]).startOf('day').valueOf() : '';
        values.endTime = values.date ? moment(values.date[1]).endOf('day').valueOf() : '';
        values.insStartTime = values.commentsDate ? moment(values.commentsDate[0]).startOf('day').valueOf():'';
        values.insEndTime = values.commentsDate ? moment(values.commentsDate[1]).endOf('day').valueOf():'';
        this.setState({
            ...values,
            pageNo: 1,
        }, this.handleSearch);
    };
    /*导出*/
    handleDownLoadExcel = () => {
        const { totalSize, babyName, courseCode, insStaffId,
            commentsStaffId, startTime, endTime,
            commentsStatus, insStartTime, insEndTime} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageSize: totalSize,
            babyName, courseCode, insStaffId,
            commentsStaffId, startTime, endTime,
            commentsStatus, insStartTime, insEndTime
        };
        exportFeedManage(param)
    };
    /**
     * 切换页数
     */
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.handleSearch);
    };
    searchItem = ():Array<any> => {
        const {insList} = this.props;
        const insListOption = (insList || []).map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }));
        const commentsOption = [{ postCode: 0, postName:'未点评'},{postCode: 1, postName: '已点评'}]
        return [
            {
                label: '宝宝姓名',
                type: 'text',
                placeholder: '请输入',
                name: 'babyName',
            }, {
                label: '点评INS',
                type: 'select',
                placeholder: '请输入',
                name: 'commentsStaffId',
                options: insListOption,
            }, {
                label: '课程时间',
                type: 'rangePicker',
                placeholder: '请输入',
                name: 'date',
                initialValue: [moment(), moment()]
            }, {
                label: '课程代码(学阶)',
                type: 'text',
                placeholder: '请输入',
                name: 'courseCode',
            }, {
                label: '主教/助教',
                type: 'select',
                placeholder: '请输入',
                name: 'insStaffId',
                options: insListOption,
            }
            ,{
                label: '点评状态',
                type: 'select',
                placeholder: '请输入',
                name: 'commentsStatus',
                options: commentsOption,
            },{
                label: '点评时间',
                type: 'rangePicker',
                placeholder: '请输入',
                name: 'commentsDate',
            }]
    }
    render() {
        const { pageSize, pageNo, dataSource, totalSize } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id={`gym-review`} className="gym-review-list page-wrap">
                    <SearchForm
                        items={this.searchItem()}
                        onSearch={this.onSearch}
                    />
                    <FullScreen
                        handleDownLoadExcel={this.handleDownLoadExcel}
                        canDownload={dataSource.length > 0&&(User.role.includes('CD')||User.role.includes('HI'))}
                    >
                        <TablePagination
                            columns={this.columns()}
                            rowKey={(record) => `${record.lessonId}${record.babyId}`}
                            dataSource={dataSource}
                            totalSize={totalSize}
                            pageSize={pageSize}
                            handleChangePage={this.handleChangePage}
                            pageNo={pageNo}
                        />
                    </FullScreen>
                </div>
            </Fragment>
        )
    }
}

export { FeedBackManageList }
