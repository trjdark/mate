/**
 * desc: 选课列表模式
 * User: Vicky.yu
 * Date: 2021/5
 * Time: 上午10:00
 */
import React, {Component} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {form} from "@/common/decorator/form";
import {Icon} from "@/ui/component/icon";
import moment from 'moment';
import { TeachingRoutes } from "@/router/enum/teachingRoutes";
import {Tabs, Modal, message, Select, Button, Alert} from "antd";
import history from '@/router/history';
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import {getSelectCourseList} from "@redux-actions/teaching/applyManage";
import {
    book_way_format,
    absent_format,
    delete_format,
} from "../applyManage/filter/applyManageFilter";
import {getAttendanceRecordList, deleteUnClass, recordSelectCourseList} from "@redux-actions/teaching/courseSelection";
import {CommonUtils} from "@/common/utils/commonUtils";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {leaveConfirmList, leaveSubmit} from "@redux-actions/teaching/scheduleAction";
import {MultLeaveConfirm} from "../component/multLeaveConfirm";
import '../courseSelection/style/index';
import { FUNC } from "@/ui/pages/setting/enum/functions";
import _ from 'lodash';
import { Popover } from "antd";

const TabPane = Tabs.TabPane;
const {Option} = Select;

/**
 * 权限控制
 * @param func key
 */
function isExist(funcId) {
    const permissionList = User.permissionList;
    return permissionList.includes(funcId)
};

@form()
class CourseSelectionList extends Component<any, any> {
    leadsId: string;
    state: any;
    // 路由代码块
    private routes: Array<any> = [
        {
            name: '客户360',
            path: '',
            link: '#',
            id: 'customer360'
        }, {
            name: '上课情况',
            path: '',
            link: '#',
            id: 'courseSelection'
        }
    ];
    private selectYears = [
        {
            id: 'LAST_YEAR',
            value: '1',
            name: `${parseInt(moment().format('YYYY'), 10)}年课程`
        },{
            id: 'ONE_YEAR',
            value: '2',
            name: `${parseInt(moment().format('YYYY'), 10) - 1}年课程`
        },{
            id: 'TWO_YEAR',
            value: '3',
            name: `${parseInt(moment().format('YYYY'), 10) - 2}年课程`
        }, {
            id: 'THREE_YEAR',
            value: '4',
            name: `${parseInt(moment().format('YYYY'), 10) - 3}年课程`
        },{
            id: 'FOUR_YEAR',
            value: '5',
            name: `${parseInt(moment().format('YYYY'), 10) - 4}年课程`
        },{
            id: 'BEFORE_FIVE_YEAR',
            value: '6',
            name: `${parseInt(moment().format('YYYY'), 10) - 5}年及更早课程`
        }
    ];
    constructor(props: any) {
        super(props);
        if (CommonUtils.hasParams(props)) {
            this.leadsId = CommonUtils.parse(props).leadsId;
        }

        this.state = {
            table: {
                list: [],           // 表格列表数据
                pageNo: 1,          // 当前页码
                pageSize: 10,       // 每页请求条数
                totalSize: 0,       // 总条数
            },
            selectedYears: [],      // 选择的年限
            // tab切换
            tabId: '1',
            timeType: '1',
            defaultActiveKey: '1',
            activeKey: CommonUtils.parse(props).tab || '1',
            tagType: 25001,         // 默认的标签
            tagTypeList: [25001, 25002, 25003, 25004, 25005],   // unClass 25001 hadClass 25002 leave 25003 out 25004 delete 25005
            visible: false,
            leaveList: [],
            deleteList: [],
            lessonList: [],
            weekList: [],
            courseIdList: [],
            sortName: 'lessonDate',
            sortOrder: 'asc',
            sortOrderShow: 'ascend',
            selectedRows: [],
            deleteIds: [],
            selectedRowKeys: [],
            showLeaveModal: false,
            askLeaveDataSource: [],
            currentContractList: [],
            chosenContract: [],
            // 各个页签合同编号
            unClassFilteredInfo: null,
            hadClassFilteredInfo: null,
            leaveClassFilteredInfo: null,
            outClassFilteredInfo: null,
            deleteClassFilteredInfo: null,
            // 上课时间
            unClassFilteredTime: null,
            hadClassFilteredTime: null,
            leaveClassFilteredTime: null,
            outClassFilteredTime: null,
            deleteClassFilteredTime: null,
            // 选中的课
            unClassFilteredLesson: null,
            hadClassFilteredLesson: null,
            attendanceStatuss: CommonUtils.parse(props).tab ? 25003 : 25001,
            exchangeClass: 0, // 可换课课时
            oldCourseInfo: [],
        };
    }

    componentDidMount() {
        const {attendanceStatuss} = this.state
        this.getCenterCourseList();
        this.handleSearch({
            attendanceStatus:attendanceStatuss
        });
        this.setState({tagType:attendanceStatuss})
    }
    /**
     * 改变tab key
     */
    onChangeTab = (activeKey) => {
        const {tagTypeList} = this.state;
        this.setState(
            {
                activeKey,
                tagType: tagTypeList[activeKey - 1],
                pageNo: 1,
                pageSize: 10,
                weekList: [],
                sortOrder: activeKey === "1"? 'asc':'desc',      // 第一项是升序，其他为降序
                sortOrderShow: activeKey === "1"? 'ascend':'descend',      // 第一项是升序，其他为降序
                currentContractList: [],
                chosenContract: [],
                unClassFilteredInfo: null,
                hadClassFilteredInfo: null,
                leaveClassFilteredInfo: null,
                outClassFilteredInfo: null,
                deleteClassFilteredInfo: null,
                unClassFilteredTime: null,
                hadClassFilteredTime: null,
                leaveClassFilteredTime: null,
                outClassFilteredTime: null,
                deleteClassFilteredTime: null,
                unClassFilteredLesson: null,
                hadClassFilteredLesson: null,
                courseIdList:[],
                listInfo: [], // 列表信息
            },
            () => {
                this.handleTabSearch({});
            }
        );
    };

