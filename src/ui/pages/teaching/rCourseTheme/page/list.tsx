/**
 * desc: R店主题资源库
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/31
 * Time: 16:45
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {getRCourseList} from "@redux-actions/teaching/rCourse";
import {User} from "@/common/beans/user";
import {Table} from "@/ui/component/tablePagination";
import {PageTitle} from "@/ui/component/pageTitle";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";

class RCourseList extends Component <any, any> {
    private route = [
        {name: '教学', path: '', link: '#', id: 'teaching'},
        {name: 'R店主题资源库', path: '', link: '#', id: 'RCourseSource'},
    ];
    private columns = [
        {title: "序号", dataIndex: 'no', render:(text, record, index) => index + 1},
        {title: "课程代码", dataIndex: 'courseCode',},
        {title: "课程名称", dataIndex: 'courseName',},
        {
            title: "操作", dataIndex: 'action',
            render:(text, record) =>
                <Link to={`${Routes.R店主题资源库详情.link}${CommonUtils.stringify({
                    id: record.courseId,
                    courseName:record.courseName,
                    courseCode:record.courseCode
                })}`}
                target="_blank">
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </Link>
        },

    ];
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            visible: false
        }
    }
    componentDidMount() {
        getRCourseList({
            currentCenterId: User.currentCenterId
        }).then(res => {
            this.setState({dataSource: res})
        })
    }
    render(){
        const {dataSource} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.route}/>
                <div className='page-wrap'>
                    <PageTitle title="R店主题"/>
                    <Table
                        columns={this.columns}
                        rowKey={'courseId'}
                        dataSource={dataSource}
                    />
                </div>
            </Fragment>
        )
    }
}
export {RCourseList}
