/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/2/25
 * Time: 下午3:44
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, message} from 'antd';
import {PageTitle} from "@/ui/component/pageTitle";
import {ValidateRegEx} from "@/common/utils/validate";
import {form} from "@/common/decorator/form";
import {MonthInput} from "@/ui/component/datePicker";
import {InputNumber} from "@/ui/component/input";
import {GbAchievementList} from "@/ui/pages/setting/centerAchievementEdit/part/gbAchievementList";
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {pattern} from "@/ui/pages/setting/centerAchievementEdit";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {CancelButton} from "@/ui/component/cancelButton";
import {User} from "@/common/beans/user";
import {addCenterPerformance, editCenterPerformance, getCenterPerformanceDetail} from "@redux-actions/setting/performanceIncomeActions";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const {Item} = Form;
const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])



// 在职GB员工
const selectOption = isPostTransRole
    ? {
        workingStatus: "1",
        roleList: ["GA","HGA"]
    }
    : {
        workingStatus: "1",
        postName: ["GA","HGA"]
    };

@form()

@connect((state) => ({
    gaList: selectTotalEmployeeList(state, selectOption)
}))
class PerformanceIncomeDetail extends React.Component<any, any> {
    breadCrumbRoutes = [
        { name: '设置',path: '', link: '#', id: 'setting'},
        { name: '运营管理' },
        { name: '约课指标设置' }
    ];
    id:string;
    constructor(props) {
        super(props)
        if(CommonUtils.hasParams(props)){
            this.id = CommonUtils.parse(props).id
        }
        this.state = {
            date: moment(),
            performanceStaffList: [    // ga业绩
                {
                    staffId: '',
                    personalTargetSales: 0,
                    label: Date.now(),
                }
            ],
            gatherNum: 0

        }
    }
    componentDidMount(){
        if(this.id){
            const data = {
                currentCenterId: User.currentCenterId,
                id:this.id,
            };
            getCenterPerformanceDetail(data).then(res => {
                const {date, id, performanceStaffList, targetSales} = res;
                this.setState({
                    id,  targetSales,
                    performanceStaffList: performanceStaffList.map(item => Object.assign({}, item, {
                        personalTargetSales: item.personalPredetermine
                    })),
                    date: moment(date),
                    }, () => {
                        this.calculateTotalNum();
                    }
                )
            })
        }
    }
    /*选择中心业绩时间*/
    handleDateChange = value => {
        this.setState({
            date: value,
        });
    };
    /*处理GB业绩目标的变化*/
    handleGbAchieveChange = (value, index) => {
        const performanceStaffList = cloneDeep(this.state.performanceStaffList);
        performanceStaffList[index].personalTargetSales = value;
        this.setGbAchieveAndCalculate(performanceStaffList);
    };
    /*处理中心业绩目标的变化*/
    handleCenterAchieveChange = value => {
        this.setState({
            targetSales: value
        })
    };
    /* 计算汇总数据 */
    calculateTotalNum = () => {
        const {performanceStaffList} = this.state;
        let numList = performanceStaffList.map(item => item.personalTargetSales || 0);
        this.setState({
            gatherNum: SafeCalculate.add(...numList)
        });
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
    /*选择GB*/
    handleSelectGb = (value, index) => {
        const performanceStaffList = cloneDeep(this.state.performanceStaffList);
        performanceStaffList[index].staffId = value;
        this.setState({performanceStaffList})
    };
    /*提交*/
    handleSubmit = (e) => {
        this.props.form.validateFields((err) => {
            if (!err) {
                // 所有验证通过后，提交表单
                const {date, targetSales, performanceStaffList, gatherNum, id} = this.state;
                // 去除performanceStaffList中不需要的属性
                const filterPerformanceStaffList = performanceStaffList.map(item => {
                    const {id, personalTargetSales, staffId} = item;
                    return {
                        id,
                        personalPredetermine:personalTargetSales,
                        staffId,
                    }
                });

                // 如果汇总数据大于中心业绩目标，提示错误并阻止提交
                if (gatherNum > targetSales) {
                    message.error('个人目标预定量大于中心月目标预定量，请重新维护');
                    return;
                }

                const params = {
                    currentCenterId: User.currentCenterId,
                    id,
                    date: date.valueOf(),
                    targetSales,
                    predetermineStaffList: filterPerformanceStaffList,
                };
                if(id){
                    // 如果id存在，执行编辑操作
                    editCenterPerformance(params).then(res => {
                        message.success('编辑中心预定量成功');
                        this.props.history.goBack();
                    });
                }else{
                    // 如果id不存在，执行新建操作
                    addCenterPerformance(params).then(res => {
                        message.success('设置中心预定量成功');
                        this.props.history.goBack();
                    });
                }
            }
        })
    }
    render() {
        const {form, gaList} = this.props;
        const {getFieldDecorator} = form;
        const {date, performanceStaffList, gatherNum, targetSales} = this.state;
        const selectIdList = performanceStaffList.map((item:any) => item.staffId);
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <Form className="page-wrap gym-center-achievement" layout="inline">
                    <PageTitle title="约课指标设置"/>
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
                        <Item label="月目标预定量">
                            {
                                getFieldDecorator('targetSales', {
                                    initialValue: targetSales,
                                    rules: [
                                        {required: true, message: '月目标预定量不能为空'},
                                        {pattern: ValidateRegEx.不含零正整数, message: '请输入大于0的正整数'}
                                    ]
                                })(
                                    <InputNumber min={0} maxLength={11} precision={0} onChange={this.handleCenterAchieveChange}/>
                                )
                            }
                        </Item>
                    </div>
                    <PageTitle title="GA每月预定量分配"/>
                    {
                        /*生成gb业绩分配列表*/
                        performanceStaffList.map((item, index) => {
                            const {staffId, label} = item;
                            return (
                                <GbAchievementList
                                    key={staffId ? staffId : label}
                                    form={form}
                                    value={Object.assign({}, item, {personalTargetSales: item.personalPredetermine})}
                                    index={index}
                                    labels={['GA', '个人目标预定量']}
                                    options={gaList}
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
        )
    }
}

export {PerformanceIncomeDetail}
