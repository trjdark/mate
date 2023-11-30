import React, { Component } from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import { Form, Row, Col, Button, message} from 'antd'
import {Select, Option as SelectOption} from "@/ui/component/select";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import { getFinancialAdministration, setFinancialAdministration } from '@/redux-actions/setting/financialAdministration'
import {User} from "../../../../common/beans/user";
import {updateApprovalList} from '@/redux-actions/setting/center'
import './part/style.scss'


@connect((state) => ({
  staffList:selectTotalEmployeeList(state, {workingStatus: "1",}) // 所有在职员工列表
}), {updateApprovalList})
class FinanceAdministration extends Component<any,any> {
  constructor(props){
    super(props)
    this.state = {
      firstStaffId:null,  // 员工1
      secondStaffId:null,  // 员工2
      id:null
    }
  }
  private routes:Array<any> = [
    {
        name: '设置',
        path: '',
        link: '#',
        id: 'setting'
    },{
        name: '过期合同确认权限设置',
        path: '',
        link: '#',
        id: 'operation'
    }
  ]
  componentDidMount(){
   getFinancialAdministration({
      currentCenterId:User.currentCenterId
    }).then(res => {
      const { firstStaffId, secondStaffId, id } = res
      this.setState({
        firstStaffId,
        secondStaffId,
        id
      })
    })
  }
  /**
   * @param e
   * 数据提交
   */
  handleSubmit = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.state
        const { firstStaffId, secondStaffId } = values
        setFinancialAdministration({
          id,
          firstStaffId,
          secondStaffId,
          currentCenterId:User.currentCenterId
        }).then(()=>{
         this.props.updateApprovalList({
            currentCenterId:User.currentCenterId,
            staffId:User.userId
          })
          this.setState({
            firstStaffId,
            secondStaffId
          },message.success('提交成功'))
        })
      }
    });
  }
  render() {
    const { staffList, form } = this.props
    const { firstStaffId, secondStaffId } = this.state
    const { getFieldDecorator } = form
    return (
      <div>
        <BreadCrumb routes={this.routes}/>
        <div className='page-wrap'>
          <Form onSubmit={this.handleSubmit}>
            <Row>
                <Col>
                  <Form.Item>
                    <span>过期合同确认人设置：</span>
                  </Form.Item>
                </Col>
            </Row>
            <Row type={"flex"} gutter={100}  className="gym-finance-administration">
                <Col>
                  <Form.Item
                    label={"过期合同确认人1"}
                    className="gym-finance-administration-formitem"
                  >
                    {
                      getFieldDecorator('firstStaffId',{
                        // 列表没有这项数据时 渲染空
                        initialValue:staffList.findIndex(item => {
                         return firstStaffId === item.staffId
                        }) !== -1 ? firstStaffId : ''
                      })(
                        <Select
                          allowClear={true}
                          showSearch
                          className="gym-finance-administration-formitem-select"
                          optionFilterProp="children"
                          filterOption={(input,option) => {
                            const text = option.props.children as string;
                            return  text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }}
                        >
                        {
                          staffList.map((item:any) => (
                            <SelectOption key={item.staffId}>{item.userName}</SelectOption>
                          ))
                        }
                        </Select>
                        )
                    }
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label={"过期合同确认人2"}
                    className="gym-finance-administration-formitem"
                  >
                    {
                      getFieldDecorator('secondStaffId',{
                        initialValue:staffList.findIndex(item => {
                          return secondStaffId === item.staffId
                         }) !== -1 ? secondStaffId : ''
                      })(
                        <Select
                          allowClear={true}
                          showSearch
                          className="gym-finance-administration-formitem-select"
                          optionFilterProp="children"
                          filterOption={(input,option) => {
                            const text = option.props.children as string;
                            return text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }}
                        >
                        {
                          staffList.map((item:any) => (
                          <SelectOption key={item.staffId}>{item.userName}</SelectOption>
                          ))
                        }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col>
                <Form.Item className="gym-form-item">
                  <div className="gym-search-form-btn">
                    <Button htmlType="submit" className='gym-button-xs gym-button-blue'>提交</Button>
                    <Button className='gym-button-xs gym-button-wBlue ml15' onClick={()=>{
                      // 清空表单控件
                      form.setFields({
                        secondStaffId:{
                          value:'',
                        },
                        firstStaffId:{
                          value:'',
                        }
                      })
                    }}>清空</Button>
                  </div>
                </Form.Item>
                </Col>
            </Row>
          </Form>

        </div>
      </div>
    );
  }
}

const financeAdministration = Form.create<any>()(FinanceAdministration);
export { financeAdministration }
