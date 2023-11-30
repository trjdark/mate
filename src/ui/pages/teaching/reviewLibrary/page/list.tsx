/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/9
 * Time: 下午3:39
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {Routes} from "@/router/enum/routes";
import {Link} from "react-router-dom";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getReviewQueryList} from "@redux-actions/teaching/reviewLibrary";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {lessonMatType} from "@/saga/selectors/setting/lessonMat";

const formatTeachProp = (type:string) => {
    const options = new Map([
        ['93001', "Play(四代教具)"],
        ['93002', "Play(五代教具)"],
        ['default', null],
    ]);
    return options.get(type) ? options.get(type) : options.get('default');
};


@connect((state) => ({
    lessonTypes: lessonMatType(state)
}))
class ReviewLibarayList extends React.Component<any, any> {
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
            name: '点评库设置(Art)',
            path: '',
            link: '#',
            id: 'tmk'
        }
    ];
    searchConfig = ():Array<any> => {
        const {lessonTypes} = this.props;
        return[
            {
                label: '课程类型',
                required: false,
                type: 'select',
                name: 'courseTypeId',
                options: (lessonTypes || []).map((item) => ({
                    postName:item.courseTypeName, postCode: item.id
                })),
            }, {
                label: '教具代数',
                required: false,
                type: 'select',
                name: 'teachPropCode',
                options: [
                    {postName: 'Play(四代教具)', postCode: "93001"},
                    {postName: 'Play(五代教具)', postCode: "93002"},
                ]
            }
        ];
    };
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize:10,
            dataSource: [],
            totalSize: 0,
            teachPropCode: null,
            courseTypeId: null
        };
    }
    columns = () => {
        const {pageNo, pageSize} = this.state;
        return [
            {
                title: "序号",
                dataIndex: 'no',
                render: (text:any, record:any, index:number) => (pageNo - 1) * pageSize + index + 1
            },
            {
                title: "课程类型",
                dataIndex: 'courseTypeName',
            }, {
                title: "教具代数",
                dataIndex: 'teachPropCode',
                render: (text:string) => formatTeachProp(text)
            }, {
                title: "操作",
                dataIndex: 'action',
                render: (text:string, record:any) => (
                    <Link to={`${Routes.教案修改.link}${CommonUtils.stringify({
                        id: record.teachingPlanId,
                        courseTypeName: record.courseTypeName
                    })}`}>
                        <button className="gym-button-xxs gym-button-white mr15">编辑</button>
                    </Link>
                )
            }
        ];
    }
    componentDidMount(){
        this.queryData();
    }

    /**
     * 获取数据
     */
    queryData = () => {
        const {pageNo, pageSize, courseTypeId, teachPropCode} = this.state;
        const param = {
            pageNo, pageSize, courseTypeId, teachPropCode,
            currentCenterId:User.currentCenterId
        };
        getReviewQueryList(param).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
            })
        })
    };
    /**
     * 搜索
     */
    handleSearch = (values) => {
        this.setState({
            ...values,
            pageNo:1,
        }, this.queryData);
    };
    /**
     * 切换页数
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            ...pageInfo,
        }, this.queryData);
    };
    render() {
        const {pageSize, pageNo, dataSource, totalSize} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id={`gym-review`} className="gym-review-list page-wrap">
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.handleSearch}
                    />
                    <TablePagination
                        columns={this.columns()}
                        rowKey={'teachingPlanId'}
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

export {ReviewLibarayList}
