/*
 * @desc: 多中心导出搜索查看页面
 * @Author: luck
 * @User: luck.yuan@gymboglobal.com
 * @Date: 2021-12-13 14:20:01
 * @LastEditTime: 2022-01-11 13:48:51
 */

import React, { Fragment } from "react";
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { TablePagination } from "@/ui/component/tablePagination";
import moment from "antd/node_modules/moment";
import ExportConditionModal from "../multiCenterDownload/part/exportConditionModal";
import { User } from "@/common/beans/user";
import { getChannelType } from "@redux-actions/report/marketReport";
import { Tooltip } from "antd";
import { getDataAll, getMultiCenterTaskList } from "@redux-actions/report/multiCenterReport";

class MultiCenterQueryList extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            enumList:{},
            dataSource: [],
            totalSize: 0,
            pageNo: 1,
            pageSize: 10,
            currentCenterId:User.currentCenterId,
            staffName:'',
            createDateBegin:'',
            createDateEnd:'',
        };
    }

    componentDidMount() {
        const { currentCenterId,staffName,createDateBegin,createDateEnd,pageNo,pageSize} = this.state;
        const params = {currentCenterId,staffName,createDateBegin,createDateEnd,pageNo,pageSize};
        const funcArr = [
            getMultiCenterTaskList(params),
            getChannelType(),
        ]
        getDataAll(funcArr).then((res:any) =>{
            this.setState({
                dataSource:res[0].status === 'ok' && res[0].value.list,
                ...res[0].value,
                enumList:Object.assign({},{
                    channelTypeList:res[1].status === 'ok' && res[1].value
                })
            })
        })
    }

    private routes = [
        {
            name: "单中心报表"
        },
        {
            name: "其他"
        },
        {
            name: "多中心导出查看"
        }
    ];

    private searchConfig = (): Array<any> => {

        return [
            {
                type: "text",
                label: "操作人",
                name: "operator",
            },
            {
                type: "rangePicker",
                label: "任务创建时间",
                name: "operateDate"
            }
        ];
    };
    private columns = (): Array<any> => {
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
                        enumList = {this.state.enumList}
                    >
                    </ExportConditionModal>
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
            }
        ]
    };

    render() {
        const { dataSource, totalSize, pageNo, pageSize } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div className="page-wrap">
                    <SearchForm items={this.searchConfig()} onSearch={this.onSearch} />
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
        const { currentCenterId,staffName,createDateBegin,createDateEnd,pageNo,pageSize} = this.state;
        const params = {currentCenterId,staffName,createDateBegin,createDateEnd,pageNo,pageSize};
        getMultiCenterTaskList(params).then(res =>{
            this.setState({
                dataSource:res.list,
                ...res,
            })
        })
    }

    //查询
    onSearch = (values: any) => {
        const params = Object.assign({}, values, {
            staffName: values.operator,
            createDateBegin: values.operateDate
                ? moment(values.operateDate[0]).startOf("day").valueOf()
                : null,
            createDateEnd: values.operateDate
                ? moment(values.operateDate[1]).endOf("day").valueOf()
                : null
        });
        this.setState(
            {
                ...params,
                pageNo: 1
            },
            this.getTaskList
        );
    };

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

}
export { MultiCenterQueryList };
