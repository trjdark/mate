/**
 * desc: 云语音通话记录
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/5
 * Time: 下午3:03
 */
import React, {Component, Fragment} from 'react';
import {Divider, Tabs} from 'antd';
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import moment from 'moment';
import '../style/calRecord.scss';
import {User} from "@/common/beans/user";
import {Routes} from "@/router/enum/routes";
import {recordTelephoneMembers} from "@redux-actions/telephone/callLeads";
import {Filter} from "@/filter/filter";
import {connect} from "@/common/decorator/connect";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {getCallStatisitcs, queryCallRecords, downloadRecordsFile} from "@redux-actions/telephone/callRecords";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const {TabPane} = Tabs;

// 在职员工
const selectOption = {
    workingStatus: "1",
};

@connect((state:any) => ({
    staffList: selectTotalEmployeeList(state, selectOption)
}))
class CallRecords extends Component <any, any>{
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'telephone'
        },{
            name: '外呼明细',
            path: '',
            link: '#',
            id: 'call-report'
        }
    ];
    constructor(props:any){
        super(props);
        this.state = {
            columns : [],
            called: '',
            babyName:'',
            beginTime: moment().subtract(7, 'd').startOf('day').valueOf(),
            talkType:'',
            endTime: moment().endOf('day').valueOf(),
            staffId:'',
            duration:null,
            dataSource: [],
            totalSize: 0,
            pageNo:1,
            pageSize:0,
            sortName: 'createDate',        // 排序字段
            sortOrder: 'desc',             // 排序升降
            callCount: 0,                  // 今日呼出次数
            callTimeStr: 0,                // 今日呼出总时长
            connectSeatNum: 0,             // 当前接入坐席数
            freeSeatNum: 0,                // 当前空闲坐席数
            groupCallList: [],
            htmkRole: '',
            callSuccessTimes: 0,           // 今日接通次数
            selectLeads: [],               // 选中的leads
        }
    }
    componentDidMount(){
        const{pageNo, pageSize, sortName, sortOrder, endTime, beginTime} = this.state;
        Promise.all([
            queryCallRecords({
                currentCenterId: User.currentCenterId,
                endTime, beginTime,
                sortName,
                sortOrder,
                pageNo,
                pageSize,
            }),
            getCallStatisitcs({currentCenterId: User.currentCenterId})
        ]).then((res:any) => {
            this.setState({
                dataSource: res[0].list,
                pageNo: res[0].pageNo,
                pageSize: res[0].pageSize,
                totalSize: res[0].totalSize,
                columns: this.setColumnConfig(this.state.sortName, this.state.sortOrder),
                callCount: res[1].callCount,
                callTimeStr: res[1].callTimeStr,
                connectSeatNum: res[1].connectSeatNum,
                freeSeatNum: res[1].freeSeatNum,
                groupCallList: res[1].groupCallList,
                htmkRole: res[1].htmkRole,
                callSuccessTimes: res[1].callSuccessTimes
            })
        });
    }
    setColumnConfig = (sortName, sortOrder) => {
        return [
            {
                title: "跟进人员",
                dataIndex: 'createByName',
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
                title: "是否接通",
                dataIndex: 'connectNum',
                render: (text: number) => <span>{text === 0 ? '否' : '是'}</span>
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
                render: (text:string) => Filter.formatTalkType(text)
            },{
                title: "电话录音",
                dataIndex: 'recordingUrl',
                render: (text:string) => (text && (User.role.includes('CD') || User.role.includes('HGA') || User.role.includes('HGB'))) &&
                    <button className="gym-button-xxs gym-button-white" onClick={() => this.downloadRecords(text)}>下载</button>
            },{
                title: "操作",
                dataIndex: 'action',
                render: (text:string, record:any) => this.isCanCall(record.primaryGbStaffId, record.primaryGaStaffId)
                    ? <button className="gym-button-xxs gym-button-white" onClick={() => this.call(record)}>拨打</button>
                    : null
            },
        ]
    };
    /**
     * 搜索项目
     */
    searchItems = () => {
        const {staffList} = this.props;
        const {beginTime, endTime} = this.state;
        const options:any = [
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder: '请输入',
            }, {
                type: 'select',
                label: '通话类型',
                name: 'talkType',
                placeholder: '请选择',
                options: [{
                    postCode: 94002,
                    postName: '未接通'
                }, {
                    postCode: 94003,
                    postName: '已接通'
                }, {
                    postCode: 94004,
                    postName: '客户挂断'
                },
                ],
            }, {
                type: 'text',
                label: '电话号码',
                name: 'called',
                placeholder: '请输入',
            }, {
                type: 'rangePicker',
                label: '通话日期',
                name: 'date',
                initialValue:[moment(beginTime), moment(endTime)]
            },{
                type: 'number',
                label: '通话时长>=',
                name: 'duration',
                placeholder: '请输入',
            },{
                type: 'select',
                label: '跟进人员',
                name: 'staffId',
                placeholder: '请选择',
                options: staffList.map((item:any) => ({postCode:item.staffId, postName: item.userName}))
            },
        ];
        return options;
    };
    /**
     * 获取统计数据列表
     */
    queryCallRecordsList = () => {
        const {
            pageSize, pageNo, sortName, sortOrder,
            called, distributeStatus, callStatus, staffId, tmkPhase,
            babyName, beginTime, endTime, talkType, duration
        } = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageSize, pageNo,sortName,sortOrder, talkType, duration,
            called, distributeStatus, callStatus, staffId, tmkPhase,
            babyName, beginTime, endTime
        };
        queryCallRecords(param).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
            })
        });
    };
    /**
     * 下载
     * @param {string} fileId
     */
    downloadRecords = (fileId:string) => {
        downloadRecordsFile({
            currentCenterId: User.currentCenterId,
            fileId: fileId,
        })
    };
    /**
     * 条件搜索
     * @param values
     */
    onSearch = (values:any) => {
        // 如果有日期选择
        values.beginTime =  values.date ? moment(values.date[0]).startOf('day').valueOf() : '';
        values.endTime = values.date ? moment(values.date[1]).endOf('day').valueOf(): '';
        delete values.date;
        this.setState({
            pageNo:1,
            ...values,
            selectLeads:[],
        },this.queryCallRecordsList);
    };
    /**
     * 分页搜索
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
            selectLeads: []
        }, this.queryCallRecordsList);
    };
    /**
     * 排序
     * @param pagination
     * @param filters
     * @param sorter
     */
    handleTableSort = (pagination, filters, sorter) => {
        const sortInfo = {
            sortName: sorter.columnKey ?  sorter.columnKey : '',
            sortOrder: sorter.order ? sorter.order.substring(0, sorter.order.length - 3): '',
        };
        this.setState({
            sortName: sortInfo.sortName,
            sortOrder: sortInfo.sortOrder,
            columns: this.setColumnConfig(sortInfo.sortName, sortInfo.sortOrder)
        }, this.queryCallRecordsList);
    };
    /**
     * 拨打
     * @param record
     */
    call = (record:any) => {
        recordTelephoneMembers([record.leadsId]);
        window.open(Routes.语音拨打.path, 'call');
    };
    /**
     * 批量选择
     * @type {{onChange: (selectedRowKeys, selectedRows) => void}}
     */
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                selectLeads: selectedRows
            });
            const leadsIdList = Array.from(new Set(selectedRows.map((item:any) => item.leadsId)));
            recordTelephoneMembers(leadsIdList)
        },
        getCheckboxProps: record => ({
            disabled: !this.isCanCall(record.primaryGbStaffId, record.primaryGaStaffId),
        }),
    };
    /**
     * 显示拨打
     * @returns {boolean}
     */
    isShowCall = ():boolean => {
        const isCD = User.role.includes("CD");
        const isGB = User.role.includes("GB") || User.role.includes("HGB") ;
        const isGA = User.role.includes("GA") || User.role.includes("HGA") ;
        return (isCD || isGB || isGA);
    };
    /**
     * 能否拨打
     * @returns {boolean}
     */
    isCanCall = (gbId:string, gaId:string):boolean => {
        if(User.role.includes("CD") || User.role.includes("HGA") || User.role.includes("HGB")){
            return true;
        }
        if(User.role.includes("GB") || User.role.includes("GA")){
            if(gbId === User.userId || gaId === User.userId){
                return true;
            }
        }
        return false;
    };
    handleLink = () => {
        window.open(Routes.语音拨打.path, 'call');
    }
    render(){
        const {
            columns, dataSource, totalSize, pageNo, pageSize,
            connectSeatNum, freeSeatNum, callCount, callTimeStr,
            groupCallList, callSuccessTimes, selectLeads
        } = this.state;

        const count = selectLeads.length;
        return (
            <div id="gym-telephone-call-record" className="gym-telephone-call-record">
                <BreadCrumb routes={this.routes}/>
                <div className="page-wrap gym-telephone-call-record-statistics" >
                    <Fragment>
                        <div className="gym-telephone-call-record-statistics-target">
                            <div className="gym-telephone-call-record-statistics-target-item">
                                <span className="gym-telephone-call-record-statistics-target-item-label">当前接入坐席数：</span>
                                <span className="gym-telephone-call-record-statistics-target-item-children">{connectSeatNum}</span>
                            </div>
                            <div className="gym-telephone-call-record-statistics-target-item">
                                <span className="gym-telephone-call-record-statistics-target-item-label">当前空闲坐席数：</span>
                                <span className="gym-telephone-call-record-statistics-target-item-children">{freeSeatNum}</span>
                            </div>
                            <div className="gym-telephone-call-record-statistics-target-item">
                                <span className="gym-telephone-call-record-statistics-target-item-label">今日呼出次数：</span>
                                <span className="gym-telephone-call-record-statistics-target-item-children">{callCount}</span>
                            </div>
                            <div className="gym-telephone-call-record-statistics-target-item">
                                <span className="gym-telephone-call-record-statistics-target-item-label">今日接通次数：</span>
                                <span className="gym-telephone-call-record-statistics-target-item-children">{callSuccessTimes}</span>
                            </div>
                            <div className="gym-telephone-call-record-statistics-target-item">
                                <span className="gym-telephone-call-record-statistics-target-item-label">今日通话总时长：</span>
                                <span className="gym-telephone-call-record-statistics-target-item-children">{callTimeStr}</span>
                            </div>
                        </div>
                        <Divider/>

                        <div className="gym-telephone-call-record-statistics-card">
                            <Tabs type="card">
                                <TabPane tab="今日通话时长" key="1" className='gym-telephone-call-record-statistics-card-pane'>
                                    {
                                        (groupCallList || []).map((item: any, index: number) => (
                                            <div className="gym-telephone-call-record-statistics-target-item sm" key={`staff_time_${index}`}>
                                                <span className="gym-telephone-call-record-statistics-target-item-label">{item.staffName}：</span>
                                                <span className="gym-telephone-call-record-statistics-target-item-children">{item.callTimeStr}</span>
                                            </div>
                                        ))
                                    }
                                </TabPane>
                                <TabPane tab="今日呼出次数" key="2" className='gym-telephone-call-record-statistics-card-pane'>
                                    {
                                        (groupCallList || []).map((item: any, index: number) => (
                                            <div className="gym-telephone-call-record-statistics-target-item sm" key={`staff_num_${index}`}>
                                                <span className="gym-telephone-call-record-statistics-target-item-label">{item.staffName}：</span>
                                                <span className="gym-telephone-call-record-statistics-target-item-children">{item.callNum}</span>
                                            </div>
                                        ))
                                    }
                                </TabPane>
                                <TabPane tab="今日接通次数" key="3" className='gym-telephone-call-record-statistics-card-pane'>
                                    {
                                        (groupCallList || []).map((item: any, index: number) => (
                                            <div className="gym-telephone-call-record-statistics-target-item sm" key={`staff_success_${index}`}>
                                                <span className="gym-telephone-call-record-statistics-target-item-label">{item.staffName}：</span>
                                                <span className="gym-telephone-call-record-statistics-target-item-children">{item.callSuccessNum}</span>
                                            </div>
                                        ))
                                    }
                                </TabPane>
                            </Tabs>
                        </div>
                    </Fragment>
                </div>
                <div className='gym-call-page-wrap gym-telephone-call-record-detail'>
                    <SearchForm items={this.searchItems()} onSearch={this.onSearch}/>
                    <Divider/>
                    {
                        this.isShowCall() &&
                        <div className='mb25'>
                            {
                                count > 0
                                    ? <button className='gym-button-lg gym-button-default' onClick={this.handleLink}>批量外呼</button>
                                    : <button className='gym-button-lg gym-button-grey'>批量外呼</button>
                            }

                        </div>
                    }

                    <div>
                        <TablePagination
                            rowSelection={this.rowSelection}
                            columns={columns}
                            dataSource={dataSource}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={item => item.id}
                            handleChangePage={this.handleChangePage}
                            handleFilterTableChange={this.handleTableSort}

                        />
                    </div>
                </div>
            </div>
        )
    }
}

export {CallRecords}
