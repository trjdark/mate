 /**
 * desc: 中心管理
 * Date: 2018/8/14
 * Time: 上午11:39
 */
import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {form} from "../../../../../common/decorator/form";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {connect} from "../../../../../common/decorator/connect";
import {getCenterList} from "@redux-actions/setting/center";
import {selectCenterType, selectCenterCityLevel} from "../../../../../saga/selectors/setting/center";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import {SearchForm} from "../../../../component/searchForm";
 import {BreadCrumb} from "@/ui/component/breadcrumb";

@form()
@connect((state:any) => ({
    centerType: selectCenterType(state),
    centerCityLevel: selectCenterCityLevel(state)
}), {})
class CenterManage extends React.Component<any, any>{
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            type: '',
            cityLevel: '',
            key: '',
            currentCenterId: User.currentCenterId,
        };
    }
    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '运营管理',
            path: '',
            link: '#',
            id: 'operation'
        },{
            name: '中心管理',
            path: '',
            link: '#',
            id: 'course'
        }
    ];
    componentDidMount(){
        this.handleSearch();
    }
    handleSearch = () => {
        const {pageNo, pageSize, type, cityLevel, key, currentCenterId} = this.state;
        getCenterList({pageNo, pageSize, type, cityLevel, key, currentCenterId})
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize
                })
            })
    }
    /**
     * 搜索
     * @param values
     */
    onSearch = (values) => {
        this.setState({
            ...values,
            pageNo:1,
        }, this.handleSearch);
    };

    /**
     * 翻页
     * @param {number} pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.handleSearch)
    };
    transFormat =(arr,code,name)=>{
        if(arr && arr.length){
             arr.map((item)=>{
                item.postCode=item[code];
                item.postName=item[name];
            });
            return arr;
        }else{
            return [];
        }

    };
    // 搜索配置
    searchConfig:any = () => {
        const {centerType, centerCityLevel} = this.props;
        return [
            {
                label: '中心类型',
                required: false,
                type: 'select',
                placeholder: '请选择',
                name: 'type',
                options:this.transFormat(centerType,'code','codeValue'),
            },{
                label: '城市等级',
                required: false,
                type: 'select',
                placeholder: '请选择' ,
                name: 'cityLevel',
                options:this.transFormat(centerCityLevel,'code','codeValue'),
            },{
                label: '关键字',
                required: false,
                type: 'text',
                placeholder: '中心名称或者中心代号' ,
                name: 'key'
            }
        ];
    };
    // 表头配置
    columns = [{
        title: '中心代号',
        dataIndex: 'centerCode',
        key: 'centerCode',
    }, {
        title: '中心名称',
        dataIndex: 'centerName',
        key: 'centerName',
    }, {
        title: '中心类型',
        dataIndex: 'typeName',
        key: 'typeName',
    }, {
        title: '城市等级',
        dataIndex: 'cityLevelName',
        key: 'cityLevelName',
    }, {
        title: '中心地址',
        dataIndex: 'address',
        key: 'address',
    }, {
        title: '联系人',
        dataIndex: 'contact',
        key: 'contact',
    }, {
        title: '联系电话',
        dataIndex: 'telephone',
        key: 'telephone',
    }, {
        title: '邮编',
        dataIndex: 'postCode',
        key: 'postCode',
    }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text:string, record:any) => (
            <div>
                <Link to={`${Routes.修改中心管理.link}${CommonUtils.stringify({id:record.id})}`} className='span-link'><button className='gym-button-xxs gym-button-white'>编辑</button></Link>
                <Link to={`${Routes.设置中心管理.link}${CommonUtils.stringify({id:record.id, code:record.centerCode, name:record.centerName})}`} className='span-link'><button className='gym-button-xxs gym-button-white'>设置</button></Link>
            </div>
        )
    }];
    render(){
        const {pageNo, pageSize, dataSource, totalSize} = this.state;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-center-manage'>
                    <SearchForm items={this.searchConfig()} onSearch={this.onSearch}/>

                    {
                        User.isHQ && <Link to={Routes.添加中心管理.path} className='ml30'>
                            <button  className='gym-button-xs gym-button-default mb20'>+ 新建</button>
                        </Link>
                    }
                    <br/>
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
            </Fragment>

        )
    }
}

export {CenterManage}
