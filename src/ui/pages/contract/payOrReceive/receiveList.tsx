/**
 * desc: 收款列表
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/22
 * Time: 16:21
 */

import React, {Component, Fragment} from 'react';
import {Link} from "react-router-dom";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Tabs, message, Modal} from "antd";
import {CommonUtils} from "@/common/utils/commonUtils";
import {SearchForm} from "@/ui/component/searchForm";
import {searchConfigEnum, columnsEnum, rowKeyEnum} from "@/ui/pages/contract/payOrReceive/enum/payEnum";
import {Routes} from "@/router/enum/routes";
import {
    deletePayAndReceive,
    getContractDetailAmount,
    getPayAndReceiveManagement, getUnContractDetail,
    returnContract
} from "@redux-actions/payOrReceiveContract";
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import history from "@/router/history";
import {transferOutRetractChangeCenter} from "@redux-actions/contract";

const TabPane = Tabs.TabPane;


class ReceiveManageList extends Component <any, any> {
    private search:any;
    private routes:Array<any> = [
        {name: '合同', path: '', link: '#', id: 'contract'},
        {name: '收付款管理', path: '', link: '#', id: 'contractManagement'},
        {name: '收款管理', path: '', link: '#', id: 'contractManagementPayReceive'}
    ];
    private tabList = [
        {label: '合同', key: 'contract'},
        {label: '其他', key: 'other'},
        {label: '转中心', key: 'trans'},
        {label: '改包', key: 'package'},
    ];
    constructor(props: any) {
        super(props);
        const type = CommonUtils.hasParams(props) ? CommonUtils.parse(props).type : 'contract';
        this.state = {
            activeKey: type,
            searchConfig: searchConfigEnum[type],
            columns: columnsEnum[type],
            rowKey: rowKeyEnum[type],
            searchItems: {},
            dataSource:[],
            totalSize: 0,
            pageNo:1,
            pageSize: 10,
        }
    }
    componentDidMount(){
        this.handleSearch({});
    }

