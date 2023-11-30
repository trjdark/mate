/**
 * Desc: 查询课程表
 * User: dave.zhang
 */
import React from 'react'
import {Row, Col, Button, Form, Checkbox, Modal} from 'antd';
import {Select, Option} from "@/ui/component/select";
import {ReserveRow} from '../../component/selectCourseRow';
import {form} from "@/common/decorator/form";
import {
    getClassScheduleList,
    getCourseType,
    getTeachContractList,
    previewScheduleList
} from '@/redux-actions/teaching/chooseLesson';
import {User} from "@/common/beans/user";
import {promoteType} from '../../enum/selectCourse';
import moment from 'moment';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const formatter = 'YYYY-MM-DD';

@form()
class Search extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            courseTypeList: [],        // 课程类型列表
            contractList: [],          // 合同列表
            checkAll: true,            // 标记全选
            indeterminate: false,      // 标记课程类型有选中但没有全选的状态
            checkedList: [],           // 选中的课程类型id列表
            changePkgVisible: false,   // 切换课程提示弹层开关
            remainCourseNum: 0,        // 课程包剩余课时数
        }
    }
    componentDidMount() {
        Promise.all([
            // 获取课程类型
            getCourseType({currentCenterId: User.currentCenterId}),
            // 获取课程包
            getTeachContractList({
                currentCenterId: User.currentCenterId,
                leadsId: this.props.leadsId
            })
        ]).then((res) => {
            const [courseType, contractList] = res;
            const allowSourceList = User.businessSource.map(item => item.businessSourceCode);
            this.setState({
                courseTypeList: courseType,
                allCourseTypeList: courseType
                    .filter(item => allowSourceList.includes(item.businessSource))
                    .map(item => item.courseTypeCode),
                checkedList: courseType.map(i => i.courseTypeCode),
                contractList: contractList
            })
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, getPromoteType} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const {contractId, promoteType} = values;
                const {babyInfo, leadsId, hasContract, setTableList} = this.props;
                const {checkedList, courseTypeList, contractList} = this.state;
                const selectionTableWrapper:HTMLElement = document.querySelector('.selection-table-wrapper');   // 课程表
                const gymContentWrap = document.querySelector('#gym-content-wrap > div');           // 内容区的包装元素
                let params = {
                    babyId: babyInfo.id,
                    contractId,
                    leadsId,
                    promoteType,
                    currentCenterId: User.currentCenterId,
                    courseTypeIdList: checkedList.map(
                        i => courseTypeList.filter(j => j.courseTypeCode === i)[0].id
                    )
                };

                // 把选课类型传导到父组件
                getPromoteType(promoteType);
                // 根据有没有合同调用不同接口：
                if (hasContract) {
                    getClassScheduleList(params).then(res => {
                        setTableList({
                            list: res,
                            currContract: contractList.filter(
                                _c => _c.contractId === values.contractId
                            )[0]
                        });
                        gymContentWrap.scrollTop = selectionTableWrapper.offsetTop; // 课程表滚动至浏览器顶端
                    })
                } else {
                    previewScheduleList(params).then(res => {
                        setTableList({
                            list: res,
                            currContract: undefined
                        })
                    });
                    gymContentWrap.scrollTop = selectionTableWrapper.offsetTop;      // 课程表滚动至浏览器顶端
                }
            }
        });
    };

    /*选择课程类型
    * @params checkedList 被选中的课程类型id数组
    * */
    onChange = (checkedList) => {
        const {allCourseTypeList} = this.state;
        this.setState({
            checkedList,
            indeterminate: checkedList.length && (checkedList.length < allCourseTypeList.length),
            checkAll: checkedList.length === allCourseTypeList.length,
        });
    };

    /*全选和全不选课程类型*/
    onCheckAllChange = (e) => {
        const {allCourseTypeList} = this.state;
        const checked = e.target.checked;
        this.setState({
            checkedList: checked ? allCourseTypeList : [],
            indeterminate: false,
            checkAll: checked,
        });
    };
    /**
     * 切换课程包
     */
    handleChangePkg = (contractId:string) => {
        const {contractList} = this.state;
        const selectContract = contractList.filter((item:any) => item.contractId === contractId)[0];
        this.setState({
            changePkgVisible: true,
            remainCourseNum: selectContract.remainingCourseNum
        })

    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const {babyInfo, hasContract} = this.props;
        const {
            contractList, indeterminate, checkAll,
            checkedList, changePkgVisible,remainCourseNum, allCourseTypeList
        } = this.state;
        const allowSourceList = User.businessSource.map(item => item.businessSourceCode);
        // 允许展示的合同列表
        const allowContractList = contractList.filter(item => allowSourceList.includes(item.businessSource));
        return (
            <div className="selection-search-wrapper shadow">
                <Row className="row-name">
                    <Col span={12} className="name">
                        宝宝姓名：{babyInfo.babyName}
                    </Col>
                    <Col span={12} className="month">
                        月龄：{babyInfo.monthValue}
                    </Col>
                </Row>
                {/*{*/}
                    {/*hasContract && User.isSigmaCenter.status===true &&*/}
                    {/*<ReserveRow*/}
                        {/*name="课程包"*/}
                        {/*render={*/}
                            {/*() => (*/}
                                {/*<FormItem>*/}
                                    {/*{*/}
                                        {/*getFieldDecorator(`contractId`, {*/}
                                            {/*rules: [],*/}
                                            {/*initialValue: contractList[0] ? contractList[0].contractId : undefined*/}
                                        {/*})(*/}
                                            {/*<Select style={{width: 390}} onChange={(value:string) => this.handleChangePkg(value)}>*/}
                                                {/*{*/}
                                                    {/*contractList.map(item =>*/}
                                                        {/*<Option value={item.contractId} key={item.contractId}>*/}
                                                            {/*{item.packageName}*/}
                                                            {/*(*/}
                                                            {/*{moment(item.effectiveTime).format(formatter)}*/}
                                                            {/*~*/}
                                                            {/*{moment(item.endTime).format(formatter)}*/}
                                                            {/*)*/}
                                                        {/*</Option>*/}
                                                    {/*)*/}
                                                {/*}*/}
                                            {/*</Select>*/}
                                        {/*)*/}
                                    {/*}*/}
                                {/*</FormItem>*/}
                            {/*)*/}
                        {/*}*/}
                    {/*/>*/}
                {/*}*/}
                {/*{*/}
                    {/*hasContract && User.isSigmaCenter.status===false &&*/}
                    {/*<ReserveRow*/}
                        {/*name="课程包"*/}
                        {/*render={*/}
                            {/*() => (*/}
                                {/*<FormItem>*/}
                                    {/*{*/}
                                        {/*getFieldDecorator(`contractId`, {*/}
                                            {/*rules: [],*/}
                                            {/*initialValue: gymContractList[0] ? gymContractList[0].contractId : undefined*/}
                                        {/*})(*/}
                                            {/*<Select style={{width: 300}} onChange={(value:string) => this.handleChangePkg(value)}>*/}
                                                {/*{*/}
                                                    {/*gymContractList.map(item =>*/}
                                                        {/*<Option value={item.contractId} key={item.contractId}>*/}
                                                            {/*{item.packageName}*/}
                                                            {/*(*/}
                                                            {/*{moment(item.effectiveTime).format(formatter)}*/}
                                                            {/*~*/}
                                                            {/*{moment(item.endTime).format(formatter)}*/}
                                                            {/*)*/}
                                                        {/*</Option>*/}
                                                    {/*)*/}
                                                {/*}*/}
                                            {/*</Select>*/}
                                        {/*)*/}
                                    {/*}*/}
                                {/*</FormItem>*/}
                            {/*)*/}
                        {/*}*/}
                    {/*/>*/}
                {/*}*/}
                {
                    hasContract &&
                    <ReserveRow
                        name="课程包"
                        render={
                            () =>
                                (
                                    <FormItem>
                                        {
                                            getFieldDecorator(`contractId`, {
                                                rules: [],
                                                initialValue: allowContractList[0] ? allowContractList[0].contractId : undefined
                                            })(
                                                <Select style={{width: 300}} onChange={(value:string) => this.handleChangePkg(value)}>
                                                    {
                                                        allowContractList.map(item =>
                                                            <Option value={item.contractId} key={item.contractId}>
                                                                {item.packageName}
                                                                ({moment(item.effectiveTime).format(formatter)}~{moment(item.endTime).format(formatter)})
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                )
                        }
                    />
                }
                {/*{*/}
                    {/*User.isSigmaCenter.status === true &&*/}
                    {/*<ReserveRow*/}
                        {/*name="课程类型"*/}
                        {/*render={*/}
                            {/*() => (*/}
                                {/*<div>*/}
                                    {/*<Checkbox*/}
                                        {/*indeterminate={indeterminate}*/}
                                        {/*onChange={this.onCheckAllChange}*/}
                                        {/*checked={checkAll}*/}
                                    {/*>*/}
                                        {/*不限*/}
                                    {/*</Checkbox>*/}
                                    {/*<CheckboxGroup*/}
                                        {/*options={plainOptions}*/}
                                        {/*value={checkedList}*/}
                                        {/*onChange={this.onChange}*/}
                                    {/*/>*/}
                                {/*</div>*/}
                            {/*)*/}
                        {/*}*/}
                    {/*/>*/}
                {/*}*/}
                {/*{*/}
                    {/*User.isSigmaCenter.status === false &&*/}
                    {/*<ReserveRow*/}
                        {/*name="课程类型"*/}
                        {/*render={*/}
                            {/*() => (*/}
                                {/*<div>*/}
                                    {/*<Checkbox*/}
                                        {/*indeterminate={indeterminate}*/}
                                        {/*onChange={this.onCheckAllChange}*/}
                                        {/*checked={checkAll}*/}
                                    {/*>*/}
                                        {/*不限*/}
                                    {/*</Checkbox>*/}
                                    {/*<CheckboxGroup*/}
                                        {/*options={gymOptions}*/}
                                        {/*value={checkedList}*/}
                                        {/*onChange={this.onChange}*/}
                                    {/*/>*/}
                                {/*</div>*/}
                            {/*)*/}
                        {/*}*/}
                    {/*/>*/}
                {/*}*/}
                <ReserveRow
                    name="课程类型"
                    render={
                        () => (
                            <div>
                                <Checkbox
                                    indeterminate={indeterminate}
                                    onChange={this.onCheckAllChange}
                                    checked={checkAll}
                                >
                                    不限
                                </Checkbox>
                                <CheckboxGroup
                                    options={allCourseTypeList}
                                    value={checkedList}
                                    onChange={this.onChange}
                                />
                            </div>
                        )
                    }
                />
                <ReserveRow
                    name="排课选项"
                    className="last-row"
                    render={
                        () => (
                            <FormItem>
                                {
                                    getFieldDecorator('promoteType', {
                                        rules: [],
                                        initialValue: promoteType[0].value
                                    })(
                                        <Select style={{width: 200}}>
                                            {
                                                promoteType.map(item =>
                                                    <Option key={item.value} value={item.value}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        )
                    }
                />
                 {
                    hasContract &&
                    <Row className="btn">
                        <Button
                            className="gym-button-blue-xs"
                            onClick={this.handleSubmit}
                            disabled={allowContractList.length <= 0}>查询</Button>
                    </Row>
                }
                {
                    !hasContract &&
                    <Row className="btn">
                        <Button className="gym-button-blue-xs" onClick={this.handleSubmit}>查询</Button>
                    </Row>
                }
                <Modal
                    visible={changePkgVisible}
                    onCancel={() => this.setState({changePkgVisible: false})}
                    footer={null}
                    closable={false}
                    centered={true}
                >
                    <div className="selection-search-wrapper-modal">
                        <p className="selection-search-wrapper-modal-title">请和家长确认是否切换为此课包？</p>
                        <p className="selection-search-wrapper-modal-title">切换后将从此课包进行排课扣课。</p>
                        <p className="selection-search-wrapper-modal-content">当前课包剩余课时：{remainCourseNum}</p>
                        <Button className="gym-button-default gym-button-xs" onClick={() => this.setState({changePkgVisible: false})}>确定</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export {Search}
