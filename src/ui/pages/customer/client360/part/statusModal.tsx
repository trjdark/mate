import React from 'react';
import {PageTitle} from "../../component/client360WrapperTitle";
import {FormFieldPair as Pairs} from '@/ui/component/FormFieldPair'
import {Form,Input,Radio,DatePicker,Row,Select,Checkbox} from 'antd'
import {User} from "@/common/beans/user";
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class StatusModal extends React.Component<any,any>{
  constructor(props){
    super(props)
    this.state={
      status:'',// 已联络 已诺访 已到访 放弃
      bbnames:''
    }
  }

  onStatusChange = (e) => {
    this.setState({status: e.target.value});
    switch (e.target.value) {
      case '已联络':
        this.setState({status:'已联络'},()=>{
          this.props.form.setFieldsValue({
            taskThemeCode:'联系',
            fuwuduixiang:this.state.bbnames,
            taskStatus:'联系成功'
          })
        })
        break;
      case '诺访':
        this.setState({status:'诺访'},()=>{
          this.props.form.setFieldsValue({
            taskThemeCode:'面谈',
            fuwuduixiang:this.state.bbnames,
            taskStatus:'待完成'
          })
        })
        break;
      case '已到访':
        this.setState({status:'已到访'},()=>{
          this.props.form.setFieldsValue({
            taskThemeCode:'面谈',
            fuwuduixiang:this.state.bbnames,
            taskStatus:'已到访'
          })
        })
        break;
      case '放弃':
        this.setState({status:'放弃'})
        break;
      default:
        return;
    }
  }

  onDateChange = (d)=>{
    if (d) {
      this.props.form.setFieldsValue({taskTime:d.valueOf()})
    } else {
      this.props.form.setFieldsValue({taskTime:undefined})
    }
  }

  onDateOk = (d)=>{
  }

  setbbNames = ()=>{
    let names = '';
    this.props.basicInfo.babyInfos.forEach((item,idx,arr)=>{
      if (idx===arr.length-1) {
        names = names + item.babyName
      } else {
        names = names + item.babyName +'/'
      }
    })
    this.setState({bbnames:names})
  }

  onPriorityChange = (e)=>{
    let checked = e.target.checked;
    this.props.form.setFieldsValue({priority:checked})
  }

  componentDidMount(){
    this.setbbNames()
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const {basicInfo} = this.props;

    let radios;
    switch (basicInfo.phaseValue) {
      case '已领取':
        radios= <RadioGroup onChange={this.onStatusChange}>
                  <Radio value={'已联络'}>已联络</Radio>
                  <Radio value={'放弃'}>放弃</Radio>
                </RadioGroup>
        break;
      case '已联络':
        radios= <RadioGroup onChange={this.onStatusChange}>
                  <Radio value={'诺访'}>诺访</Radio>
                  <Radio value={'放弃'}>放弃</Radio>
                </RadioGroup>
        break;
      case '诺访':
        radios= <RadioGroup onChange={this.onStatusChange}>
                  <Radio value={'已到访'}>已到访</Radio>
                  <Radio value={'放弃'}>放弃</Radio>
                </RadioGroup>
        break;
      case '已到访':
        radios= <RadioGroup onChange={this.onStatusChange}>
                  <Radio value={'放弃'}>放弃</Radio>
                </RadioGroup>
        break;
      default:
        return;
    }

    return(
      <div className="status-modal">
          <div>
            <PageTitle title={'客户状态'} hn={'h4'}/>
            <Pairs labelTxt="当前状态"
                   labelCol={6}
                   render={()=>(
                     <FormItem>
                       {getFieldDecorator('currentStatus', {
                         rules:[],
                         initialValue:basicInfo.phaseValue
                       })(
                         <Input style={{width:'200px'}} disabled />
                       )}
                     </FormItem>
                   )}
            />
            <Pairs labelTxt="更改状态"
                   labelCol={6}
                   required={true}
                   render={()=>(
                     <FormItem>
                       {getFieldDecorator('nextStatus', {
                         rules:[{
                            required: true,
                            message: '请选择改状态',
                          }],
                         initialValue:''
                       })(
                         radios
                       )}
                     </FormItem>
                   )}
            />
          </div>

          {(this.state.status==='已联络' ||
            this.state.status==='诺访' ||
            this.state.status==='已到访')?(
            <div>
              <PageTitle title={'任务补充'} hn={'h4'}/>
              <Pairs labelTxt="发起人"
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('faqiren', {
                           rules:[],
                           initialValue:User.englishName+' '+User.chineseName
                         })(
                           <Input style={{width:'200px'}} disabled />
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="执行人"
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('zhixingren', {
                           rules:[],
                           initialValue:User.englishName+' '+User.chineseName
                         })(
                           <Input style={{width:'200px'}} disabled />
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="服务对象"
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('fuwuduixiang', {
                           rules:[],
                           initialValue:''
                         })(
                           <Input style={{width:'200px'}} disabled />
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="主题"
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('taskThemeCode', {
                           rules:[],
                           initialValue:''
                         })(
                           <Input style={{width:'200px'}} disabled />
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="任务时间"
                     labelCol={6}
                     required={true}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('taskTime', {
                           rules:[{
                               required: true,
                               message: '请选择任务时间！',
                           }]
                         })(
                           <Row type="flex">
                             <DatePicker
                                         showTime
                                         format="YYYY-MM-DD HH:mm:ss"
                                         placeholder="请选择时间"
                                         onChange={this.onDateChange}
                                         onOk={this.onDateOk}
                             />
                           </Row>
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="提醒时间"
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('remindFrequencyTime', {
                           rules:[],
                           initialValue:30
                         })(
                            <Select style={{ width: 200 }}>
                                <Option value={30}>任务开始前30分钟</Option>
                                <Option value={60}>任务开始前1小时</Option>
                                <Option value={120}>任务开始前2小时</Option>
                                <Option value={360}>任务开始前6小时</Option>
                                <Option value={1440}>任务开始前24小时</Option>
                            </Select>
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="任务描述"
                     labelCol={6}
                     required={true}
                     rowNoMiddle={true}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('taskDesc', {
                           rules:[{
                              required: true,
                              message: '请填写任务描述',
                            }],
                           initialValue:''
                         })(
                            <TextArea rows={4} style={{width:'500px'}} maxLength={3000} />
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="任务状态"
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('taskStatus', {
                           rules:[],
                           initialValue:''
                         })(
                           <Input style={{width:'200px'}} disabled />
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="是否紧急"
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('priority', {
                           rules:[],
                           initialValue:false
                         })(
                           <Checkbox onChange={this.onPriorityChange}></Checkbox>
                         )}
                       </FormItem>
                     )}
              />
            </div>
          ):(null)}

          {this.state.status==='放弃'?(
            <div>
              <PageTitle title={'放弃原因'} hn={'h4'}/>
              <Pairs labelTxt="放弃原因分类"
                     required={true}
                     labelCol={6}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('recycleType', {
                           rules:[{
                              required: true,
                              message: '请选择放弃原因',
                            }],
                           initialValue:'80001'
                         })(
                            <Select style={{ width: 200 }}>
                              <Option value="80001">联系未果-错/空号</Option>
                              <Option value="80002">其他中心</Option>
                              <Option value="80003">其他品牌</Option>
                              <Option value="80004">未知</Option>
                            </Select>
                         )}
                       </FormItem>
                     )}
              />
              <Pairs labelTxt="放弃原因描述"
                     labelCol={6}
                     required={true}
                     rowNoMiddle={true}
                     render={()=>(
                       <FormItem>
                         {getFieldDecorator('recycleReason', {
                           rules:[{
                              required: true,
                              message: '请填写放弃原因描述',
                            }],
                           initialValue:''
                         })(
                            <TextArea rows={4} style={{width:'500px'}} maxLength={200} />
                         )}
                       </FormItem>
                     )}
              />
            </div>
          ):(null)}
      </div>
    )
  }
}

export {StatusModal};