    /**
     * 切换标签
     * @param {string} activeKey
     */
    onChangeTab = (activeKey:string) => {
        this.search.onReset();
        this.setState({
            activeKey:activeKey,
            searchConfig: searchConfigEnum[activeKey],
            columns: columnsEnum[activeKey],
            rowKey: rowKeyEnum[activeKey],
            dataSource:[],
            searchItems: {},
        },() => {
            this.handleSearch({pageNo:1, pageSize: this.state.pageSize});

        });
    };
    /**
     * 搜索
     * @param values
     */
    handleChangeContract = (values) => {
        let param = {}
        for(let key in values){
            if(key === 'payDate' && values[key]){
                param['payStartDate'] = moment(values[key][0]).startOf('day').valueOf();
                param['payEndDate'] = moment(values[key][1]).endOf('day').valueOf();
            }else if(key === 'createDate'&& values[key]){
                param['createStartDate'] = moment(values[key][0]).startOf('day').valueOf();
                param['createEndDate'] = moment(values[key][1]).endOf('day').valueOf();
            }else{
                param[key] = values[key]
            }
        }
        this.setState({searchItems: param, pageNo:1, pageSize: this.state.pageSize}, () => {
            this.handleSearch(param);
        })
    };
    /**
     * 获取数据
     * @param body
     */
    handleSearch = (body:any) => {
        const {activeKey} = this.state;
        const param = Object.assign({}, body, {
            currentCenterId: User.currentCenterId,
            tagType: activeKey,
            intent: 'deposit'
        });
        getPayAndReceiveManagement(param).then(res => {
            this.setState({
                dataSource:res.list,
                totalSize:res.totalSize,
                pageSize:res.pageSize,
                pageNo: res.pageNo
            })
        }, err => message.error(err.msg));
    };
    /**
     * 表格操作按钮渲染
     */
    renderTableButton = () => {
        const {columns, activeKey} = this.state;
        let res = cloneDeep(columns);
        res.push({
            title: '操作',
            dataIndex: 'action',
            render: (text:string, record:any) => (
                <Fragment>
                    {
                        activeKey === 'contract' && (
                            <Fragment>
                                {
                                    (record.hasPayment === 0 && User.permissionList.includes(FUNC['新建合同退回'])) &&
                                    <ConfirmCheck
                                        button={'退回'}
                                        item={record}
                                        ensure={(e) => this.refund(e, record.aparId, returnContract)}
                                        contentText={record.isElectronic ? <span className='size14'>退回后当前流程无法再次发起，且已签电子合同需手动作废，如需补签则需要新建流程。</span> : '是否确定退款？'}
                                    />
                                }
                                {
                                    record.contractSource !== '74001' &&
                                    <button
                                        onClick={
                                            () => {
                                                const postData ={
                                                    "aparId":record.aparId,
                                                    "financialContent":33002, //退课
                                                    "leadsId":record.leadsId
                                                };
                                                const linkUrl = `${Routes.确认合同收款.link}${CommonUtils.stringify({
                                                    aparId:record.aparId,
                                                    leadsId:record.leadsId,
                                                    contractCode:record.contractCode,
                                                    contractId:record.contractId,
                                                    estimatedAmount:record.estimatedAmount
                                                })}`;
                                                this.checkStatus(record, postData, linkUrl, getContractDetailAmount)
                                            }
                                        }
                                        className='gym-button-xxs gym-button-white'
                                    >
                                        {record.hasPayment === 1 ? '查看' : '收款'}
                                    </button>
                                }

                            </Fragment>
                        )
                    }

                    {
                        activeKey === 'other' && (
                            <Fragment>
                                {
                                    (record.mode !== 34007 && record.hasPayment === 0 && record.financialContent !== 33009 && record.financialContent !== 33001) &&
                                    <ConfirmCheck
                                        button={'删除'}
                                        item={record}
                                        ensure={(e) => this.refund(e, record.financialRecordId, deletePayAndReceive)}
                                        contentText={'是否确认删除？'}
                                    />
                                }
                                {
                                    record.mode !== 34007 &&
                                    <button
                                        onClick={() => {
                                            const param = {
                                                currentCenterId:User.currentCenterId,
                                                id:record.financialRecordId
                                            };
                                            const linkUrl = `${Routes.确认其他收款.link}${CommonUtils.stringify({
                                                leadsId:record.leadsId,
                                                contractCode:record.contractCode,
                                                contractId:record.contractId,
                                                financialContent:record.financialContent,
                                                financialRecordId:record.financialRecordId,
                                                gbName:record.gbName,
                                                monthAge:record.monthAge,
                                                customerName:record.customerName,
                                            })}`;
                                            this.checkStatus(record, param, linkUrl, getUnContractDetail)
                                        }}
                                        className='gym-button-xxs gym-button-white mr5'>
                                        {record.hasPayment === 1 ? '查看' : '收款'}
                                    </button>
                                }

                            </Fragment>
                        )
                    }
                    {
                        activeKey === 'trans' && (
                            <Fragment>
                                <button
                                    onClick={() => {
                                        const postData ={
                                            "aparId":record.aparId,
                                            "financialContent":33003,
                                            "leadsId":record.leadsId
                                        };
                                        const linkUrl = `${Routes.确认改中心收款.link}${CommonUtils.stringify({
                                            aparId:record.aparId,
                                            leadsId:record.leadsId,
                                            contractCode:record.contractCode,
                                            contractId:record.contractId,
                                            estimatedAmount:record.estimatedAmount
                                        })}`;
                                        this.checkStatus(record, postData, linkUrl, getContractDetailAmount)}
                                    }
                                    className='gym-button-xxs gym-button-white'>
                                    {record.hasPayment === 1 ? '查看' : '收款'}
                                </button>
                            </Fragment>
                        )
                    }
                    {
                        activeKey === 'package' && (
                            <Fragment>
                                {
                                    (record.hasPayment === 0 && User.permissionList.includes(FUNC['改包退回'])) &&
                                    <ConfirmCheck
                                        button={'退回'}
                                        item={record}
                                        ensure={(e) => this.refund(e, record.aparId , returnContract)}
                                        contentText={record.isElectronic ? <span className='size14'>退回后当前流程无法再次发起，且已签电子合同需手动作废，如需补签则需要新建流程。</span> : '是否确定退款？'}
                                    />
                                }
                                <button
                                    onClick={() => {
                                        const postData ={
                                            "aparId":record.aparId,
                                            "financialContent":33008,
                                            "leadsId":record.leadsId
                                        };
                                        const linkUrl = `${Routes.确认改包收款.link}${CommonUtils.stringify({
                                            aparId:record.aparId,
                                            leadsId:record.leadsId,
                                            contractCode:record.contractCode,
                                            contractId:record.contractId,
                                            estimatedAmount:record.estimatedAmount
                                        })}`;
                                        this.checkStatus(record, postData, linkUrl, getContractDetailAmount)}
                                    }
                                    className='gym-button-xxs gym-button-white'>
                                    {record.hasPayment === 1 ? '查看' : '收款'}
                                </button>
                            </Fragment>
                        )
                    }
                </Fragment>
            )
        });

        return res;
    };
    /**
     * 渲染导出按钮
     * @param {string} type
     * @returns {any}
     */
    renderAction = (type:string) => {
        if(type === 'other'){
            return (
                <Link to={`${Routes.新建收款申请.path}?type=receive`}>
                    <button  className='gym-button-xs gym-button-default mb20 ml30'>+&nbsp;新增</button>
                </Link>
            )
        }
        return null
    };
    /**
     * 分页
     */
    handleChangePageContract = (pageInfo:any) => {
        this.setState({...pageInfo}, () => {
            this.handleSearch(Object.assign({}, this.state.searchItems, pageInfo))
        })
    };
    /**
     * 退款合同
     * @param record
     */
    refund = (record:any, id:string, func:any) => {
        const {pageNo, pageSize, searchItems} = this.state;
        const param = {
            id: id,
            currentCenterId: User.currentCenterId,
            contractId: record.contractId
        };
        func(param).then((res) => {
            message.success('操作成功！', 2, () => {
                this.handleSearch(Object.assign({}, searchItems, {pageNo, pageSize}));
            })

        });
    };
    /**
     *检查状态
     */
    checkStatus = (record:any, postData:any, url:string, func:any) => {
        const {pageNo, pageSize, searchItems} = this.state;
        func(postData).then((res) => {
            if(res.hasPayment === record.hasPayment){
                // history.push(url)
                window.open(url);

            }else{
                message.warning('该合同收付款操作已改变，刷新页面后再尝试!', 5);
                this.handleSearch(Object.assign({}, searchItems, {pageNo, pageSize}));
                return false
            }
        }, (err) => {
            message.error(err.msg)
        });
    };
    render(){
        const {
            activeKey, searchConfig, dataSource,
            totalSize, pageSize, pageNo, rowKey
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <Tabs
                        onChange={this.onChangeTab}
                        activeKey={activeKey}
                        type="card"
                        tabBarGutter={10}
                    >
                        {
                            (this.tabList || []).map((item) =>
                                (
                                    <TabPane key={item.key} tab={item.label}>
                                        <div className='page-wrap gym-contract-tab-content'>
                                            <SearchForm
                                                wrappedComponentRef={(inst) => this.search = inst}
                                                items={searchConfig}
                                                onSearch={this.handleChangeContract}
                                            />
                                            {this.renderAction(activeKey)}
                                            <TablePagination
                                                style={{marginTop:'-5px'}}
                                                columns={this.renderTableButton()}
                                                rowKey={rowKey}
                                                dataSource={dataSource}
                                                totalSize={totalSize}
                                                pageSize={pageSize}
                                                handleChangePage={this.handleChangePageContract}
                                                pageNo={pageNo}
                                            />
                                        </div>
                                    </TabPane>
                                )
                            )
                        }
                    </Tabs>
                </div>
            </Fragment>
        )
    }
}

export {ReceiveManageList}
