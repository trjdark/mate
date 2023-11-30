/**
 * Desc: 选择课程包
 * User: Vicky.Yu
 * Date: 2018/12/17,
 * Time: 上午10:10
 */
import React, {Component} from 'react';
import {message, Select} from 'antd';
import {connect} from 'react-redux';
import {Form} from "antd";
import {Fetch} from "@/service/fetch";
import {ContractApi} from "@/api/contractApi";
import {setSelectedCourse} from "@/saga/actions/activity/activityDetail";
import {User} from "@/common/beans/user";
import moment from 'moment';
import './index.scss'

const {Option} = Select;

class ChoosePackage extends Component <any, any> {
    constructor(props) {
        super(props);
        this.state = {
            courseList: [],
            currentCenterId: User.currentCenterId
        };
        this.getContract = this.getContract.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
    }

    render() {
        let {selectedBaby, form, selectedCourse=[], activityPayModeEnum, payMode, applicationConsumption} = this.props;
        const {getFieldDecorator} = form;
        const {courseList} = this.state;
        const {usableCourseNum} = selectedCourse;
        selectedBaby = Array.isArray(selectedBaby) ? (selectedBaby[0] || {}) : selectedBaby;
        const {babyName} = selectedBaby;
        const allowBusinessSourceList = User.businessSource.map(item => item.businessSourceCode)
        const allowCourseList = courseList.filter((item:any) => allowBusinessSourceList.includes(item.businessSource));
        // 旧需求
        return (
            <div style={{width: '100%'}}>
                <div className="gym-activity-plan-table gym-radius">
                    <table className="joined-member-table">
                        <tbody>
                        <tr>
                            <td>宝宝姓名</td>
                            <td>{babyName}</td>
                        </tr>
                        <tr>
                            <td>课程包</td>
                            <td>
                                {/*{*/}
                                    {/*User.isSigmaCenter.status === true &&*/}
                                    {/*getFieldDecorator('selectedCourse', {*/}
                                        {/*rules: [*/}
                                            {/*{ required: true, message: '请选择' }*/}
                                        {/*],*/}
                                        {/*initialValue: courseList[0] ? courseList[0].contractId : undefined*/}

                                    {/*})(*/}
                                        {/*<Select style={{width: 350}} onChange={this.handleCourseChange}>*/}
                                            {/*{*/}
                                                {/*courseList.map((item:any) =>*/}
                                                {/*<Option value={item.contractId} key={item.contractId}>*/}
                                                    {/*{`${item.packageName}（${moment(item.effectiveTime).format('YYYY/MM/DD')}~${moment(item.endTime).format('YYYY/MM/DD')}）`}*/}
                                                {/*</Option>*/}
                                                {/*)*/}
                                            {/*}*/}
                                        {/*</Select>*/}
                                    {/*)*/}
                                {/*}*/}
                                {/*{*/}
                                    {/*User.isSigmaCenter.status=== false &&*/}
                                    {/*getFieldDecorator('selectedCourse', {*/}
                                        {/*rules: [*/}
                                            {/*{ required: true, message: '请选择' }*/}
                                        {/*],*/}
                                        {/*initialValue: gymboCourseList[0] ? gymboCourseList[0].contractId : undefined*/}

                                    {/*})(*/}
                                        {/*<Select style={{ width: 350 }} onChange={this.handleCourseChange}>*/}
                                            {/*{*/}
                                                {/*gymboCourseList.map((item: any) =>*/}
                                                    {/*<Option value={item.contractId} key={item.contractId}>*/}
                                                        {/*{`${item.packageName}（${moment(item.effectiveTime).format('YYYY/MM/DD')}~${moment(item.endTime).format('YYYY/MM/DD')}）`}*/}
                                                    {/*</Option>*/}
                                                {/*)*/}
                                            {/*}*/}
                                        {/*</Select>*/}
                                    {/*)*/}
                                {/*}*/}
                                {
                                    getFieldDecorator('selectedCourse', {
                                        rules: [
                                            { required: true, message: '请选择' }
                                        ],
                                        initialValue: allowCourseList[0] ? allowCourseList[0].contractId : undefined

                                    })(
                                        <Select style={{width: 350}} onChange={this.handleCourseChange}>
                                            {
                                                allowCourseList.map((item:any) =>
                                                    <Option value={item.contractId} key={item.contractId}>
                                                        {`${item.packageName}（${moment(item.effectiveTime).format('YYYY/MM/DD')}~${moment(item.endTime).format('YYYY/MM/DD')}）`}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </td>
                        </tr>
                        {
                                courseList.length > 0 &&
                            <tr>
                                <td>可选课时</td>
                                <td>
                                    <span className="enroll-emphasize-text">
                                        {usableCourseNum}
                                </span>
                                </td>
                            </tr>
                        }
                        {
                                courseList.length===0 &&
                            <tr>
                                <td>可选课时</td>
                                <td>
                                    <span className="enroll-emphasize-text">
                                        0
                                </span>
                                </td>
                            </tr>
                        }
                        </tbody>
                    </table>
                </div>
                {
                    // 当有扣课并且可选课数小于扣课数,显示警告
                    ((payMode === activityPayModeEnum.仅扣课 || payMode === activityPayModeEnum.扣课且付费 || payMode === activityPayModeEnum.扣课或付费) && (usableCourseNum < applicationConsumption))
                        ? (
                            <p className="choose-package-error">可选课时不足了哦，当前课时为<span>{usableCourseNum}</span>，
                                需要<span>{applicationConsumption}</span>课时才能进行此次操作哦！
                            </p>
                        ) : null
                }
            </div>

        )

    }

    componentDidMount() {
        this.getContract();
    }

    handleCourseChange(value) {
        const {courseList} = this.state;
        courseList.forEach(item => {
            const {contractId} = item;
            if (contractId === value) {
                this.props.setSelectedCourse(item);
            }
        });
    }

    getContract() {
        let { selectedBaby, selectedCourse} = this.props;
        selectedBaby = Array.isArray(selectedBaby) ? (selectedBaby[0]||{}) : selectedBaby;
        if (Object.keys(selectedBaby).length > 0) {
            // 已选择宝宝，请求宝宝的合同数据
            const {currentCenterId} = this.state;
            const params = {
                url: ContractApi.获取Leads下的所有合同,
                data: {
                    currentCenterId,
                    leadsId: selectedBaby.leadsId
                }
            };
            Fetch.post(params).then(res => {
                // 过滤西格玛课包 （11.5改动 全部课包展示）
                const allowBusinessSourceList = User.businessSource.map(item => item.businessSourceCode)
                const arr = res.filter((item: any) => allowBusinessSourceList.includes(item.businessSource));
                if (Array.isArray(res) && res.length > 0) {
                    // 宝宝存在合同，默认选中第一项合同
                    this.setState({
                        courseList: res
                    });
                    if(Object.keys(selectedCourse).length === 0){
                        this.props.setSelectedCourse(arr[0]);
                    }
                } else {
                    message.error('该宝宝没有签订任何合同');
                }
            })
        } else {
            message.error('请先选择一个宝宝');
        }
    }
}

const mapStateToProps = state => {
    const {
        types,
        selectedCourse,   // 报名时选中的课程包
        payMode,          // 付费方式
        applicationConsumption,     // 扣课数

    } = state.activityDetail;
    const {
        activityPayModeEnum,    // 活动付费方式枚举
    } = types;
    return {
        selectedCourse,
        payMode,
        activityPayModeEnum,
        applicationConsumption,
    }
};

const mapDispatchProps = dispatch => ({
    setSelectedCourse(data) {
        dispatch(setSelectedCourse(data));
    }
});

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(ChoosePackage));
