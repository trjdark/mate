/*
 * @desc: 总部导出下载页面
 * @Author: luck.yuan@gymboglobal.com
 * @Date: 2021-12-23 11:13:58
 */

import React, { Fragment } from "react";
import {Link} from 'react-router-dom';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { TablePagination } from "@/ui/component/tablePagination";
import moment from "antd/node_modules/moment";
import ExportConditionModal from "./part/exportConditionModal";
import { User } from "@/common/beans/user";
import { getChannelType } from "@redux-actions/report/marketReport";
import { Tooltip } from "antd";
import { downloadReportExcel, getDataAll, getMultiCenterTaskList } from "@redux-actions/report/multiCenterReport";
import {Routes} from "@/router/enum/routes";
import {getValidPromotorInCurrentCenter} from "@redux-actions/client360";
import {getCourseListByCourseType} from "@redux-actions/contract";
import {getCurrentCenterBingTmkAndHtmk} from "@redux-actions/customer/assignActions";

class MultiCenterDownload extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentCenterId: User.currentCenterId,
            enumList: {},
            dataSource: [],
            totalSize: 0,
            pageNo: 1,
            pageSize: 10,
            promotorList: [],
            tmkList: [],
            packageList: []
        };
    }

    componentDidMount() {
        const { currentCenterId, pageNo, pageSize } = this.state;
        const params = { currentCenterId, pageNo, pageSize };
        const param = {currentCenterId: User.currentCenterId};
        const funcArr = [
            getMultiCenterTaskList(params),
            getChannelType(),
            getValidPromotorInCurrentCenter(param),
            getCurrentCenterBingTmkAndHtmk(param),
            getCourseListByCourseType(param)
        ]
        getDataAll(funcArr).then((res: any) => {
            this.setState({
                dataSource: res[0].status === 'ok' && res[0].value.list,
                ...res[0].value,
                enumList: Object.assign({}, {
                    channelTypeList: res[1].status === 'ok' && res[1].value
                }),
                promotorList: res[2].status === 'ok' && res[2].value,
                tmkList: res[3].status === 'ok' && res[3].value,
                packageList: res[4].status === 'ok' && res[4].value
            })
        })
    }

    private routes = [
        {name: "单中心报表"},
        {name: "其他"},
        {name: "下载已审批导出报表"}
    ];

    private columns = (): Array<any> => {
        const {promotorList, tmkList, packageList} = this.state;
        return [
            {
                title: "报表名称",
                dataIndex: "reportName",
            },
            {
                title: "导出条件",
                dataIndex: "requestParamsMap",
                render: (data, record) => (
                    <ExportConditionModal
                        dataSource={data}
                        reportName={record.reportName}
                        enumList={this.state.enumList}
                        query={record.selectParams}
                        promotorList={promotorList}
                        tmkList={tmkList}
                        packageList={packageList}
                    />
                )
            },
            {
                title: "操作人",
                dataIndex: "staffName"
            },
            {
                title: "任务创建时间",
                dataIndex: "createDate",
                render: (text: number) => {
                    return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
                }
            },
            {
                title: "任务状态",
                dataIndex: "taskStatus",
                render: (text: string) => {
                    if (text === '失败') {
                        return <Tooltip title='请重新提交导出任务'><span style={{ color: 'red', cursor: 'pointer' }}>失败</span></Tooltip>
                    } else {
                        return text
                    }
                }
            },
            {
                title: "操作",
                dataIndex: "action",
                render: (text, record) => (
                    <span>
                        {((record.taskStatus === '已完成') && (moment().subtract(2, 'months').endOf('day') < record.createDate))
                            ? <button className="gym-button-xxs gym-button-white" onClick={() => { this.handlFileDownload(record) }}>下载</button>
                            : <button className="gym-button-xxs gym-button-grey">下载</button>
                        }
                    </span>
                )
            }
        ]
    };

    render() {
        const { dataSource, totalSize, pageNo, pageSize } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div className='flex flex-jc-between pl25'>
                    <div>
                        查看还在审批中的申请，请前往：<Link target='_blank' to={Routes.查看报表导出审批进度.path}>待审批的报表导出</Link>页面中查看
                    </div>
                    <div >
                        功能需求反馈请邮件：<span className='cDefault'>mate.report@gymboglobal.com</span>，
                        本页使用说明请点击上方<span className='cDefault'>【帮助】</span>
                    </div>
                </div>

                <div className="page-wrap">
                    <TablePagination
                        dataSource={dataSource} columns={this.columns()}
                        totalSize={totalSize} pageNo={pageNo}
                        pageSize={pageSize} rowKey={(item: any, index: number) => index}
                        handleChangePage={this.handleChangePage}
                    />
                </div>
            </Fragment>
        );
    }

    // 获取数据项
    getTaskList() {
        const { currentCenterId, pageNo, pageSize } = this.state;
        const params = { currentCenterId, pageNo, pageSize };
        getMultiCenterTaskList(params).then(res => {
            this.setState({
                dataSource: res.list,
                ...res,
            })
        })
    }

    /**
     * 换页
     */
    handleChangePage = pageInfo => {
        this.setState(
            {
                pageNo: pageInfo.pageNo,
                pageSize: pageInfo.pageSize
            },
            this.getTaskList
        );
    };

    // 多中心导出文件下载
    handlFileDownload = values => {
        const params = { attachmentId: values.attachmentId };
        downloadReportExcel(params);
    }

}
export { MultiCenterDownload };
