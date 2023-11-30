import React from 'react';
import {Row,Col} from 'antd'
import './index.scss'

declare interface props {
  labelTxt:string,
  labelCol:number,
  required?:boolean,
  rowNoMiddle?:boolean,
  render:()=>{}
}

class FormFieldPair extends React.Component<props,any>{
  constructor(props){
    super(props)
    this.state={}
  }
  render(){
    const {labelCol,labelTxt,rowNoMiddle}=this.props;
    return(
      <React.Fragment>
        <Row className="form-field-pair"
             type={ rowNoMiddle ? null : 'flex' }
             align="middle"
        >
          <Col span={labelCol}
               className={`label ${this.props.required?'required':''}`}
          >
            {labelTxt}：
          </Col>
          <Col span={(24-labelCol)} className="item">
            {
              this.props.render()
            }
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export {FormFieldPair};
