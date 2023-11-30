import React from 'react'
import {Form,Row,Col,Radio, Modal } from 'antd';
import {Input, InputNumber} from "@/ui/component/input";
import {Select,Option} from "@/ui/component/select";
import {checkPrimaryContactTel} from '@redux-actions/customerCreate'
import {User} from "@/common/beans/user";
import {handleValidate, Validation} from "@/common/utils/validate";
import {CrossCenterSearch} from './crossCenterSearch'
import {PageTitle} from '@/ui/component/pageTitle';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class ContactInformationContent extends React.Component<any,any> {
    constructor(props) {
        super(props)
        this.state = {
            cellphoneCheckMsg:'',
            visible:false,
            cellphoneCheckType:''
        }
    }
    // Todo 临时解决方案
    componentDidMount(){
        setTimeout(() => {
            const {data} = this.props;
            if(data.primaryContactTel){
                this.checkTele(data.primaryContactTel)
            }
        },1000);
    }
    onFamilyChange = (e)=>{
        this.props.onTitleChange({value:e.key,key:this.props.tabKey})
    }

    onJobChange = (e)=>{
        let fieldLabel = `job-${this.props.tabKey}`
        this.props.form.setFieldsValue({ [fieldLabel]: e.key })
    }

    onCellphoneChange = (e)=>{
        const {value} = e.target;
        // 验证手机号格式后才调用接口：
        if (/^1[3456789]\d{9}$/.test(value)) {
          this.checkTele(value)
        } else {
          this.setState({cellphoneCheckMsg:''})
        }
    }
    checkTele = (value)=>{
      checkPrimaryContactTel({
        currentCenterId:User.currentCenterId,
        primaryContactTel:value,
        contactId:this.props.data?this.props.data.id:''
      }).then(res => {
        this.setState({
          cellphoneCheckMsg:res.msg,
          cellphoneCheckType:res.type
        });
        // 重复手机号，提交时弹出提示，无法创建
        // 若为0，则正常；若为1，则本中心冲突；若为2，则与其他中心冲突
        if (res.type===1) {
          this.props.form.setFieldsValue({
            [`cellphoneExisted-${this.props.tabKey}`]:res.msg
          })
        } else {
          this.props.form.setFieldsValue({
            [`cellphoneExisted-${this.props.tabKey}`]:''
          })
        }
      })
    }

    cellphoneCheckClick = ()=>{
      if (this.state.cellphoneCheckType === 2) {
        this.setState({visible:true})
      }
    };

    onCancel = ()=>{
      this.setState({visible:false})
    };

    render() {
        let {isPhoneEdit = true, isEdit=true, data } = this.props;
        isPhoneEdit=(isPhoneEdit || !data.id);
        const {familyRelationList, jobList} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            }
        };
        return (
            <div>
              <Modal
                title={<PageTitle title="跨中心查询" className="" />}
                visible={this.state.visible}
                footer={null}
                onCancel={this.onCancel}
                maskClosable={true}
                width={800}
                className='crossCenterSearch'
                destroyOnClose={true}
              >
                <CrossCenterSearch tel={this.props.form.getFieldValue(`primaryContactTel-${this.props.tabKey}`)} />
              </Modal>
              <Row>
                {
                  this.props.data &&
                  <FormItem label={'id'} {...formItemLayout} style={{display:'none'}}>
                      {getFieldDecorator(`id-${this.props.tabKey}`, {
                          rules: [],
                          initialValue: data.id
                      })(
                          <Input placeholder={`id`}/>
                      )}
                  </FormItem>
                }
              </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={'是否主要联系人'} {...formItemLayout}>
                            {getFieldDecorator(`isPrimaryContact-${this.props.tabKey}`, {
                                initialValue: data.isPrimaryContact
                            })(
                                <RadioGroup disabled={!isEdit}>
                                  <Radio value={1}>是</Radio>
                                  <Radio value={0}>否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'QQ'} {...formItemLayout}>
                            {getFieldDecorator(`qq-${this.props.tabKey}`, {
                                rules: [
                                    {validator:handleValidate[Validation.正整数]}
                                ],
                                initialValue: data.qq || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`QQ`} maxLength={50} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={'家庭关系'} {...formItemLayout}>
                            {getFieldDecorator(`familyRelation-${this.props.tabKey}`, {
                                rules: [{required: true, message: '请填写家庭关系'}],
                                initialValue: {key: data.familyRelation || ''}
                            })(
                                <Select
                                    disabled={!isEdit}
                                    labelInValue
                                    style={{ width: 200 }}
                                    onChange={this.onFamilyChange}
                                    placeholder={'请选择'}
                                >
                                    {
                                        familyRelationList.map((item,idx)=>
                                            <Option value={item.code} key={`relation_${idx}`}>{item.codeValue}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'Email'} {...formItemLayout}>
                            {getFieldDecorator(`email-${this.props.tabKey}`, {
                                rules: [{
                                    validator:handleValidate[Validation.邮箱]
                                }],
                                initialValue: data.email || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`Email`}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <FormItem label={'是否法定监护人'} {...formItemLayout}>
                            {getFieldDecorator(`isLegalGuardian-${this.props.tabKey}`, {
                                rules: [{ required: true,message:'请选择'}],
                                initialValue: data.isLegalGuardian
                            })(
                                <RadioGroup disabled={!isEdit}>
                                  <Radio value={1}>是</Radio>
                                  <Radio value={0}>否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'年龄'} {...formItemLayout}>
                            {getFieldDecorator(`age-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.age || ''
                            })(
                                <InputNumber disabled={!isEdit} placeholder={`年龄`} max={200} min={1}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <FormItem label={'姓名'} {...formItemLayout}>
                            {getFieldDecorator(`contactName-${this.props.tabKey}`, {
                                initialValue: data.contactName || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`如需使用电子合同，请完善法定监护人姓名`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'职业'} {...formItemLayout}>
                            {getFieldDecorator(`job-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.job || ''
                            })(
                                <Select disabled={!isEdit} onChange={this.onJobChange}>
                                  {
                                      jobList.map((item,idx)=>
                                          <Option value={item.code} key={`job_${idx}`}>{item.codeValue}</Option>
                                      )
                                  }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem
                            {...formItemLayout}
                            label={'手机'}
                        >
                            {getFieldDecorator(`primaryContactTel-${this.props.tabKey}`, {
                                rules: [
                                    {
                                        required:true,
                                        validator:handleValidate[Validation.手机号]
                                    }
                                ],
                                initialValue: data.primaryContactTel || ''
                            })(
                                <Input disabled={!isPhoneEdit} placeholder={`手机`} onChange={(e)=>this.onCellphoneChange(e)} style={{width:200}}/>
                            )}
                        </FormItem>

                    </Col>
                    <Col>
                        <span className="cellphoneCheckStr" onClick={this.cellphoneCheckClick}>
                            {this.state.cellphoneCheckMsg}
                          </span>
                    </Col>
                </Row>

                <Row style={{display:'none'}}>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`cellphoneExisted-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.cellphoneExisted || ''
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <FormItem label={'座机'} {...formItemLayout}>
                            {getFieldDecorator(`telephoneNumber-${this.props.tabKey}`, {
                                rules: [
                                    {
                                        validator:handleValidate[Validation.座机]
                                    }
                                ],
                                initialValue: data.telephoneNumber || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`座机`}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'工作单位'} {...formItemLayout}>
                            {getFieldDecorator(`company-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.company || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`工作单位`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <FormItem label={'其他电话'} {...formItemLayout}>
                            {getFieldDecorator(`otherTel-${this.props.tabKey}`, {
                                rules: [
                                    {
                                        validator:handleValidate[Validation.正整数]
                                    }
                                ],
                                initialValue: data.otherTel || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`其他电话`}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'备注'} {...formItemLayout}>
                            {getFieldDecorator(`remark-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.remark || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`备注`} />
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <FormItem label={'微信'} {...formItemLayout}>
                            {getFieldDecorator(`weChat-${this.props.tabKey}`, {
                                rules: [],
                                initialValue: data.weChat || ''
                            })(
                                <Input disabled={!isEdit} placeholder={`微信`} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            {...formItemLayout}
                            label={'身份证'}
                        >
                            {getFieldDecorator(`identityCard-${this.props.tabKey}`, {
                                rules: [{required:false, message: '请填写身份证'}],
                                initialValue: data.identityCard || ''
                            })(
                                <Input placeholder={`如需使用电子合同，请完善监护人身份证号`} disabled={!isEdit}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
}

export {ContactInformationContent}
