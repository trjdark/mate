/**
 * desc: 中心业绩目标设置表单
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/3/12
 * Time: 上午10:38
 */
import React, {Component, Fragment} from 'react';
import {Form, message} from 'antd';
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {MonthInput} from "@/ui/component/datePicker";
import {InputNumber} from "@/ui/component/input";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {CancelButton} from "@/ui/component/cancelButton";
import {GbAchievementList} from "./part/gbAchievementList";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {
    getAchievementDetail,
    addAchievement,
    editAchievement,
} from "@redux-actions/setting/centerAchievement";
import './style/index.scss';
import {User} from "@/common/beans/user";
import {ValidateRegEx} from "@/common/utils/validate";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {FUNC} from "@/ui/pages/setting/enum/functions";
/*解构出二级组件,方便调用*/
const {Item} = Form;

export const pattern = /\B(?=(\d{3})+(?!\d))/g;   // 千分位


const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])

// 在职GB员工
const selectOption = isPostTransRole
    ? {
        workingStatus: "1",
        roleList: ["GB","HGB"]
    }
    :{
        workingStatus: "1",
        postName: ["GB","HGB"]
    };

@connect((state) => ({
    gbList: selectTotalEmployeeList(state, selectOption)
}))
class CenterAchievementEdit extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbRoutes: [
                {
                    name: '设置'
                },
                {
                    name: '运营管理'
                },
                {
                    name: '销售指标设置'
                }
            ],
            date: moment(),   // 年月
            targetSales: 0,   // 中心目标业绩
            performanceStaffList: [    // gb业绩
                {
                    staffId: '',
                    personalTargetSales: 0,
                    label: Date.now(),
                }
            ],
            initialGbList: [],      // Gb列表
            gatherNum: 0,   // 汇总数据
            id: undefined,  // 该条中心业绩目标的id
            isChange: false
        }
    }

    componentDidMount() {
        this.getCenterAchievementDetail();
    }
    static getDerivedStateFromProps(props, state) {
        if(!state.isChange && (Array.prototype.isPrototypeOf(props.gbList) && props.gbList.length !== 0)){
            return {
                isChange: true,
                initialGbList: props.gbList
            }
        }
        return null;
    }
    /*判断url是否有参数，有参数的情况下，本页面为编辑状态，要先请求数据详情*/
    getCenterAchievementDetail = () => {
        const props = this.props;
        const {hasParams, parse} = CommonUtils;
        if (hasParams(props)) {
            const data = {
                currentCenterId: User.currentCenterId,
                id: parse(props).id,
            };
            getAchievementDetail(data).then(res => {
                const {date, id, performanceStaffList, targetSales} = res;
                this.setState(
                    {
                        id, performanceStaffList, targetSales,
                        date: moment(date),
                    }, () => {
                        this.calculateTotalNum();
                    }
                )
            })
        }
    };

    /*选择中心业绩时间*/
    handleDateChange = value => {
        this.setState({
            date: value,
        });
    };
    /*处理中心业绩目标的变化*/
    handleCenterAchieveChange = value => {
        this.setState({
            targetSales: value
        })
    };
    /*选择GB*/
    handleSelectGb = (value, index) => {
        const performanceStaffList = cloneDeep(this.state.performanceStaffList);
        performanceStaffList[index].staffId = value;
        this.setState({performanceStaffList})
    };

    /*处理GB业绩目标的变化*/
    handleGbAchieveChange = (value, index) => {
        const performanceStaffList = cloneDeep(this.state.performanceStaffList);
        performanceStaffList[index].personalTargetSales = value;
        this.setGbAchieveAndCalculate(performanceStaffList);
    };

    /* 计算汇总数据 */
    calculateTotalNum = () => {
        const {performanceStaffList} = this.state;
        let numList = performanceStaffList.map(item => item.personalTargetSales || 0);
        this.setState({
            gatherNum: SafeCalculate.add(...numList)
        });
    };

    /*添加一条GB业绩*/
    addGbAchievement = () => {
        const performanceStaffList = cloneDeep(this.state.performanceStaffList);
        performanceStaffList.push({
            staffId: '',
            personalTargetSales: 0,
            label: Date.now(),
        });
        this.setState({
            performanceStaffList
        })
    };

    /*删除一条GB业绩*/
    deleteGbAchievement = (index) => {
        const {performanceStaffList} = this.state;
        if (performanceStaffList.length <= 1) {
            message.warning('请至少保持一条数据');
            return;
        }
        const performanceStaffListClone = cloneDeep(performanceStaffList);
        performanceStaffListClone.splice(index, 1);
        // 删除gb后，重新计算汇总数据，并重新计算可选的gb列表
        this.setGbAchieveAndCalculate(performanceStaffListClone);
    };

    /*设置performanceStaffList列表后，重新计算汇总数据, 并执行其他传入的计算*/
    setGbAchieveAndCalculate = (list, cb = null) => {
        this.setState(
            {
                performanceStaffList: list,
            },
            () => {
                this.calculateTotalNum();
                if (typeof cb === 'function') {
                    cb();
                }
            }
        )
    };

    /*提交*/
    handleSubmit = (e) => {
        this.props.form.validateFields((err) => {
            if (!err) {
                // 所有验证通过后，提交表单
                const {
                    date, targetSales, performanceStaffList, id,
                } = this.state;

                // 去除performanceStaffList中不需要的属性
                const filterPerformanceStaffList = performanceStaffList.map(item => {
                    const {id, personalTargetSales, staffId} = item;
                    return {
                        id,
                        personalTargetSales,
                        staffId,
                    }
                });

                const params = {
                    currentCenterId: User.currentCenterId,
                    id,
                    date: date.valueOf(),
                    targetSales,
                    performanceStaffList: filterPerformanceStaffList,
                };
                if(id){
                    // 如果id存在，执行编辑操作
                    editAchievement(params).then(res => {
                        message.success('编辑中心业绩成功');
                        this.props.history.goBack();
                    });
                }else{
                    // 如果id不存在，执行新建操作
                    addAchievement(params).then(res => {
                        message.success('设置中心业绩成功');
                        this.props.history.goBack();
                    });
                }
            }
        })
    }
    render() {
        const {breadCrumbRoutes, performanceStaffList, gatherNum, targetSales, date} = this.state;
        const {form, gbList} = this.props;
        const {getFieldDecorator} = form;
        const selectIdList = performanceStaffList.map((item:any) => item.staffId);
        return (
            <Fragment>
                <BreadCrumb routes={breadCrumbRoutes}/>
                <Form className="page-wrap gym-center-achievement" layout="inline">
                    <PageTitle title="中心业绩设置"/>
                    {/*中心业绩设置*/}
                    <div className="gym-center-achievement-center-set">
                        <Item label="年月" className="gym-center-achievement-center-set-wrap">
                            {
                                getFieldDecorator('date', {
                                    initialValue: date,
                                    rules: [
                                        {required: true, message: '年月不能为空'},
                                    ]
                                })(
                                    <MonthInput onChange={this.handleDateChange}/>
                                )
                            }
                        </Item>
                        <Item label="月目标销售额">
                            {
                                getFieldDecorator('targetSales', {
                                    initialValue: targetSales,
                                    rules: [
                                        {required: true, message: '月目标销售额不能为空'},
                                        {pattern: ValidateRegEx.不含零正整数, message: '请输入大于0的正整数'}
                                    ]
                                })(
                                    <InputNumber min={0} maxLength={11} precision={0} onChange={this.handleCenterAchieveChange}/>
                                )
                            }
                        </Item>
                    </div>

                    <PageTitle title="GB每月业绩分配"/>
                    {
                        /*生成gb业绩分配列表*/
                        performanceStaffList.map((item, index) => {
                            const {staffId, label} = item;
                            return (
                                <GbAchievementList
                                    key={staffId ? staffId : label}
                                    form={form}
                                    value={item}
                                    labels={['GB', "个人目标销售额"]}
                                    index={index}
                                    options={gbList}
                                    selectIdList={selectIdList}
                                    handleAchieveChange={this.handleGbAchieveChange}
                                    handleGbChange={this.handleSelectGb}
                                    deleteItem={this.deleteGbAchievement}
                                />
                            )
                        })
                    }
                    <p className="gym-center-achievement-gather">汇总: {String(gatherNum).replace(pattern, ',')}</p>
                    <button
                        className="gym-radius-btn gym-button-default"
                        onClick={this.addGbAchievement}
                    >
                        + 添加
                    </button>
                    <CancelButton handleSubmit={this.handleSubmit} form={form}/>
                </Form>
            </Fragment>
        );
    }
}

export default Form.create()(CenterAchievementEdit);
