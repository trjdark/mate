/**
 *Desc: 高级查询页面，自定义查询页面
 *User: Debby.Deng
 *Date: 2018/10/9,
 *Time: 下午3:44
 */
import * as React from "react";
import {Icon} from "../../../../component/icon";
import {Checkbox, Button, Form} from "antd";
import {Input} from "../../../../component/input";
import {form} from "../../../../../common/decorator/form";
import {connect} from "../../../../../common/decorator/connect";
import {
    selectAdvanceButtonId,
    selectAdvanceCenterCourse,
    selectAdvanceDistrict, selectAdvanceINS,
} from "../../../../../saga/selectors/customer/assignSelector";
import {
    getPackageList,
    getDistrictList,
    saveAdvanceBtn,
    deleteAdvanceBtn,
    getAdvanceInsList
} from "@redux-actions/customer/assignActions";
import {User} from "../../../../../common/beans/user";
import {Basic} from "../advanceSearchPart/basic";
import {Customer} from "../advanceSearchPart/customer";
import {Lesson} from "../advanceSearchPart/lesson";
import {Growth} from "../advanceSearchPart/growth";
import {Other} from "../advanceSearchPart/other";
import {Message} from "@/ui/component/message/message";
import {Map} from "immutable";
import {CommonUtils} from "@/common/utils/commonUtils";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import moment from 'moment';

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectGAOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GA', 'HGA']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GA", 'HGA']
    };
const selectGBOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GB', 'HGB']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GB", 'HGB']
    };



