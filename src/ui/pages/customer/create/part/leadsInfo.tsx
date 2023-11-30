import React from 'react'
import {Input, Form, Row, DatePicker, Checkbox} from 'antd';
import {Select, Option} from "@/ui/component/select";
import {ListModal} from '@/ui/component/listModal';
import {PageTitle} from "@/ui/component/pageTitle";
import {RecmdModalContent} from './recmdModalContent';
import {connect} from "@/common/decorator/connect";
import {getCodeInfoByType} from '@redux-actions/customerCreate'
import {
    getValidPromotorInCurrentCenter,
    getValidMarketingActivityInCurrentCenter
} from '@redux-actions/client360';
import {User} from "@/common/beans/user";
import _ from 'lodash';
import {Confirm} from "@/ui/component/customerCreateModal";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {form} from "@/common/decorator/form";

const {TextArea} = Input;
const FormItem = Form.Item;

@form()
@connect((state: any) => ({}), {getCodeInfoByType})
class LeadsInformation extends React.Component<any, any> {
    referalNameInput: any;
    referalPhoneNumInput: any;

    constructor(props) {
        super(props);
        this.referalNameInput = React.createRef()
        this.referalPhoneNumInput = React.createRef()
        this.state = {
            referalVisible: false,
            appearnceTypeList: [],
            ChannelTypeList: [],
            huiyuanCode: '72006',
            feihuiyuanCode: '72010',
            recommend: {},
            isFromMarketChecked: false,
            validPromotorList: [],
            validMarketingActivityList: []
        }
    }

    closeReferalModalAndBlur = () => {
        this.setState({referalVisible: false}, () => {
            this.referalNameInput.blur();
            this.referalPhoneNumInput.blur();
        })
    }

    handleOk = (e) => {
        let {recommend} = this.state;
        const {contactName,leadsId}=recommend;
        const that=this;
        if (!contactName) {//联系人名称不存在
            const url= `${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify({leadsId,title:1})}`;
            Confirm({
                content:<span>该会员还没联系人姓名，请将联系人姓名补充完整, 现在去完善？</span>,
                onOk(){
                    window.open(url,"_blank");
                    that.closeReferalModalAndBlur();
                }
            })
        }else{
            this.closeReferalModalAndBlur();
            this.props.form.setFieldsValue({
                referalName: recommend['contactName'],
                referalPhoneNum: recommend['contactTel'],
                referalContactId: recommend['contactId'],
                referalLeadsId: recommend['leadsId']
            })
        }

    }

    handleCancel = (e) => {
        this.closeReferalModalAndBlur()
    }

    onChange = () => {
        this.clearRecommandInput()
    }

    enableRecommand = () => {
        let val = this.props.form.getFieldValue('channelType')
        return (val === this.state.huiyuanCode) || (val === this.state.feihuiyuanCode)
    }

    onReferalClick = (e) => {
        let val = this.props.form.getFieldValue('channelType')
        if (val === this.state.huiyuanCode) {
            this.setState({referalVisible: true})
        }
    }

    clearRecommandInput = () => {
        this.props.form.setFieldsValue({
            referalName: '',
            referalPhoneNum: '',
            referalContactId: '',
            referalLeadsId: ''
        })
    }

    setRecommend = (recommend) => {
        this.setState({recommend})
    }

    getOptions = () => {
        // 当岗位是GB时，只有会员推荐：
        const roleArr = _.compact(User.role)
        if (roleArr.length === 1 && roleArr[0] === 'GB') {
            return new Array(<Option value="72006" key="0">会员推荐</Option>)
        } else {
            return this.state.ChannelTypeList.map((item, idx) =>
                <Option value={item.code} key={idx}>{item.codeValue}</Option>
            );
        }
    }

    onIsFromMarketChange = (e) => {
        if (!e.target.checked) {
            this.props.form.setFieldsValue({
                marketingActivityId: undefined,
                promoterId: undefined,
                channelComment: ''
            })
        }
        this.setState({isFromMarketChecked: e.target.checked})
    }

    getValidPromotorOptions = () => {
        return this.state.validPromotorList.map((item, idx) =>
            <Option value={item.promotorId} key={idx}>{item.promotorName}</Option>
        )
    }

    getValidMarketingActivityOptions = () => {
        return this.state.validMarketingActivityList.map((item, idx) =>
            <Option value={item.marketingActivityId} key={idx}>{item.theme}</Option>
        )
    }

    onMarketingActivitySelect = (value) => {
        this.props.form.setFieldsValue({
            channelComment: this.state.validMarketingActivityList.filter(
                item => item.marketingActivityId === value
            )[0].theme
        })
    }

    // 推荐人手机号校验规则
    validator = (rule, value, callback) => {
        // 手机号规则验证
        let valid = /^1[3456789]\d{9}$/.test(value);
        if (!rule.required) {
            callback();
        }
        if (!value) {
            callback('请输入手机号');
        }
        if (!valid) {
            callback('手机号格式错误');
        }
        callback();
    }

