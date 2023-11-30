/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import '../style/index'
import React from 'react';
import {message, Modal} from "antd";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {
    getRRPList,
    checkIfTemplateIsEnbale
} from "@redux-actions/setting/lessonMaterialActions";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {lessonMatType} from "@/saga/selectors/setting/lessonMat";
import history from "@/router/history";

declare interface RRPListProps {
    sort?:String,
    getLessonMatType: any,
    lessonMatType: any,
}

@connect((state)=>({
    lessonMatType:lessonMatType(state),
}),{})

class RRPList extends React.Component<RRPListProps, any> {
    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: 'RRP模板管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        }
    ];

    constructor(props: any) {
        super(props);
        this.state = {
            dataList:[],
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
            currentCenterId: User.currentCenterId,
            sort:"asc",
            courseTypeId: '', // 课程分类
            lessonPlanName: '', // 教案名字
            forceToLesson: false // 是否教程内可以编辑
        };
    }

    componentDidMount() {
        this.handleSearch();
    }

    /**
     * 搜索
     * @param values
     */
    handleChange = (values:any) => {
        this.setState({
            ...values,
            pageNo:1
        },this.handleSearch);
    };

    handleChangeUnClassFilter = (values: any, filter: any, sort: any) => {
        this.setState({
            sort: sort.order === 'descend' ? 'desc' : sort.order === 'ascend' ? 'asc' : null,
        },()=>{
            this.handleSearch();
        });
    };
    /**
     * 获取数据
     */
    handleSearch = () => {
        const {courseTypeId,lessonPlanName,pageNo,pageSize,currentCenterId,sort} = this.state;
        getRRPList({
            courseTypeId,lessonPlanName,pageNo,pageSize,currentCenterId,sort
        }).then((res) => {
            this.setState({
                dataList: res.list,
                totalSize: res.totalSize
            })
        }, (err) => {
           message.error(err.msg);
        })
    };

    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, this.handleSearch);
    };
    /**
     * 检查是否可用
     * @param record
     */
    checkTemplateIsEnable = (record) => {
        const postData ={
            currentCenterId: User.currentCenterId,
            id: record.id
        };

        // 弹出提示
        checkIfTemplateIsEnbale(postData).then((res) => {
            if(res.isEnable){
                Modal.warning({
                    title: '提醒',
                    content: '该课程类型未配置课程等级，系统已自动禁用本教案。如需启用请前往课程资料设置配置',
                    okText: '前往课程资料设置',
                    onOk: this.goToLesson
                });
            }else{
                history.push(`${Routes.RRP课程类型编辑.link}/${CommonUtils.stringify({id: record.id})}`)
            }
        }, (err) => {
            message.error(err.data.msg);
        })
    };

    /**
     * 前往课程资料设置
     */
    goToLesson = () => {
        history.push(Routes.课程资料管理.path)
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const {lessonMatType} = this.props;
        const lessonMatOptions = lessonMatType.map((item: any) => ({
            postCode: item.id,
            postName: item.courseTypeName
        }));
        return [
            {
                label: '教案名称',
                required: false,
                type: 'text',
                placeholder: '请输入教案名称',
                name: 'lessonPlanName'
            }, {
                label: '课程类型',
                required: false,
                type: 'select',
                placeholder: '请选择课程类型',
                name: 'courseTypeId',
                options: lessonMatOptions
            }
        ];
    };
    /*设置搜索内容和列表头*/
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 200,
        }, {
            title: '教案名称',
            dataIndex: 'lessonPlanName',
            key: 'lessonPlanName'
        }, {
            title: '课程类型',
            dataIndex: 'courseTypeName',
            key: 'courseTypeName',
            render: (text:any,record:any) => text === 'Play' ? `${text} (${record.teachPropName})}` : text

        }, {
            title: '启用状态',
            dataIndex: 'isEnable',
            key: 'isEnable',
            width: 200,
            render: (text:any) => text === 1 ? '启用' : '禁用'
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 100,
            render: (text:any,record:any) => (
                <button
                    onClick={() => this.checkTemplateIsEnable(record)}
                    className="gym-button-xxs gym-button-white"
                >
                    编辑
                </button>
            )
        }];
    render() {
        const {pageNo, pageSize, totalSize , dataList} = this.state;
        return (
            <div id={`gym-rrp-add-edit`}>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.handleChange}
                    />
                    <div className='gym-classroom-manage-create ml30'>
                        <Link to={`${Routes.RRP课程类型新增.path}`}>
                            <button className='gym-button-xs gym-button-default mb20'>+ 新建</button>
                        </Link>
                    </div>
                    <TablePagination
                        columns={this.columns}
                        rowKey={'id'}
                        dataSource={dataList}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                        handleFilterTableChange={this.handleChangeUnClassFilter}
                    />
                </div>
            </div>
        )
    }
}

export {RRPList}