@form()
@connect((state: any) => ({
    districtList: selectAdvanceDistrict(state),
    centerCourseList: selectAdvanceCenterCourse(state),
    buttonId: selectAdvanceButtonId(state),
    insList: selectAdvanceINS(state),
    gaList: selectTotalEmployeeList(state, selectGAOption),
    gbList: selectTotalEmployeeList(state, selectGBOption),
}), {getDistrictList, getPackageList, saveAdvanceBtn, deleteAdvanceBtn, getAdvanceInsList})
class AdvancedSearch extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            advanceSearchName: this.props.queryName,
            isAutoSave: false,
        };
    }

    componentDidMount() {
        const {getDistrictList, getPackageList, getAdvanceInsList} = this.props;
        const params = {currentCenterId: User.currentCenterId};
        getDistrictList(params);
        getPackageList(params);
        getAdvanceInsList(params);
    }

    resetSearchInfo = () => {//清空列表
        const {form} = this.props;
        form.resetFields();
    };
    setAdvanceSearchName = (e) => {//设置自定义查询名称
        this.setState({advanceSearchName: e.target.value});
    };

    getCondition(formValue) {//解析高级查询form参数为后端要求condition
        let condition = {basic: {}, customer: {}, lesson: {}, growth: {}, other: {}};
        for (let field in formValue) {
            const filedArr = field.split('-');
            const label = filedArr[0];
            const key = filedArr[1];
            const type = filedArr[2];//rangePicker类型
            if (type === 'time') {//rangePicker 日期类型
                condition[label][`${key}Begin`] = formValue[field][0] ? formValue[field][0].startOf('day').valueOf() : null;
                condition[label][`${key}End`] = formValue[field][1] ? formValue[field][1].endOf('day').valueOf() : null;
            } else if (type === 'singleTime') {//单个Moment类型日期
                formValue[field] && (condition[label][key] = formValue[field].format('YYYY-MM'));
            } else {
                condition[label][key] = formValue[field];
            }
        }
        return condition;
    }

    setAutoSave = (e) => {
        this.setState({isAutoSave: e.target.value});
    };
    saveAdvanceSearch = (callback?) => {//保存自定义查询
        const name = this.state.advanceSearchName;
        const {saveAdvanceBtn, form, id} = this.props;
        const condition = this.getCondition(form.getFieldsValue());
        if (this.isEmpty(condition)) {
            return;
        }
        if (!name) {
            Message.error('自定义查询名称不能为空');
            return false;
        }
        const params = {
            condition: condition,
            currentCenterId: User.currentCenterId,
            id: id,
            name: name
        };
        saveAdvanceBtn(params, callback);
        this.props.onHideSearch();
    };
    deleteAdvanceSearch = () => {
        const {id, deleteAdvanceBtn} = this.props;
        const params = {
            id: id,
            currentCenterId: User.currentCenterId
        };
        deleteAdvanceBtn(params);
        this.props.onHideSearch()
    };
    isEmpty = (condition) => {
        const newValues = Map(CommonUtils.PlainObj(condition))
        if (!newValues.size) {//查询条件为空
            Message.error('查询条件不能为空！');
            return true;
        }
        return false;
    };
    handleSearch = () => {//点击查询按钮
        let {form, onSearch, id} = this.props;
        const {isAutoSave} = this.state;
        const condition = this.getCondition(form.getFieldsValue());
        if (this.isEmpty(condition)) {
            return;
        }
        if (isAutoSave) {
            const name = this.state.advanceSearchName;
            if (!name) {
                Message.error('自定义查询名称不能为空');
                return false;
            }
            this.saveAdvanceSearch(() => {
                onSearch(condition, !id)
            });
            return false;
        }
        onSearch(condition);
    };

    render() {
        let {form, condition, districtList, id, insList, gaList, gbList, centerCourseList} = this.props;
        if (!id) {//自定义查询
            condition = {};
        }
        const queryId = id;
        const closeIcon = 'shouqi', closeWord = '收起', expandIcon = 'zhankai', expandWord = '展开';
        let {basic = {}, customer = {}, lesson = {}, growth = {}, other = {}} = condition;

        return (
            <div className='bgWhite gym-advanced-search' style={{height:'500px',overflowY:'scroll'}}>
                <div className='gym-advanced-search-border'>
                    <p><Icon className='cDefault size20' type='biaoti'/>
                        <span className='size18'>设置筛选条件</span>
                        <button className='gym-button-wBlue gym-button-xs fr mr10'
                                onClick={this.resetSearchInfo}>
                            清空条件
                        </button>
                    </p>
                    <Form>
                        <Basic basic={basic} form={form} districtList={districtList}
                               icon={closeIcon} isExpand={true} word={closeWord}
                               title='基础信息'
                        />
                        <Customer customer={customer} form={form} title='客户获取'
                                  icon={expandIcon} isExpand={false} word={expandWord}
                                  gbList={gbList} cpackageList={centerCourseList}
                        />
                        <Lesson form={form} icon={expandIcon} isExpand={false} word={expandWord}
                                lesson={lesson} title={'上课情况'}/>
                        <Growth growth={growth} form={form}
                                icon={expandIcon} isExpand={false} word={expandWord}
                                gbList={gbList} gaList={gaList} insList={insList}
                                title='客户成长'/>
                        <Other form={form} icon={expandIcon} word={expandWord}
                               isExpand={false} other={other} title='其他信息'/>
                        <div className='gym-advanced-search-customized'>
                            <Checkbox defaultChecked={this.state.isAutoSave}
                                      onChange={this.setAutoSave}
                                      style={{color: '#000'}}>保存到自定义查询</Checkbox>
                            <label className='ml30 mr10'>自定义名称</label>
                            <Input value={this.state.advanceSearchName} onChange={this.setAdvanceSearchName}
                                   placeholder='自定义搜索'/>
                            <div className='fr'>
                                <button onClick={this.saveAdvanceSearch}
                                        className='gym-button-default gym-button-xs'>保存
                                </button>
                                {
                                    queryId && <button onClick={this.deleteAdvanceSearch}
                                                       className='gym-button-default gym-button-xs'>删除</button>
                                }
                            </div>

                        </div>
                        <div className='text-c mt30'>
                            <Button htmlType='submit'
                                    className='gym-button-xs gym-button-blue mr20'
                                    onClick={this.handleSearch}>查询</Button>
                            <Button className='gym-button-xs gym-button-wBlue'
                                    onClick={() => {
                                        this.props.onHideSearch()
                                    }}
                            >取消</Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }

}

export {AdvancedSearch}
