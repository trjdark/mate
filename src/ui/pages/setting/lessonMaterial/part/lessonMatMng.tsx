/**
 * desc: 课程分类管理列表
 * User: colin.lu
 * Date: 2019/6/1
 * Time:
 */
import React, {Fragment} from 'react';
import {SearchForm} from "@/ui/component/searchForm";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {TablePagination} from "@/ui/component/tablePagination";
import {
    getLessonMatList,
    closeOrOpenLessonMat, getLessonLevel
} from "@redux-actions/setting/lessonMaterialActions";
import {User} from "@/common/beans/user";
import {Confirm} from "@/ui/component/customerCreateModal";
import {Tooltip} from "@/ui/component/toolTip";
import {Message} from "@/ui/component/message/message";

declare interface LessonList{
    currentPage:string,
    pageSize:string,
    getLessonMatList: any,
    closeOrOpenLessonMat: any,
    pager: any,
    lessonMatList: any,
}

class LessonMatMng extends React.Component<LessonList,any>{
    state={
        courseCode:"",
        courseName:"",
        pageNo:1,
        pageSize:10,
        currentCenterId:User.currentCenterId,
        courseLevelId:"",
        lessonOptions: [],
        dataSource: [],
        totalSize: 0,
    };
    componentDidMount(){
        const {pageNo, pageSize, currentCenterId} = this.state;

        Promise.all([
            getLessonMatList({pageNo, pageSize, currentCenterId}),
            getLessonLevel({courseTypeId: '', currentCenterId})
        ]).then((res:any) => {
            const [data, lessonOptions] = res;
            this.setState({
                dataSource: data.list,
                totalSize: data.totalSize,
                lessonOptions: lessonOptions.map((item:any) => ({postCode: item.id, postName: item.levelName}))
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
        }, this.getLessonList)
    };
    /**
     * 分页
     * @param page
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.getLessonList);
    };


    /**
     * 获取课程等级列表
     */
    getLessonList = () => {
        const {pageNo, pageSize, currentCenterId, courseCode, courseName, courseLevelId } = this.state;
        getLessonMatList({pageNo, pageSize, currentCenterId, courseCode, courseName, courseLevelId})
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize,
                })
            });
    };

    /**
     * 解封/封存
     * @param record
     */
    changeStorage(record){
        const _this = this;
        const params = {
            id:record.id,
            isStorage:record.isStorage ? 0 : 1,
            currentCenterId: User.currentCenterId,
            key:record.key
        };
        Confirm({
            title:`${!record.isStorage? '封存' : '解封'}后可能会影响‘RRP模板管理’内的设置，是否确定${!record.isStorage? '封存' : '解封'}${record.courseTypeName}课程？`,
            okText: '确定',
            cancelText: '取消',
            onOk(){
                closeOrOpenLessonMat(params).then(() => {
                    Message.success("保存成功！", _this.getLessonList)
                });
            }
        })
    }
    // 搜索配置
    searchConfig = ():Array<any> => {
        const {lessonOptions} = this.state;
        return [
            {
                label: '课程代码',
                required: false,
                type: 'text',
                placeholder: '课程代码',
                name: 'courseCode'
            },{
                label: '课程名称',
                required: false,
                type: 'text',
                placeholder: '课程名称',
                name: 'courseName'
            },{
                label: '课程等级',
                required: false,
                type: 'select',
                placeholder: '请选择课程等级',
                name: 'courseLevelId',
                options: lessonOptions,
            }
        ];
    };
    // 表头配置
    columns = () => {
        const {pageNo, pageSize} = this.state;
        return [{
            title: '序号',
            dataIndex: 'number',
            render: (text:any, record:any, index:number) => (pageNo - 1) * pageSize + index + 1
        }, {
            title: '课程分类名称',
            dataIndex: 'courseTypeName',
        }, {
            title: '课程代码',
            dataIndex: 'courseCode',
            render: (text:any) => (
                <Tooltip title={text}>
                    {text && text.length > 10? `${text.substr(0,9)}...`: text}
                </Tooltip>
            )
        },{
            title: '课程名称',
            dataIndex: 'courseName',
            render: (text:any) => (
                <Tooltip title={text}>
                    {text && text.length > 10? `${text.substr(0,9)}...`: text}
                </Tooltip>
            )
        },{
            title: '课程等级',
            dataIndex: 'courseLevelList',
            align:'center',
            render: (text:any, record:any) => this.renderLevel(record.courseLevelList, record.courseMonthList)
        },{
            title: '状态',
            dataIndex: 'isStorage',
            render: (text:number) => text === 0 ? "解封" : "封存"
        },{
            title: '操作',
            key: 'action',
            render:(text,record) => {
                return (
                    <Fragment>
                        <Link to={`${Routes.课程资料编辑.link}/${CommonUtils.stringify({id: record.id})}`}>
                            <button className='mr5 gym-button-xxs gym-button-white'>编辑</button>
                        </Link>
                        <button
                            className='gym-button-xxs gym-button-white'
                            onClick={this.changeStorage.bind(this,record)}
                        >
                            {record.isStorage ? "解封" : "封存"}
                        </button>
                    </Fragment>
                )
            },
        }];
    }
    /**
     * 渲染课程等级
     */
    renderLevel = (lessonLevel:Array<any>, lessonMonth:Array<any>) => {
        if(!lessonLevel || !lessonMonth){
            return ""
        }
        if(lessonLevel.length < 3){
            return lessonLevel.map((item:any, index:number) => (
                <div className="gym-lesson-tab" key={`lessonLevel_${index}`}>
                    <div>{item}</div>
                    <div>{lessonMonth[index]}</div>
                </div>
            ))
        }else{
            return(
                    <Tooltip
                        trigger='hover'
                        placement='bottom'
                        title={
                            <span>
                                {
                                    (lessonLevel || []).map((item:any, index:number) =>{
                                        return(
                                            <div key={index}>
                                                <span>{item}</span>
                                                <span>{lessonMonth[index]}</span>
                                            </div>
                                        )
                                    })
                                }
                            </span>
                        }
                    >
                        {
                            lessonLevel.map((item:any, index:number) => {
                                if(index < 2){
                                    return (
                                        <div className="gym-lesson-tab" key={`lessonLevel_${index}`}>
                                            <div>{item}</div>
                                            <div>{lessonMonth[index]}</div>
                                        </div>
                                    )
                                }
                            })
                        }
                        <span>...</span>
                    </Tooltip>
                )
        }
    };
    render(){
        const {pageNo, pageSize, dataSource, totalSize} = this.state;
        return(
            <div id={`gym-lesson-manage`}>
                <SearchForm items={this.searchConfig()} onSearch={this.handleChange}/>
                <Link to={`${Routes.课程资料新建.path}`}>
                    <button  className='gym-button-xs gym-button-default mb20 ml30'>+ 新建</button>
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

export {LessonMatMng}
