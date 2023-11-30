/**
 * desc: 总部课程包设置
 * Date: 2018/8/11
 * Time: 下午12:02
 */
import React from 'react';
import {SearchForm} from "../../../../component/searchForm";
import {Button} from "antd";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {getHqPackageList} from "@redux-actions/setting/courseGeneral";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import {CourseType} from "@/ui/pages/setting/enum/course";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";

@connect((state) => ({
    businessSourceMap: selectBusinessSourceList(state)
}))
class CourseGeneralManage extends React.Component<any,any>{
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            packageName: '',
            packageCode: '',
            dataSource: [],
            totalSize: 0,
        }
    }
    componentDidMount(){
        this.getPackageList();
    }
    /**
     * 获取总部课程报数据
     */
    getPackageList = () => {
        const {pageNo, pageSize, packageName, packageCode} = this.state;
        getHqPackageList({
            currentCenterId:User.currentCenterId,
            pageNo, pageSize,
            packageName,packageCode
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        });
    };
    /**
     * 搜索
     * @param values
     */
    handleSearch = (values:any) => {
        this.setState({...values, pageNo:1}, this.getPackageList);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState({
            pageNo:pageInfo.pageNo,
            pageSize: pageInfo.pageSize
        }, this.getPackageList)
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
        return [
            {
                title: '类型',
                dataIndex: 'packageType',
                render:(text)=> {
                    const resultList = CourseType.filter((item) => item.value === text);
                    return resultList.length > 0 ? resultList[0].name : '-'
                }
            }, {
                title: '课程包代码',
                dataIndex: 'packageCode',
            }, {
                title: '课程包名称',
                dataIndex: 'packageName',
            }, {
                title: '课程包业务来源',
                dataIndex: 'businessSource',
                render: (text:string) => {
                    let res = businessSourceMap.filter((item:any) => item.businessSourceCode === text)
                    return res.length > 0 ? res[0].businessSourceValue : '-'
                }
            }, {
                title: '标准有效期长度（月）',
                dataIndex: 'validityPeriod',
            }, {
                title: '课时数',
                dataIndex: 'packageNum',
            }, {
                title: '合约频次（次/周）',
                dataIndex: 'nc',
            },{
                title: '启用状态',
                dataIndex: 'isEnabled',
                render:(text)=> text === 1 ? "启用" : "禁用",
            }, {
                title: '操作',
                dataIndex: 'action',
                render:(text,record)=>(
                    <Link to={`${Routes.总部课程包编辑.link}/${CommonUtils.stringify({id: record.id})}`}>
                        <Button className=" gym-button-xxs gym-button-white" >编辑</Button>
                    </Link>
                ),
            }
        ];
    }
    render(){
        let {dataSource, pageNo, pageSize, totalSize} = this.state;
        return(
            <div id={`gym-general-course-manage`}>
                <SearchForm items={this.searchConfig} onSearch={this.handleSearch}/>
                <Link to={Routes.总部课程包添加.path}>
                    <Button className='gym-button-default-xs mb20 ml30'>
                        + 新建
                    </Button>
                </Link>
                <br/>
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

export {CourseGeneralManage}
