/**
 * desc: 换课删课明细记录
 * User: katarina.yuan
 * Date: 2021/5/10
 * Time: 14:50
 */
import React, {Component} from 'react';
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import moment from 'moment';
import { message, Alert } from 'antd';
import FullScreen from '../components/fullScreen';
import { changeDeleteClassList, exportchangeDeleteClassList, getAllCourse } from "@redux-actions/report/messageReport";
import { typeOptions } from "./enum/index"
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const selectAllOption = {
    leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
}

@connect((state) => ({
    allList: selectTotalEmployeeList(state, selectAllOption),
}), {})
class ExchangeAndDeletedRecord extends Component<any, any>{
    private routes:Array<any> = [
        {
            name: '报表',
            path: '',
            link: '#',
            id: 'report'
        },{
            name: '大服务类报表',
            path: '',
            link: '#',
            id: 'message'
        },{
            name: '换/删课明细',
            path: '',
            link: '#',
            id: 'course-vital'
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
            canDownload: false,
            courseCode: null,
            classOptions: [],                                          // 课程代码
            typeOptions: [],                                           // 操作类型
            babyName: null,                                              // 宝宝名称
            contractCode: null,        　　　　　　　　　　　　              // 合同编号
            lessonCourse: null,        　　　　　　　　　　　　              // 课程代码
            operateType: null,         　　　　　　　　　　　　              // 操作类型
            operateStartTime: moment().startOf('month').valueOf(),     // 操作时间（开始）
            operateEndTime: moment().endOf('day').valueOf(),           // 操作时间（结束）
            lessonStartTime: null,                                     // 课程开始时间（开始）
            lessonEndTime: null,                                       // 课程开始时间（结束）
            operateStaff: null,                                          // 操作人
            lastSyncDatetime: null,     // 数据有效时间
            staffList:[] // 操作人列表
        }
    };

