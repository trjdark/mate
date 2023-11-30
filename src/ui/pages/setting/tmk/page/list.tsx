/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/13
 * Time: 下午3:15
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {Routes} from "@/router/enum/routes";
import {Link} from "react-router-dom";
import {TablePagination} from "@/ui/component/tablePagination";
import {connect} from "@/common/decorator/connect";
import {getTmkOrganization, deleteTmkCenter} from "../../../../../redux-actions/setting/tmk";
import {User} from "@/common/beans/user";
import "../style/index";
import {selectTmkGIList} from "@/saga/selectors/setting/tmk";
import {CommonUtils} from "@/common/utils/commonUtils";
import moment from 'moment';

@connect((state)=>({
    GIList: selectTmkGIList(state)
}), {})
class TmkTelephoneCenterManage extends React.Component<any, any>{
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
            name: 'TMK呼叫中心设置',
            path: '',
            link: '#',
            id: 'tmk'
        }
    ];
    columns:Array<any>;
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize:10,
            dataSource: [],
            totalSize: 0,
        }
        this.columns = [
            {
                title: "中心名称",
                dataIndex: 'tmkCenterName',
            },
            {
                title: "创建时间",
                dataIndex: 'createDate',
                render: (date:number) => moment(date).format("YYYY-MM-DD")
            },{
                title: "所属GI",
                dataIndex: 'associatedGiName',
            },{
                title: "状态",
                dataIndex: 'status',
                render: (text:string) => text === "1" ? "启用" : ''
            },
            {
                title: "操作",
                dataIndex: 'action',
                render: (text, record) => <Fragment>
                    <Link to={`${Routes.TMK查看.link}${CommonUtils.stringify({tmkCenterId: record.tmkCenterId})}`}>
                        <button className="gym-button-xxs gym-button-white mr15">查看</button>
                    </Link>
                    <Link to={`${Routes.TMK编辑.link}${CommonUtils.stringify({tmkCenterId: record.tmkCenterId})}`}>
                        <button className="gym-button-xxs gym-button-white mr15">编辑</button>
                    </Link>
                </Fragment>
            }
        ]
    }
    componentDidMount(){
        getTmkOrganization({
            currentCenterId: User.currentCenterId
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    /**
     * 搜索
     */
    handleSearch = (values) => {
        getTmkOrganization({
            currentCenterId: User.currentCenterId,
            pageNo:1,
            ...values
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    /**
     * 切换页数
     */
    handleChangePage = () => {

    }
    /**
     * 删除TMK中心
     * @param record
     */
    removeTmkCenter = (record:any) => {
        deleteTmkCenter({
            currentCenterId: User.currentCenterId,
            id: record.tmkCenterId
        }).then((res:any) => {
            getTmkOrganization({
                currentCenterId: User.currentCenterId
            }).then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize
                })
            })
        })
    }
    render(){
        const {pageSize, pageNo, dataSource, totalSize} = this.state;
        const {GIList} = this.props;
        const newGIList = GIList.map((item:any) =>({
            postCode: item.username,
            postName: item.username
        }));
        const searchConfig:Array<any> = [
            {
                label: 'TMK中心名称',
                required: false,
                type: 'text',
                placeholder: '输入关键字检索',
                name: 'tmkCenterName'
            }, {
                label: '所属GI',
                required: false,
                type: 'select',
                placeholder: '输入关键字检索',
                name: 'associatedGiName',
                options: newGIList
            }
        ];
        return(
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id='gym-tmk-manage' className='gym-tmk-manage page-wrap'>
                    <SearchForm
                        items={searchConfig}
                        onSearch={this.handleSearch}
                    />
                    <div className='gym-tmk-manage-create ml30'>
                        <Link to={`${Routes.TMK新增.path}`}>
                            <button className='gym-button-xs gym-button-default mb20'>+ 新建</button>
                        </Link>
                    </div>
                    <TablePagination
                        columns={this.columns}
                        rowKey={'tmkCenterId'}
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

export {TmkTelephoneCenterManage}
