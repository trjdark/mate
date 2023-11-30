/**
 * desc: 消耗负债报表
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/17
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import FullScreen from '../components/fullScreen';
import {getConsumeAndDebtList, getConsumeAndDebtTotal, downloadMarketDetail} from "@redux-actions/report/financeReport";
import {User} from "@/common/beans/user";
import {formatter, couldDownLoad, formatNum} from "../common";
import {Alert} from 'antd';

class ConsumeAndDebt extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {name: '报表'},
                {name: '财务类报表'},
                {name: '消耗负债(按合同)'}
            ],
            searchConfig: [
                {
                    type: 'month',
                    label: '查询年月',
                    name: 'endTime',
                    initialValue: moment(),
                },
            ],
            columns: [
                {
                    title: '合同号',
                    dataIndex: 'contractCode',
                },
                {
                    title: '合同有效期',
                    dataIndex: 'effectiveDate',
                    render(text, record) {
                        const endDate = record.endDate;
                        if (!text || !endDate) {
                            return '';
                        }
                        return `${moment(text).format(formatter)} ~ ${moment(endDate).format(formatter)}`
                    }
                },
                {
                    title: '合同类型',
                    dataIndex: 'contractType',
                },
                {
                    title: '成长伙伴',
                    dataIndex: 'gbStaffCode',
                },
                {
                    title: '客户名称',
                    dataIndex: 'customerName',
                },
                {
                    title: '月龄',
                    dataIndex: 'monthValue',
                },
                {
                    title: '课程包',
                    dataIndex: 'packageName',
                },
                {
                    title: '课程包课时',
                    dataIndex: 'courseNum',
                },
                {
                    title: '课程包定价',
                    dataIndex: 'coursePackagePrice',
                    render: text => text ? formatNum(text) : null,
                },
                {
                    title: '赠送课时数',
                    dataIndex: 'freeCourseNum',
                },
                {
                    title: '期初负债',
                    dataIndex: 'openningLiabilityAmount',
                },
                {
                    title: '期初课时数',
                    dataIndex: 'openningCourseNum',
                },
                {
                    title: '期初赠课数',
                    dataIndex: 'openningFreeCourseNum',
                },
                {
                    title: '合同金额',
                    dataIndex: 'contractAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '转入合同金额',
                    dataIndex: 'transferredInAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '转出合同金额',
                    dataIndex: 'transferredOutAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '改包金额',
                    dataIndex: 'changePackageAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '退课金额',
                    dataIndex: 'cancelCourseAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '注册费',
                    dataIndex: 'registeredFee',
                    render: text => formatNum(text),
                },
                {
                    title: '总收入',
                    dataIndex: 'totalAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '耗课金额',
                    dataIndex: 'costCourseAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '总耗课数',
                    dataIndex: 'costCourseNum',
                },
                {
                    title: '耗课课时数',
                    dataIndex: 'courseConsumeNum',
                },
                {
                    title: '赠课耗课数',
                    dataIndex: 'freeCourseCostNum',
                },
                {
                    title: '新增赠课数',
                    dataIndex: 'freeCourseNumMonthly',
                },
                {
                    title: '新签约课时数',
                    dataIndex: 'freshCourseNumMonthly',
                },
                {
                    title: '转入课时数',
                    dataIndex: 'rollinCourseNumMonthly',
                },
                {
                    title: '转出课时数',
                    dataIndex: 'rolloutCourseNumMonthly',
                    render: text => Number(text),
                },
                {
                    title: '改包课时数',
                    dataIndex: 'changeCourseNumMonthly',
                },
                {
                    title: '退课课时数',
                    dataIndex: 'cancelCourseNumMonthly',
                },
                {
                    title: '合同调整正课数',
                    dataIndex: 'adjustCourseNum',
                },
                {
                    title: '合同调整赠课数',
                    dataIndex: 'adjustFreeCourseNum',
                },
                {
                    title: '合同调整金额',
                    dataIndex: 'adjustCoursePrice',
                },
                {
                    title: '校准课时数',
                    dataIndex: 'correctCourseNum',
                },
                {
                    title: '校准赠课数',
                    dataIndex: 'correctFreeCourseNum',
                },
                {
                    title: '校准金额',
                    dataIndex: 'correctAmount',
                },
                {
                    title: '部分退费正课课时',
                    dataIndex: 'partRefundCourseNum',
                },
                {
                    title: '部分退费赠课课时',
                    dataIndex: 'partRefundFreeCourseNum',
                },
                {
                    title: '部分退费金额',
                    dataIndex: 'partRefundCoursePrice',
                },
                {
                    title: '期末负债',
                    dataIndex: 'endingLiabilityAmount',
                    render: text => formatNum(text),
                },
                {
                    title: '期末课时数',
                    dataIndex: 'endingCourseNum',
                },
                {
                    title: '期末赠课数',
                    dataIndex: 'endingFreeCourseNum',
                },

            ],
            dataSource: [],             // 表格数据
            totalData: null,            // 总计数据
            lastSyncDatetime: null,     // 最后截止时间
            endTime: moment(),          // 查询终止月
            totalSize: 0,
            pageNo: 1,                  // 页数
            pageSize: 10,               // 每页请求条数
        }
    }

    render() {
        const {
            breadCrumbRoutes, columns, dataSource, lastSyncDatetime, searchConfig,
            totalSize, pageNo, pageSize,
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
                        <p className="gym-report-fullscreen-tips">提示：总计等于查询月份的全部数据汇总</p>
                        <Alert message="请注意：本报表仅供参考，具体以中心内财务计算结果为准。系统已将2020年6月前数据进行存档，如中心需要请联系Service提交数据需求，谢谢！" type="error" className='mb15'/>
                        <div className="gym-table-wrap">
                            <TablePagination
                                columns={columns}
                                dataSource={dataSource}
                                totalSize={totalSize}
                                pageNo={pageNo}
                                pageSize={pageSize}
                                rowKey={item => item.id}
                                handleChangePage={this.handleChangePage}
                            />
                        </div>
                    </FullScreen>
                </div>
            </Fragment>
        )
    }

    componentDidMount() {
        // 加载时默认请求数据
    }

    /*查询*/
    onSearch = (value) => {
        this.setState(
            {
                ...value,
                pageNo: 1,
                totalSize: 0,
            },
            this.initConsumeAndDebt,
        );
    };

    /*重置*/
    onReset = (value) => {
        this.setState(
            {
                ...value
            }
        );
    };

    /**
     * 翻页
     * @param data 分页数据
     */
    handleChangePage = (data) => {
        this.setState(
            {
                pageNo: data.pageNo,
                pageSize: data.pageSize,
            },
            this.getConsumeAndDebtListData,
        );
    };

    /**
     * 生成查询参数
     * @return object 参数对象
     */
    createParams = () => {
        const {endTime} = this.state;
        return {
            currentCenterId: User.currentCenterId,
            endDate: endTime.valueOf(),
            staffId: User.userId,
        };
    };

    /*查询报表分页数据*/
    getConsumeAndDebtListData = () => {
        const {pageNo, pageSize, totalData} = this.state;
        const params = Object.assign({}, this.createParams(), {pageNo, pageSize});
        getConsumeAndDebtList(params).then(res => {
            const {list, lastSyncDatetime, pageNo, pageSize, totalSize} = res;
            if (list.length > 0 && totalData) {
                // 当查询到分页数据，并且含有总计数据时，把总计数据显示在表格底部，否则，不显示
                list.push(totalData);
            }
            this.setState({
                dataSource: list,
                pageNo, pageSize, totalSize,
                lastSyncDatetime: lastSyncDatetime || Date.now(),
            })
        });
    };

    /*初始化查询报表分页数据和总计数据*/
    initConsumeAndDebt = () => {
        const {pageNo, pageSize} = this.state;
        const params = this.createParams(); // 查询总计字段用的参数
        const paramsPage = Object.assign({}, params, {pageNo, pageSize}); // 查询分页数据用的参数
        Promise.all([getConsumeAndDebtList(paramsPage), getConsumeAndDebtTotal(params)]).then(res => {
            const [listData, totalData] = res;   // 查询到的分页数据和总计数据
            const {list, lastSyncDatetime, pageNo, pageSize, totalSize} = listData;
            if (list.length > 0) {
                // 当查询到分页数据时，把总计数据显示在表格底部，否则，不显示
                list.push(totalData);
            }
            this.setState({
                dataSource: list,
                pageNo, pageSize, totalSize, totalData,
                lastSyncDatetime: lastSyncDatetime || Date.now(),
            })
        }).catch(err => {
            console.log(err);
        })
    };

    /*导出excel*/
    handleDownLoadExcel = () => {
        if (couldDownLoad(this.state.dataSource)) {
            const data = this.createParams();
            downloadMarketDetail(data);
        }
    }
}

export default ConsumeAndDebt;
