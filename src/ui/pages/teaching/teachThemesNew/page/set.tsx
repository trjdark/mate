/**
 * desc: 课程主题设置(Art)
 * User: Vicky.Yu
 * Date: 2021/3/9
 * Time: 下午2:21
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
import { getReviewDetailNew} from "@redux-actions/teaching/reviewLibrary";
import {Message} from "@/ui/component/message/message";
import {ConfirmCheck} from "@/ui/component/confirmCheck";

class TeachThemesSetNew extends React.Component<any, any> {
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: '课程主题设置2.0',
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
            classId: null,     // 选中主题id
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
        getTeachPlanConfigDetailNew(param).then((res:any) => {
            this.setState({
                weekList:res.weekList,
                configList: this.parsingDate(res.weekList, res.reviewProgramPageListRespList, res.classAndThemeList)
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
            weekIndexMap[moment(week.beginDate).format("YYYY-MM-DD")] = index;
        });
        teachPlanList.forEach((plan, index) => {
            let n = 0;
            let themes = []
            while (n < weekCount){
                themes.push({
                    beginDate: moment(weekList[n].beginDate).valueOf(),
                    endDate:moment(weekList[n].endDate).valueOf(),
                    programId: plan.reviewProgramId,  // 教案类型id
                    week:  weekList[n].week,
                    weekName: weekList[n].weekName,
                    date: this.state.date.valueOf()
                });
                n++;
            }
            plan.children = themes;
            teachIndexMap[plan.reviewProgramId] = index;
        });
        const newTeachPlanArr = [...teachPlanList];
        teachConfigList.forEach((data) => {
            newTeachPlanArr[teachIndexMap[data.programId]].children[weekIndexMap[data.beginDate]] = data;
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
            classId: null,
        }, this.queryData)
    };
    /**
     * 渲染气泡插件
     */
    renderPop = (list:Array<any>) => {
        return (list || []).map((item:any, index:number) => (
            <div
                className='gym-teach-theme-popover'
                key={`${item.courseCode}_${index}`}
            >
                <div>
                    <span>{item.courseCode}:</span>
                    <span>{item.themeName}</span>
                </div>
            </div>
        ))
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
            classId: record.classId
        }, () => this.queryThemeList(record))
    };
    /**
     * 获取课程列表
     * @param record
     */
    queryThemeList = (record) => {
        const prarm = {
            id: record.programId ,
            currentCenterId:User.currentCenterId
        }
        getReviewDetailNew(prarm).then((res) => {
            this.setState({ optionList: res.reviewClassList})
        })
    };
    /**
     * 改变教案
     * @param value
     */
    changeLessonPlay = (value) => {
        this.setState({classId: value})
    };
    /**
     * 保存配置
     * @param record
     */
    saveThemeConfig = (record) => {
        setTeachPlanConfigNew(Object.assign({}, record, { currentCenterId: User.currentCenterId, date: this.state.date.valueOf(), classId: this.state.classId})).then(() => {
            this.setState({
                lessonIndex: null,
                weekIndex: null,
                optionList: [],
                classId: null,
            }, this.queryData)
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
            classId: null,
        },)
    };
    render() {
        const {
            date, weekList, configList, lessonIndex, weekIndex,
            optionList, classId
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
                                        <span>
                                            {item.programType}
                                            {item.programVersion ? `(${item.programVersion === "93001" ? '四代' : '五代'})` :''}
                                        </span>
                                    </div>
                                    {
                                        (item.children || []).map((item2,index2) =>
                                            (index === lessonIndex && index2 === weekIndex)
                                                ?(
                                                    <div
                                                        className="gym-teach-theme-content-col td"
                                                        key={`row-edit-${index}-td-${index2}`}
                                                    >
                                                        <Select
                                                            showSearch
                                                            filterOption={
                                                                (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                            value={classId}
                                                            onChange={this.changeLessonPlay}
                                                        >
                                                            {
                                                                optionList.map((option) =>
                                                                (
                                                                    <Option key={option.id} value={option.id}>
                                                                        <Tooltip title={option.className}>
                                                                            {option.className}
                                                                        </Tooltip>
                                                                    </Option>
                                                                ))
                                                            }
                                                        </Select>
                                                        <ConfirmCheck
                                                            button={<Tooltip placement="bottom" title={'保存'}>
                                                                <AntdIcon
                                                                    className='gym-teach-theme-content-col-icon'
                                                                    type='save'/>
                                                            </Tooltip>}
                                                            item={item2}
                                                            ensure={() => this.saveThemeConfig(item2)}
                                                            contentText={'更改教案会导致原教案对应的点评词条无法计数统计，请确认是否更改？'}
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
                                                        className="gym-teach-theme-content-col td"
                                                        onDoubleClick={() => this.exitTheme(item2, index, index2)}
                                                    >
                                                        <Popover placement="bottom" content={this.renderPop(item2.themeList)}>
                                                            <span>{item2.className}</span>
                                                        </Popover>
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

export {TeachThemesSetNew};
