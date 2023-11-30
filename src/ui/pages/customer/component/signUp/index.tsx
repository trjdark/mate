/**
 * Desc: 报名弹框
 * User: Vicky.Yu
 * Date: 2018/12/11,
 * Time: 下午8:00
 */
import React from "react";
import {connect} from 'react-redux';
import {Form} from "antd";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from '@/ui/component/searchForm';
import {User} from "@/common/beans/user";
import {selectActivity} from "@/saga/actions/activity/activityDataList";
import {ActivityApi} from "@/api/activityApi";
import {Fetch} from "@/service/fetch";
import moment from 'moment';
import {getActivityDetail} from "@redux-actions/activity/activityDetail";
import "./index.scss";

class SignUp extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 1,
            pageSize: 10,
            startDate: '',      // 开始时间
            endDate: '',        // 结束时间
            theme: '',          // 主题
            totalSize: '',      // 总页数
            activityList: [],   // 活动列表
            body: {},
            list: [
                {
                    type: 'datesPicker',
                    label: '开始日期',
                    name: 'startDate',
                },
                {
                    type: 'datesPicker',
                    label: '结束日期',
                    name: 'endDate',
                },
                {
                    type: 'text',
                    label: '活动名称',
                    name: 'theme',
                }
            ],
        }
    }

    /**
     * 执行搜索
     */
    onSearch = (values: any) => {
        this.setState(
            {
                ...values,
                pageNo: 1,
                pageSize: this.state.pageSize
            },
            () => {
                this.handleSearch(values);
            }
        )
    };

    /**
     * 搜索方法
     */
    handleSearch = (body: any) => {
        const {pageSize, pageNo} = this.state;
        const {leadsId, selectedActivity} = this.props;
        const {theme, startDate} = body;
        const endDate = body.endDate ? (moment(body.endDate.format('YYYY-MM-DD')).valueOf()) + (24 * 60 * 60 * 1000 - 1000) : null;
        const params = {
            url: ActivityApi.会员可报名活动列表,
            data: {
                currentCenterId: User.currentCenterId,
                pageSize,
                pageNo,
                theme,
                leadsId,
                startDate: startDate ? moment(startDate.format('YYYY-MM-DD')).valueOf() : null,   // 开始时间
                endDate: endDate       // 结束时间
            }

        };
        Fetch.post(params).then(res => {
            const {list, totalSize, totalNo} = res;
            this.setState({
                body,
                activityList: list,
                totalSize: totalSize,
                totalNo: totalNo
            });
            if (Array.isArray(list) && list.length > 0) {
                if (selectedActivity.length === 0) {
                    // 默认选中第一项
                    const selected = list.slice(0, 1);
                    this.props.selectActivity(selected);
                    // 查询活动详情数据
                    this.props.getActivityDetail({
                        id: selected[0].id,
                        currentCenterId: User.currentCenterId,
                    });
                }
            }
        }).catch((e) => {
            console.log(e)
        })
    };
    onReset = (values) => {
        this.setState({
            ...values
        });
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, () => {
            this.handleSearch(this.state.body);
        });
    };

    componentDidMount() {
        this.handleSearch({})
    };

    // 选择活动报名
    onCheck = (selectedRowKeys: string[], selectedRows) => {
        // 设置选中的活动
        this.props.selectActivity(selectedRows);
        // 查询活动详情数据
        this.props.getActivityDetail({
            id: selectedRows[0].id,
            currentCenterId: User.currentCenterId,
        })
    };

    format = (start, end) => {
        const activityStartTime = moment(start).format("HH:mm");
        const activityEndTime = moment(end).format("HH:mm");
        return (<span>{activityStartTime} ~ {activityEndTime}</span>)
    };

    render() {
        const {selectedActivity, activityPayModeObj} = this.props;
        const {pageNo, pageSize, list, activityList, totalSize} = this.state;
        // 表格抬头
        const columns: any = [
            {
                title: '活动名',
                dataIndex: 'activityTheme',
                key: 'activityTheme'
            },
            {
                title: '活动日期',
                dataIndex: 'activityStartTime',
                key: 'activityStartTime',
                render: (text: number, record: any) => moment(text).format("YYYY-MM-DD")
            },
            {
                title: '活动时间',
                dataIndex: 'duringTime',
                key: 'duringTime',
                render: (text: string, record: any) => (this.format(record.activityStartTime, record.activityEndTime))

            },
            {
                title: '付费方式',
                dataIndex: 'payMode',
                key: 'payMode',
                render(text) {
                    return activityPayModeObj[text];
                }
            },
        ];
        return (
            <div id="signUp-wrap">
                {/* 搜索 */}
                <SearchForm items={list} onSearch={this.onSearch} onReset={this.onReset}/>
                <TablePagination
                    columns={columns}
                    dataSource={activityList}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: selectedActivity.map(item => item.id),
                        onChange: this.onCheck
                    }}
                    rowKey={`id`}
                    totalSize={totalSize}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    handleChangePage={this.handleChangePage}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {selectedActivity} = state.activityList;
    const {types} = state.activityDetail;
    const {
        activityPayModeObj,        // 付款类型枚举值（用于取值）
    } = types;
    return {
        activityPayModeObj,
        selectedActivity,
    }
};

const mapDispatchToProps = dispatch => ({
    selectActivity(data) {
        dispatch(selectActivity(data));
    },
    getActivityDetail(params) {
        dispatch(getActivityDetail(params));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SignUp));
