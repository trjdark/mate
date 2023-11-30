/**
 * desc: 会员连续未到提醒报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/30
 * Time: 上午20：00
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import FullScreen from '../components/fullScreen';
import {User} from "@/common/beans/user";
import {getMemberAbsentData, downloadMemberAbsent} from "@redux-actions/report/serviceReport";
import {couldDownLoad} from "../common";
import {Tooltip} from "@/ui/component/toolTip";

class MemberAbsentTwice extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '报表'
                },
                {
                    name: '服务类报表'
                },
                {
                    name: '会员连续未到提醒'
                }
            ],
            searchConfig: [
                {
                    type: 'number',
                    label: '连续未到次数>=',
                    name: 'absentTimes',
                    colon: false,   // 去掉冒号
                    props: {
                        min: 1,
                        max: 999,
                        precision: 0,
                        formatter: value => {
                            return Number.isNaN(+value) ? '' : value;
                        }
                    }
                },
            ],
            columns: [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                    width: 150,
                },
                {
                    title: '爸爸',
                    dataIndex: 'fatherName',
                },
                {
                    title: '妈妈',
                    dataIndex: 'motherName',
                },
                {
                    title: 'GB',
                    dataIndex: 'mainStaff',
                },
                {
                    title: '星期',
                    dataIndex: 'weekDay',
                },
                {
                    title: '课次',
                    dataIndex: 'courseTime',
                },
                {
                    title: '教室',
                    dataIndex: 'classRoom',
                },
                {
                    title: '课程',
                    dataIndex: 'courseCode',
                },
                {
                    title: '累计',
                    dataIndex: 'absentTime',
                },
                {
                    title: '具体原因',
                    dataIndex: 'detail',
                    render: (text, row, index) => {
                        text = (text || '').trim();     // 有时从后台传回的是undefined
                        if (text.length > 10) {
                            return (
                                <Tooltip
                                    title={text}
                                >
                                    {`${text.slice(0, 10)}...`}
                                </Tooltip>
                            )
                        }
                        return text;
                    }
                },
                {
                    title: '最近一次',
                    dataIndex: 'lastTime',
                }
            ],             // 表单配置
            dataSource: [],             // 数据项
            lastSyncDatetime: null,     // 数据有效时间
            absentTimes: 2,      // 未到次数
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }

    render() {
        const {
            breadCrumbRoutes, columns, dataSource, lastSyncDatetime,
            totalSize, pageNo, pageSize, searchConfig
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={searchConfig}
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
            </Fragment>
        );
    }

    componentDidMount() {}

    /*查询*/
    onSearch = (value) => {
        this.setState(
            {
                ...value,
                pageNo: 1,
                totalSize: 0,
            },
            this.getMemberAbsentList,
        );
    };

    /*重置*/
    onReset = (value) => {
        this.setState(
            {
                ...value,
            },
        );
    };

    /*生成参数数据*/
    createParams = () => {
        const {absentTimes} = this.state;
        return {
            absentTimes,
            currentCenterId: User.currentCenterId,
        }
    };

    /*查询会员连续未到提醒列表*/
    getMemberAbsentList = () => {
        const {pageNo, pageSize} = this.state;
        const params = {
            ...this.createParams(),
            pageNo,
            pageSize
        };
        getMemberAbsentData(params).then(res => {
            const {pageNo, pageSize, totalSize, list, lastSyncDatetime} = res;
            this.setState({
                pageNo,
                pageSize,
                totalSize,
                dataSource: list,
                lastSyncDatetime: lastSyncDatetime || Date.now()
            })
        })
    };

    /*翻页*/
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getMemberAbsentList,
        );
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            const params = this.createParams();
            downloadMemberAbsent(params)
        }
    };
}

export default MemberAbsentTwice;