    /**
     *  获取所有中心课程
     */
    getCenterCourseList = () => {
        const postData = {
            currentCenterId: User.currentCenterId,
            leadsId: this.leadsId,
        };

        getSelectCourseList(postData).then(
            (res) => {
                this.setState({
                    lessonList: res
                })
            },
            () => {
                // 返回请求reject
            }
        )
    };

    onCancel = () => {
        this.setState({
            visible: false,
            id: ''
        })
    };

    onOk = () => {
        this.setState({
            visible: false,
        });

    };

    /**
     * 查询列表
     */
    handleSearch = (body: any) => {
        this.setState({
            "attendanceStatus": body.attendanceStatus ? body.attendanceStatus : 25001,
            "courseIdList": body.courseIdList ? body.courseIdList : null,
            "currentCenterId": User.currentCenterId,
            "contractCodeList": [],
            "leadsId": this.leadsId,
            "pageNo": 1,
            "pageSize": 10,
            "sortName": body.sortName ? body.sortName : null,
            "sortOrder": body.sortOrder ? body.sortOrder : null,
            "timeType": body.timeType ? body.timeType : '1',
            "weekList": body.timeType ? body.timeType : null
        });

        const postData = {
            "attendanceStatus": body.attendanceStatus ? body.attendanceStatus : 25001,
            "courseIdList": body.courseIdList ? body.courseIdList : null,
            "currentCenterId": User.currentCenterId,
            "contractCodeList": [],
            "leadsId": this.leadsId,
            "pageNo": 1,
            "pageSize": 10,
            "sortName": body.sortName ? body.sortName : null,
            "sortOrder": body.sortOrder ? body.sortOrder : null,
            "timeType": body.timeType ? body.timeType : '1',
            "weekList": body.timeType ? body.timeType : null
        };

        getAttendanceRecordList(postData).then(
            (res) => {
                let contractList = [];
                for (let i = 0; i < res.list.length; i++) {
                    let pushData = {
                        text: '',
                        value: ''
                    };
                    if(res.list[i].contractCode && res.list[i].contractCode !== ''){
                        pushData.text = res.list[i].contractCode;
                        pushData.value = res.list[i].contractCode;
                        contractList.push(pushData)
                    }
                }
                contractList = _.unionBy(contractList,'value');
                this.setState({
                    table: res,
                    babyInfo: res.list[0],
                    currentContractList: contractList
                })
            },
            (err) => {
                // 返回请求reject
                message.error(err.msg)
            });

    };

    handleTabSearch = (body: any) => {
        const postData = {
            "attendanceStatus": this.state.tagType ? this.state.tagType : 25001,
            "courseIdList": this.state.courseIdList ? this.state.courseIdList : null,
            "currentCenterId": User.currentCenterId,
            "leadsId": this.leadsId,
            "pageNo": 1,
            "pageSize": 10,
            "sortName": this.state.sortName ? this.state.sortName : null,
            "sortOrder": this.state.sortOrder ? this.state.sortOrder : null,
            "timeType": this.state.timeType ? this.state.timeType : '1',
            "weekList": this.state.weekList ? this.state.weekList : null,
            "contractCodeList": this.state.chosenContract ? this.state.chosenContract : [],
        };

        getAttendanceRecordList(postData).then(
            (res) => {
                let contractList = [];
                for (let i = 0; i < res.list.length; i++) {
                    let pushData = {
                        text: '',
                        value: ''
                    };
                    if(res.list[i].contractCode && res.list[i].contractCode !== '') {
                        pushData.text = res.list[i].contractCode;
                        pushData.value = res.list[i].contractCode;
                        contractList.push(pushData)
                    }
                }
                contractList = _.unionBy(contractList,'value');
                this.setState({
                    table: res,
                    babyInfo: res.list[0],
                    currentContractList: contractList
                })
            },
            (err) => {
                // 返回请求reject
                message.error(err.msg)
            });
    };

    handleTableChange = (body: any) => {
        const postData = {
            "attendanceStatus": this.state.tagType ? this.state.tagType : 25001,
            "courseIdList": this.state.courseIdList ? this.state.courseIdList : null,
            "currentCenterId": User.currentCenterId,
            "leadsId": this.leadsId,
            "pageNo": this.state.table.pageNo ? this.state.table.pageNo : 1,
            "pageSize": this.state.table.pageSize ? this.state.table.pageSize : 10,
            "sortName": this.state.sortName ? this.state.sortName : null,
            "sortOrder": this.state.sortOrder ? this.state.sortOrder : null,
            "timeType": this.state.timeType ? this.state.timeType : '1',
            "weekList": this.state.weekList ? this.state.weekList : null,
            "contractCodeList": this.state.chosenContract ? this.state.chosenContract : [],
        };

        getAttendanceRecordList(postData).then(
            (res) => {
                let contractList = [];
                for (let i = 0; i < res.list.length; i++) {
                    let pushData = {
                        text: '',
                        value: ''
                    };
                    if(res.list[i].contractCode && res.list[i].contractCode !== '') {
                        pushData.text = res.list[i].contractCode;
                        pushData.value = res.list[i].contractCode;
                        contractList.push(pushData)
                    }
                }
                contractList = _.unionBy(contractList,'value');
                this.setState({
                    table: res,
                    babyInfo: res.list[0],
                    currentContractList: contractList
                })
            },
            (err) => {
                // 返回请求reject
                message.error(err.msg)
            });
    };

