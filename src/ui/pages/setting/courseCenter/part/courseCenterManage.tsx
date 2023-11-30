/**
 * desc: 中心课程包管理
 * Date: 2018/8/14
 * Time: 上午9:14
 */
import React from 'react';
import {Link} from "react-router-dom";
import {SearchForm} from "../../../../component/searchForm";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getCenterPackageList} from "@redux-actions/setting/course";
import {User} from "@/common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import {Button} from "antd";
import {CourseType} from "@/ui/pages/setting/enum/course";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";


@connect((state) => ({
    businessSourceMap: selectBusinessSourceList(state)
}))
class CourseCenterManage extends React.Component<any, any> {
    constructor(props:any){
        super(props)
        this.state = {
            pager:{
                currentPage: 1,
                pageSize: 10
            },
            packageName: '',
            packageCode: '',
            dataSource: [],
            totalSize: 0
        }
    }
    componentDidMount(){
        this.getData();
    }
    /**
     * 获取数据
     */
    getData = () => {
        const {pageNo, pageSize, packageName, packageCode} = this.state;
        const param = {
            pageNo, pageSize, packageName, packageCode,
            currentCenterId:User.currentCenterId,
        };
        getCenterPackageList(param).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        });
    }
    onSearch = (values:any) => {
        this.setState({
            ...values,
            pageNo: 1,
        }, this.getData);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.getData);
    };
    // 搜索配置
    searchConfig:any = [
        {
            label: '课程包代码',
            required: false,
            type: 'text',
            placeholder: '课程包代码',
            name: 'packageCode'
        },{
            label: '课程包名称',
            required: false,
            type: 'text',
            placeholder: '课程包名称' ,
            name: 'packageName'
        },
    ];
    // 表头设置
    columns = () => {
        const {businessSourceMap} = this.props;
        return [{
            title: '类型',
            dataIndex: 'packageType',
            key: 'packageType',
            width: 120,
            render:(text)=> {
                const resultList = CourseType.filter((item) => item.value === text);
                return resultList.length > 0 ? resultList[0].name : '-'
            }
        }, {
            title: '课程包代码',
            dataIndex: 'packageCode',
            key: 'packageCode',
            width: 120
        }, {
            title: '课程包名称',
            dataIndex: 'packageName',
            key: 'packageName',
            width: 150
        }, {
            title: '课程包业务来源',
            dataIndex: 'businessSource',
            width:  150,
            render: (text:string) => {
                let res = businessSourceMap.filter((item:any) => item.businessSourceCode === text)
                return res.length > 0 ? res[0].businessSourceValue : '-'
            }
        },{
            title: '标准有效期长度',
            dataIndex: 'validityPeriod',
            key: 'duration',
            width: 200
        }, {
            title: '课时数',
            dataIndex: 'packageNum',
            key: 'packageNum',
            width: 80
        }, {
            title: '合约频次',
            dataIndex: 'nc',
            key: 'nc',
            width: 150
        },{
            title: '课程包定价',
            dataIndex: 'packagePrice',
            key: 'packagePrice',
            width: 120
        },{
            title: '启用状态',
            dataIndex: 'isEnabled',
            key: 'isEnabled',
            width: 80,
            render: (text:number) => (text === 1 ? <span>启用</span> : text === 0 ? <span>禁用</span> : null )
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            render:(text:string, record:any) => (
                <div>
                    <Link className="span-link" to={`${Routes.中心课程包定价.link}${CommonUtils.stringify({id: record.id})}`}>
                        <Button className="gym-button-white-xxs">定价</Button>
                    </Link>
                    {
                        // 托育课程不参与促销活动
                        record.businessSource === '75003' ||
                        <Link className="span-link" to={`${Routes.中心课程包促销.link}${CommonUtils.stringify({id: record.id})}`}>
                            <Button className="gym-button-white-xxs">促销</Button>
                        </Link>
                    }
                </div>
            )
        }];
    }
    render(){
        const {pageNo, pageSize, totalSize, dataSource} = this.state;

        return(
            <div className='gym-center-course-manage'>
                <SearchForm items={this.searchConfig} onSearch={this.onSearch}/>
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

export {CourseCenterManage}
