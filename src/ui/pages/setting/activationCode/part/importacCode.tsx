
import React from 'react'
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { Row, Col } from 'antd';
import { User } from "@/common/beans/user";
import { TablePagination } from '@/ui/component/tablePagination';
import { Icon } from '@/ui/component/icon';
import {downloadTemplate, verifyCode, uploadCode} from "@redux-actions/setting/acCodeActions";
import { AnalysisExcelButton} from "@/ui/pages/setting/activationCode/part/analysisExcelButton";
import {Message} from "@/ui/component/message/message";
import history from "@/router/history";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";

class ImportacCode extends React.Component<any, any> {
    // 面包屑
    private routes: Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        }, {
            name: '激活码管理',
            path: '',
            link: '#',
            id: 'activationCode'
        }, {
            name: '激活码导入',
            path: '',
            link: '#',
            id: 'importCode'
        }
    ];
    constructor(props) {
        super(props);
        this.state = {
            success: undefined,
            errorRow: [],         // 错误信息
            list:[],              // 激活码列表
            pageNo:1,
            pageSize: 2,
            totalSize: 0
        }
    }
    columns = [
        {
            title: '行号',
            dataIndex: 'row',
        },{
            title: '原因',
            dataIndex: 'msg',
        }
    ]
    /**
     * 浏览
     */
    handleChange = (body: any, valueName: string) => {
        const param = { currentCenterId: User.currentCenterId, list: body };
        const {pageNo, pageSize} = this.state;
        this.setState({list: body});
        verifyCode(param).then((res: any) => {
                this.setState({
                    success: res.checkResult,
                    dataSource: res.errorRow,
                    errorRow: res.errorRow.filter((item:any, index:number) => (index >= (pageNo - 1)*pageSize) && index < pageSize),
                    totalSize: res.errorRow.length
                })
            })
    }
    /**
     * 下载模版
     * @returns {any}
     */
    onDownloadRepeat = () => {
        downloadTemplate({currentCenterId: User.currentCenterId})
    };
    /**
     * 确认导入
     */
    handleSubmit = () => {
        const param = {
            currentCenterId: User.currentCenterId,
            list: this.state.list
        };
        uploadCode(param).then(() => {
            Message.success("上传成功");
            history.goBack();
        })
    };
    /**
     * 分页
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo:pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
            errorRow: this.state.dataSource.filter((item:any, index:number) => (index >= (pageInfo.pageNo - 1) * pageInfo.pageSize) && index < pageInfo.pageNo * pageInfo.pageSize),
        })
    };
    render() {
        const { pageNo, success, errorRow, pageSize, totalSize } = this.state;
        return (
            <div>
                <BreadCrumb routes={this.routes} />
                <div id="gym-customer-batch-import" className="page-wrap">
                    <Row type="flex" align="middle">
                        <Col span={4} className="col-left">
                            <div>激活码导入（.xlsx）：</div>
                        </Col>
                        <Col span={20} className="col-right col-padding">
                            <AnalysisExcelButton handleEmit={this.handleChange} />
                        </Col>
                    </Row>
                    <div className="row-download">
                        <p className="no-template">
                            没有导入模版？<span onClick={this.onDownloadRepeat} className="download">点击下载</span>
                        </p>
                        <p className="limits">请保证excel文件只有一个sheet页，支持每次最多导入10000条leads，<br />上传小于500条，速度更快哦。</p>
                    </div>
                    {
                        (success === true) ? (
                            <div>
                                <Row className="importRes" align="middle" type="flex">
                                    <div className="success-col">
                                        <Icon className="iconSize iconSuccess" type="zhengque" />
                                        <div className="importResTitle">上传成功</div>
                                    </div>
                                </Row>
                            </div>
                        ) : (null)
                    }
                    {
                        (success === false) ? (
                            <div>
                                <Row className="importRes" align="middle" type="flex">
                                    <Icon className="iconSize iconError" type="weitongguo" />
                                    <div className="importResTitle">上传错误</div>
                                </Row>
                                <TablePagination
                                    dataSource={errorRow}
                                    columns={this.columns}
                                    rowKey='row'
                                    totalSize={totalSize}
                                    pageNo={pageNo}
                                    pageSize={pageSize}
                                    handleChangePage={this.handleChangePage}
                                />
                            </div>
                        ) : null
                    }
                    <div className="gym-import-code-analysis-buttons">
                        <button
                            disabled={!success}
                            className={`gym-button-${success ? 'default' : 'grey'} gym-button-lg mr15`}
                            onClick={this.handleSubmit}
                        >确认导入</button>
                        <Link to={Routes.激活码管理列表.path}>
                            <button className="gym-button-wBlue gym-button-lg">取消</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export { ImportacCode };
