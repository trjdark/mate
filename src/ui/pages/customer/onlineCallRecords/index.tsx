/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/18
 * Time: 下午2:31
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import { Divider } from 'antd';
import {downloadRecordsFile, queryCenterCallRecords} from "@redux-actions/telephone/callRecords";
import {User} from "@/common/beans/user";
import {recordTelephoneMembers, getCenterMemberList} from "@redux-actions/telephone/callLeads";
import moment from "moment";
import {getCenterCallRecordsCounts} from "@redux-actions/customer/call";
import {CommonUtils} from "@/common/utils/commonUtils";
import {FUNC} from "@/ui/pages/setting/enum/functions";

/**
 * 去重
 * @param arr
 * @param key
 */
const removeDuplicate = (arr, key) => {
    let map = {};
    let result = [];
    for(let i = 0, l = arr.length; i < l; i++){
        if(!map[arr[i][key]]){
            result.push(arr[i])
            map[arr[i][key]] = true;
        }
    }
    return result;
}

class OnlineCallRecords extends React.Component<any, any>{
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            babyName: '',
            staffId:'',
            talkType:'',
            called:"",
            dataSource: [],
            tmkList: [],
            selectLeads: [],
            totalSize: 0,
            beginTime: null,
            endTime:null,
            callCount: 0,
            sortName: 'createDate',
            sortOrder: "desc",
            columns:[]
        }
    }
    private routes:Array<any> = [
        {
            name: '客户中心',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '外呼明细',
            path: '',
            link: '#',
            id: 'tmk'
        }
    ];
    setColumnConfig = (sortName, sortOrder) => {
        return [
            {
                title: "TMK",
                dataIndex: 'staffName',
            },{
                title: "宝宝姓名",
                dataIndex: 'babyName',
            },{
                title: "月龄",
                dataIndex: 'monthValue',
            },{
                title: "家庭关系/姓名",
                dataIndex: 'familyRelationship',
                render: (text:string, record:any) => <span>{text}/{record.parentName}</span>
            },{
                title: "手机号码",
                dataIndex: 'called',
            },{
                title: "归属地",
                dataIndex: 'phonePlace',
            }, {
                title: "接通次数",
                dataIndex: 'connectNum',
            },{
                title: "最近通话时间",
                dataIndex: 'createDate',
                sorter: true,
                sortOrder: sortName === "createDate" && `${sortOrder}end`,
                render: (date:number) => moment(date).format("YYYY-MM-DD HH:mm")
            },{
                title: "通话时长",
                dataIndex: 'durationFormat',
            },{
                title: "通话类型",
                dataIndex: 'talkType',
                render: (text:string) => this.formatTalkType(text)
            },
        ];
    };

    searchConfig:Array<any> =  [
        {
            type: 'text',
            label: '宝宝姓名',
            name: 'babyName',
            options: [],
        },
        {
            type: 'dates',
            label: '通话时间',
            name: {
                start: 'beginTime',
                end: 'endTime'
            },
        },
        {
            type: 'select',
            label: '通话类型',
            name: 'talkType',
            options: [
                {postCode: "94001", postName: "空号"},
                {postCode:"94002", postName: "未接通"},
                {postCode:"94003", postName: "已接通"},
                {postCode:"94004", postName: "客户挂断"}],
        },
        {
            type: 'text',
            label: '电话号码',
            name: 'called',
        },
    ];
    componentDidMount(){
        const {pageNo, pageSize, sortName, sortOrder } = this.state;
        Promise.all([
            queryCenterCallRecords({
                currentCenterId: User.currentCenterId,
                sortName,
                sortOrder,
                pageNo,
                pageSize,
            }),
            getCenterMemberList({
                currentCenterId: User.currentCenterId,
                id: User.currentCenterId
            }),
            getCenterCallRecordsCounts({
                currentCenterId: User.currentCenterId,

            })
        ]).then((res:any) => {
            this.setState({
                dataSource: res[0].list,
                totalSize: res[0].totalSize,
                tmkList: res[1],
                callCount: res[2].callCount,
                columns: this.setColumnConfig(this.state.sortName, this.state.sortOrder)
            })
        })
    }
    getCallRecords = () => {
        const {pageNo, pageSize, staffId, talkType, called, babyName, beginTime, endTime, sortName, sortOrder} = this.state;
        queryCenterCallRecords({
            currentCenterId: User.currentCenterId,
            pageNo,
            pageSize,
            babyName,
            staffId,
            talkType,
            called,
            sortName: sortName ? sortName :'createDate',
            sortOrder: sortOrder ?  sortOrder : "desc",
            beginTime: beginTime && beginTime.startOf('day').valueOf(),
            endTime: endTime && endTime.endOf('day').valueOf(),
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    formatTalkType = (type:string) => {
        const talkMap = new Map([
            ['94001', '空号'],
            ['94002', '未接通'],
            ['94003', '已接通'],
            ['94004', '客户挂断'],
            ['default', '未知'],
        ])
        return talkMap.get(type) || talkMap.get('default');
    }
    onSearch = (values) => {
        this.setState({
            pageNo:1,
            ...values,
        },this.getCallRecords);
    };
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                selectLeads: selectedRows
            });
            recordTelephoneMembers(removeDuplicate(selectedRows, 'leadsId').map((item:any) => ({
                leadsId: item.leadsId,
                babyName: item.babyName,
                centerId: item.cid,
                contactId: item.contactId,
                monthValue: item.monthValue
            })))
        },
    };
    downloadRecords = (fileId:string) => {
        downloadRecordsFile({
            currentCenterId: User.currentCenterId,
            fileId: fileId,
        })
    };
    /**
     * 翻页
     * @param pageInfo
     */
    changePage = (pageInfo) => {
        this.setState(pageInfo, this.getCallRecords)
    };
    /**
     * 排序
     * @param pagination
     * @param filters
     * @param sorter
     */
    handleTableSort = (pagination,filters,sorter) => {
        const sortInfo = {
            sortName: sorter.columnKey ?  sorter.columnKey : '',
            sortOrder: sorter.order ? sorter.order.substring(0, sorter.order.length - 3): '',
        };
        this.setState({
            sortName: sortInfo.sortName,
            sortOrder: sortInfo.sortOrder,
            columns: this.setColumnConfig(sortInfo.sortName, sortInfo.sortOrder)
        }, this.getCallRecords)
    };
    render(){
        const {dataSource, tmkList, totalSize, callCount, pageNo, pageSize, columns} = this.state;
        let newColumns = CommonUtils.isInclude(User.permissionList, FUNC["电话录音"])
                        ? [...columns, {
                                title: "电话录音",
                                dataIndex: 'recordingUrl',
                                render: (text:string) => text && <button className="gym-button-xxs gym-button-white" onClick={() => this.downloadRecords(text)}>下载</button>
                            }]
                        : [...columns];


        const  tmkListOptions = tmkList.map((item:any) => ({postCode:item.id, postName: item.chineseName}));
        const searchConfig = [...this.searchConfig, {
            type: 'select',
            label: 'TMK',
            name: 'staffId',
            options: tmkListOptions,
            initialValue: undefined,
        },];
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap gym-telephone-call-record-count">
                    <span>今日呼出次数：{callCount}</span>
                </div>
                <div id="gym-telephone-call-record" className="gym-telephone-call-record page-wrap">
                    <div>
                        <SearchForm
                            items={searchConfig}
                            onSearch={this.onSearch}
                        />
                    </div>
                    <Divider/>
                    <br/>
                    <TablePagination
                        rowSelection={this.rowSelection}
                        columns={newColumns}
                        rowKey={'id'}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        handleChangePage={this.changePage}
                        handleFilterTableChange={this.handleTableSort}
                    />
                </div>
            </Fragment>
        )
    }
}

export {OnlineCallRecords}
