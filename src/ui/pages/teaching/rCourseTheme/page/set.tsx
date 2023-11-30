/**
 * desc: 课程主题设置(R店)
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/11
 * Time: 15:33
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {MonthInput} from "@/ui/component/datePicker";
import {Tooltip} from "@/ui/component/toolTip";
import moment from 'moment';
import history from '@/router/history';
import {getTeachPlanConfigDetailNew, setTeachPlanConfigNew} from "@redux-actions/teaching/teachTheme";
import {User} from "@/common/beans/user";
import {Popover, Icon as AntdIcon} from 'antd';
import {Select, Option} from "@/ui/component/select";
import { getRCourseListNoPage, getRCourseThemeSet, getRCourseList, updateRCourseThemeSet} from "@redux-actions/teaching/rCourse";
import {Message} from "@/ui/component/message/message";
import {ConfirmCheck} from "@/ui/component/confirmCheck";

class RCourseSet extends React.Component<any, any> {
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: 'R店主题设置',
            path: '',
            link: '#',
            id: 'teachThemeConfig'
        }
    ];
    constructor(props:any){
        super(props)
        this.state = {
            date : moment(),
            weekList: [],
            configList: [],
            lessonIndex:null,
            weekIndex:null,
            optionList: [],
            courseThemeIds: [],     // 选中主题id
        }
    }
    componentDidMount(){
        this.queryData();
    }

    /**
     * 获取数据
     */
    queryData = () => {
        const {date} = this.state;
        const param = {
            date: date.valueOf(),
            currentCenterId: User.currentCenterId
        }
        const param2 = {
            currentCenterId: User.currentCenterId,
            endDate: moment(date).endOf('month').valueOf(),
            startDate:moment(date).startOf('month').valueOf(),
        }
        Promise.all([
            getTeachPlanConfigDetailNew(param),
            getRCourseList(param),
            getRCourseThemeSet(param2)
        ]).then(res => {
            const [week, courseList, themeList] = res;
            this.setState({
                weekList:week.weekList,
                configList: this.parsingDate(week.weekList, courseList, themeList)
            })
        })
    };
    /**
     * 解析数据
     * @param {Array<any>} week
     * @param {Array<any>} teachPlanList
     * @param {Array<any>} teachConfigList
     */
    parsingDate = (weekList:Array<any>, teachPlanList:Array<any>, teachConfigList:Array<any>) => {
        const weekIndexMap = {};
        const teachIndexMap = {};
        const weekCount = weekList.length;
        weekList.forEach((week, index) => {
            weekIndexMap[moment(week.beginDate).valueOf()] = index;
        });
        teachPlanList.forEach((plan, index) => {
            let n = 0;
            let themes = []
            while (n < weekCount){
                themes.push([]);
                n++;
            }
            plan.children = themes;
            teachIndexMap[plan.courseId] = index;
        });
        const newTeachPlanArr = [...teachPlanList];

        teachConfigList.forEach((data) => {
            if(teachIndexMap[data.courseId] !== undefined){
                newTeachPlanArr[teachIndexMap[data.courseId]].children[weekIndexMap[data.startDate]] = [ ...newTeachPlanArr[teachIndexMap[data.courseId]].children[weekIndexMap[data.startDate]] , data]
            }
        });
        return newTeachPlanArr;
    };
    /**
     * 更换月份
     * @param date
     */
    handleChangeMonth = (date:any) => {
        this.setState({
            date,
            lessonIndex:null,
            weekIndex:null,
            optionList: [],
            courseThemeIds: [],
        }, this.queryData)
    };
    /**
     * 渲染气泡插件
     */
    renderPop = (str:Array<any>) => {
        return <div
                className='gym-teach-theme-popover'
            >
                <div>
                    <span>{str}</span>
                </div>
            </div>
    };
    /**
     * 显示修改教案
     * @param lessonIndex
     * @param weekIndex
     */
    exitTheme = (record, lessonIndex, weekIndex) => {
        this.setState({
            lessonIndex,
            weekIndex,
            courseThemeIds: record.children[weekIndex].map(item => item.courseThemeResourcesId)
        }, () => this.queryThemeList(record))
    };
    /**
     * 获取课程列表
     * @param record
     */
    queryThemeList = (record) => {
        const param = {
            courseId: record.courseId ,
            currentCenterId:User.currentCenterId
        }
        getRCourseListNoPage(param).then((res) => {
            this.setState({ optionList: res})
        })
    };
    /**
     * 改变教案
     * @param value
     */
    changeLessonPlay = (value, idx) => {
        const arr = [...this.state.courseThemeIds]
        arr[idx] = value;
        this.setState({courseThemeIds: arr});
    };
    /**
     * 保存配置
     * @param record
     */
    saveThemeConfig = (record, weekIndex:number) => {
        const {weekList} = this.state;
        const arr  = this.state.courseThemeIds.filter(item => item);
        if(arr.length === 0){
            Message.info('应至少选择一个主题');
            return;
        }
        const param = {
            currentCenterId:User.currentCenterId,
            courseId: record.courseId,
            courseThemeResourcesId: arr,
            startDate: weekList[weekIndex].beginDate,
            endDate: weekList[weekIndex].endDate
        }
        updateRCourseThemeSet(param).then((res) => {
            this.closeThemeConfig();
            this.queryData();
            Message.success("保存成功")
        })
    };
    /**
     * 关闭修改教案
     * @param lessonIndex
     * @param weekIndex
     */
    closeThemeConfig = () => {
        this.setState({
            lessonIndex:null,
            weekIndex:null,
            optionList: [],
            courseThemeIds: [],
        },)
    };
    render() {
        const {
            date, weekList, configList, lessonIndex, weekIndex,
            optionList, courseThemeIds
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div className="page-wrap gym-teach-theme" id="gym-teach-theme">
                    <div className="gym-teach-theme-head">
                        <span className='mr10'>月份选择：</span>
                        <MonthInput
                            value={date}
                            onChange={this.handleChangeMonth}
                            allowClear={false}
                        />
                    </div>
                    <div className="gym-teach-theme-content">
                        <div className="gym-teach-theme-content-row">
                            <div className="gym-teach-theme-content-col th">
                                <span>课程类型</span>
                            </div>
                            {
                                weekList.map((item:any, index:number) => (
                                    <div key={`date_${index}`} className="gym-teach-theme-content-col th td">
                                        <span>{item.weekName}</span>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            configList.map((item:any, index:number) => (
                                <div className="gym-teach-theme-content-row" key={`row-${index}`}>
                                    <div className="gym-teach-theme-content-col">
                                        <span>{item.courseCode}-{item.courseName}</span>
                                    </div>
                                    {
                                        (item.children || []).map((item2 = [],index2) =>
                                            (index === lessonIndex && index2 === weekIndex)
                                                ?(
                                                    <div
                                                        className="gym-teach-theme-content-col td"
                                                        key={`row-edit-${index}-td-${index2}`}
                                                    >
                                                        <div>
                                                            <Select
                                                                showSearch
                                                                filterOption={
                                                                    (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                value={courseThemeIds[0]}
                                                                onChange={(e) => this.changeLessonPlay(e, 0)}
                                                                className='mb5'
                                                                allowClear={true}
                                                            >
                                                                {
                                                                    optionList.map((option) =>
                                                                        (
                                                                            <Option key={option.id} value={option.id}>
                                                                                {option.themeName}
                                                                            </Option>
                                                                        ))
                                                                }
                                                            </Select>
                                                            <Select
                                                                showSearch
                                                                filterOption={
                                                                    (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                value={courseThemeIds[1]}
                                                                onChange={(e) => this.changeLessonPlay(e, 1)}
                                                                allowClear={true}
                                                            >
                                                                {
                                                                    optionList.map((option) =>
                                                                        (
                                                                            <Option key={option.id} value={option.id}>
                                                                                {option.themeName}
                                                                            </Option>
                                                                        ))
                                                                }
                                                            </Select>
                                                        </div>

                                                        <ConfirmCheck
                                                            button={<Tooltip placement="bottom" title={'保存'}>
                                                                <AntdIcon
                                                                    className='gym-teach-theme-content-col-icon'
                                                                    type='save'/>
                                                            </Tooltip>}
                                                            item={item}
                                                            ensure={() => this.saveThemeConfig(item,  index2)}
                                                            contentText='是否确认更改？'
                                                        />
                                                        <Tooltip placement="bottom" title={'取消'}>
                                                            <AntdIcon
                                                                className='gym-teach-theme-content-col-icon close'
                                                                type='close'
                                                                onClick={() => this.closeThemeConfig()}/>
                                                        </Tooltip>

                                                    </div>
                                                )
                                                :(
                                                    <div
                                                        key={`row-${index}-td-${index2}`}
                                                        className="gym-teach-theme-content-col tx"
                                                        onDoubleClick={() => this.exitTheme(item, index, index2)}
                                                    >
                                                        {
                                                            (item2 || []).map((item3, index3) =>
                                                                <Popover placement="bottom"
                                                                         key={`themeName_${index3}`}
                                                                         content={this.renderPop(item3.themeDesc)}
                                                                >
                                                                    <div className=''>{item3.themeName}</div>
                                                                </Popover>
                                                            )
                                                        }
                                                    </div>
                                                )
                                        )
                                    }
                                </div>
                            ))
                        }

                    </div>
                    <div className="gym-teach-theme-buttons">
                        <button
                            className="gym-button-white gym-button-xs"
                            onClick={() => {history.goBack()}}
                        >返回</button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {RCourseSet};
