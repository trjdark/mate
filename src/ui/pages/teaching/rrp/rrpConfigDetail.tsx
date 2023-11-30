/**
 * desc: RRP配置详情
 * User: colin.lu
 * Date: 2019/06/01
 * Time: 上午10:00
 */

import React, {Fragment} from 'react';
import {getMonthList, getPrview, getRRPConfig, saveRRPConfig, sendPush} from "@redux-actions/setting/lessonMaterialActions";
import {User} from "@/common/beans/user";
import {message, Form, Row, Col, Switch, Button, Popover, Modal} from "antd";
import {Table} from "@/ui/component/tablePagination";
import {PageTitle} from "@/ui/component/pageTitle";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {form} from "@/common/decorator/form";
import {Option, Select} from "@/ui/component/select";
import {findIndex, cloneDeep} from "lodash";

import moment from "moment";

const FormItem = Form.Item;

@form()
class RRPConfigDetail extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: 'RRP配置设置',
            path: '',
            link: '#',
            id: 'contractManagement'
        }
    ];
    constructor(props:any){
        super(props)
        this.state = {
            defaultMonth: "",              // 默认当前月
            monthOptions: "",              // 选择月份范围
            isEdit: false,                  // 是否在编辑状态
            isEnable: false,               // 是否开启推送
            lessonData:{},                 // 数据信息
            weekList: [],                  // 星期列表
            rrpDetailVisible: false,       // 预览弹层
            ifShowNotRanged:false,
            popOverLessonType: '',
            popOverInfo: {},

        }
    }
    componentDidMount() {
        this.setMonth();
        this.getCenterRRP()
    }
    /**
     * 获取月份列表
     */
    setMonth = () => {
        const postData = {
            currentCenterId: User.currentCenterId
        };
        getMonthList(postData).then((res) => {
            this.setState({
                defaultMonth: res.defaultMonth,
                monthOptions: res.monthOptions
            })
        }, (err) => {
            message.error(err.msg);
        })
    };
    /**
     * 获取RRP信息
     */
    getCenterRRP = () => {
        const postData ={
            currentCenterId: User.currentCenterId,
            date: this.props.form.getFieldsValue().chooseMonth
                ? moment(this.props.form.getFieldsValue().chooseMonth).valueOf()
                : moment().valueOf()
        };
        getRRPConfig(postData).then((res:any) => {
            this.setState({
                isEnable: res.isEnable === 1,
                weekList: res.weekList,
                lessonData: res
            })
        })
    };
    /**
     * 设置推送
     */
    sendPush = (checkedStatus: boolean) => {
        const postData ={
            currentCenterId: User.currentCenterId,
            date:moment(this.state.date).valueOf(),
            isEnable: checkedStatus ? 1 : 0,
        };
        sendPush(postData).then((res) => {
            message.success(`${checkedStatus ? '' : '取消'}推送成功`);
            this.setState({
                isEnable: checkedStatus,
            })
        }, (err) => {
            message.error(err.msg);
        })
    };
    /**
     * 改变修改状态
     */
    triggerEdit = () => {
        this.setState({isEdit: !this.state.isEdit})
    };
    /**
     * 保存
     */
    save = () => {
        const postParams = Object.assign({},this.state.lessonData,{
            currentCenterId: User.currentCenterId,
            date: moment(this.state.date).valueOf()
        });
        saveRRPConfig(postParams).then(() => {
            // 保存成功，刷新
            this.getCenterRRP();
            message.success('保存RRP配置成功');
            this.setState({
                isEdit: false
            })
        },(err) => {
            message.error(err.msg);
        })
    };
    /**
     * 选择日期
     * @param time
     */
    changeMonth = (time) => {
        this.setState({date:moment(time).format('YYYY-MM')}, ()=>{
            this.getCenterRRP()
        });
    };
    /**
     * 获取预览信息
     * @param item
     * @param record
     * @param weekIndex
     */
    showWeekPopupRRPDetailInfo = (item,record, weekIndex) => {
        const postData = {
            "courseTypeId": record.courseTypeId,
            "currentCenterId": User.currentCenterId,
            "currentWeekId": item.id,
            "date": moment(this.state.date).valueOf(),
            "id": item.rrpConfigId,
            "nextWeekId": "",
            "weekIndex": weekIndex
        };

        getPrview(postData).then((res) => {
            if(!res.prepare || res.prepare === ''){
                this.setState({
                    ifShowNotRanged: true,
                    rrpDetailVisible: true,
                    popOverInfo: res,
                    popOverLessonType: record.courseTypeName
                })
            }else{
                this.setState({
                    ifShowNotRanged: false,
                    rrpDetailVisible: true,
                    popOverInfo: res,
                    popOverLessonType: record.courseTypeName
                })
            }
        }, (err) => {
            message.error(err.msg);
        });
    };
    /**
     * 课程排序
     */
    sortLessons = (lessons:Array<any>):Array<any> => {
        let res:Array<any> = [
            lessons.filter((item:any) => item && item.teachPropCode === "93001").length > 0 ? lessons.filter((item:any) => item && item.teachPropCode === "93001")[0] : {id: '', teachPropCode: "93001"},
            lessons.filter((item:any) => item && item.teachPropCode === "93002").length > 0 ? lessons.filter((item:any) => item && item.teachPropCode === "93002")[0] : {id: '', teachPropCode: "93002"},
        ];
        return res
    };
    /**
     * 显示框
     * @param record
     * @param lessons
     * @param weekIndex
     * @returns {any}
     */
    renderDiv = (record, lessons, weekIndex) => {
        const {isEdit} = this.state;
        if(isEdit){
            // 如果多项选择（四代，五代play）
            if(record.dispersed){
                const _lessons = this.sortLessons(lessons);
                return (_lessons || []).map((lesson:any, index:number) =>
                    <Select
                        key={`${lesson.id}_${index}`}
                        style={{width:'150px'}}
                        onChange={(value, option) => {this.setMutliTableLessonType(value, record.courseTypeId, weekIndex, lesson.teachPropCode)}}
                        placeholder={`请选择`}
                        className="inputWidth"
                        defaultValue={`${lesson ? lesson.id : ''}`}
                    >
                        {   // 如果是四代教具，采用四代教具列表；五代教具，采用五代教具列表
                            (lesson.teachPropCode === "93001" ? record.fourRrpMainList
                                : lesson.teachPropCode === "93002" ? record.fiveRrpMainList
                                    : []).map((item:any,index:number) =>
                                <Option key={`${record.courseTypeCode}-${item.courseTypeName}-${index}`} value={item.id} title={item.lessonPlanName}>
                                    {item.lessonPlanName}
                                </Option>
                            )
                        }
                    </Select>
                )
            }else{
                return (
                    (lessons || []).map((lesson:any, index:number) =>
                        <Select
                            key={`${lesson ? lesson.id : index}`}
                            style={{width:'150px'}}
                            onChange={(value, option) => {this.setTableLessonType(value, record.courseTypeId, weekIndex)}}
                            placeholder={`请选择`}
                            className="inputWidth"
                            defaultValue={`${lesson ? lesson.id : ''}`}
                        >
                            {
                                (record.rrpMainList || []).map((item:any,index:number) =>
                                    <Option key={`${record.courseTypeCode}-${item.courseTypeName}-${index}`} value={item.id} title={item.lessonPlanName}>
                                        {item.lessonPlanName}
                                    </Option>
                                )
                            }
                        </Select>
                    )
                )
            }
        }else{
            return (
                (lessons || []).map((lesson:any) =>
                    lesson ?
                        <div className='gym-lesson-popover-span' key={lesson.id}>
                            <Popover
                                placement='bottom'
                                trigger='hover'
                                content={
                                    <div className='gym-lesson-popover'>
                                        {
                                            (lesson.rrpList || []).filter(item => item.subjectName !== 'PPS').map((item:any) =>(
                                                <Row className='gym-lesson-popover-row' key={item.id}>
                                                    <Col span={20} className='gym-lesson-popover-text'>{item.courseCode}:{item.subjectName}</Col>
                                                    <Col span={4} className='gym-lesson-popover-button pl10'>
                                                        <Button
                                                            htmlType='button'
                                                            className='gym-button-xxs gym-button-white'
                                                            onClick={() => {this.showWeekPopupRRPDetailInfo(item, record, weekIndex)}}
                                                        >预览</Button>
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                    </div>
                                }
                            >
                                <span>
                                    {lesson.lessonPlanName}
                                </span>
                            </Popover>
                        </div>
                        : null
                )
            )
        }

    }
    /**
     * 表格信息
     */
    configColumns = () => {
        const {weekList} = this.state;
        const arr = [
            {
                title: '课程类型',
                dataIndex: 'courseTypeName',
                key: 'courseTypeName',
                width: 120,
                align: 'center'
            },
            {
                title: `第一周(${weekList[0]})`,
                dataIndex: 'firstWeek',
                key: 'firstWeek',
                align: 'center',
                render:(text:any, record:any) => this.renderDiv(record, record.configRrpList.map((item:any) => item.firstWeek), 1)
            },
            {
                title: `第二周(${weekList[1]})`,
                dataIndex: 'secondWeek',
                key: 'secondWeek',
                align: 'center',
                render:(text:any, record:any) => this.renderDiv(record, record.configRrpList.map((item:any) => item.secondWeek), 2)

            },
            {
                title: `第三周(${weekList[2]})`,
                dataIndex: 'thriceWeek',
                key: 'thriceWeek',
                align: 'center',
                render:(text:any, record:any) => this.renderDiv(record, record.configRrpList.map((item:any) => item.thriceWeek), 3)

            },
            {
                title: `第四周(${weekList[3]})`,
                dataIndex: 'fourthWeek',
                key: 'fourthWeek',
                align: 'center',
                render:(text:any, record:any) => this.renderDiv(record, record.configRrpList.map((item:any) => item.fourthWeek), 4)

            }
        ];
        weekList.length === 5 && arr.push(
            {
                title: `第五周(${weekList[4]})`,
                dataIndex: 'fifthWeek',
                key: 'fifthWeek',
                align: 'center',
                render:(text:any, record:any) => this.renderDiv(record, record.configRrpList.map((item:any) => item.fifthWeek), 5)

            }
        );
        return arr;
    };
    /**
     * 多教具Play 选择
     * @param value
     * @param courseTypeId
     * @param weekIndex
     * @param teacherCode
     */
    setMutliTableLessonType = (value, courseTypeId, weekIndex, teacherCode) => {
        const {lessonData} = this.state;
        const data = cloneDeep(lessonData.dataList);
        const weekOptions = new Map([
            [1, 'firstWeek'],
            [2, 'secondWeek'],
            [3, 'thriceWeek'],
            [4, 'fourthWeek'],
            [5, 'fifthWeek'],
        ]);
        const teacherOptions = new Map([
            ["93001", 0],
            ["93002", 1],
        ]);
        const weekKey = weekOptions.get(weekIndex);
        const index = findIndex(data, {courseTypeId: courseTypeId});
        const i = teacherOptions.get(teacherCode);
        data[index].configRrpList[i][weekKey] = {
            id: value,
            teachPropCode:teacherCode
        };
        this.setState({lessonData: Object.assign({}, this.state.lessonData, {dataList: data})})
    }
    /**
     * 选择模版
     * @param value
     * @param courseTypeId
     * @param weekIndex
     */
    setTableLessonType = (value, courseTypeId, weekIndex) => {
        const {lessonData} = this.state;
        const data = lessonData.dataList;
        const weekOptions = new Map([
            [1, 'firstWeek'],
            [2, 'secondWeek'],
            [3, 'thriceWeek'],
            [4, 'fourthWeek'],
            [5, 'fifthWeek'],
        ]);
        const weekKey = weekOptions.get(weekIndex);

        const index = findIndex(data, {courseTypeId: courseTypeId});

        data[index].configRrpList[0][weekKey] = {id: value};
        this.setState({lessonData: Object.assign({}, this.state.lessonData, {dataList: data})})
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            isEdit, defaultMonth, monthOptions, isEnable, lessonData, rrpDetailVisible,
            ifShowNotRanged, popOverLessonType, popOverInfo,
        } = this.state;
        return(
            <div id={`gym-rrp-add-edit`}>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <Form layout={"inline"}>
                        <Row className='mb15'>
                            <Col span={6}>
                                <FormItem label='是否启用:'>
                                    {
                                        getFieldDecorator('ifPush', {
                                        })(
                                            <Switch
                                                disabled={isEdit}
                                                checkedChildren="是"
                                                unCheckedChildren="否"
                                                checked={isEnable}
                                                onChange={this.sendPush}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem label='月份选择:'>
                                    {
                                        getFieldDecorator('chooseMonth', {
                                            initialValue: defaultMonth
                                        })(
                                            <Select
                                                style={{width:200}}
                                                onChange={this.changeMonth}
                                                placeholder={`请选择`}
                                                className="inputWidth"
                                                disabled={isEdit}
                                            >
                                                {
                                                    (monthOptions || []).map((item:any,index:number) =>
                                                        <Option key={item.monthCode} value={item.monthCode}>
                                                            {item.monthCode}
                                                        </Option>
                                                    )
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <div>
                            <Table
                                bordered={true}
                                columns={this.configColumns()}
                                dataSource={lessonData.dataList}
                                rowKey='courseTypeId'
                                className='gym-lesson-config-table'
                            />
                        </div>
                        <div className='mt30 gym-lesson-button'>
                            {
                                isEdit ?
                                    <Fragment>
                                        <Button
                                            htmlType="button"
                                            className='gym-button-default gym-button-xs'
                                            onClick={this.save}
                                        >
                                            保存
                                        </Button>
                                        <Button
                                            onClick={this.triggerEdit}
                                            htmlType="button"
                                            className='gym-button-white gym-button-xs ml30'
                                        >
                                            取消
                                        </Button>
                                    </Fragment>
                                 :
                                    <Button
                                        htmlType="submit"
                                        className='gym-button-default gym-button-xs'
                                        onClick={this.triggerEdit}
                                    >
                                        编辑
                                    </Button>

                            }
                        </div>
                    </Form>
                    <Modal
                        visible={rrpDetailVisible}
                        okText={`确定`}
                        cancelText={`返回`}
                        footer={null}
                        closable={true}
                        destroyOnClose={true}
                        maskClosable={true}
                        onCancel={() => {this.setState({rrpDetailVisible: false})}}
                    >
                        <div>
                            <PageTitle title="RRP配置预览"/>
                            {
                                ifShowNotRanged &&
                                <div className='gym-popOver-tip'>
                                    请注意! 您还未设置下周课程教案! 无法预览"下周预告"部分。
                                </div>
                            }
                            <div className='gym-popOver-area'>
                                <img src={require(`@/images/phoneBackground.png`)} className='gym-popOver-phone'/>
                                <img src={require(`@/images/phoneTitle.png`)} className='gym-popOver-phone-title'/>
                                <div className='gym-popOver-content'>
                                    <div>
                                        <img src={require(`@/images/mainTitle.png`)} className='gym-popOver-mainTitle'/>
                                        <div className='gym-popOver-popOverLessonType'>
                                            {popOverLessonType}
                                        </div>
                                    </div>
                                    <div className='gym-popOver-recap'>
                                        <span className='gym-popOver-recap-title'>课堂回顾</span>
                                        <img src={require(`@/images/subTitle1.png`)} className='gym-popOver-subTitle1'/>
                                        <div className='gym-popOver-recap-content'>
                                            {popOverInfo.recap}
                                        </div>
                                    </div>
                                    <div className='gym-popOver-review'>
                                        <span className='gym-popOver-review-title'>家庭游戏</span>
                                        <img src={require(`@/images/subTitle2.png`)} className='gym-popOver-subTitle2'/>
                                        <div className='gym-popOver-review-content'>
                                            {popOverInfo.review}
                                        </div>
                                    </div>
                                    {
                                        !ifShowNotRanged &&
                                        <div className='gym-popOver-prepare'>
                                            <span className='gym-popOver-prepare-title'>下周预告</span>
                                            <img src={require(`@/images/subTitle3.png`)} className='gym-popOver-subTitle3'/>
                                            <div className='gym-popOver-prepare-content'>
                                                {popOverInfo.prepare}
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

export {RRPConfigDetail}
