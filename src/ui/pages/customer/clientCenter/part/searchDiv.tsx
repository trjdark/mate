/**
 * desc: 搜索条件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/1/20
 * Time: 下午4:07
 */
import  React, {Component, Fragment} from "react";
import {Form, Checkbox,} from "antd";
import {Select, Option} from "@/ui/component/select";
import {form} from "@/common/decorator/form";
import {Input, InputNumber} from "@/ui/component/input";
import {
    navConfig, appearanceType, intentionLevel, channelTypeList,
    assignSource, birthdayMonthList, genderList,recycleType
} from "@/ui/pages/customer/enum/assign";
import {DateInput} from "@/ui/component/datePicker";
import moment from 'moment';
import {CommonUtils} from "@/common/utils/commonUtils";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;


@form()

class SearchDiv extends Component <any, any> {
    state = {
        flag: false,
        promotorList: [],                       // promotor列表
        tmkList: [],                            // tmk列表
        packageList: [],                        // 课程包列表
        appearanceTypeIndeterminate:false,
        appearanceTypeCheckAll: false,
        channelTypeIndeterminate:false,
        channelTypeCheckAll: false,
        phaseIndeterminate: false,
        phaseCheckAll: true,
        errorInputs: [],                        // 报错选择框
    };
    private beginKeys = [
        'birthdayBegin', 'firstInquireDateBegin', 'lastInquireDateBegin',
        'createDateBegin', 'lastRecycleTimeBegin', 'lastDistributeTimeBegin', 'lastReceiveTimeBegin',
        'firstContactTimeBegin', 'lastContactTimeBegin', 'appTimeBegin', 'oppTimeBegin', 'lastVisitTimeBegin',
        'toVisitTimeBegin', 'lastPreviewTimeBegin', 'lastAssessTimeBegin',
        'firstFinacialTimeBegin', 'contractExpireTimeBegin'
    ];
    private endKeys = [
        'birthdayEnd', 'firstInquireDateEnd', 'lastInquireDateEnd',
        'createDateEnd', 'lastRecycleTimeEnd', 'lastDistributeTimeEnd', 'lastReceiveTimeEnd',
        'firstContactTimeEnd', 'lastContactTimeEnd', 'appTimeEnd', 'oppTimeEnd', 'lastVisitTimeEnd',
        'toVisitTimeEnd', 'lastPreviewTimeEnd', 'lastAssessTimeEnd',
        'firstFinacialTimeEnd', 'contractExpireTimeEnd'
    ];
    commonSearch = ():Array<any> => {
        const {gbList, gaList, type, value, phaseNum} = this.props;
        const phaseTypes = (navConfig || []).map(item => ({value:item.phaseId, label:`${item.title}(${ CommonUtils.myFalse(phaseNum[item.name]) ? '-' : phaseNum[item.name] })`}));
        return [
            {
                label: '宝宝名',
                name: 'babyName',
                type: 'text',
                initialValue: type === 'babyName' ? value : null
            },{
                label: '手机号',
                name: 'phoneNumber',
                placeholder: '输入11位手机号码',
                type: 'text',
                initialValue: type === 'phoneNumber' ? value : null
            },{
                label: '联系人',
                name: 'contactName',
                type: 'text',
                initialValue: type === 'contactName' ? value : null

            },{
                label: 'GB',
                name: 'gb',
                type: 'select',
                options: [
                    {staffId:'', englishName: 'ALL', chineseName: ''},
                    {staffId:'toAllocate', englishName: '未分配', chineseName: ''},
                    ...(gbList || [])
                ].map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }))

            },{
                label: 'GA',
                name: 'ga',
                type: 'select',
                options: [
                    {staffId:'', englishName: 'ALL', chineseName: ''},
                    {staffId:'toAllocate', englishName: '未分配', chineseName: ''},
                    ...(gaList || [])
                ].map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }))

            }, {
                label: '客户阶段',
                name: 'phase',
                type: 'check',
                options: phaseTypes,
                initialValue: (navConfig || []).map((item:any) => item.phaseId),
                indeterminate: this.state.phaseIndeterminate,
                indeterminateName: 'phaseIndeterminate',
                checkAll: this.state.phaseCheckAll,
                checkAllName: 'phaseCheckAll'

            },
        ];
    };
    highSearch = ():Array<any> => {
        const {gbList, type, value, tmkList, promotorList, packageList} = this.props;
        return [
            {
                title: '',
                label: 'common',
                options: [
                    {
                        label: 'Promotor',
                        name: 'promotor',
                        type: 'select',
                        options:(promotorList || []).map((item: any) => ({ postCode: item.promotorId, postName: item.promotorName }))
                    }, {
                        label: 'TMK',
                        name: 'tmk',
                        type: 'select',
                        options:(tmkList || []).map((item: any) => ({ postCode: item.id, postName: `${item.englishName} ${item.chineseName}` }))
                    },{
                        label: '上一个GB',
                        name: 'lastGb',
                        type: 'select',
                        options: (gbList || []).map((item: any) => ({ postCode: item.staffId, postName: `${item.englishName} ${item.chineseName}` }))
                    },{
                        label: '意向度',
                        name: 'intentionLevel',
                        type: 'select',
                        options: (intentionLevel || []).map((item:any) =>({postCode:item.code, postName:item.name}))
                    },
                ]
            },
            {
                title: '宝宝信息:',
                label: 'babyInfo',
                options:[
                    {
                        label: '宝宝名',
                        name: 'babyName',
                        type: 'text',
                        initialValue: type === 'babyName' ? value : null
                    },{
                        label: '月龄',
                        type: 'numberRange',
                        name: ['monthValueBegin', 'monthValueEnd']
                    },{
                        label: '生日',
                        type: 'dateRange',
                        name: ['birthdayBegin', 'birthdayEnd']
                    },{
                        label: '生日月',
                        type: 'select',
                        name: 'birthdayMonth',
                        options:birthdayMonthList
                    },{
                        label: '性别',
                        name: 'gender',
                        type: 'select',
                        options: genderList
                    },{
                        label: '联系人',
                        name: 'contactName',
                        type: 'text',
                        initialValue: type === 'contactName' ? value : null

                    },{
                        label: '手机号',
                        name: 'phoneNumber',
                        placeholder: '输入11位手机号码',
                        type: 'text',
                        initialValue: type === 'phoneNumber' ? value : null
                    },{
                        label: '区县',
                        name: 'district',
                        type: 'text',
                    },{
                        label: '小区',
                        name: 'quarter',
                        type: 'text',
                    },{
                        label: '客户编号',
                        name: 'leadsId',
                        type: 'text',
                    }
                ]
            },
            {
                title: '获取:',
                label: 'get',
                options: [
                    {
                        label: '出现方式',
                        name: 'appearanceType',
                        type: 'check',
                        options: appearanceType,
                        indeterminate: this.state.appearanceTypeIndeterminate,
                        indeterminateName: 'appearanceTypeIndeterminate',
                        checkAll: this.state.appearanceTypeCheckAll,
                        checkAllName: 'appearanceTypeCheckAll'

                    }, {
                        label: '渠道来源',
                        name: 'channelType',
                        type: 'check',
                        options: channelTypeList,
                        indeterminate: this.state.channelTypeIndeterminate,
                        indeterminateName: 'channelTypeIndeterminate',
                        checkAll: this.state.channelTypeCheckAll,
                        checkAllName: 'channelTypeCheckAll'
                    },{
                        label: '渠道备注',
                        name: 'channelComment',
                        type: 'text',
                    },{
                        label: '首次获取日期',
                        type: 'dateRange',
                        name: ['firstInquireDateBegin', 'firstInquireDateEnd']
                    },{
                        label: '最后获取日期',
                        type: 'dateRange',
                        name: ['lastInquireDateBegin', 'lastInquireDateEnd']
                    },{
                        label: '创建日期',
                        type: 'dateRange',
                        name: ['createDateBegin', 'createDateEnd']
                    },
                ]
            },
            {
                title: '分配领取',
                label: 'assign',
                options: [
                    {
                        label: '待分配(来源) ',
                        name: 'toAllocateSource',
                        type: 'select',
                        options: (assignSource || []).map((item:any) =>({postCode:item.value, postName:item.name}))
                    },{
                        label: '是否进过回收站',
                        name: 'isIntoRecycle',
                        type: 'select',
                        options:[{postCode:'', postName:'ALL'},{postCode:0, postName:'否'},{postCode:1, postName:'是'}]
                    }, {
                        label: '最后进回收站日期',
                        type: 'dateRange',
                        name: ['lastRecycleTimeBegin', 'lastRecycleTimeEnd']
                    }, {
                        label: '最后分配日期',
                        type: 'dateRange',
                        name: ['lastDistributeTimeBegin', 'lastDistributeTimeEnd']
                    },{
                        label: '最后领取日期',
                        type: 'dateRange',
                        name: ['lastReceiveTimeBegin', 'lastReceiveTimeEnd']
                    },{
                        label: '回收原因 ',
                        name: 'recycleCause',
                        type: 'select',
                        options: (recycleType || []).map((item:any) =>({postCode:item.value, postName:item.name}))
                    },

                ]
            },
            {
                title: '联系：',
                label: 'connection',
                options: [
                    {
                        label: '首次联系日期',
                        type: 'dateRange',
                        name: ['firstContactTimeBegin', 'firstContactTimeEnd']
                    },{
                        label: '最后联系日期',
                        type: 'dateRange',
                        name: ['lastContactTimeBegin', 'lastContactTimeEnd']
                    },{
                        label: '有效联系任务数',
                        type: 'numberRange',
                        name: ['effectiveContactNumBegin', 'effectiveContactNumEnd']
                    },{
                        label: '首次联系间隔',
                        type: 'numberRange',
                        name: ['firstContactIntervalBegin', 'firstContactIntervalEnd']
                    },{
                        label: '首次成功联系间隔',
                        type: 'numberRange',
                        name: ['firstContactSuccessIntervalBegin', 'firstContactSuccessIntervalEnd']
                    },
                ]
            },
            {
                title: '诺访到访',
                label: 'visit',
                options: [
                    {
                        label: '首次诺访日期',
                        type: 'dateRange',
                        name: ['appTimeBegin', 'appTimeEnd']
                    },{
                        label: '首次到访日期',
                        type: 'dateRange',
                        name: ['oppTimeBegin', 'oppTimeEnd']
                    },{
                        label: '最后一次到访日期',
                        type: 'dateRange',
                        name: ['lastVisitTimeBegin', 'lastVisitTimeEnd']
                    },{
                        label: '已到访次数',
                        type: 'numberRange',
                        name: ['visitNumBegin', 'visitNumEnd']
                    },{
                        label: '即将到访日期',
                        type: 'dateRange',
                        name: ['toVisitTimeBegin', 'toVisitTimeEnd']
                    },{
                        label: '最后试听日期',
                        type: 'dateRange',
                        name: ['lastPreviewTimeBegin', 'lastPreviewTimeEnd']
                    },{
                        label: '最后测评日期',
                        type: 'dateRange',
                        name: ['lastAssessTimeBegin', 'lastAssessTimeEnd']
                    },
                ]
            },
            {
                title: '签约',
                label: 'contract',
                options: [
                    {
                        label: '首次收款日期',
                        type: 'dateRange',
                        name: ['firstFinacialTimeBegin', 'firstFinacialTimeEnd']
                    },{
                        label: '课程包名称(有效)',
                        type: 'select',
                        name: 'packageId',
                        options: (packageList || []).map(item => ({postCode: item.id, postName: item.packageName}))
                    },{
                        label: '合同到期日',
                        type: 'dateRange',
                        name: ['contractExpireTimeBegin', 'contractExpireTimeEnd']
                    },{
                        label: '剩余有效总课时',
                        type: 'numberRange',
                        name: ['totalRemainingCourseNumBegin', 'totalRemainingCourseNumEnd']
                    },
                ]
            },
        ]
    };
    /**
     * 搜索项目全部选择
     * @param e
     * @param indeterminateName
     * @param checkAllName
     * @param name
     * @param list
     */
    onCheckAllChange = (e, indeterminateName, checkAllName, name, list) => {
        const {form} = this.props;
        this.setState({
            [indeterminateName]: false,
            [checkAllName]: e.target.checked,
        });
        form.setFieldsValue({[name]: e.target.checked ? list.map(item => item.value) : []})
    };
    /**
     * 搜索项目单独选择
     * @param values
     * @param indeterminateName
     * @param checkAllName
     * @param name
     * @param list
     */
    onChangeCheck = (values, indeterminateName, checkAllName, name, list ) => {
        const {form} = this.props;
        this.setState({
            [indeterminateName]: !!values.length && values.length < list.length,
            [checkAllName]: values.length === list.length,
        });
        form.setFieldsValue({[name]: values})
    }
    /**
     * 构建搜索项
     * @param item
     * @param {number} index
     * @returns {any}
     */
    renderFormItem = (item, index:number) => {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {errorInputs} = this.state;
        switch (item.type) {
            case 'text':
                return (
                    <div  className='gym-client-center-form-wrap-item' key={`${item.name}_${index}`}>
                        {/* Todo 搜索飙红，提示必填 */}
                        <FormItem label={item.label} className={`${errorInputs.includes(item.name) ? 'has-error' : ''}`}>
                            {
                                getFieldDecorator(item.name, {
                                    initialValue: item.initialValue
                                })(
                                    <Input
                                        className='gym-form-item-input '
                                        placeholder={item.placeholder}
                                        onChange={() => this.handleChange(item.name)}
                                    />
                                )
                            }
                        </FormItem>
                    </div>

                );
            case 'select':
                return (
                    <div className='gym-client-center-form-wrap-item'  key={`${item.name}_${index}`}>
                        <FormItem label={item.label} >
                            {
                                getFieldDecorator(item.name, {
                                    initialValue: item.initialValue
                                })(
                                    <Select
                                        className='gym-form-item-select'
                                        placeholder={item.placeholder}
                                        getPopupContainer={()=>document.querySelector(item.popupContainer || '.gym-client-center-form')}
                                        showSearch={true}
                                        filterOption={(input, option) => {
                                            const text = option.props.children as string;
                                            return text.toLowerCase().includes(input.toLowerCase())
                                        }}
                                    >
                                        {
                                            (item.options || []).map((item: any, index: number) =>
                                                <Option
                                                    key={`${item.postCode}_${index}`}
                                                    value={item.postCode}
                                                >
                                                    {item.postName}
                                                </Option>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </div>
                )
            case 'numberRange':
                return (
                    <div className='gym-client-center-form-wrap-item'  key={`${item.name[0]}_${index}`}>
                        <FormItem label={item.label} className='xxs'>
                            {
                                getFieldDecorator(item.name[0])(
                                    <InputNumber allowClear={false}/>
                                )
                            }
                        </FormItem>
                        <div className='text'>-</div>
                        <FormItem className='xxs'>
                            {
                                getFieldDecorator(item.name[1])(
                                    <InputNumber allowClear={false}/>
                                )
                            }
                        </FormItem>
                    </div>

                )
            case 'dateRange':
                return (
                    <div className='gym-client-center-form-wrap-item'  key={`${item.name[0]}_${index}`}>
                        <FormItem label={item.label} className='xxs'>
                            {
                                getFieldDecorator(item.name[0])(
                                    <DateInput placeholder='' allowClear={true} suffixIcon={<span/>}/>
                                )
                            }
                        </FormItem>
                        <div className='text'>-</div>
                        <FormItem className='xxs'>
                            {
                                getFieldDecorator(item.name[1])(
                                    <DateInput  placeholder='' allowClear={true} suffixIcon={<span/>}/>
                                )
                            }
                        </FormItem>
                    </div>

                )
            case 'check':
                return (
                    <div className='gym-client-center-form-wrap-item lg' key={`${item.name}_${index}`}>
                        <FormItem label={item.label} className='xxs'>
                            <Checkbox
                                indeterminate={item.indeterminate}
                                onChange={(e) => this.onCheckAllChange(
                                    e, item.indeterminateName, item.checkAllName, item.name, item.options)}
                                checked={item.checkAll}
                            >All</Checkbox>
                            {
                                getFieldDecorator(item.name, {
                                    initialValue: item.initialValue
                                })(
                                    <CheckboxGroup onChange={(values) => this.onChangeCheck(
                                        values, item.indeterminateName, item.checkAllName, item.name, item.options
                                    )}>
                                        {
                                            item.options.map(item2 => (
                                                <Checkbox
                                                    key={item2.value}
                                                    value={item2.value}
                                                >{item2.label}</Checkbox>
                                            ))
                                        }
                                    </CheckboxGroup>
                                )
                            }
                        </FormItem>
                    </div>
                )
        }
    };
    /**
     * 查询
     * @param {number} pageNo
     * @param {number} pageSize
     */
    search = () => {
        const {form} = this.props;
        let result = form.getFieldsValue();
        for(let key in result){
            if(this.beginKeys.includes(key) && result[key]){
                result[key] = moment(result[key]).startOf('day').valueOf()
            }
            if(this.endKeys.includes(key) && result[key]){
                result[key] = moment(result[key]).endOf('day').valueOf()
            }
            if(key === 'phase' && result[key].length === 0){
                const allPhase = (navConfig || []).map((item:any) => item.phaseId);
                this.setState({phaseCheckAll: true});
                form.setFieldsValue({[key]: allPhase});
                result[key] = allPhase;
            }
        }
        return result;
    };
    /**
     * 报错
     */
    error = (arr:Array<string>) => {
        this.setState({errorInputs: [...arr]})
    };
    /**
     * 消除错误提示
     */
    handleChange = (name:string) => {
        const {errorInputs} = this.state;
        if(errorInputs.length === 0){
            return;
        }
        if(errorInputs.includes(name)){
            this.setState({errorInputs: []})
        }
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
     * 重置
     */
    handleReset = () => {
        const {form, onReset} = this.props;
        form.resetFields();
        form.setFieldsValue({babyName: null, phoneNumber:null, contactName:null});
        this.setState({
            appearanceTypeIndeterminate:false,
            appearanceTypeCheckAll: false,
            channelTypeIndeterminate:false,
            channelTypeCheckAll: false,
            phaseIndeterminate: false,
            phaseCheckAll: true,
        })
        if (typeof onReset === 'function') {
            onReset(form.getFieldsValue());
        }
    };
    render(){
        const {flag} = this.state;
        return (
            <Fragment>
                <div className="gym-client-center-common-title">
                    <div className='mr25 size20'>查询条件</div>
                    <div >
                        <button className='mr15 gym-button-lg gym-button-default' onClick={this.handleReset}>重置查询条件</button>

                        <button className='gym-button-xs gym-button-default' onClick={this.triggerData}>{!flag ? '展开' : '收起'}</button>
                    </div>
                </div>
                <Form>
                    <div className="gym-client-center-common">
                        <div className='gym-client-center-form'>
                            <div className='gym-client-center-form-title'>常用:</div>
                            <div className='gym-client-center-form-wrap'>
                                {this.commonSearch().map((item, index) => this.renderFormItem(item, index))}
                            </div>
                        </div>
                    </div>
                    <div className={`gym-client-center-high ${flag ? '' : 'none'}`}>
                        {
                            this.highSearch().map((item) => (
                                <div className='gym-client-center-form' key={item.label}>
                                    <div className='gym-client-center-form-title'>{item.title}</div>
                                    <div className='gym-client-center-form-wrap' key={item.label}>
                                        {
                                            (item.options || []).map((item2, index2) =>
                                                this.renderFormItem(item2, index2))
                                        }
                                    </div>
                                </div>

                            ))
                        }
                    </div>
                </Form>
            </Fragment>
        )
    }
}

export {SearchDiv}
