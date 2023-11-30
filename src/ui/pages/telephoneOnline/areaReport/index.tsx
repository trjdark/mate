/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/3/20
 * Time: 下午3:35
 */
import React, {Component} from 'react';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {getEmiGroupsRecord, exportReport} from "@redux-actions/telephone/callRecords";
import moment from 'moment';

class AreaReport extends Component<any, any>{
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'telephone'
        },{
            name: '外呼统计(按坐席组)',
            path: '',
            link: '#',
            id: 'area-report'
        }
    ];
    constructor(props:any){
        super(props)
        this.state = {
            columns: [],
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo:1,
            startTime: moment().startOf('day').valueOf(),
            endTime: moment().endOf('day').valueOf(),
        }
    };
    private columns = [
        {
            title: '技能组名称',
            dataIndex: 'name',
        }, {
            title: '坐席人数',
            dataIndex: 'memberCount',
        }, {
            title: '呼入接通率',
            dataIndex: 'incall_rate',
            render: (text:string) => this.formatRate(text)
        },{
            title:'呼出接通率',
            dataIndex:'outcall_rate',
            render: (text:string) => this.formatRate(text)
        },{
            title: '呼入接起次数',
            dataIndex: 'incall_count',
        },{
            title: '呼出接起次数',
            dataIndex: 'outcall_count',
        }, {
            title: '呼入通话时长',
            dataIndex: 'incall_time',
        }, {
            title: '呼出通话时长',
            dataIndex: 'outcall_time',
        },{
            title:'通话总时长',
            dataIndex:'total_call_time',
        }
    ];
    searchConfig = ():Array<any> => {
        const config = [
            {
                type: 'text',
                label: '关键字',
                name: 'searchStr',
                placeholder: '请输入正确的技能组名称',
            },
            {
                type: 'dates',
                label: '查询日期',
                name: {
                    start: 'startTime',
                    end: 'endTime',
                    startInitialValue: moment(),
                    endInitialValue: moment(),
                },
            },
        ];
        return config;
    }
    componentDidMount(){
        this.queryAccountList();
    }
    /**
     * 格式化百分比精度
     * @param {string} str
     */
    formatRate = (str:string) => {
        if(str === "0" || !str){
            return "0.00%";
        }
        const index = str.indexOf('.');
        return str.substring(0, index+3) + "%";
    };
    /**
     * 获取数据
     */
    queryAccountList = () => {
        const {pageSize, pageNo, startTime, endTime, searchStr} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageSize, pageNo,
            startTime, endTime,
            searchStr,
            fromType: "1"
        };
        getEmiGroupsRecord(param).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    /**
     * 条件搜索
     * @param values
     */
    onSearch = (values:any) => {
        const param = Object.assign({}, values, {
            startTime: values.startTime ? moment(values.startTime).valueOf() : null,
            endTime: values.endTime ? moment(values.endTime).valueOf() : null,
        })
        this.setState({
            pageNo:1,
            ...param,
        },this.queryAccountList);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
            selectLeads: []
        }, this.queryAccountList);
    };
    /**
     * 导出
     */
    export = () => {
        const {startTime, endTime, searchStr} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            fromType: "1",
            startTime, endTime,
            exportType: "2",
            searchStr,
        }
        exportReport(param)
    };
    render(){
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        return(
            <div id="gym-telephone-area-report" className="gym-telephone-area-report">
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />
                    <div className="mb25">
                        <button className="gym-button-default gym-button-xs" onClick={this.export}>导出</button>
                    </div>
                    <TablePagination
                        dataSource={dataSource}
                        columns={this.columns}
                        totalSize={totalSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        rowKey="id"
                        handleChangePage={this.handleChangePage}
                    />
                </div>
            </div>
        )
    }
}

export {AreaReport}
