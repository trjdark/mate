/**
 * desc: 请假申请详情
 * User: dean.yue
 * Date: 2020/9/27
 * Time: 上午10:00
 */
import { Modal, Form } from 'antd';
import React, { Fragment } from 'react'
import {PageTitle} from "@/ui/component/pageTitle";
const FormItem = Form.Item
class LeaveDetailModal extends React.Component<any,any> {
  
  render() {
    const configLeaveType = {
      '29001':"事假",
      '29002':"病假"
  }
    const configLeaveSource = {
      '1501001': 'Mate',
      '1501002': '启蒙App'}
    
    const { visible, onCancel, leaveDetailList} = this.props
    const leaveType = configLeaveType[leaveDetailList.leaveType] || '--'
    const operateSource = configLeaveSource[leaveDetailList.operateSource] || '--'
    return (
      <Fragment>
        <Modal
          visible={visible}
          footer={null}
          onCancel={() => onCancel(false)}
          centered={true}
          className="gym-leaveDetail-modal"
        >
          <div>
              <PageTitle title='请假申请'/>
              <Form className="gym-channel-form">
                  <FormItem label="宝宝姓名" className="gym-input-wrap">
                    <span>{ leaveDetailList.babyName }</span>                  
                  </FormItem>
                  <FormItem label="上课时间" className="gym-input-wrap">
                    <span> { 
                      leaveDetailList.lessonDate
                    } </span>  
                  </FormItem>
                  <FormItem label="课程" className="gym-input-wrap">
                    <span> { leaveDetailList.courseCode } </span>  
                  </FormItem>
                  <FormItem label="历史请假" className="gym-input-wrap">
                    <span> { leaveDetailList.totalLeaveTimes } </span>  
                  </FormItem>
                  <FormItem label="请假类型" className="gym-input-wrap">
                    <span> { leaveType
                    } </span>  
                  </FormItem>
                  <FormItem label="GB" className="gym-input-wrap">
                    <span> { leaveDetailList.gbStaffName } </span>  
                  </FormItem>
                  <FormItem label="操作时间" className="gym-input-wrap">
                    <span>  {leaveDetailList.operateTime} </span>  
                  </FormItem>
                  <FormItem label="操作人员" className="gym-input-wrap">
                    <span> {leaveDetailList.operateStaff} </span>  
                  </FormItem>
                  <FormItem label="操作来源" className="gym-input-wrap">
                    <span> {operateSource} </span>  
                  </FormItem>
                  <FormItem label="请假事由" className="gym-input-wrap">
                    <span>{leaveDetailList.leaveRemark}</span>  
                  </FormItem>
              </Form>
            
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export { LeaveDetailModal }