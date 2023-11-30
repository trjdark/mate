/**
 * desc: 课程分类管理列表
 * User: debby
 * Date: 2018/8/16
 * Time:
 */
import React from 'react';
import {SearchForm} from "../../../../component/searchForm";
import {Button} from "antd";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {getCourseList} from "@redux-actions/setting/lessonCategoryActions";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";

declare interface pager{
    currentPage:string,
    pageSize:string
}


@connect((state) => ({
    businessSourceMap: selectBusinessSourceList(state)
}))

class LessonCateMng extends React.Component<any,any>{

    constructor(props:any){
        super(props);
        this.state={
            courseTypeCode:"",
            courseTypeName:"",
            pageNo:1,
            pageSize:10,
            currentCenterId:User.currentCenterId
        };
    }
    componentDidMount(){
        this.getData();
    }

    /**
     * 获取数据
     */
    getData = () => {
        const {courseTypeCode,courseTypeName,pageNo,pageSize,currentCenterId} = this.state;
        getCourseList({courseTypeCode,courseTypeName,pageNo,pageSize,currentCenterId})
            .then((res:any) => {
                this.setState({
                    dataSource:res.list,
                    totalSize: res.totalSize
                })
            })
    }
    /**
     * 搜索
     * @param json
     */
    handleChange = (values:any) => {
        this.setState({
            ...values,
            pageNo:1
        }, this.getData)
    };
    /**
     * 分页
     * @param {pager} page
     */
    handleChangePage = (pageInfo:pager) => {
        this.setState(pageInfo, this.getData);
    };
    // 搜索配置
    searchConfig:Array<any> = [
        {
            label: '课程分类代码',
            required: false,
            type: 'text',
            placeholder: '课程分类代码',
            name: 'courseTypeCode'
        },{
            label: '课程分类名称',
            required: false,
            type: 'text',
            placeholder: '课程分类名称' ,
            name: 'courseTypeName'
        }

    ];
    //  表头配置
    columns = () => {
        const {pageNo, pageSize} = this.state;
        const {businessSourceMap} = this.props;
        return [{
            title: '序号',
            dataIndex: 'number',
            width:100,
            render: (text:any, record:any, index:number) => (pageNo - 1) * pageSize + index + 1
        }, {
            title: '课程分类代码',
            dataIndex: 'courseTypeCode',
        }, {
            title: '课程分类名称',
            dataIndex: 'courseTypeName',
        }, {
            title: '课程业务来源',
            dataIndex: 'businessSource',
            render: (text:string) => {
                let res = businessSourceMap.filter((item:any) => item.businessSourceCode === text)
                return res.length > 0 ? res[0].businessSourceValue : '-'
            }
        }, {
            title: '启用状态',
            dataIndex: 'isEnabled',
            render: (text:number) =>  text === 1 ? '启用' : '停用'
        },{
            width:100,
            title: '操作',
            key: 'action',
            render:(text,record)=>(
                <Link to={`${Routes.课程分类编辑.link}/${CommonUtils.stringify({id: record.id})}`}>
                    <Button className=" gym-button-xxs gym-button-white" >编辑</Button>
                </Link>
            ),
        }];
    }
    render(){
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        return(
            <div id={`gym-lesson-manage`}>
                <SearchForm items={this.searchConfig} onSearch={this.handleChange}/>
                <Link to={`${Routes.课程分类新建.path}`}>
                    <Button className='gym-button-xs gym-button-default mb15 ml30'>+ 新建</Button>
                </Link>
                <TablePagination
                    columns={this.columns()}
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

export {LessonCateMng}
