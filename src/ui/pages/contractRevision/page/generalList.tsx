/**
 * desc: 总部审批页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/5/12
 * Time: 下午5:00
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {listWrappedComponent} from "@/ui/pages/contractRevision/part/listWrappedComponent";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";

class GeneralListComponent extends React.Component<any, any> {
    private routes:Array<any> = [
        {name: '合同调整', path: '', link: '#', id: 'contractRevision'},
        {name: '总部审批列表', path: '', link: '#', id: 'contractRevisionGeneralList'}
    ];
    private TYPE = ['3','4','5','6','7' ];              // 1代表操作失误，2代表系统bug
    constructor(props){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,

        }
    }
    componentDidMount(){
        this.queryDate();
    }
    /*查询数据*/
    onSearch = (arg:any = {}) => {
        this.setState({
            pageNo:1,
            ...arg
        }, this.queryDate);
    };
    /*分页*/
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.queryDate);
    };
    /**
     * 查询数据
     */
    queryDate = () => {
        const {
            pageNo ,pageSize, babyName, contractCode, adjStatus,
            approvalStartTime, approvalEndTime, centerCode
        } = this.state;
        const param = Object.assign({}, {
            pageNo, pageSize,
            babyName, contractCode, adjStatus,
            approvalStartTime, approvalEndTime, centerCode,
            adjTypes: this.state.adjTypes ? [this.state.adjTypes] :  this.TYPE,
        });
        this.props.search(param);
    };
    /**
     * 导出
     */
    handleExport = () => {
        const {
            babyName, contractCode, adjStatus, approvalStartTime, approvalEndTime, centerCode
        } = this.state;
        const param = Object.assign({}, {
            babyName, contractCode, adjStatus,
            approvalStartTime, approvalEndTime, centerCode,
            adjTypes: this.state.adjTypes ? [this.state.adjTypes] :  this.TYPE,
        });
        this.props.emitExport(param, '总部财务合同调整审批列表');
    };
    render(){
        const {searchConfig, columnsConfig,dataSource, totalSize} = this.props;
        const {pageNo, pageSize} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap'>
                    <SearchForm
                        items={searchConfig}
                        onSearch={this.onSearch}
                    />
                    <div className='mb15'>
                        <button className='gym-button-default-sm'
                                onClick={this.handleExport}
                        >导出</button>
                    </div>
                    <TablePagination
                        columns={columnsConfig}
                        dataSource={dataSource}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        totalSize={totalSize}
                        scroll={{x: 'max-content'}}
                        rowKey='id'
                        handleChangePage={this.handleChangePage}

                    />
                </div>
            </Fragment>
        )
    }
}

const ContractRevisionGeneralList = listWrappedComponent(GeneralListComponent)

export {ContractRevisionGeneralList}