    /**
     * filter变化
     */
    handleFilterChange = (body: any) => {
        const postData = {
            "attendanceStatus": this.state.tagType ? this.state.tagType : 25001,
            "courseIdList": this.state.courseIdList ? this.state.courseIdList : null,
            "currentCenterId": User.currentCenterId,
            "leadsId": this.leadsId,
            "pageNo": 1,
            "pageSize": this.state.table.pageSize ? this.state.table.pageSize : 10,
            "sortName": this.state.sortName ? this.state.sortName : null,
            "sortOrder": this.state.sortOrder ? this.state.sortOrder : null,
            "timeType": this.state.timeType ? this.state.timeType : '1',
            "weekList": this.state.weekList ? this.state.weekList : null,
            "contractCodeList": this.state.chosenContract ? this.state.chosenContract : [],
        };

        getAttendanceRecordList(postData).then(
            (res) => {
                let contractList = [];
                for (let i = 0; i < res.list.length; i++) {
                    let pushData = {
                        text: '',
                        value: ''
                    };
                    if(res.list[i].contractCode && res.list[i].contractCode !== '') {
                        pushData.text = res.list[i].contractCode;
                        pushData.value = res.list[i].contractCode;
                        contractList.push(pushData)
                    }
                }
                contractList = _.unionBy(contractList,'value');
                this.setState({
                    table: res,
                    babyInfo:res.list[0],
                    currentContractList: contractList
                })
            },
            (err) => {
                // 返回请求reject
                message.error(err.msg)
            });
    };

    /**
     * 查询
     */
    handleChangeUnClassFilter = (values: any, filter: any, sort: any) => {
        let courseIdListObj = filter.courseCode ? filter.courseCode : null;
        let weekListObj = filter.lessonDate ? filter.lessonDate.map(Number) : null;
        let sortNameObj = sort.columnKey ? sort.columnKey : null;
        let sortOrderObj = sort.order === 'descend' ? 'desc' : sort.order === 'ascend' ? 'asc' : null;
        let sortOrderShowObj = sort.order;
        let chosenContractObj = filter.contractCode ? filter.contractCode : null;

        if(filter.contractCode){
            this.setState({
                unClassFilteredInfo:chosenContractObj
            })
        }else{
            this.setState({
                unClassFilteredInfo:null
            })
        }

        if(filter.lessonDate){
            this.setState({
                unClassFilteredTime:weekListObj
            })
        }else{
            this.setState({
                unClassFilteredTime:null
            })
        }

        if(filter.courseCode){
            this.setState({
                unClassFilteredLesson:weekListObj
            })
        }else{
            this.setState({
                unClassFilteredLesson:null
            })
        }

        this.setState({
            courseIdList: courseIdListObj,
            weekList: weekListObj,
            sortName: sortNameObj,
            sortOrder: sortOrderObj,
            sortOrderShow: sortOrderShowObj,
            chosenContract: chosenContractObj,
        },            () => {
            this.handleFilterChange({});
        });
    };

