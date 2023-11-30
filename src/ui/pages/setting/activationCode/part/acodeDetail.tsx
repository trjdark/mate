/**
 * desc: 激活码详情
 * User: Vicky.Yu
 * Date: 2020/7/3
 * Time: 10:20
 */

import React from 'react';
import { form } from "../../../../../common/decorator/form";
import moment from 'moment';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { CommonUtils } from "../../../../../common/utils/commonUtils";
import { User } from "../../../../../common/beans/user";
import { TablePagination } from "../../../../component/tablePagination/index";
import { SearchForm } from "../../../../component/searchForm/index";
import {getAcodeCodeDetail} from "@redux-actions/setting/acCodeActions";

@form()

class AccodeDetail extends React.Component<any, any>{
    private centerCode = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : null;
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
            id: 'operation'
        }, {
            name: '激活码管理详情',
            path: '',
            link: '#',
            id: 'activationCode'
        }
    ];
    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            currentCenterId: User.currentCenterId,
            dataSource: [],
            totalSize: 0,
            phoneNumber: '',
        }
    }
    componentDidMount() {
        this.handleSearch()
    }
    /**
     * 搜索
     * @param values
     */
    onSearch = (values) => {
        const params = {
            pageNo: 1,
            pageSize: this.state.pageSize,
            phoneNumber: values.phoneNumber
        };
        this.setState(params, this.handleSearch);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, this.handleSearch);
    };
    /**
     * 获取数据
     * @param body
     */
    handleSearch = () => {
        const { pageNo, pageSize, phoneNumber } = this.state;
        const param = {
            pageNo, pageSize, phoneNumber,
            centerCode: this.centerCode,
            currentCenterId:User.currentCenterId
        };
        getAcodeCodeDetail(param).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        });
    };

    // 搜索配置
    searchConfig: any = [
        {
            label: '手机号',
            required: false,
            type: 'text',
            placeholder: '请输入手机号',
            name: 'phoneNumber'
        }
    ];
    // 表头配置
    columns = [{
        title: '手机号',
        dataIndex: 'contactPhoneNumber',
        key: 'contactPhoneNumber',
    }, {
        title: '宝宝名字',
        dataIndex: 'babyName',
        key: 'babyName',
    },{
        title: '中心号',
        dataIndex: 'centerCode',
        key: 'centerCode'
    }, {
        title: '激活码',
        dataIndex: 'exchangeCode',
        key: 'exchangeCode'
    }, {
        title: '发送时间',
        dataIndex: 'sendDate',
        key: 'sendDate',
        render:(text:string) => (moment(text).format("YYYY-MM-DD"))
    }];
    render() {
        const { pageNo, pageSize, dataSource, totalSize } = this.state;
        return (
            <div>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap gym-holiday'>
                    <div className='gym-acode-manage'>
                        <SearchForm items={this.searchConfig} onSearch={this.onSearch} />
                        <TablePagination
                            columns={this.columns}
                            rowKey={'id'}
                            dataSource={dataSource}
                            totalSize={totalSize}
                            pageSize={pageSize}
                            handleChangePage={this.handleChangePage}
                            pageNo={pageNo}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export { AccodeDetail }
