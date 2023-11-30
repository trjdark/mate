import React from 'react';
import {Link} from 'react-router-dom';
import {Popover} from 'antd';
import {Icon} from "@/ui/component/icon";
import {Routes} from "@/router/enum/routes";
import {recordTelephoneMembers} from "@redux-actions/telephone/callLeads";
import moment from 'moment';
import {CommonUtils} from "@/common/utils/commonUtils";
declare interface itemProps {
  info:any,
  key?:number,
  visible?:boolean
  leadsId:string
  isCall:boolean
  phaseValue:string
  logList?:any
}

class ContactItem extends React.Component<itemProps,any>{
  constructor(props){
    super(props);
    this.state={}
  }
  toggleCellphone = (cp)=>{
    if(!cp){
        return ''
    }

    if (!this.props.visible) {
      return cp.substring(0,3)+'****'+cp.substring(cp.length-4)
    } else {
      return cp
    }
  };
  handleCall = () => {
      recordTelephoneMembers([this.props.leadsId]);
      window.open(Routes.语音拨打.path, 'call');
  };
  log = () => {
      const logList = this.props.logList || [];
      if(logList.length > 0){
          return (
              <div className='contactWrapper-tooltip'>
                  <div className='contactWrapper-tooltip-row'>
                      <span className='contactWrapper-tooltip-time'>导入时间</span>
                      <span className='contactWrapper-tooltip-remark'>备注</span>
                  </div>
                  {
                      logList.map((item:any, index:number) => (
                          <div className='contactWrapper-tooltip-row' key={`log-${index}`}>
                              <span className='contactWrapper-tooltip-time'>{moment(item.importDate).format('YYYY-MM-DD')}</span>
                              <span className='contactWrapper-tooltip-remark'>{item.contactRemark}</span>
                          </div>
                      ))
                  }

                  <div className='contactWrapper-tooltip-footer'>
                      <Link to={`${Routes.渠道日志.link}${CommonUtils.stringify({leadsId:this.props.leadsId})}`}>
                          详情
                      </Link>
                  </div>
              </div>
          )
      }else{
          return null
      }
  }
  render(){
    const cellphone = this.toggleCellphone(this.props.info.primaryContactTel);
    const {isCall, phaseValue} = this.props;
    const options = ['已领取', '已联络', '诺访', '已到访', '新会员', '老会员'];
    const status = options.includes(phaseValue);
    return(
      <div className="contactItem">
        <Popover placement="bottom" title={this.log()} trigger="hover">
          <div className="flexWrapper">
            <div>
              <span className={`main ${this.props.info.isPrimaryContact?'':'nomain'}`}>
                主
              </span>
              <span className="type">{this.props.info.familyRelationValue}</span>
              <span className="name">{this.props.info.contactName}</span>
            </div>
            <div>
              <span className="cellphone">{cellphone}</span>
              {
                  (isCall && status) &&
                  <span className="call" onClick={this.handleCall}><Icon type="bohao"/></span>
              }
            </div>

          </div>
        </Popover>
      </div>
    )
  }
}

export {ContactItem};
