/**
 *Desc: 课程包结束
 *User: Debby.Deng
 *Date: 2019/4/18,
 *Time: 10:28 AM
 */

import * as React from "react";
import {CommonRecords, WrappedComponent} from "./record";
import {User} from "../../../../../common/beans/user";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {form} from "../../../../../common/decorator/form";
import {
    historyDownload, packageClose
} from "@redux-actions/customer/historyList";
import {historyStatus, transferSort} from "@/ui/pages/customer/enum/history";
import {HistoryMultSelect} from "@/ui/pages/customer/history/part/historyMultSelect";
import {Button, message} from "antd";
import {ListModal} from "@/ui/component/listModal";
import {AssignCustomers} from "@/ui/pages/customer/assign/part/assignCustomers";
import {Provider} from "@/common/decorator/context";
import {SearchForm} from "@/ui/component/searchForm";
import {Message} from "@/ui/component/message/message";

@form()
class CourseClose extends React.Component<any> {
    state = {
        resData: {},
        selectedRowKeys: [],
        showAssign: false,
        query: {
            currentCenterId: User.currentCenterId,
            gaStaffIdList: [],
            gbStaffIdList: [],
            pageNo: 1,
            pageSize: 10,
            phone:null,
            babyName:null,
            isHistoryMember:1//default 历史会员
        },
        searchItems: [
            {
                label: '历史会员',
                name: 'isHistoryMember',
                type: 'select',
                options: [
                    {
                        postCode: 1,
                        postName: '历史会员'
                    },
                    {
                        postCode: 0,
                        postName: '非历史会员'
                    }
                ],
                initialValue: 1,
                popupContainer: '.gym-content',
            },
            {
                label: '宝宝姓名',
                name: 'babyName',
                type: 'text',
            }
        ],
        sortedInfo:{
            sortName: 'endTime',
            sort: 'desc',
        }
    };
    handleSearch = (values) => {
        const {isHistoryMember,phone,babyName}=values;
        const query = {
            gaStaffIdList: values.GA,
            gbStaffIdList: values.GB,
            pageNo: 1,
            pageSize: 10,
            phone,
            babyName,
            isHistoryMember
        };
        if(phone){
            const phoneReg = /^1[3456789]\d{9}$/;
            if (!phoneReg.test(phone)) {
                Message.error('请输入11位数的手机号码');
                return;
            }
        }
        this.resetState(query);
    };
    handlePageChange = (page) => {
        this.resetState(page);
    };
    resetState = (params) => {
        const query = Object.assign({}, {...this.state.query}, params,{...this.state.sortedInfo});
        packageClose(query).then((res) => {
            this.setState({resData: res, query: query});
        });

    };
    /**
     * 点击更换GB
     * @returns {any}
     */
    changeGb = () => {
        const {selectedRowKeys = []} = this.state;
        if (selectedRowKeys.length < 1) {
            message.error('请选择客户！');
        } else {
            this.setState({
                showAssign: true
            })
        }
    };
    /**
     * 隐藏leads弹框
     * @returns {any}
     */
    hideLeadsMask = () => {
        this.setState({showAssign: false});
    };
    /**
     * 导出
     * @returns {any}
     */
    handleDownload = () => {
        const {type} = this.props;
        const {resData}:any = this.state;
        const query = Object.assign({}, this.state.query,
            {historyType: historyStatus[type], pageNo: null, pageSize: null});
        if (resData.list && resData.list.length > 0) {
            historyDownload(query);
        }
    };
     /**
      * 排序变更
      * @param sorter
      * @returns {any}
      */
     handleSortChange=(pagination,filters,sorter:{field,order})=>{
         this.setState({
             sortedInfo:{
                 sortName:sorter.field ,
                 sort: transferSort[sorter.order],
             }
         },()=>{this.resetState({})})
     };

    componentDidMount() {
        this.resetState({});
    }

    render() {
        const {type, form} = this.props;
        const {resData, selectedRowKeys = [], showAssign, searchItems, sortedInfo}:any = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys});
            },
            selectedRowKeys,
            getCheckboxProps: record => {
                return {
                    disabled: record.phase !== '10'
                }
            }
        };
        const TableWrap = WrappedComponent(CommonRecords, type);
        const table = <TableWrap
            resData={resData}
            rowKey={`leadsId`}
            onRowSelection={rowSelection}
            onPageChange={this.handlePageChange}
            onSortChange={this.handleSortChange}
            sortedInfo={sortedInfo}
        />;
        const role = User.role;
        const providerValue = {callback: this.resetState};
        return (
            <Provider value={providerValue}>
                <div className="gym-customer-history">

                    <HistoryMultSelect form={form} showSearchBtn={false}/>
                    <SearchForm items={searchItems} form={form} onSearch={this.handleSearch}/>

                    <div className='text-l mb20 mt20 ml30 clear'>

                        {
                            CommonUtils.isInclude(role, ['BMS']) && <button
                                className={`${(resData.list && resData.list.length) > 0 ?
                                    `gym-button-default-sm` : 'gym-button-greyb-sm'} fr`}
                                onClick={this.handleDownload}
                            >
                                导出
                            </button>
                        }
                        <Button className='gym-button-default-sm fr mr10'
                                onClick={this.changeGb}
                        >
                            更换GB
                        </Button>
                    </div>
                    {table}

                    <ListModal
                        visible={showAssign}
                        width={650}
                        footer={null}
                        destroyOnClose={true}
                        closable={true}
                        maskClosable={true}
                        onCancel={this.hideLeadsMask}
                    >
                        <AssignCustomers
                            onHideClick={this.hideLeadsMask}
                            reAssign={true}
                            role={`GB`}
                            customerArr={selectedRowKeys}
                            totalCustomerNum={selectedRowKeys.length}
                            fromHistory={true}
                        />
                    </ListModal>
                </div>
            </Provider>
        )
    }
}

export {CourseClose}
