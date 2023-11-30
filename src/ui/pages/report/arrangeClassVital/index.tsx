/**
 * desc: 排课耗课统计
 * User: Vicky.Yu
 * Date: 2020/9/14
 * Time: 下午2:12
 */
import React, { Component } from 'react';
import { User } from "@/common/beans/user";
import moment from 'moment';
import { SearchForm } from "@/ui/component/searchForm";
import { TablePagination } from "@/ui/component/tablePagination";
import { BreadCrumb } from "@/ui/component/breadcrumb";
import FullScreen from '../components/fullScreen';
import { getArrangeClassVitalList, exportClassVital, getWaitFollowlist, exportsWaitFollowlist } from "@redux-actions/report/messageReport";
import { message } from 'antd';

class ArrangeClassVital extends Component<any, any>{
    private routes: Array<any> = [
        {
            name: '报表',
            path: '',
            link: '#',
            id: 'telephone'
        }, {
            name: '大服务类报表',
            path: '',
            link: '#',
            id: 'account'
        }, {
            name: '排课耗课统计',
            path: '',
            link: '#',
            id: 'account'
        }
    ];
    private tabsConfig = [
        {
            id: '1',
            name: "排课耗课",
            value: "1"
        },
    ];
    constructor(props: any) {
        super(props)
        this.state = {
            infoType: "1",
            columns: [],
            beginDate: moment().startOf('month'),
            endDate: moment().endOf('day'),
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo: 1,
            canDownload: false,
            memberLatitude:null
        }
    }

    /**
     * 搜索框
     * @returns {Array<any>}
     */
    searchConfig = () => {
        const { infoType } = this.state;
        let searchConfig: Array<any> = [];
        searchConfig = [infoType === "1" &&{
            type: 'rangePicker',
            label: '选择日期',
            name: 'date',
            initialValue: [moment().startOf('month'), moment()]
        },
            infoType === "2"&&{
            label: '会员维度',
            type: 'select',
            name: 'memberLatitude',
            placeholder: '未开课会员/连续未约课会员/连续未出席会员',
            options:[
                {postCode:"noattend",postName:"未开课会员"},
                {postCode:"nobook",postName:"连续未约课会员"},
                {postCode:"connoattend",postName:"连续未出席会员"},
            ]
        }];
        return searchConfig;
    }
    componentDidMount() {
        this.setState({
            columns: this.setColumnsConfig(this.state.infoType),
        })
    }