    handleChangeHadClassFilter = (values: any, filter: any, sort: any) => {
        let courseIdListObj = filter.courseCode ? filter.courseCode : null;
        let weekListObj = filter.lessonDate ? filter.lessonDate.map(Number) : null;
        let sortNameObj = sort.columnKey ? sort.columnKey : null;
        let sortOrderObj = sort.order === 'descend' ? 'desc' : sort.order === 'ascend' ? 'asc' : null;
        let sortOrderShowObj = sort.order;
        let chosenContractObj = filter.contractCode ? filter.contractCode : null;

        if(filter.contractCode){
            this.setState({
                hadClassFilteredInfo:chosenContractObj
            })
        }else{
            this.setState({
                hadClassFilteredInfo:null
            })
        }

        if(filter.lessonDate){
            this.setState({
                hadClassFilteredTime:weekListObj
            })
        }else{
            this.setState({
                hadClassFilteredTime:null
            })
        }

        if(filter.courseCode){
            this.setState({
                hadClassFilteredLesson:weekListObj
            })
        }else{
            this.setState({
                hadClassFilteredLesson:null
            })
        }

        this.setState({
            courseIdList: courseIdListObj,
            weekList: weekListObj,
            sortName: sortNameObj,
            sortOrder: sortOrderObj,
            sortOrderShow: sortOrderShowObj,
            chosenContract: chosenContractObj,
        },            () => {
            this.handleFilterChange({});
        });
    };
    handleChangeleaveFilter = (values: any, filter: any, sort: any) => {
        let courseIdListObj = filter.courseCode ? filter.courseCode : null;
        let weekListObj = filter.lessonDate ? filter.lessonDate.map(Number) : null;
        let sortNameObj = sort.columnKey ? sort.columnKey : null;
        let sortOrderObj = sort.order === 'descend' ? 'desc' : sort.order === 'ascend' ? 'asc' : null;
        let sortOrderShowObj = sort.order;
        let chosenContractObj = filter.contractCode ? filter.contractCode : null;

        if(filter.contractCode){
            this.setState({
                leaveClassFilteredInfo:chosenContractObj
            })
        }else{
            this.setState({
                leaveClassFilteredInfo:null
            })
        }

        if(filter.lessonDate){
            this.setState({
                leaveClassFilteredTime:weekListObj
            })
        }else{
            this.setState({
                leaveClassFilteredTime:null
            })
        }

        this.setState({
            courseIdList: courseIdListObj,
            weekList: weekListObj,
            sortName: sortNameObj,
            sortOrder: sortOrderObj,
            sortOrderShow: sortOrderShowObj,
            chosenContract: chosenContractObj,
        },            () => {
            this.handleFilterChange({});
        });
    };
    handleChangeOutFilter = (values: any, filter: any, sort: any) => {
        let courseIdListObj = filter.courseCode ? filter.courseCode : null;
        let weekListObj = filter.lessonDate ? filter.lessonDate.map(Number) : null;
        let sortNameObj = sort.columnKey ? sort.columnKey : null;
        let sortOrderObj = sort.order === 'descend' ? 'desc' : sort.order === 'ascend' ? 'asc' : null;
        let sortOrderShowObj = sort.order;
        let chosenContractObj = filter.contractCode ? filter.contractCode : null;

        if(filter.contractCode){
            this.setState({
                outClassFilteredInfo:chosenContractObj
            })
        }else{
            this.setState({
                outClassFilteredInfo:null
            })
        }

        if(filter.lessonDate){
            this.setState({
                outClassFilteredTime:weekListObj
            })
        }else{
            this.setState({
                outClassFilteredTime:null
            })
        }

        this.setState({
            courseIdList: courseIdListObj,
            weekList: weekListObj,
            sortName: sortNameObj,
            sortOrder: sortOrderObj,
            sortOrderShow: sortOrderShowObj,
            chosenContract: chosenContractObj,
        },            () => {
            this.handleFilterChange({});
        });
    };
    handleChangeDeleteFilter = (values: any, filter: any, sort: any) => {
        let courseIdListObj = filter.courseCode ? filter.courseCode : null;
        let weekListObj = filter.lessonDate ? filter.lessonDate.map(Number) : null;
        let sortNameObj = sort.columnKey ? sort.columnKey : null;
        let sortOrderObj = sort.order === 'descend' ? 'desc' : sort.order === 'ascend' ? 'asc' : null;
        let sortOrderShowObj = sort.order;
        let chosenContractObj = filter.contractCode ? filter.contractCode : null;

        if(filter.contractCode){
            this.setState({
                deleteClassFilteredInfo:chosenContractObj
            })
        }else{
            this.setState({
                deleteClassFilteredInfo:null
            })
        }

        if(filter.lessonDate){
            this.setState({
                deleteClassFilteredTime:weekListObj
            })
        }else{
            this.setState({
                deleteClassFilteredTime:null
            })
        }

        this.setState({
            courseIdList: courseIdListObj,
            weekList: weekListObj,
            sortName: sortNameObj,
            sortOrder: sortOrderObj,
            sortOrderShow: sortOrderShowObj,
            chosenContract: chosenContractObj,
        }, () => {
            this.handleFilterChange({});
        });
    };

    /**
     * 分页变化
     * @param pageInfo
     */
        // 未上课
    handleChangePageUnClass = (pageInfo: any) => {
        this.state.table.pageNo = pageInfo.pageNo;
        this.state.table.pageSize = pageInfo.pageSize;
        this.setState({
            table: {
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
            }
        });
        this.handleTableChange({});
    };
    // 已上课
    handleChangePageLeave = (pageInfo: any) => {
        this.state.table.pageNo = pageInfo.pageNo;
        this.state.table.pageSize = pageInfo.pageSize;
        this.setState({
            table: {
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
            }
        });
        this.handleTableChange({});
    };
    // 请假
    handleChangePageHad = (pageInfo: any) => {
        this.state.table.pageNo = pageInfo.pageNo;
        this.state.table.pageSize = pageInfo.pageSize;
        this.setState({
            table: {
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
            }
        });
        this.handleTableChange({});
    };
    // 旷课
    handleChangePageOut = (pageInfo: any) => {
        this.state.table.pageNo = pageInfo.pageNo;
        this.state.table.pageSize = pageInfo.pageSize;
        this.setState({
            table: {
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
            }
        });
        this.handleTableChange({});
    };
    // 删课
    handleChangePageDelete = (pageInfo: any) => {
        this.state.table.pageNo = pageInfo.pageNo;
        this.state.table.pageSize = pageInfo.pageSize;
        this.setState({
            table: {
                pageNo: this.state.table.pageNo,
                pageSize: this.state.table.pageSize,
            }
        });
        this.handleTableChange({});
    };

    /**
     * 列表日历模式切换
     */
    goToCalendar = () => {
        history.push(`${Routes.选课情况日历.link}${
            CommonUtils.stringify({
                leadsId: this.leadsId
            })
            }`)
    };

    /**
     * changeSelectYear  改变year
     */
    changeSelectYear = (value: string) => {
        const {tagType, courseIdList, sortName, sortOrder, weekList} = this.state;
        // 设置为当前选中的年份
        this.setState({
            timeType: value
        });

        const postData = {
            "attendanceStatus": tagType ? tagType : 25001,
            "courseIdList": courseIdList ? courseIdList : null,
            "currentCenterId": User.currentCenterId,
            "leadsId": this.leadsId,
            "pageNo": 1,
            "pageSize": 10,
            "sortName": sortName ? sortName : null,
            "sortOrder": sortOrder ? sortOrder : null,
            "timeType": value,
            "weekList": weekList ? weekList : null
        };

        getAttendanceRecordList(postData).then(
            (res) => {
                this.setState({
                    table: res,
                    babyInfo: res.list[0],
                })
            },
            (err) => {
                // 返回请求reject
                message.error(err.msg)
            }
        );
    };

