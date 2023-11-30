/**
 * desc: 数据项组件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/2/9
 * Time: 下午1:28
 */
import  React, {Component, Fragment} from "react";
import {Checkbox,Tag} from 'antd';

const CheckboxGroup = Checkbox.Group;


class DateField extends Component<any, any>{
    defaultCheckedList:Array<string> ;
    constructor(props){
        super(props)
        this.defaultCheckedList = props.defaultSelect;
        this.state = {
            common_checkAllItem: false,
            common_indeterminate: true,
            common_checkList:['phase', 'ga', 'gb'],

            baby_checkAllItem: false,
            baby_indeterminate: true,
            baby_checkList:[ 'monthValue'],

            get_checkAllItem: false,
            get_indeterminate: true,
            get_checkList:[ 'channelType', 'lastInquireDate', 'appearanceType'],

            assign_checkAllItem: false,
            assign_indeterminate: false,
            assign_checkList:[],

            connection_checkAllItem: false,
            connection_indeterminate: true,
            connection_checkList:['lastContactTime'],

            visit_checkAllItem: false,
            visit_indeterminate: false,
            visit_checkList:[],

            contract_checkAllItem: false,
            contract_indeterminate: false,
            contract_checkList:[],

            checkedList: this.defaultCheckedList,
            indeterminate: true,
            checkAll: false,
            flag: true,
        }
    }

