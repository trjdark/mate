/**
 * desc: 试点中心设置列表
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/11
 * Time: 下午4:26
 */
import React from 'react';
import {BreadCrumb} from '@/ui/component/breadcrumb';
import {AddButton} from "@/ui/pages/setting/testPoint/part/addButton";
import {TablePagination} from "@/ui/component/tablePagination";
import {getTestPointList, addTestPoint, deleteTestPoint} from "@redux-actions/setting/testPoint";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import moment from 'moment';
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {Tooltip} from "@/ui/component/toolTip";
import {CommonUtils} from "@/common/utils/commonUtils";

class TestPointList extends React.Component<any, any> {
    private breadCrumbRoutes: Array<any> = [
        {name: '设置', path: '', link: '#', id: ''},
        {name: '运营管理', path: '', link: '#', id: ''},
        {name: '试点中心设置', path: '', link: '#',}
    ];
    constructor(props){
        super(props)
        this.state = {
            dataSource: [],     // 列表数据
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }
    componentDidMount() {
        this.handleSearch();
    }
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({...pageInfo,}, this.handleSearch);
    }
    // 查询
    handleSearch = () => {
        const {pageNo, pageSize} = this.state;
        const param = {
            pageNo, pageSize,
            currentCenterId: User.currentCenterId
        };
        getTestPointList(param).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
            })
        })
    };
    /**
     * 添加试点中心
     * @param point
     */
    handleAddTestPoint = (point:any) => {
        addTestPoint(point).then(() => {
            Message.success("添加成功！");
            this.handleSearch();
        })
    };
    /**
     * 删除试点中心
     * @param record
     */
    handleCancelTestPoint = (record) => {
        const param = {
            id: record.id,
            currentCenterId:User.currentCenterId
        }
        deleteTestPoint(param).then(() => {
            Message.success("删除成功！");
            this.handleSearch();
        })
    };
    /**
     * 翻页
     */
    changePage = (pageInfo) => {
        this.setState(
            {
                pageNo: pageInfo.pageNo,
                pageSize: pageInfo.pageSize,
            },
            this.handleSearch
        );
    };
    columns = [
        {
            title: '中心号',
            dataIndex: 'centers',
            width: 200
        }, {
            title: '角色',
            dataIndex: 'roleName',
            width: 80
        }, {
            title: '菜单',
            dataIndex: 'functionNames',
            width: 400
        },{
            title: '备注',
            dataIndex: 'remark',
            width: 240,
            render: (text:string) => <Tooltip title={text}>{CommonUtils.cutstr(text, 20)}</Tooltip>

        },{
            title: '创建人',
            dataIndex: 'createBy',
            width: 100
        },{
            title: '创建时间',
            dataIndex: 'createDate',
            width: 140,
            render: (time:number) => moment(time).format('YYYY-MM-DD HH:mm')

        },{
            title: '操作',
            dataIndex: 'actions',
            width: 80,
            render: (text, record) => (
                <ConfirmCheck
                    button='删除'
                    item={record}
                    contentText='是否删除本条记录?'
                    ensure={this.handleCancelTestPoint}
                />
            )
        },
    ];
    render() {
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        return (
            <div className="gym-test-point">
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className='page-wrap'>
                    <AddButton emitAddTestPoint={this.handleAddTestPoint}/>
                    <TablePagination
                        dataSource={dataSource}
                        columns={this.columns} 
                        totalSize={totalSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        rowKey='id'
                        scroll={{x: 'max-content'}}
                        handleChangePage={this.changePage}
                    />
                </div>
            </div>
        )
    }
}

export {TestPointList}
