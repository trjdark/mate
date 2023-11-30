/**
 * desc: 教室管理
 * User: colin.lu
 * Date: 2019/6/21
 * Time:
 */

import React from 'react';
import {Button} from "antd";
import {Tooltip} from "@/ui/component/toolTip";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {getRoomList} from "@redux-actions/setting/roomActions";
import {CommonUtils} from "@/common/utils/commonUtils";
import {SearchForm} from "@/ui/component/searchForm";
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import '../../classroom/style/index'

class RoomManage extends React.Component<any, any> {
    state = {
        classroomCode: "",
        classroomName: "",
        classroomType: "",
        pageNo: 1,
        pageSize: 10,
        currentCenterId: User.currentCenterId,
        dataSource: [],
        totalSize: 0,
    };
    componentDidMount() {
        this.getData();
    }
    getData = () => {
        const {pageNo, pageSize, classroomCode, classroomName, classroomType, currentCenterId} = this.state;
        getRoomList({
            pageNo, pageSize, classroomCode, classroomName, classroomType, currentCenterId
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        });
    }
    /**
     * 搜索
     * @param values
     */
    onSearch = (values: any) => {
        this.setState({
            ...values,
            pageNo:1
        }, this.getData)
    };
    /**
     * 分页
     * @param page
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, this.getData);
    };
    // 搜索配置
    searchConfig:any = [
        {
            label: '教室编号',
            required: false,
            type: 'text',
            placeholder: '教室编号',
            name: 'classroomCode'
        }, {
            label: '教室名称',
            required: false,
            type: 'text',
            placeholder: '教室名称',
            name: 'classroomName'
        },
        {
            label: '教室类型',
            required: false,
            type: 'select',
            placeholder: '教室类型',
            name: 'classroomType',
            options: [
                {
                    postCode: 'play',
                    postName: 'play'
                },
                {
                    postCode: 'music',
                    postName: 'music'
                },
                {
                    postCode: 'Art',
                    postName: 'Art'
                },
                {
                    postCode: 'Parenting',
                    postName: 'Parenting'
                },
                {
                    postCode: 'Others',
                    postName: 'Others'
                },
            ]
        },

    ];
    columns = [
        {
            title: '教室编号',
            dataIndex: 'classroomCode',
            width: 200,
            render: (text:any) => (
                <Tooltip title={text}>
                    {text.length > 10? `${text.substr(0,9)}...`: text}
                </Tooltip>
            )
        }, {
            title: '教室名称',
            dataIndex: 'classroomName',
            render: (text:any) => (
                <Tooltip title={text}>
                    {text.length > 10? `${text.substr(0,9)}...`: text}
                </Tooltip>
            )
        }, {
            title: '教室类型',
            dataIndex: 'classroomType',
        }, {
            title: '所属中心',
            dataIndex: 'centerName',
            width: 200
        }, {
            title: '状态',
            dataIndex: 'isEnabled',
            render: (text:number) => text === 1 ? "启用" : '停用'
        }, {
            title: '备注',
            dataIndex: 'remark',
            width:'20%',
            render: (text:any = '') => (
                <Tooltip title={text}>
                    {(text && text.length > 10) ? `${text.substr(0,9)}...`: text}
                </Tooltip>
            )
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (record) => (
                <Link
                    to={`${Routes.编辑教室管理.link}/${CommonUtils.stringify({id: record.id})}`}
                >
                    <Button htmlType={'button'} className=" gym-button-xxs gym-button-white">编辑</Button>
                </Link>
            )
        }
    ];
    render() {
        const {dataSource, pageNo, pageSize, totalSize} = this.state;
        return (
            <div id='gym-classroom-manage' className='gym-table-popover'>
                <SearchForm
                    items={this.searchConfig}
                    onSearch={this.onSearch}
                />
                <div className='gym-classroom-manage-create ml30'>
                    <Link to={`${Routes.添加教室管理.path}`}>
                        <button className='gym-button-xs gym-button-default mb20'>+ 新建</button>
                    </Link>
                </div>
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

export {RoomManage}