    /**
     * changeSelectYear  改变yaer
     */
    deleteUnClassBtn = () => {
        if (this.state.deleteIds.length === 0) {
            message.error('请勾选至少一个未上课程！');
            return false
        } else {
            const postData = {
                "currentCenterId": User.currentCenterId,
                "id": this.state.deleteIds
            };

            deleteUnClass(postData).then(
                () => {
                    message.success('删除成功!');
                    this.state.deleteIds = [];
                    this.state.selectedRowKeys = [];
                    this.setState({
                        deleteIds: this.state.deleteIds,
                        selectedRowKeys: this.state.selectedRowKeys,
                    });
                    this.handleSearch({});
                },
                () => {});
        }
    };

    /**
     * 点击请假按钮
     * @returns {any}
     */
    askLeave = () => {
        const {selectedRowKeys, deleteIds} = this.state;
        const postParams = {
            currentCenterId: User.currentCenterId,
            attendanceIdList: deleteIds
        };
        if (selectedRowKeys.length) {
            leaveConfirmList(postParams).then(
                (res) => {
                    this.setState({
                        askLeaveDataSource: res,
                        showLeaveModal: true
                    });

                },
                (err) => {
                    this.setState({showLeaveModal: false});
                });
        } else {
            message.error('请选择宝宝');
        }
    };
    /**
     * 请假弹框弹框取消按钮
     * @returns {any}
     */
    handleLeaveCancel = () => {
        this.setState({showLeaveModal: false});
    };
    /**
     * 请假弹框确定按钮
     * @returns {any}
     */
    handleLeaveOk = (value) => {
        let leaveList = [];
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                leaveList.push({
                    attendanceId: key,
                    leaveReason: value[key]
                })
            }
        }
        const params = {
            currentCenterId: User.currentCenterId,
            leaveList
        };
        leaveSubmit(params).then(
            () => {
                message.success('请假操作成功！');
                this.state.deleteIds = [];
                this.state.selectedRowKeys = [];
                this.setState({
                    showLeaveModal: false,
                    deleteIds: this.state.deleteIds,
                    selectedRowKeys: this.state.selectedRowKeys,
                });
                // 重新获取页面数据
                this.handleSearch({});
            },
            (err) => {
                message.error(err.msg)
            }
        )
    };
    toSelect = () => {
        const { exchangeClass, selectedRows } = this.state;
        const { selectedRowKeys} = this.state;
        for (let i in selectedRows){
            if ((selectedRows[0].contractId !== selectedRows[i].contractId )|| (selectedRows[0].babyId !== selectedRows[i].babyId)) {
                message.error('请选择同一个宝宝且同一个合同里的课程才能进行批量换课');
                return false;
            } else if (selectedRows[i].bookWay==="26003"){
                message.error('试听课不允许进行换课操作');
                return false;
            }
        }
        const oldCourseInfo = selectedRows.map((item: any) => ({
            lessonDate: item.lessonDate,
            courseCode: item.courseCode,
            attendanceId : item.attendanceId,
            contractId: item.contractId,
            babyName: item.babyName,
            babyId: item.babyId,
            monthValue: item.monthValue
        }));
        const babyInfo = oldCourseInfo[0];
        if (selectedRowKeys.length){
            window.open(`${TeachingRoutes.选择固定课表新.link}${CommonUtils.stringify({
                leadsId: this.leadsId,
                currBabyInfo:babyInfo,
                hasContract:1,
                exchangeClassNum: exchangeClass,
            })
        }`, 'mulitChangeCourse', '', true)
        }else{
            message.error('请选择宝宝');
        }
    }
    render() {
        const {
            table, visible, lessonList, selectedRowKeys, showLeaveModal, askLeaveDataSource,
            defaultActiveKey, activeKey, currentContractList, sortOrderShow,
            unClassFilteredInfo, hadClassFilteredInfo,leaveClassFilteredInfo,outClassFilteredInfo,deleteClassFilteredInfo,
            unClassFilteredTime, hadClassFilteredTime,leaveClassFilteredTime,outClassFilteredTime,deleteClassFilteredTime,
            unClassFilteredLesson,
        } = this.state;

        let filterLessonList = [];

        if (lessonList !== []) {
            for (let i = 0; i < lessonList.length; i++) {
                let pushData = {
                    text: '',
                    value: ''
                };

                pushData.text = lessonList[i].courseCode;
                pushData.value = lessonList[i].courseId;
                filterLessonList.push(pushData)
            }
        }

        const columnsUnClass = [
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            },
            {
                title: '上课时间',
                dataIndex: 'lessonDate',
                key: 'lessonDate',
                className: 'left-trigger',
                sorter: true,
                sortOrder: sortOrderShow,
                filters: [{
                    text: '周一',
                    value: 1,
                }, {
                    text: '周二',
                    value: 2,
                }, {
                    text: '周三',
                    value: 3,
                }, {
                    text: '周四',
                    value: 4,
                }, {
                    text: '周五',
                    value: 5,
                }, {
                    text: '周六',
                    value: 6,
                }, {
                    text: '周日',
                    value: 7,
                }],
                filterMultiple: true,
                filteredValue: unClassFilteredTime
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                className: 'middle-trigger',
                filters: currentContractList,
                filterMultiple: true,
                filteredValue: unClassFilteredInfo
            },
            {
                title: '课程',
                dataIndex: 'courseCode',
                key: 'courseCode',
                className: 'middle-trigger',
                filters: filterLessonList,
                filterMultiple: true,
                filteredValue: unClassFilteredLesson,
                render: (text: string, record: any) => {
                    if (record.exchangeFlag === 1) {
                        return <span>{text + '(App换课)'}</span>
                    } else if (record.exchangeFlag === 2) {
                        return <Popover placement="top" title={'Mate换课'} trigger="hover"><span style={{ color: '#009CBD' }}><Icon type="jiaohuan" /></span>{text}</Popover>
                    } else {
                        return <span>{text}</span>
                    }
                }
            },
            {
                title: '教室',
                dataIndex: 'classroomName',
                key: 'classroomName'
            },
            {
                title: 'INS',
                dataIndex: 'primaryInsStaffName',
                key: 'primaryInsStaffName',
            },
            {
                title: '排课类型',
                dataIndex: 'bookWay',
                key: 'bookWay',
                render(text, record) {
                    if (text) {
                        return book_way_format(text, record.isWaiting)
                    } else {
                        return ''
                    }
                }
            },
            /*{
                title: '排课时间',
                dataIndex: 'bookTime',
                key: 'bookTime',
                render(text){
                    return moment(text).format('YYYY-MM-DD HH:MM:SS')
                }
            }*/
            {
                title:'约课人',
                dataIndex:'bookStaff'
            }
        ];

        const columnsHadClass = [
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            }, {
                title: '上课时间',
                dataIndex: 'lessonDate',
                key: 'lessonDate',
                className: 'left-trigger',
                sorter: true,
                sortOrder: sortOrderShow,
                filters: [{
                    text: '周一',
                    value: 1,
                }, {
                    text: '周二',
                    value: 2,
                }, {
                    text: '周三',
                    value: 3,
                }, {
                    text: '周四',
                    value: 4,
                }, {
                    text: '周五',
                    value: 5,
                }, {
                    text: '周六',
                    value: 6,
                }, {
                    text: '周日',
                    value: 7,
                }],
                filterMultiple: true,
                filteredValue: hadClassFilteredTime
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                className: 'middle-trigger',
                filters: currentContractList,
                filterMultiple: true,
                filteredValue: hadClassFilteredInfo
            }, {
                title: '课程',
                dataIndex: 'courseCode',
                key: 'courseCode',
                className: 'middle-trigger',
                render: (text: string, record: any) => {
                    if (record.exchangeFlag === 1) {
                        return <span>{text + '(App换课)'}</span>
                    } else if (record.exchangeFlag === 2) {
                        return <Popover placement="top" title={'Mate换课'} trigger="hover"><span style={{ color: '#009CBD' }}><Icon type="jiaohuan" /></span>{text}</Popover>
                    } else {
                        return <span>{text}</span>
                    }
                }
            }, {
                title: '教室',
                dataIndex: 'classroomName',
                key: 'classroomName'
            }, {
                title: 'INS',
                dataIndex: 'primaryInsStaffName',
                key: 'primaryInsStaffName',
            }, {
                title: '排课类型',
                dataIndex: 'bookWay',
                key: 'bookWay',
                render(text, record) {
                    if (text) {
                        return book_way_format(text, record.isWaiting)
                    } else {
                        return ''
                    }
                }
            },{
                title:'约课人',
                dataIndex:'bookStaff'
            }];

        const columnsLeave = [
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            }, {
                title: '上课时间',
                dataIndex: 'lessonDate',
                key: 'lessonDate',
                className: 'left-trigger',
                sorter: true,
                sortOrder: sortOrderShow,
                filters: [{
                    text: '周一',
                    value: 1,
                }, {
                    text: '周二',
                    value: 2,
                }, {
                    text: '周三',
                    value: 3,
                }, {
                    text: '周四',
                    value: 4,
                }, {
                    text: '周五',
                    value: 5,
                }, {
                    text: '周六',
                    value: 6,
                }, {
                    text: '周日',
                    value: 7,
                }],
                filterMultiple: true,
                filteredValue: leaveClassFilteredTime
            }, {
                title: '操作来源',
                dataIndex: 'operateSource',
                render: (text) => {
                    const config = {
                        "1501001": "Mate",
                        "1501002": "启蒙APP"
                    }
                    return config[text]
                }
            },{
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                className: 'middle-trigger',
                filters: currentContractList,
                filterMultiple: true,
                filteredValue: leaveClassFilteredInfo
            }, {
                title: '课程',
                dataIndex: 'courseCode',
                className: 'middle-trigger',
                key: 'courseCode',
                render:(text:string,record:any)=>{
                    if (record.exchangeFlag === 1) {
                        return <span>{text + '(App换课)'}</span>
                    } else if (record.exchangeFlag === 2) {
                        return <Popover placement="top" title={'Mate换课'} trigger="hover"><span style={{ color: '#009CBD' }}><Icon type="jiaohuan" /></span>{text}</Popover>
                    } else {
                        return <span>{text}</span>
                    }
                }
            }, {
                title: '教室',
                dataIndex: 'classroomName',
                key: 'classroomName',
            }, {
                title: 'INS',
                dataIndex: 'primaryInsStaffName',
                key: 'primaryInsStaffName',
            }, {
                title: '排课类型',
                dataIndex: 'bookWay',
                key: 'bookWay',
                render(text, record) {
                    if (text) {
                        return book_way_format(text, record.isWaiting);
                    } else {
                        return ''
                    }
                }
            }, {
                title: '请假时间',
                dataIndex: 'leaveTime',
                key: 'leaveTime',
                render(text) {
                    if (text) {
                        return moment(text).format('YYYY-MM-DD');
                    } else {
                        return '';
                    }

                }
            },{
                title:'约课人',
                dataIndex:'bookStaff'
            }];

        const columnsOut = [
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            }, {
                title: '上课时间',
                dataIndex: 'lessonDate',
                key: 'lessonDate',
                className: 'left-trigger',
                sorter: true,
                sortOrder: sortOrderShow,
                filters: [{
                    text: '周一',
                    value: 1,
                }, {
                    text: '周二',
                    value: 2,
                }, {
                    text: '周三',
                    value: 3,
                }, {
                    text: '周四',
                    value: 4,
                }, {
                    text: '周五',
                    value: 5,
                }, {
                    text: '周六',
                    value: 6,
                }, {
                    text: '周日',
                    value: 7,
                }],
                filterMultiple: true,
                filteredValue: outClassFilteredTime
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                className: 'middle-trigger',
                filters: currentContractList,
                filterMultiple: true,
                filteredValue: outClassFilteredInfo
            }, {
                title: '课程',
                dataIndex: 'courseCode',
                key: 'courseCode',
                className: 'middle-trigger',
                render:(text:string,record:any)=>{
                    if (record.exchangeFlag === 1) {
                        return <span>{text + '(App换课)'}</span>
                    } else if (record.exchangeFlag === 2) {
                        return <Popover placement="top" title={'Mate换课'} trigger="hover"><span style={{ color: '#009CBD' }}><Icon type="jiaohuan" /></span>{text}</Popover>
                    } else {
                        return <span>{text}</span>
                    }
                }
            }, {
                title: '教室',
                dataIndex: 'classroomName',
                key: 'classroomName',
            }, {
                title: 'INS',
                dataIndex: 'primaryInsStaffName',
                key: 'primaryInsStaffName',
            }, {
                title: '排课类型',
                dataIndex: 'bookWay',
                key: 'bookWay',
                render(text, record) {
                    if (text) {
                        return book_way_format(text, record.isWaiting);
                    } else {
                        return ''
                    }
                }
            }, {
                title: '旷课方式',
                dataIndex: 'absentType',
                key: 'absentType',
                render(text) {
                    if (text) {
                        return absent_format(text)
                    } else {
                        return ''
                    }
                }
            },{
                title:'约课人',
                dataIndex:'bookStaff'
            }];

        const columnsDelete = [
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            }, {
                title: '上课时间',
                dataIndex: 'lessonDate',
                key: 'lessonDate',
                className: 'left-trigger',
                sorter: true,
                sortOrder: sortOrderShow,
                filters: [{
                    text: '周一',
                    value: 1,
                }, {
                    text: '周二',
                    value: 2,
                }, {
                    text: '周三',
                    value: 3,
                }, {
                    text: '周四',
                    value: 4,
                }, {
                    text: '周五',
                    value: 5,
                }, {
                    text: '周六',
                    value: 6,
                }, {
                    text: '周日',
                    value: 7,
                }],
                filterMultiple: true,
                filteredValue: deleteClassFilteredTime
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                className: 'middle-trigger',
                filters: currentContractList,
                filterMultiple: true,
                filteredValue: deleteClassFilteredInfo
            }, {
                title: '课程',
                dataIndex: 'courseCode',
                key: 'courseCode',
                className: 'middle-trigger',
                render:(text:string,record:any)=>{
                    if (record.exchangeFlag === 1) {
                        return <span>{text + '(App换课)'}</span>
                    } else if (record.exchangeFlag === 2) {
                        return <Popover placement="top" title={'Mate换课'} trigger="hover"><span style={{ color: '#009CBD' }}><Icon type="jiaohuan" /></span>{text}</Popover>
                    } else {
                        return <span>{text}</span>
                    }
                }
            }, {
                title: '教室',
                dataIndex: 'classroomName',
                key: 'classroomName',
            }, {
                title: 'INS',
                dataIndex: 'primaryInsStaffName',
                key: 'primaryInsStaffName',
            }, {
                title: '操作人',
                dataIndex: 'deleteStaff',
                key: 'deleteStaff',
                render(text) {
                    if (text !== null && text !== undefined) {
                        return text
                    } else {
                        return 'system'
                    }
                }
            }, {
                title: '删课时间',
                dataIndex: 'deletedDate',
                key: 'deletedDate',
                render(text) {
                    if (text) {
                        return moment(text).format('YYYY-MM-DD');
                    } else {
                        return '';
                    }
                }
            }, {
                title: '删课方式',
                dataIndex: 'deletedType',
                key: 'deletedType',
                render(text) {
                    if (text !== null && text !== undefined) {
                        return delete_format(text)
                    } else {
                        return ''
                    }
                }
            },{
                title:'约课人',
                dataIndex:'bookStaff'
            }];

        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                let postArr = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    postArr.push(selectedRows[i].attendanceId);
                }
                let totalExchangeClass = 0; // 选定宝宝的可换课时
                // 把可换课时累加
                selectedRows.forEach(item=> {
                    totalExchangeClass += item.classHourNum
                });
                this.setState({
                    deleteIds: postArr,
                    selectedRows: selectedRows,
                    selectedRowKeys: selectedRowKeys,
                    exchangeClass: totalExchangeClass
                });
                // 存在localStorage
                const oldCourseInfo = selectedRows.map((item: any) => ({
                    lessonDate: item.lessonDate,
                    courseCode: item.courseCode,
                    attendanceId : item.attendanceId,
                    contractId: item.contractId,
                    babyName: item.babyName,
                    babyId: item.babyId,
                    monthValue: item.monthValue,
                    lessonId: item.lessonId,
                    businessSource: item.lessonBusinessSource
                }));
                recordSelectCourseList(oldCourseInfo)
            }
        };
        return (
            <div id='gym-course' className='gym-course-selection'>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-contract'>
                    <div className='gym-course-selection-btn-group'>
                        <div className='gym-course-selection-year-select'>
                            <Select
                                defaultValue="1"
                                placeholder={'请选择'}
                                style={{width: '200px'}}
                                onChange={this.changeSelectYear}
                            >
                                {
                                    this.selectYears.map((item) => {
                                        return (
                                            <Option value={item.value} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div className='gym-course-selection-calendar-select'>
                            <span className='gym-course-selection-calendar-select-icon-selected'>
                                <Icon
                                    className='gym-course-selection-calendar-select-icon'
                                    type={"liebiaomoshi"}
                                />
                                <span className='gym-course-selection-calendar-select-text'>列表模式</span>
                            </span>
                            <span
                                className='gym-course-selection-calendar-select-icon-unSelected ml15'
                                onClick={this.goToCalendar}
                            >
                                <Icon className='gym-course-selection-calendar-select-icon' type={"rili"}/>
                                <span className='gym-course-selection-calendar-select-text'>日历模式</span>
                            </span>
                        </div>
                    </div>
                    <div>
                        <Tabs
                            defaultActiveKey={defaultActiveKey}
                            onChange={this.onChangeTab}
                            activeKey={activeKey}
                            type="card"
                            tabBarGutter={10}
                        >
                            <TabPane tab="未上课程" key="1" forceRender={true}>
                                <div className='page-wrap gym-course-selection-tab-content'>
                                    <span>
                                        <button
                                            onClick={() => this.askLeave()}
                                            className='gym-button-xs gym-button-default mb30 ml30'
                                        >
                                            请假
                                        </button>
                                    </span>
                                    {
                                        (isExist(`${FUNC[`试听课删课`]}`) || isExist(`${FUNC[`删课`]}`) ) &&
                                        <span className='ml15'>
                                            <ConfirmCheck
                                                contentText={"是否确认删除课程？"}
                                                item={{}}
                                                ensure={() => this.deleteUnClassBtn()}
                                                button={
                                                    <button className='gym-button-xs gym-button-white mb30'>删课</button>
                                                }
                                            />
                                        </span>
                                    }

                                    <span>
                                        <Button
                                            className='gym-button-xs gym-button-default mb30 ml30'
                                            onClick={()=> this.toSelect()}
                                        >
                                            批量换课
                                        </Button>
                                    </span>
                                    <br/>
                                    <Alert showIcon message="每次换课最多不超过100节。" type="warning" className='mb15'/>
                                    <div>
                                        <TablePagination
                                            rowSelection={rowSelection}
                                            columns={columnsUnClass}
                                            dataSource={table.list || []}
                                            rowKey={'attendanceId'}
                                            totalSize={table.totalSize}
                                            pageSize={table.pageSize}
                                            handleChangePage={this.handleChangePageUnClass}
                                            pageNo={table.pageNo}
                                            handleFilterTableChange={this.handleChangeUnClassFilter}
                                        />
                                    </div>
                                </div>
                                <MultLeaveConfirm
                                    dataSource={askLeaveDataSource}
                                    onCancel={this.handleLeaveCancel}
                                    onOk={this.handleLeaveOk}
                                    showModal={showLeaveModal}
                                />
                            </TabPane>
                            <TabPane tab="已上课程" key="2" forceRender={true}>
                                <div
                                    className='page-wrap gym-course-selection-tab-content'
                                    style={{marginTop: '0', paddingTop: '15px'}}
                                >
                                    <div>
                                        <TablePagination
                                            columns={columnsHadClass}
                                            dataSource={table.list || []}
                                            rowKey={'attendanceId'}
                                            totalSize={table.totalSize}
                                            pageSize={table.pageSize}
                                            handleChangePage={this.handleChangePageHad}
                                            pageNo={table.pageNo}
                                            handleFilterTableChange={this.handleChangeHadClassFilter}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="请假课程" key="3" forceRender={true}>
                                <div
                                    className='page-wrap gym-course-selection-tab-content'
                                    style={{marginTop: '0', paddingTop: '15px'}}
                                >
                                    <div>
                                        <TablePagination
                                            columns={columnsLeave}
                                            dataSource={table.list || []}
                                            rowKey={'attendanceId'}
                                            totalSize={table.totalSize}
                                            pageSize={table.pageSize}
                                            handleChangePage={this.handleChangePageLeave}
                                            pageNo={table.pageNo}
                                            handleFilterTableChange={this.handleChangeleaveFilter}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="旷课课程" key="4" forceRender={true}>
                                <div
                                    className='page-wrap gym-course-selection-tab-content'
                                    style={{marginTop: '0', paddingTop: '15px'}}
                                >
                                    <div>

                                        <TablePagination
                                            columns={columnsOut}
                                            dataSource={table.list || []}
                                            rowKey={'attendanceId'}
                                            totalSize={table.totalSize}
                                            pageSize={table.pageSize}
                                            handleChangePage={this.handleChangePageOut}
                                            pageNo={table.pageNo}
                                            handleFilterTableChange={this.handleChangeOutFilter}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="删除课程" key="5" forceRender={true}>
                                <div
                                    className='page-wrap gym-course-selection-tab-content'
                                    style={{marginTop: '0', paddingTop: '15px'}}
                                >
                                    <Alert showIcon message="删课记录仅支持查询近两年的数据。" type="info" className='mb15'/>

                                    <div>
                                        <TablePagination
                                            columns={columnsDelete}
                                            dataSource={table.list || []}
                                            rowKey={'attendanceId'}
                                            totalSize={table.totalSize}
                                            pageSize={table.pageSize}
                                            handleChangePage={this.handleChangePageDelete}
                                            pageNo={table.pageNo}
                                            handleFilterTableChange={this.handleChangeDeleteFilter}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
                <Modal title="删除" visible={visible} onOk={this.onOk} onCancel={this.onCancel}>
                    <div>
                        确定是否删除这些未上课记录?
                    </div>
                </Modal>
            </div>
        )
    }
}

export {CourseSelectionList}
