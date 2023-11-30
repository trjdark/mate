/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/9/6
 * Time: 下午5:36
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {BreadCrumb} from '@/ui/component/breadcrumb';
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import {User} from "@/common/beans/user";
import {getElectronicContractList} from "@redux-actions/setting/electronicContract";
import {Routes} from "@/router/enum/routes";
import {typeEnum} from "@/ui/pages/setting/electronicContract/enum/sealType";
import {CommonUtils} from "@/common/utils/commonUtils";

class ElectronicContractList extends React.Component<any, any> {
    private breadCrumbRoutes: Array<any> = [
        {name: '设置', path: '', link: '#', id: ''},
        {name: '电子合同管理', path: '', link: '#', id: ''},
        {name: '电子合同用印设置', path: '', link: '#',}
    ];

    searchConfig:Array<any> = [
        {
            label: '用印名称',
            type: 'text',
            placeholder: '请输入',
            name: 'sealName'
        }, {
            label: '用印类型',
            type: 'select',
            placeholder: '请选择用印类型',
            name: 'sealType',
            options: typeEnum
        },{
            label: '启用状态',
            type: 'select',
            placeholder: '请选择',
            name: 'enable',
            options: [
                {postCode: 1, postName: '启用'},
                {postCode: 0, postName: '停用'},
            ]
        },{
            label: '中心编号',
            type: 'text',
            placeholder: '请输入',
            name: 'centerCode'
        },
    ];
    constructor(props:any){
        super(props);
        this.state = {
            pageNo:1,
            pageSize: 10,
            dataSource: [],
            totalSize:0
        }
    }
    columns = ():any => {
        const {pageNo, pageSize} = this.state;
        return [
            {
                title: "序号",
                dataIndex: 'index',
                render: (text, record, index) => (pageNo - 1) * pageSize + index + 1
            },{
                title: "用印名称",
                dataIndex: 'sealName',
            },{
                title: "用印类型",
                dataIndex: 'sealType',
                render: (text:string) => typeEnum.filter((item) => item.postCode === text )[0].postName
            },{
                title: "启用状态",
                dataIndex: 'enable',
                render: (text:number) => text === 1 ? '启用' : '停用'

            },{
                title: "中心编号",
                dataIndex: 'centerCodeList',
                width: 400,

            },{
                title: "操作",
                dataIndex: 'action',
                render: (text, record) => <Link to={`${Routes.电子用印编辑.link}${CommonUtils.stringify({sealId: record.sealId})}`}>
                    <button className="gym-button-white gym-button-xxs">编辑</button>
                </Link>
            },
        ]
    } ;
    componentDidMount(){
        this.getDate();
    }

    /**
     * 搜索
     * @param {{}} values
     */
    handleSearch = (values = {}) => {
        this.setState(values, this.getDate)
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.getDate);
    };
    getDate = () => {
        const {pageNo, pageSize, centerCode, enable, sealType, sealName} = this.state;
        const param = {
            pageNo, pageSize, centerCode, enable, sealType, sealName,
            currentCenterId: User.currentCenterId
        }
        getElectronicContractList(param).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    render() {
        const {pageNo, pageSize, totalSize, dataSource} = this.state;
        return (
            <div className="gym-electronic-contract">
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className='page-wrap'>
                    <SearchForm
                        items={this.searchConfig}
                        onSearch={this.handleSearch}
                    />
                    <div className='ml30'>
                        <Link to={`${Routes.电子用印添加.path}`}>
                            <button className='gym-button-xs gym-button-default mb20'>+ 新建</button>
                        </Link>
                    </div>
                    <TablePagination
                        columns={this.columns()}
                        rowKey={'sealId'}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                    />
                </div>
            </div>
        )
    }
}

export {ElectronicContractList}
