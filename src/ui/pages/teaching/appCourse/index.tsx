import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";
import {User} from "@/common/beans/user";
import {getAppCourseList, updateAppCourse} from "@redux-actions/teaching/rCourse";
import {TablePagination} from "@/ui/component/tablePagination";
import {Modal} from "antd";
import {Input, TextArea} from "@/ui/component/input";
import {form} from "@/common/decorator/form";
import {Form} from "antd";
import {lessonMatType} from "@/saga/selectors/setting/lessonMat";
import {getLessonMatType} from "@redux-actions/setting/lessonMaterialActions";
import {Message} from "@/ui/component/message/message";

const {Item} = Form;

const formatTeachProp = (type:string) => {
    const options = new Map([
        ['93001', "Play(四代教具)"],
        ['93002', "Play(五代教具)"],
        ['default', null],
    ]);
    return options.get(type) ? options.get(type) : options.get('default');
};

@connect((state) => ({
    businessSourceMap: selectBusinessSourceList(state),
    lessonMatType:lessonMatType(state),
}), {getLessonMatType})
@form()
class AppCourse extends Component <any, any> {
    private BREAD_CRUMB = [
        {id: 'teach', name: '教学'},
        {id: 'teach-app-course', name: 'App课程展示'},
    ];
    private columns = [
        {
            title: '业务来源',
            dataIndex: 'businessSource'
        },{
            title: '课程分类',
            dataIndex: 'courseTypeCode'
        },{
            title: '课程代码',
            dataIndex: 'courseCode'
        },{
            title: '课程名称',
            dataIndex: 'courseName'
        },{
            title: '课程主题',
            dataIndex: 'themeName'
        },{
            title: '教案名称',
            dataIndex: 'className'
        },{
            title: '教具代数',
            dataIndex: 'programVersion',
            render: (text:string) => formatTeachProp(text)
        },{
            title: '主题描述',
            dataIndex: 'themeDesc'
        },{
            title: '操作',
            dataIndex: 'action',
            render: (text, record) =>
                <button className='mr10 gym-button-xxs gym-button-white' onClick={() => this.showModal(record)}>编辑</button>
        },

    ];
    constructor(props) {
        super(props);
        this.state = {
            totalSize: 10,
            pageNo:1,
            pageSize: 10,
            dataSource:[],
            businessSourceList:null,
            courseTypeCodeList:null,
            courseCode:null,
            themeName:null,
            courseName:null,
            className:null,
            visible:false,
            updateId:null,
            updateCourseName:null,
            updateThemeName:null,
            updateThemeDesc:null,
        }
    }
    componentDidMount() {
        const {getLessonMatType} = this.props;
        this.queryData();
        getLessonMatType({currentCenterId: User.currentCenterId});
    }

    searchOption = ():Array<any> => {
        const {businessSourceMap, lessonMatType} = this.props;
        return [
            {
                type: 'select',
                label: '业务来源',
                name: 'businessSourceList',
                placeholder: '请选择',
                multiple:true,
                options:businessSourceMap.map(item => ({postCode:item.businessSourceCode, postName: item.businessSourceValue})),
            }, {
                type: 'select',
                label: '课程分类',
                name: 'courseTypeCodeList',
                placeholder: '请选择',
                multiple:true,
                options:lessonMatType.map(item => ({postCode:item.courseTypeCode, postName: item.courseTypeName})),
            },{
                label: '课程代码',
                type: 'text',
                placeholder: '请输入',
                name: 'courseCode'
            },{
                label: '课程主题',
                type: 'text',
                placeholder: '请输入',
                name: 'themeName'
            },{
                label: '课程名称',
                type: 'text',
                placeholder: '请输入',
                name: 'courseName'
            },{
                label: '教案名称',
                type: 'text',
                placeholder: '请输入',
                name: 'className'
            }
        ];
    }
    queryData = () => {
        const {pageNo, pageSize, businessSourceList, courseTypeCodeList, courseCode, themeName, courseName, className} = this.state;
        const param = Object.assign({}, {
            pageNo, pageSize, businessSourceList,
            courseTypeCodeList, courseCode, themeName,
            courseName, className
        }, {
            currentCenterId:User.currentCenterId
        });
        getAppCourseList(param).then(res => {
            this.setState({
                dataSource: res.list,
                pageNo: res.pageNo,
                pageSize: res.pageSize,
                totalSize: res.totalSize
            })
        })
    }
    /**
     * 搜索
     */
    handleSearch = (values) => {
        this.setState({...values, pageNo:1}, this.queryData);
    }
    /**
     * 分页
     */
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.queryData)
    }
    showModal = (node) => {
        this.setState({
            visible:true, updateId: node.id,
            updateCourseName:node.courseName,
            updateThemeName:node.themeName,
            updateThemeDesc:node.themeDesc,
        });
    }
    closeModal = () => {
        this.setState({visible: false, updateId:null,
            updateCourseName:null,
            updateThemeName:null,
            updateThemeDesc:null,
        });
    }
    handleSubmit = () => {
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                const param = Object.assign({}, values, {
                    id: this.state.updateId,
                    currentCenterId: User.currentCenterId
                });
                updateAppCourse(param).then(() => {
                    Message.success('更新成功！');
                    this.queryData();
                })
                this.closeModal();
            }
        })
    }
    render(){
        const {dataSource, pageNo, pageSize, totalSize, visible, updateCourseName, updateThemeName, updateThemeDesc} = this.state;
        const {form} = this.props;
        const {getFieldDecorator} = form;

        return (
            <Fragment>
                <BreadCrumb routes={this.BREAD_CRUMB}/>
                <div className='page-wrap'>
                    <SearchForm
                        items={this.searchOption()}
                        onSearch={this.handleSearch}
                    />
                    <TablePagination
                        columns={this.columns}
                        totalSize={totalSize}
                        dataSource={dataSource}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        rowKey='id'
                    />
                </div>
                <Modal
                    visible={visible}
                    title='APP课程显示设置'
                    onCancel={this.closeModal}
                    onOk={this.handleSubmit}
                    destroyOnClose={true}
                >
                    <Form >
                        <Item label='课程名称'>
                            {
                                getFieldDecorator('courseName',{
                                    rules: [{required: true, message: '请输入课程名称'}],
                                    initialValue: updateCourseName,
                                })(
                                    <Input
                                        className=''
                                        placeholder='请输入课程主题'
                                    />
                                )
                            }
                        </Item>
                        <Item label='课程主题'>
                            {
                                getFieldDecorator('themeName',{
                                    rules: [{required: true, message: '请输入课程主题'}],
                                    initialValue: updateThemeName,
                                })(
                                    <Input
                                        className=''
                                        placeholder='请输入课程主题'
                                    />
                                )
                            }
                        </Item>
                        <Item label='主题描述'>
                            {
                                getFieldDecorator('themeDesc',{
                                    rules: [{required: true, message: '请输入主题描述'}],
                                    initialValue: updateThemeDesc,
                                })(
                                    <TextArea
                                        placeholder='请输入主题描述'
                                    />
                                )
                            }
                        </Item>
                    </Form>
                </Modal>
            </Fragment>
        )
    }
}

export {AppCourse}
