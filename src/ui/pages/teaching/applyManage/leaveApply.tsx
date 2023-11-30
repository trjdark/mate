/**
 * desc: 请假申请列表
 * User: colin.lu
 * Date: 2018/12/28
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import moment from 'moment';
import {
    Tabs,
    message,
    Form,
    DatePicker,
    Button,
    Input,
    Select,
    Popover,
} from "antd";
import {Routes} from "@/router/enum/routes";
import {User} from "@/common/beans/user";
import {getLeaveList, getLeaveDetail} from "@redux-actions/teaching/applyManage";
import history from "../../../../router/history";
import {leave_type_format} from "./filter/applyManageFilter";
import '../applyManage/style/index'
import {form} from "@/common/decorator/form";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import { CommonUtils } from "@/common/utils/commonUtils";
import uuid from 'uuid'
import { LeaveDetailModal } from './part/leaveDetailModal'
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

declare interface SearchFormProps {
    form?: any,
    onSearch: (json: any) => void,
    onReset?: (value: any) => void,

}

@form()
class LeaveApply extends React.Component<SearchFormProps, any> {
    //路由代码块
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '申请管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        }
    ];

    state = {
        table:{
            list: [],
            //分页的数据
            pageNo: 1,
            pageSize: 10,
            totalSize: 0
        },
        //tab切换
        tabId: '2',
        defaultActiveKey: '2',
        activeKey: '2',
        babyName:null,
        date: null,
        setFirstDate: undefined,
        disableDate: undefined,
        beginDate: moment().subtract(3, "month").valueOf(),
        endDate: moment().valueOf(),
        operateSource: "",
        visible: false,
        leaveDetailList: {}
    };


    componentDidMount() {
        this.handleSearch({});
    }

    onReset = () => {
        const {form} = this.props;
        form.resetFields();
    };

    setRangePickerHalfYear = (date) => {
        const {form} = this.props;
        if(date[0] && date[1]){
            if((moment(date[1]).valueOf() - moment(date[0]).valueOf()) > 1000*60*60*24*180 ){
                message.error('最大时间区间为180天！');
                form.setFieldsValue({
                    lessonDate:[moment().subtract(3, "month"), moment()]
                });
            }
        }
    };

    /**
     * 改变tab key
     */
    onChangeTab = (activeKey) => {
        if(activeKey === '1'){
            history.push(Routes.试听申请.path)
        }else if(activeKey === '2') {

        }else if(activeKey === '3') {
            history.push(Routes.gymguard.path)
        }
    };

    /**
     *查询列表
     */
    handleSearch = (body:any) => {
        if((body.lessonDate ? (moment(body.lessonDate[1]).valueOf() - moment(body.lessonDate[0]).valueOf()):0) > 1000*60*60*24*180 ){
            message.error('最大时间区间为180天！');
            return
        }

        this.setState({
            babyName: body.babyName ? body.babyName : null,
            beginDate:body.lessonDate ? moment(body.lessonDate[0]).valueOf() : this.state.beginDate,
            endDate: body.lessonDate ? moment(body.lessonDate[1]).valueOf() : this.state.endDate,
            pageNo: 1,
            pageSize: 10
        });

        const postData = {
            "babyName": body.babyName ? body.babyName : null,
            "currentCenterId": User.currentCenterId,
            "beginDate": body.lessonDate ? moment(body.lessonDate[0]).valueOf() : this.state.beginDate,
            "endDate": body.lessonDate ? moment(body.lessonDate[1]).valueOf() : this.state.endDate,
            "pageNo": 1,
            "pageSize": 10,
            operateSource: this.state.operateSource
        };

        getLeaveList(postData).then((res) => {
            this.setState({
                table: res
            })
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        })


    };

    handleTableChange = () => {
        if((moment(this.state.endDate).valueOf() - moment(this.state.beginDate).valueOf()) > 1000*60*60*24*180 ){
            message.error('最大时间区间为180天！');
            return
        }
        const postData = {
            "babyName": this.state.babyName,
            "currentCenterId": User.currentCenterId,
            "beginDate": this.state.beginDate,
            "endDate": this.state.endDate,
            "pageNo": this.state.table.pageNo,
            "pageSize": this.state.table.pageSize
        };
        /**
         * 请假列表
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        getLeaveList(postData).then((res) => {
            this.setState({
                table: res
            })
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        })
    };

    /**
     * 查询
     */
    handleSearchApply = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if((moment(values.lessonDate[1]).valueOf() - moment(values.lessonDate[0]).valueOf()) > 1000*60*60*24*180 ){
                message.error('最大时间区间为180天！');
                return
            }
            this.setState({
                babyName: values.babyName ? values.babyName : undefined,
                beginDate: moment(values.lessonDate[0]).valueOf() ? moment(values.lessonDate[0]).valueOf() : undefined,
                endDate: moment(values.lessonDate[1]).valueOf() ? moment(values.lessonDate[1]).valueOf() : undefined,
                pageNo: 1,
                pageSize: 10,
                operateSource:values.operateSource
            });

            const postData = {
                "babyName": values.babyName ? values.babyName : null,
                "currentCenterId": User.currentCenterId,
                "beginDate": moment(values.lessonDate[0]).valueOf() ? moment(values.lessonDate[0]).valueOf() : null,
                "endDate": moment(values.lessonDate[1]).valueOf() ? moment(values.lessonDate[1]).valueOf() : null,
                "pageNo": 1,
                "pageSize": 10,
                "operateSource": values.operateSource
            };
            getLeaveList(postData).then((res) => {
                this.setState({
                    table: res
                })
            }, (err) => {
                //返回请求reject
                message.error(err.msg)
            })
        })
    };

    /**
     * 分页变化
     * @param pageInfo
     */
    handleChangePageApply = (pageInfo:any) => {
        const {operateSource} = this.state
        this.setState({
            table: {
                pageNo: pageInfo.pageNo,
                pageSize: pageInfo.pageSize,
            }
        }, () => {
            const postData = {
                "babyName": this.state.babyName ? this.state.babyName : null,
                "currentCenterId": User.currentCenterId,
                "beginDate": moment(this.state.beginDate).valueOf() ? moment(this.state.beginDate).valueOf() : null,
                "endDate": moment(this.state.endDate).valueOf() ? moment(this.state.endDate).valueOf() : null,
                "pageNo": pageInfo.pageNo,
                "pageSize": pageInfo.pageSize,
                operateSource,
            };

            getLeaveList(postData).then((res) => {
                this.setState({
                    table: res
                })
            }, (err) => {
                //返回请求reject
                message.error(err.msg)
            })
        })
    };

    /**
     * 权限控制
     * @param func key
     */
    isExist = (funcId)=> {
        const permissionList = User.permissionList;
        return permissionList.includes(funcId)
    };

    render() {
        const {
            table,
            visible,
            leaveDetailList
        }
             = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            }, {
                title: '上课时间',
                dataIndex: 'lessonDate',
                key: 'lessonDate'
            }, {
                title: '课程',
                dataIndex: 'courseCode',
                key: 'courseCode'
            }, {
                title: '历史请假',
                dataIndex: 'totalLeaveTimes',
                key: 'totalLeaveTimes',
            }, {
                title: '请假类型',
                dataIndex: 'leaveType',
                key: 'leaveType',
                render(text) {
                    if(text){
                        return leave_type_format(text)
                    }else {
                        return ''
                    }
                }
            }, {
                title: 'GB',
                dataIndex: 'primaryGBStaffName',
                key: 'primaryGBStaffName',
            }, {
                title: '操作时间',
                dataIndex: 'lastUpdateDate',
                key: 'lastUpdateDate',
                render(text) {
                    if(text && text !== null){
                        return `${moment(text).format('YYYY-MM-DD  HH:mm:ss')}`;
                    }else{
                        return '';
                    }

                }
            },
            {
                title: '操作来源',
                dataIndex: 'operateSource',
                key: 'operateSource',
                render: (text)=> {
                    const config = {
                        "1501001": "Mate",
                        "1501002": "启蒙APP"
                    }
                    return config[text]
                }
            },{
                title: '操作人员',
                dataIndex: 'operateStaff',
                key: 'operateStaff',
            },{
                title: '请假事由',
                dataIndex: 'leaveRemark',
                key: 'leaveRemark',
                render:(text)=>{
                    const content = (
                        <div className="gym-apply-leave-main">{text ? text : ''}</div>
                    )
                   return text && <Popover content={content}>
                                <div>
                                    {CommonUtils.cutstr(text, 7)}
                                </div>
                            </Popover>
                }
            }
        ];

        return (
            <div id='gym-contract-receive'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract gym-apply-manage'>
                    <Tabs
                        defaultActiveKey={this.state.defaultActiveKey}
                        onChange={this.onChangeTab}
                        activeKey={this.state.activeKey}
                        type="card"
                        tabBarGutter={10}
                    >
                        {
                            this.isExist(`${FUNC[`试听申请`]}`) &&
                            <TabPane tab="试听申请" key="1">
                                <div>
                                </div>
                            </TabPane>
                        }
                        {
                            this.isExist(`${FUNC[`请假申请`]}`) &&
                            <TabPane tab="请假申请" key="2">
                                <div className='page-wrap gym-apply-manage-tab-content'>
                                    <div>
                                        <Form onSubmit={this.handleSearchApply} className="gym-common-search-form">
                                            <div className="gym-form-item-wrap">
                                                <FormItem label={'宝宝姓名'} className='gym-form-item'>
                                                    {
                                                        getFieldDecorator('babyName', {})(
                                                            <Input placeholder='请输入'/>
                                                        )
                                                    }
                                                </FormItem>
                                            </div>
                                            <div className="gym-form-item-wrap">
                                                <FormItem label={'上课日期'} className='gym-form-item'>
                                                    {
                                                        getFieldDecorator('lessonDate', {
                                                            initialValue: [moment().subtract(3, "month"), moment()]
                                                        })(
                                                            <RangePicker
                                                                allowClear={false}
                                                                onCalendarChange={this.setRangePickerHalfYear}
                                                            />
                                                        )
                                                    }
                                                </FormItem>
                                            </div>
                                            <div className="gym-form-item-wrap">
                                                <Form.Item label="操作来源" className='gym-form-item'>
                                                    {
                                                        getFieldDecorator('operateSource', {
                                                            initialValue: ''
                                                        })(<Select>
                                                            <Select.Option value='1501001'>Mate</Select.Option>
                                                            <Select.Option value='1501002'>启蒙App</Select.Option>
                                                        </Select>)
                                                    }
                                                </Form.Item>
                                            </div>
                                            {/* 搜索框刚好占满一行，让按钮到最后位置显示 */}
                                            <div className="gym-form-item-wrap">
                                                <FormItem className='gym-form-item'/>
                                            </div>
                                            <div className="gym-form-item-wrap">
                                                <FormItem className='gym-form-item'/>
                                            </div>
                                            <div className="gym-form-item-wrap">
                                                <FormItem className='gym-form-item' label={' '} colon={false}>
                                                    <div className="gym-search-form-btn">
                                                        <Button
                                                            htmlType="submit"
                                                            className='gym-button-xs gym-button-blue'
                                                        >
                                                            查询
                                                        </Button>
                                                        <Button
                                                            className='gym-button-xs gym-button-wBlue ml15'
                                                            onClick={this.onReset}
                                                        >
                                                            重置
                                                        </Button>
                                                    </div>
                                                </FormItem>
                                            </div>
                                        </Form>
                                    </div>
                                    <TablePagination
                                        style={{marginTop: '-5px'}}
                                        columns={columns}
                                        rowKey={(record)=> record.babyId +uuid.v1() }
                                        dataSource={table.list || []}
                                        totalSize={table.totalSize}
                                        pageSize={table.pageSize}
                                        handleChangePage={this.handleChangePageApply}
                                        pageNo={table.pageNo}
                                        onRow={record => {
                                            return {
                                                onClick: (e)=>{
                                                    getLeaveDetail({
                                                        id:record.id,
                                                        currentCenterId:User.currentCenterId
                                                    }).then(res => {
                                                        this.setState({
                                                            visible:  true,
                                                            leaveDetailList:res
                                                        })
                                                    })
                                                }
                                            }
                                        }}
                                    />
                                    <LeaveDetailModal visible={visible} onCancel={(visible:boolean) => this.setState({visible})} leaveDetailList = {leaveDetailList} />
                                </div>
                            </TabPane>
                        }
                        {
                            this.isExist(`${FUNC[`GYM Guard`]}`) &&
                            <TabPane tab="Gym Guard" key="3">
                                <div>
                                </div>
                            </TabPane>
                        }
                    </Tabs>
                </div>
            </div>
        )
    }
}

export {LeaveApply}
