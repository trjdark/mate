/**
 * desc: 测评库
 * User: Vicky
 * Date: 2020/08/03
 * Time: 17:30
 */
import React, { Fragment } from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { SearchForm } from "@/ui/component/searchForm";
import { TablePagination } from "@/ui/component/tablePagination";
import { Routes } from "@/router/enum/routes";
import { Link } from "react-router-dom";
import { User } from "@/common/beans/user";
import history from "@/router/history";
import { CommonUtils } from "@/common/utils/commonUtils";
import { getProjectList, getCourseMonths, getEvaluationLibList } from "@redux-actions/teaching/evaluationReport";

class EvalutionLibarayList extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: '教学管理',
            path: '',
            link: '#',
            id: 'teachingOperation'
        },{
            name: '到访测评设置',
            path: '',
            link: '#',
            id: 'evaluationLibList'
        }
    ];
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize:10,
            projectCode:'', // 项目id(领域)
            courseId:'', // 月龄
            months: [], // 月龄
            projectList: [], // 项目列表
            dataSource: [],
            totalSize: 0,
        };
    }
    columns = () => [
        {
            title: "序号",
            dataIndex: 'a',
            render:(text, record,index)=> {
                return (
                    <div>{index + 1}</div>
                )
            }
        },
        {
            title: "月龄",
            dataIndex: 'courseCode',
            render:(text, record)=> {
                return (
                    <div>{record.courseCode} ({record.beginMonth}-{record.endMonth}个月)</div>
                )
            }
        },{
            title: "领域",
            dataIndex: 'projectName',
        },{
            title: "启用状态",
            dataIndex: 'enabled',
            render:(text, record)=> text===0?'禁用':'启用'
        },
        {
            title: "操作",
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <div>
                        <button className="gym-button-xxs gym-button-white mr15" onClick={() => { this.edit(record) }}>编辑</button>
                    </div>
                )
            }
        }
    ];
    componentDidMount () {
        this.handleSearch();
        getCourseMonths({
            currentCenterId: User.currentCenterId
        }).then((res: any) => {
            this.setState({ months: res });
        })
        getProjectList({currentCenterId: User.currentCenterId}).then((res:any) => {
            this.setState({ projectList: res });
        })
    }
    /**
     * 编辑
     */
    edit = (record:any) => {
        history.push(`${Routes.测评库编辑.link}${CommonUtils.stringify({id: record.projectId})}`)

    };
    handleSearch = () => {
        const params = {
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            currentCenterId: User.currentCenterId,
            courseId: this.state.courseId,
            projectCode: this.state.projectCode,
        };
        getEvaluationLibList(params).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    /**
     * 搜索
     * @param values
     */
    onSearch = (values: any) => {
        this.setState({
            ...values,
            pageNo: 1,
        }, this.handleSearch);
    };
    /**
     * 切换页数
     */
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.handleSearch);
    };
    /**
     * 搜索配置设置
     * @returns {Array<any>}
     */
    searchItem = ():Array<any> => {
        const {months, projectList} = this.state;
        const monthsOption = months.map((item: any) => ({
            postCode: item.courseId,
            postName: `${item.courseCode}  (${item.beginMonth}-${item.endMonth}个月)`,
        }));
        const projectOption = projectList.map((item: any) => ({ postCode: item.projectCode, postName: item.projectName}));
        return [
            {
                label: '月龄',
                required: false,
                type: 'select',
                placeholder: '请输入',
                name: 'courseId',
                options: monthsOption,
            }, {
                label: '领域',
                required: false,
                type: 'select',
                placeholder: '请输入',
                name: 'projectCode',
                options: projectOption,
            }
        ];
    }
    render() {
        const { pageSize, pageNo, dataSource, totalSize } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id={`gym-review`} className="gym-review-list page-wrap">
                    <SearchForm
                        items={this.searchItem()}
                        onSearch={this.onSearch}
                    />
                    <div className="gym-review-list-create ml30">
                        <Link to={`${Routes.测评库新增.path}`}>
                            <button className="gym-button-xs gym-button-default mb20">+ 新建</button>
                        </Link>
                    </div>
                    <TablePagination
                        columns={this.columns()}
                        rowKey={'projectId'}
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

export {EvalutionLibarayList}