    componentDidMount() {
        getCodeInfoByType({type: 'appearnceType', currentCenterId: User.currentCenterId})
            .then((res) => {
                this.setState({appearnceTypeList: res})
            })
        getCodeInfoByType({type: 'ChannelType', currentCenterId: User.currentCenterId})
            .then((res) => {
                this.setState({ChannelTypeList: res})
            })
        getValidPromotorInCurrentCenter({currentCenterId: User.currentCenterId})
            .then(res => {
                this.setState({validPromotorList: res})
            })
        getValidMarketingActivityInCurrentCenter({currentCenterId: User.currentCenterId})
            .then(res => {
                this.setState({validMarketingActivityList: res})
            })
    }
    /**
     * 下一步
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                this.props.emitNext(values)
            }
        })
    };
    /**
     * 上一步
     */
    handlePrev = () => {
        this.props.emitPrev();
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20}
        };

        return (
            <div style={this.props.style}>
                <div className="gym-customer-create-step-wrapper" >
                    <Form className="formWrapper">
                        <Row>
                            <FormItem label={`获取日期`} {...formItemLayout}>
                                {
                                    getFieldDecorator(`inquireDate`, {
                                        rules: []
                                    })(
                                        <DatePicker style={{width: 250}}/>
                                    )
                                }
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'出现方式'} {...formItemLayout}>
                                {getFieldDecorator(`appearanceType`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择出现方式'
                                        }
                                    ]
                                })(
                                    <Select style={{width: 250}} placeholder="请选择出现方式">
                                        {
                                            this.state.appearnceTypeList.map((item, idx) =>
                                                <Option value={item.code} key={idx}>{item.codeValue}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'渠道来源'} {...formItemLayout}>
                                {getFieldDecorator(`channelType`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择渠道来源'
                                        }
                                    ]
                                })(
                                    <Select style={{width: 250}}
                                            placeholder="请选择渠道来源"
                                            onChange={this.onChange}
                                    >
                                        {this.getOptions()}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'是否推荐'} {...formItemLayout}>
                                {getFieldDecorator(`isRecommend`, {
                                    rules: []
                                })(
                                    <Checkbox disabled
                                              checked={this.enableRecommand()}
                                    ></Checkbox>
                                )}
                            </FormItem>
                        </Row>

                        {/* 隐藏表单 begin */}
                        <Row>
                            <FormItem label={'推荐人Id'} {...formItemLayout} style={{display: 'none'}}>
                                {getFieldDecorator(`referalContactId`, {
                                    rules: [],
                                    initialValue: ''
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                        </Row>

                        <Row>
                            <FormItem label={'推荐人LeadsId'} {...formItemLayout} style={{display: 'none'}}>
                                {getFieldDecorator(`referalLeadsId`, {
                                    rules: [],
                                    initialValue: ''
                                })(
                                    <Input/>
                                )}
                            </FormItem>
                        </Row>

                        {/* 隐藏表单 over */}
                        <Row>
                            <FormItem label={'推荐人姓名'} {...formItemLayout}>
                                {getFieldDecorator(`referalName`, {
                                    rules: [{
                                        required: this.enableRecommand(),
                                        message: '请输入推荐人姓名'
                                    }],
                                    initialValue: ''
                                })(
                                    <Input style={{width: 250}}
                                           placeholder={`推荐人姓名`}
                                           disabled={!this.enableRecommand()}
                                           onClick={this.onReferalClick}
                                           ref={input => this.referalNameInput = input}
                                    />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'推荐人手机号码'} {...formItemLayout}>
                                {getFieldDecorator(`referalPhoneNum`, {
                                    rules: [{
                                        required: this.enableRecommand(),
                                        validator: this.validator
                                    }],
                                    initialValue: ''
                                })(
                                    <Input placeholder={`推荐人手机号码`}
                                           style={{width: 250}}
                                           disabled={!this.enableRecommand()}
                                           onClick={this.onReferalClick}
                                           ref={input => (this.referalPhoneNumInput = input)}
                                    />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'渠道备注'} {...formItemLayout}>
                                {getFieldDecorator(`channelComment`, {
                                    rules: [],
                                    initialValue: '',
                                })(
                                    <TextArea rows={4} style={{width: 600, resize: 'none'}}
                                              disabled={this.state.isFromMarketChecked}
                                    />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'是否来源于市场'} {...formItemLayout}>
                                {getFieldDecorator(`isFromMarket`, {
                                    rules: []
                                })(
                                    <Checkbox onChange={this.onIsFromMarketChange}></Checkbox>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'市场渠道名称'} {...formItemLayout}>
                                {getFieldDecorator(`marketingActivityId`, {
                                    rules: []
                                })(
                                    <Select style={{width: 250}}
                                            showSearch
                                            placeholder="请选择"
                                            optionFilterProp="children"
                                            filterOption={true}
                                            onSelect={this.onMarketingActivitySelect}
                                            disabled={!this.state.isFromMarketChecked}>
                                        {this.getValidMarketingActivityOptions()}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label={'Promotor'} {...formItemLayout}>
                                {getFieldDecorator(`promoterId`, {
                                    rules: []
                                })(
                                    <Select style={{width: 250}}
                                            showSearch={true}
                                            optionFilterProp={'children'}
                                            placeholder="请选择"
                                            disabled={!this.state.isFromMarketChecked}>
                                        {this.getValidPromotorOptions()}
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                    </Form>

                    <ListModal
                        visible={this.state.referalVisible}
                        handleOk={this.handleOk}
                        handleCancel={this.handleCancel}
                        okText={`关联`}
                        cancelText={`取消`}
                        destroyOnClose={true}
                    >
                        <div>
                            <PageTitle title={`选择推荐人`}/>
                            <RecmdModalContent callback={this.setRecommend}/>
                        </div>
                    </ListModal>
                </div>
                <div className='gym-customer-create-tabs-button mt20'>
                    <button className='gym-button-white gym-button-xs mr15' onClick={this.handlePrev}>上一步</button>
                    <button className='gym-button-default gym-button-xs' onClick={this.handleSubmit}>保存</button>
                </div>
            </div>


        )
    }
}

export {LeadsInformation}
