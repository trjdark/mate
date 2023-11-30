/**
 * desc: 产品管理
 * User: debby
 * Date: 2018/8/16
 * Time:
 */
import React from 'react';
import {SearchForm} from "../../../../component/searchForm";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getProductList} from "@redux-actions/setting/productActions";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";


class ProductMange extends React.Component<any,any>{
    constructor(props:any){
        super(props);
        this.state={
            currentCenterId:User.currentCenterId,
            pageNo:1,
            pageSize:10,
            productCode: '',
            productName: '',
            dataSource: [],
            totalSize: 0,
        };
    }
    componentDidMount(){
        this.getData();
    }

    /**
     * 搜索
     * @param json
     */
    onSearch = (values:any) => {
        this.setState({
            ...values,
            pageNo:1
        }, this.getData)
    };
    /**
     * 分页
     * @param page
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.getData);
    };
    /**
     * 获取数据
     */
    getData = () => {
        const {pageNo, pageSize, currentCenterId, freeGiftCode, freeGiftName} = this.state;
        getProductList({
            pageNo, pageSize, currentCenterId,
            freeGiftCode, freeGiftName
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    // 搜索配置
    searchConfig:any = [
        {
            label: '产品编号',
            required: false,
            type: 'text',
            placeholder: '产品编号',
            name: 'freeGiftCode'
        },{
            label: '产品名称',
            required: false,
            type: 'text',
            placeholder: '产品名称' ,
            name: 'freeGiftName'
        }
    ];
    // 表头配置
    columns = [{
        title: '产品编号',
        dataIndex: 'freeGiftCode',
        width:150
    }, {
        title: '产品名称',
        dataIndex: 'freeGiftName',
    }, {
        title: '零售价',
        dataIndex: 'retailPrice',
        width:'15%'
    }, {
        title: '成本价',
        dataIndex: 'costPrice',
        width:'15%'
    }, {
        title: '状态',
        dataIndex: 'isEnabled',
        width:150,
        render: (text:number) => text === 1 ? "启用" : '停用'
    },{
        title: '操作',
        key: 'action',
        width:100,
        render:(text,record)=>(
            <Link to={`${Routes.产品管理编辑.link}/${CommonUtils.stringify({id: record.id})}`}>
                <button className=" gym-button-xxs gym-button-white">编辑</button>
            </Link>
        ),
    }];
    render(){
        const {pageNo, pageSize, dataSource, totalSize} = this.state;
        return(
            <div id={`gym-product-manage`}>
                <SearchForm items={this.searchConfig} onSearch={this.onSearch}/>
                <Link to={`${Routes.产品管理新建.path}`}>
                    <button  className='gym-button-xs gym-button-default mb20 ml30'>+ 新建</button>
                </Link>
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
        )
    }
}

export {ProductMange}