    /**
     * 表格头设置
     * @param {string} key
     * @returns {any}
     */
    setColumnsConfig = (key: string, ) => {
        const columnsConfigs: any = new Map<string, any>([
            ['1', [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                }, {
                    title: '月龄',
                    dataIndex: 'monthValue',
                }, {
                    title: '合同编号',
                    dataIndex: 'contractCode',
                },  {
                    title: '合同状态',
                    dataIndex: 'contractStatus',
                }, {
                    title: '签约日期',
                    dataIndex: 'signTime',
                }, {
                    title: '合同有效期',
                    dataIndex: 'contractPeriodDate',
                },{
                    title: '剩余课时',
                    dataIndex: 'remainingCourseNum',
                }, {
                    title: '已上课时',
                    dataIndex: 'alreadyNum',
                }, {
                    title: '旷课课时',
                    dataIndex: 'truancyNum'
                },{
                    title: '选课课时',
                    dataIndex: 'selectNum',
                }, {
                    title: 'GB',
                    dataIndex: 'gb',
                }, {
                    title: 'GA',
                    dataIndex: 'ga',
                }],],
            ['2', [
                {
                    title: '宝宝姓名',
                    dataIndex: 'babyName',
                }, {
                    title: '月龄',
                    dataIndex: 'monthValue',
                }, {
                    title: '合同编号',
                    dataIndex: 'contractCode',
                }, {
                    title: '合同状态',
                    dataIndex: 'contractStatus'
                }, {
                    title: '签约日期',
                    dataIndex: 'signTime',
                }, {
                    title: '剩余课时',
                    dataIndex: 'remainCourse',
                }, {
                    title: '已上课时',
                    dataIndex: 'attendCourse',
                }, {
                    title: '选课课时',
                    dataIndex: 'bookCourse'
                }, {
                    title: 'GB',
                    dataIndex: 'gbStaffName'
                }, {
                    title: 'GA',
                    dataIndex: 'gaStaffName'
                }, {
                    title: '最后一次课程时间',
                    dataIndex: 'lastCourse',
                    render:(text) => (
                        text && moment(text).format('YYYY-MM-DD')
                    )
                }],],
        ]);
        return columnsConfigs.get(key);
    };
    /**
     * 切换标签
     * @param {string} value
     */
    handleChangeTab = (type: string) => {
        if(type === "1"){
            this.setState({ infoType: type, columns: this.setColumnsConfig(type),dataSource:[],totalSize:'',canDownload:false, pageNo:1, pageSize:10, },this.queryClassVitalList)

        }else if(type === "2"){
            this.setState({ infoType: type, columns: this.setColumnsConfig(type),dataSource:[],totalSize:'',canDownload:false, pageNo:1, pageSize:10, })
        }
    };
    /**
     * 搜索
     * @param {string} value
     */
    onSearch = (value: any) => {
        const infoType = this.state
        if(infoType.infoType === '2' && !value.memberLatitude){
            return message.error('请输入查询内容')
        }
        value.beginDate = value.date ? moment(value.date[0]).valueOf() : '';
        value.endDate = value.date ? moment(value.date[1]).valueOf() : '';
        this.setState({
            pageNo: 1,
            ...value,
        }, this.queryClassVitalList);

    }
    /**
     * 获取数据
     */
    queryClassVitalList = () => {
        const { infoType, pageSize, pageNo, beginDate, endDate, memberLatitude } = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            pageSize,
            pageNo,
            beginDate,
            endDate
        };
        const param2 = {
            currentCenterId: User.currentCenterId,
            pageSize,
            pageNo,
            memberLatitude
        }
        if (infoType === '1') {
            getArrangeClassVitalList(param).then((res: any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize,
                    columns: this.setColumnsConfig(infoType),
                    canDownload: res.list.length >0 ? true : false
                })
            })
        }
        else if (infoType === '2') {
            getWaitFollowlist(param2).then((res: any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize,
                    columns: this.setColumnsConfig(infoType),
                    canDownload: res.list.length >0 ? true : false
                })
            })
        }
    };
    /**
     * 导出
     */
    export = (canDownload:boolean) => {
        const { infoType,beginDate, endDate, memberLatitude } = this.state;
        if(infoType === "1" && canDownload){
            const param = {
                currentCenterId: User.currentCenterId,
                beginDate, endDate,
            }
            exportClassVital(param)

        }else if(infoType === "2" && canDownload){
            const param = {
                currentCenterId: User.currentCenterId,
                memberLatitude
            }
            exportsWaitFollowlist(param)

        }else if(canDownload === false){
            message.error('暂无数据')
        }
    }
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,

        }, this.queryClassVitalList);
    };
    render() {
        const { infoType, columns, dataSource, totalSize, pageNo, pageSize, canDownload } = this.state;
        return (
            <div id="gym-telephone-account" className="gym-telephone-account">
                <BreadCrumb routes={this.routes} />

                <div className="gym-telephone-account-tabs">
                    {
                        this.tabsConfig.map((item: any, index: number) => (
                            <div
                                key={index}
                                className={`gym-telephone-account-tab ${item.value === infoType ? 'active' : ''}`}
                                onClick={() => this.handleChangeTab(item.value)}
                            >
                                <span>{item.name}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="page-wrap">
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />
                    <FullScreen
                        handleDownLoadExcel={() => this.export(canDownload)}
                        canDownload={dataSource.length > 0}
                    >
                        <TablePagination
                            scroll={{x: 1800}}
                            dataSource={dataSource}
                            columns={columns}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={(item: any, index: number) => index}
                            handleChangePage={this.handleChangePage}
                        />
                    </FullScreen>
                </div>
            </div>
        )
    }
}

export { ArrangeClassVital }