    /**
     * 表格头配置
     * @type {{title: string; dataIndex: string}[]}
     */
    private columns = [
        {
            title: '中心号',
            dataIndex: 'centerId',
        }, {
            title: '批次ID',
            dataIndex: 'batchId',
        }, {
            title: '操作类型',
            dataIndex: 'operateType',
        },{
            title:'批次换课总课时数',
            dataIndex:'batchNum',
        },{
            title: '课时数',
            dataIndex: 'classNum',
        },{
            title: '宝宝名',
            dataIndex: 'babyName',
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
        },{
            title:'操作时间',
            dataIndex:'operateTime',
        }, {
            title: '排课类型',
            dataIndex: 'bookType',
        }, {
            title: '课程代码',
            dataIndex: 'courseType',
        }, {
            title: '课程开始时间',
            dataIndex: 'lessonStartTime',
        }, {
            title: '当前GB',
            dataIndex: 'gb',
        }, {
            title: '当前GA',
            dataIndex: 'ga',
        }, {
            title: '操作人',
            dataIndex: 'operateStaff',
        }, {
            title: '宝宝ID',
            dataIndex: 'babyId',
        }, {
            title: 'leads ID',
            dataIndex: 'leadsId',
        }, {
            title: '合同ID',
            dataIndex: 'contractId',
        }
    ];
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const {allList} = this.props;
        const { classOptions, typeOptions } = this.state
        const staffOption = allList.map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }))
        const config = [
            {
                type: 'text',
                label: '宝宝名',
                name: 'babyName',
                placeholder: '请输入宝宝姓名'
            },
            {
                type: 'text',
                label: '合同编号',
                name: 'contractCode',
                placeholder: '请输入合同编号'
            },
            {
                type: 'select',
                label: '课程代码',
                name: 'lessonCourse',
                options: classOptions
            },
            {
                type: 'select',
                label: '操作类型',
                name: 'operateType',
                options: typeOptions
            },
            {
                type: 'rangePicker',
                label: '操作时间',
                name: 'operateTime',
                initialValue: [moment().startOf('month'), moment().endOf('day')],
            },
            {
                type: 'rangePicker',
                label: '课程开始时间',
                name: 'lessonDate',
            },
            {
                type: 'select',
                label: '操作人',
                name: 'operateStaff',
                options: staffOption
            }
        ];
        return config;
    }
    componentDidMount(){
        this.allTypeOptions()
        getAllCourse({
            currentCenterId: User.currentCenterId,
            staffId:User.userId
        }).then(res => {
            const allCourseCode = res.map(item => ({
                postCode: item.id,
                postName: item.courseCode
            }))
            this.setState({
                classOptions:allCourseCode
            })
        })

    }
    /**
     * 获取数据
     */
    getContentList = () => {
        const {
            babyName, contractCode,
            lessonCourse, operateType,
            operateStartTime, operateEndTime,
            lessonStartTime, lessonEndTime,
            operateStaff, pageNo, pageSize} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            babyName, contractCode,
            lessonCourse, operateType,
            operateStartTime, operateEndTime,
            lessonStartTime, lessonEndTime,
            operateStaff, pageNo, pageSize
        };
        changeDeleteClassList(param).then((res) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
                canDownload:res.list.length>0?true:false,
                lastSyncDatetime: Date.now()
            })
        })
    };
    /**
     * 条件搜索
     * @param values
     */
    onSearch = (values:any) => {
        const param = Object.assign({}, values, {
            babyName:values.babyName,
            contractCode:values.contractCode,
            lessonCourse:values.lessonCourse,
            operateType:values.operateType ? values.operateType : null,
            operateStartTime: values.operateTime ? moment(values.operateTime[0]).startOf('day').valueOf() : null,
            operateEndTime: values.operateTime ? moment(values.operateTime[1]).endOf('day').valueOf() : null,
            lessonStartTime: values.lessonDate ? moment(values.lessonDate[0]).startOf('day').valueOf() : null,
            lessonEndTime: values.lessonDate ? moment(values.lessonDate[1]).endOf('day').valueOf() : null,
            operateStaff:values.operateStaff,
        })
        this.setState({
            ...param,
            pageNo:1
        }, this.getContentList);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.getContentList);
    };
    /**
     * 导出
     */
    export = () => {
        const {
            babyName, contractCode,
            lessonCourse, operateType,
            operateStartTime, operateEndTime,
            lessonStartTime, lessonEndTime,
            operateStaff, canDownload} = this.state;
        const param = {
            currentCenterId: User.currentCenterId,
            babyName, contractCode,
            lessonCourse, operateType,
            operateStartTime, operateEndTime,
            lessonStartTime, lessonEndTime,
            operateStaff
        };
        // 获取选中开始时间往后推一年
        const endTime = moment(operateStartTime).add(moment.duration({ 'year': 1 }));
        if (canDownload===false){
            message.error('暂无数据')
        }else if(operateEndTime > endTime){
            // 判断如果选中结束时间>上面后推一年，提示：最多支持查询的1年的数据
            message.warning('最多支持导出1年的数据');
        }else{
            exportchangeDeleteClassList(param)
        }
    };
    /**
     * 操作类型选项
     */
     allTypeOptions = () => {
        this.setState({
            typeOptions
        })
     }
    render(){
        const {dataSource, totalSize, pageNo, pageSize, lastSyncDatetime} = this.state;
        return(
            <div id="gym-telephone-area-report" className="gym-telephone-area-report">
                <BreadCrumb routes={this.routes}/>

                <div className="page-wrap">

                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />

                    <FullScreen
                        handleDownLoadExcel={this.export}
                        canDownload={dataSource.length > 0}
                        lastSyncDatetime={lastSyncDatetime}
                        fyi={'上线之前的数据仅供参考。'}
                    >
                        <Alert showIcon message="删课记录仅支持查询近两年的数据。" type="info" className='mb15'/>

                        <TablePagination
                            dataSource={dataSource}
                            columns={this.columns}
                            totalSize={totalSize}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            rowKey={(item: any, index: number) => index}
                            handleChangePage={this.handleChangePage}
                            scroll={{ x:2200 }}
                        />
                    </FullScreen>

                </div>
            </div>
        )
    }
}

export { ExchangeAndDeletedRecord }
