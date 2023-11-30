/**
 * desc: 坐席通话详情统计
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/3/20
 * Time: 下午3:03
 */
import React, {Component} from 'react';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {exportReport, getEmiCloudRecord} from "@redux-actions/telephone/callRecords";
import moment from 'moment';
import {connect} from "@/common/decorator/connect";
import {selectGIDList} from "@/saga/selectors/setting/tmk";


@connect((state) => ({
    gidList: selectGIDList(state)
}))
class SeatReport extends Component<any, any>{
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'telephone'
        },{
            name: '坐席通话详情统计',
            path: '',
            link: '#',
            id: 'seat-report'
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
            title: '接入坐席',
            dataIndex: 'displayname',
        }, {
            title: '所属技能组',
            dataIndex: 'gname',
        }, {
            title: '拨打人员',
            dataIndex: 'staff',
            render: (text:string) => text || '-'
        },{
            title:'呼入接通率',
            dataIndex:'incall_rate',
            render: (text:string) => this.formatRate(text)
        },{
            title: '呼出接通率',
            dataIndex: 'outcall_rate',
            render: (text:string) => this.formatRate(text)
        },{
            title: '呼出接起次数',
            dataIndex: 'outcall_count',
        }, {
            title: '呼出次数',
            dataIndex: 'total_outcall_count',
        }, {
            title: '呼入通话时长',
            dataIndex: 'incall_time',
        },{
            title:'呼出通话时长',
            dataIndex:'outcall_time',
        },{
            title: '通话总时长',
            dataIndex: 'total_call_time',
        }
    ];
    searchConfig = ():Array<any> => {
        const {gidList} = this.props;
        const config = [
            {
                type: 'text',
                label: '关键字',
                name: 'searchStr',
                placeholder: '请输入接入坐席号进行查询'
            },
            {
                type: 'select',
                label: '技能组',
                name: 'gid',
                options : gidList.map((item:any) => ({postCode:item.id, postName:item.name}))
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
    };
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
    componentDidMount(){
        this.queryRecordList();
    }
    /**
     * 获取数据
     */
    queryRecordList = () => {
        const {pageNo, pageSize, startTime, endTime, searchStr, gid} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageNo,pageSize,
            startTime, endTime,
            searchStr,
            gid,
            fromType: "1",
        };
        getEmiCloudRecord(param).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        });
    };
    /**
     * 条件搜索
     * @param values
     */
    onSearch = (values:any) => {
        const param = Object.assign({}, values, {
            startTime: values.startTime ? moment(values.startTime).valueOf() : null,
            endTime: values.endTime ? moment(values.endTime).valueOf() : null,
        });
        this.setState({
            pageNo:1,
            ...param,
        },this.queryRecordList);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.queryRecordList);
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
            exportType: "1",
            searchStr,
        }
        exportReport(param)
    };
    render(){
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        return(
            <div id="gym-telephone-seat-report" className="gym-telephone-seat-report">
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

export {SeatReport}