    config = () => {
        return [
            {
                title: '常用：',
                id:'common',
                list: this.state.common_checkList,
                allChecked: this.state.common_checkAllItem,
                indeterminate: this.state.common_indeterminate,
                options: [
                    {
                        label: 'GB',
                        value: 'gb'
                    },{
                        label: 'GA',
                        value: 'ga'
                    },{
                        label: 'Promotor',
                        value: 'promotor'
                    },{
                        label: 'TMK',
                        value: 'tmk'
                    },{
                        label: '上一个GB',
                        value: 'lastGb'
                    },{
                        label: '意向度',
                        value: 'intentionLevel'
                    },{
                        label: '客户阶段',
                        value: 'phase'
                    },
                ]
            },{
                title: '宝宝信息：',
                id:'baby',
                list: this.state.baby_checkList,
                allChecked: this.state.baby_checkAllItem,
                indeterminate: this.state.baby_indeterminate,
                options: [
                    {
                        label: '月龄',
                        value: 'monthValue'
                    },{
                        label: '生日',
                        value: 'birthday'
                    },{
                        label: '性别',
                        value: 'gender'
                    },{
                        label: '联系人',
                        value: 'contactName'
                    },{
                        label: '手机号码（脱敏）',
                        value: 'insensitivePhoneNumber'
                    },{
                        label: '区县',
                        value: 'district'
                    },{
                        label: '小区',
                        value: 'quarter'
                    },{
                        label: '客户编号',
                        value: 'leadsId'
                    },{
                        label: '推荐人',
                        value: 'referalContact'
                    }
                ]
            },{
                title: '获取：',
                id:'get',
                list: this.state.get_checkList,
                allChecked: this.state.get_checkAllItem,
                indeterminate: this.state.get_indeterminate,
                options: [
                    {
                        label: '出现方式',
                        value: 'appearanceType'
                    },{
                        label: '渠道来源',
                        value: 'channelType'
                    },{
                        label: '渠道备注',
                        value: 'channelComment'
                    },{
                        label: '首次获取日期',
                        value: 'firstInquireDate'
                    },{
                        label: '最后获取日期',
                        value: 'lastInquireDate'
                    },{
                        label: '创建日期',
                        value: 'createDate'
                    },
                ]
            },{
                title: '分配领取：',
                id:'assign',
                list: this.state.assign_checkList,
                allChecked: this.state.assign_checkAllItem,
                indeterminate: this.state.assign_indeterminate,
                options: [
                    {
                        label: '待分配(来源)',
                        value: 'toAllocateSource'
                    },{
                        label: '是否进过回收站',
                        value: 'isIntoRecycle'
                    },{
                        label: '最后进回收站日期',
                        value: 'lastRecycleTime'
                    },{
                        label: '最后分配日期',
                        value: 'lastDistributeTime'
                    },{
                        label: '最后领取日期',
                        value: 'lastReceiveTime'
                    },{
                        label: '回收原因',
                        value: 'recycleCause'
                    },
                ]
            },{
                title: '联系：',
                id:'connection',
                list: this.state.connection_checkList,
                allChecked: this.state.connection_checkAllItem,
                indeterminate: this.state.connection_indeterminate,
                options: [
                    {
                        label: '首次联系日期',
                        value: 'firstContactTime'
                    },{
                        label: '最后联系日期',
                        value: 'lastContactTime'
                    },{
                        label: '有效联系任务数',
                        value: 'effectiveContactNum'
                    },{
                        label: '首次联系间隔',
                        value: 'firstContactInterval'
                    },{
                        label: '首次成功联系间隔',
                        value: 'firstContactSuccessInterval'
                    },
                ]
            },{
                title: '诺访到访：',
                id:'visit',
                list: this.state.visit_checkList,
                allChecked: this.state.visit_checkAllItem,
                indeterminate: this.state.visit_indeterminate,
                options: [
                    {
                        label: '首次诺访日期',
                        value: 'appTime'
                    },{
                        label: '首次到访日期',
                        value: 'oppTime'
                    },{
                        label: '最后一次到访日期',
                        value: 'lastVisitTime'
                    },{
                        label: '已到访次数',
                        value: 'visitNum'
                    },{
                        label: '即将到访日期',
                        value: 'toVisitTime'
                    },{
                        label: '最后试听日期',
                        value: 'lastPreviewTime'
                    },{
                        label: '最后测评日期',
                        value: 'lastAssessTime'
                    },
                ]
            },{
                title: '签约：',
                id:'contract',
                list: this.state.contract_checkList,
                allChecked: this.state.contract_checkAllItem,
                indeterminate: this.state.contract_indeterminate,
                options: [
                    {
                        label: '首次收款日期',
                        value: 'firstFinacialTime'
                    },{
                        label: '课程包名称(有效)',
                        value: 'packageName'
                    },{
                        label: '合同到期日',
                        value: 'contractExpireTime'
                    },{
                        label: '剩余有效总课时',
                        value: 'totalRemainingCourseNum'
                    },
                ]
            },

        ];
    }
    onCheckAllChange = (e) => {
        let selectedChecked = this.config()
            .map(item => item.options)
            .reduce((pre = [], cur = []) => [...pre, ...cur], [])
            .map(item => item.value);

        this.setState({
            checkedList: e.target.checked ? selectedChecked : [],
            indeterminate: false,
            checkAll: e.target.checked ? true : false,
            common_checkAllItem: e.target.checked ? true : false,
            common_indeterminate: false,
            common_checkList:e.target.checked
                ? this.config().filter(item => item.id === 'common')[0].options.map(item => item.value)
                : [],

            baby_checkAllItem: e.target.checked ? true : false,
            baby_indeterminate: false,
            baby_checkList:e.target.checked
                ? this.config().filter(item => item.id === 'baby')[0].options.map(item => item.value)
                : [],

            get_checkAllItem: e.target.checked ? true : false,
            get_indeterminate: false,
            get_checkList:e.target.checked
                ? this.config().filter(item => item.id === 'get')[0].options.map(item => item.value)
                : [],

            assign_checkAllItem: e.target.checked ? true : false,
            assign_indeterminate: false,
            assign_checkList:e.target.checked
                ? this.config().filter(item => item.id === 'assign')[0].options.map(item => item.value)
                : [],

            connection_checkAllItem: e.target.checked ? true : false,
            connection_indeterminate: false,
            connection_checkList:e.target.checked
                ? this.config().filter(item => item.id === 'connection')[0].options.map(item => item.value)
                : [],

            visit_checkAllItem: e.target.checked ? true : false,
            visit_indeterminate: false,
            visit_checkList:e.target.checked
                ? this.config().filter(item => item.id === 'visit')[0].options.map(item => item.value)
                : [],

            contract_checkAllItem: e.target.checked ? true : false,
            contract_indeterminate: false,
            contract_checkList:e.target.checked
                ? this.config().filter(item => item.id === 'contract')[0].options.map(item => item.value)
                : [],
        }, () => {
            this.props.emitCheckData(this.state.checkedList)
        })
    };
    onCheckAllItemChange = (e, key) => {
        let plainOptions = this.config().filter((item) => item.id === key)[0].options.map(item => item.value);
        let totalLen = this.config().map(item => item.options).reduce((pre = [], cur = []) => [...pre, ...cur], []).length;
        let selectedChecked = this.config()
            .filter(item => item.id !== key)
            .map(item => item.list)
            .reduce((pre = [], cur = []) => [...pre, ...cur], []);
        this.setState({
            checkedList: e.target.checked ? [...selectedChecked, ...plainOptions ] : selectedChecked,
            indeterminate: e.target.checked
                            ? (!![...selectedChecked, ...plainOptions].length && [...selectedChecked, ...plainOptions].length < totalLen)
                            : (!!selectedChecked.length && selectedChecked.length < totalLen),
            checkAll: e.target.checked ? [...selectedChecked, ...plainOptions].length === totalLen : selectedChecked.length === totalLen,
            [`${key}_checkList`]: e.target.checked ? plainOptions : [],
            [`${key}_indeterminate`]: false,
            [`${key}_checkAllItem`]: e.target.checked,
        }, () => {
            this.props.emitCheckData(this.state.checkedList)
        })

    };
    onChange = (checkedList, key) => {
        let len = this.config().filter((item) => item.id === key)[0].options.length;
        let totalLen = this.config().map(item => item.options).reduce((pre = [], cur = []) => [...pre, ...cur], []).length;
        let selectedChecked = this.config()
                                .filter(item => item.id !== key)
                                .map(item => item.list)
                                .reduce((pre = [], cur = []) => [...pre, ...cur], []);
        this.setState({
            checkedList: [...selectedChecked, ...checkedList],
            indeterminate: !![...selectedChecked, ...checkedList].length && [...selectedChecked, ...checkedList].length < totalLen,
            checkAll: [...selectedChecked, ...checkedList].length === totalLen,
            [`${key}_checkList`]: checkedList,
            [`${key}_indeterminate`]: !!checkedList.length && checkedList.length < len,
            [`${key}_checkAllItem`]: checkedList.length === len,

        }, () => {
            this.props.emitCheckData(this.state.checkedList)
        })
    };
    /**
     * 收起展开
     */
    triggerData = () => {
        this.setState(prev => {
            return {flag: !prev.flag}
        })
    };
    /**
     * 展示显示框
     */
    renderSpan = (record, index) => {
        const arr = this.config().map(item => item.options).reduce((pre = [], cur = []) => [...pre, ...cur], []);
        const name = arr.filter(item => item.value === record)[0].label;
        return <Tag key={`${index}_label`} className='gym-client-center-date-field-part-title-left-span'>{name}</Tag>
    };
    /**
     * 重置
     */
    handleReset = () => {
        this.setState({
            common_checkAllItem: false,
            common_indeterminate: true,
            common_checkList:['phase', 'ga', 'gb'],

            baby_checkAllItem: false,
            baby_indeterminate: true,
            baby_checkList:['babyName', 'monthValue'],

            get_checkAllItem: false,
            get_indeterminate: true,
            get_checkList:[ 'channelType', 'lastInquireDate', 'appearanceType'],

            assign_checkAllItem: false,
            assign_indeterminate: false,
            assign_checkList:[],

            connection_checkAllItem: false,
            connection_indeterminate: true,
            connection_checkList:['lastContactTime'],

            visit_checkAllItem: false,
            visit_indeterminate: false,
            visit_checkList:[],

            contract_checkAllItem: false,
            contract_indeterminate: false,
            contract_checkList:[],

            checkedList: this.defaultCheckedList,
            indeterminate: true,
            checkAll: false,
        }, () => {
            this.props.emitCheckData(this.state.checkedList)
        })

    };
    render(){
        const {flag, checkedList} = this.state;
        return (
            <div className='gym-client-center-date-field-part'>
                <div className='gym-client-center-date-field-part-title'>
                    <div className="gym-client-center-date-field-part-title-left">
                        <span className='mr25 size20'>数据项</span>
                        <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={this.state.checkAll}
                        >
                             全部
                        </Checkbox>
                        {
                            flag
                            ? (<Fragment>
                                    {
                                        (checkedList || []).filter((item, index) => index < 8).map((item, index) => this.renderSpan(item, index))
                                    }
                                    {
                                        checkedList.length > 8 && '...'
                                    }
                                </Fragment>)
                            : null
                        }
                    </div>

                    <div>
                        <button className='mr15 gym-button-lg gym-button-default' onClick={this.handleReset}>重置数据项</button>
                        <button className='gym-button-xs gym-button-default' onClick={this.triggerData}>{flag ? '展开' : '收起'}</button>
                    </div>
                </div>
                {
                    !flag
                        ? (
                            <div className='gym-client-center-date-field-part-content'>
                                {
                                    this.config().map(item => (
                                        <div key={item.id} className='gym-client-center-date-field-part-items'>
                                            <div className='gym-client-center-date-field-part-items-title'>{item.title}</div>
                                            <div className='gym-client-center-date-field-part-items-list'>
                                                <Checkbox
                                                    onChange={(e) => this.onCheckAllItemChange(e, item.id)}
                                                    indeterminate={item.indeterminate}
                                                    checked={item.allChecked}
                                                >全部</Checkbox>
                                                <CheckboxGroup
                                                    onChange={(e) => this.onChange(e, item.id)}
                                                    value={item.list}
                                                >
                                                    {
                                                        item.options.map(item2 => (
                                                            <Checkbox
                                                                key={item2.value}
                                                                value={item2.value}
                                                            >{item2.label}</Checkbox>
                                                        ))
                                                    }
                                                </CheckboxGroup>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                        : null
                }

            </div>
        )
    }
}

export {DateField}
