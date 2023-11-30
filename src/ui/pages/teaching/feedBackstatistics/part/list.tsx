/**
 * desc: 随堂反馈数据统计
 * User: Vicky
 * Date: 2020/9/29
 * Time: 14:30
 */
import React, { Fragment } from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { TablePagination } from "@/ui/component/tablePagination";
import { Routes } from "@/router/enum/routes";
import { getCourseType } from "@/redux-actions/teaching/chooseLesson";
import moment from 'moment'
import { User } from "@/common/beans/user";
import history from "@/router/history";
import { CommonUtils } from "@/common/utils/commonUtils";
import { getStatisticsList } from "@redux-actions/teaching/feedBack";
import { ShowPhone } from "./showPhone";

class FeedBackStatisticsList extends React.Component<any, any> {
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        }, {
            name: '随堂反馈数据统计',
            path: '',
            link: '#',
            id: 'feedBackManage'
        }
    ];
    DEFAULT_START_TIME = moment().startOf('day');         // 默认开始时间
    DEFAULT_END_TIME = moment().endOf('day');             // 默认结束时间
    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            babyName: '',                                  // 宝宝姓名
            courseType: '',                                // 课程类型
            startTime: this.DEFAULT_START_TIME.valueOf(),  // 点评开始时间
            endTime: this.DEFAULT_END_TIME.valueOf(),      // 点评结束时间
            contactPhoneNum: '',                           // 手机号码
            dataSource: [],
            totalSize: 0,
            courseTypeList: [],                            // 课程类型列表

        };
    }
    columns = () => [
        {
            title: "序号",
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return (
                    <div>{index + 1}</div>
                )
            }
        },
        {
            title: "宝宝姓名",
            dataIndex: 'babyName',
            key: 'babyName',
        },
        {
            title: "手机号码",
            dataIndex: 'contactPhoneNum',
            key: 'contactPhoneNum',
            render: (text: string, record: any) => <ShowPhone text={text} id={record.babyId} />
        },
        {
            title: "课程类型",
            dataIndex: 'courseType',
            key: 'courseType',
        }, {
            title: "随堂表现点评次数",
            dataIndex: 'performanceCount',
            key: 'performanceCount',
            sorter: (a, b) => a.performanceCount - b.performanceCount,
        },
        {
            title: "能力发展点评次数",
            dataIndex: 'abilityCount',
            key: 'abilityCount',
            sorter: (a, b) => a.abilityCount - b.abilityCount,
        },
        {
            title: "点评开始时间",
            dataIndex: 'startTime',
            key: 'startTime',
            render: (text) => moment(text).format('YYYY-MM-DD')
        },
        {
            title: "最近点评时间",
            dataIndex: 'recentTime',
            key: 'recentTime',
            render: (text) => moment(text).format('YYYY-MM-DD')
        },
        {
            title: "操作",
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <div>
                        <button className="gym-button-xxs gym-button-white mr15" onClick={() => { this.detail(record) }}>查看</button>
                    </div>
                )
            }
        }
    ];
    componentDidMount() {
        const { performanceOrder } = this.state;
        this.handleSearch();
        getCourseType({ currentCenterId: User.currentCenterId, performanceOrder }).then((res: any) => {
            this.setState({ courseTypeList: res });
        })

    }
    /**
     * 编辑
     */
    detail = (record: any) => {
        history.push(`${Routes.随堂反馈数据统计查看.link}${CommonUtils.stringify({ id: record.babyId, courseTypeId: record.courseTypeId })}`)
    }
    handleSearch = () => {
        const params = {
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            currentCenterId: User.currentCenterId,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            babyName: this.state.babyName,
            courseType: this.state.courseType,
            contactPhoneNum: this.state.contactPhoneNum,
        };
        getStatisticsList(params).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    onSearch = (values: any) => {
        values.startTime = values.date ? moment(values.date[0]).startOf('day').valueOf() : '';
        values.endTime = values.date ? moment(values.date[1]).endOf('day').valueOf(): '';
        this.setState({
            ...values,
            pageNo: 1,
        }, this.handleSearch);
    };
    /**
     * 切换页数
     */
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.handleSearch);
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchItem = ():Array<any> => {
        const {courseTypeList} = this.state;
        const courseTypeOption = courseTypeList.map((item: any) => ({ postCode: item.id, postName: item.courseTypeName }));
        return [
            {
                label: '宝宝姓名',
                type: 'text',
                placeholder: '请输入',
                name: 'babyName',
            }, {
                label: '手机号码',
                type: 'text',
                placeholder: '请输入',
                name: 'contactPhoneNum',
            }, {
                label: '点评时间',
                type: 'rangePicker',
                placeholder: '请输入',
                name: 'date',
                initialValue:[this.DEFAULT_START_TIME, this.DEFAULT_END_TIME]
            }, {
                label: '课程类型',
                type: 'select',
                placeholder: '请输入',
                name: 'courseType',
                options: courseTypeOption,
            },
        ];
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
                    <TablePagination
                        columns={this.columns()}
                        rowKey={(record) => `${record.babyAllName}${record.courseTypeId}${record.babyId}`}
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

export { FeedBackStatisticsList }
