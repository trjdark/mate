import React from 'react';
import {Icon} from '@/ui/component/icon'
import {priority} from '../../enum/client360';
import moment from 'moment';

class MemoItem extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {}
  }

  onItemClick = ()=>{
    this.props.onItemClick(this.props.idx,this.props.data)
  }

  render(){
    const {data,currIdx,idx} = this.props;
    return(
      <div className={`memoItem ${currIdx===idx?'selected':''}`}
           onClick={this.onItemClick}
      >
        {
          (data.taskTheme === '70001') &&
          <div className="title">
            <Icon className="iconSize" type='lianxi'/>
            <span className="theme">联系</span>
          </div>
        }
        {
          (data.taskTheme === '70002') &&
          <div className="title">
            <Icon className="iconSize" type='miantan'/>
            <span className="theme">面谈</span>
          </div>
        }
        {
          (data.taskTheme === '70003') &&
          <div className="title">
            <Icon className="iconSize" type='qianyue'/>
            <span className="theme">签约</span>
          </div>
        }
        {
          (data.taskTheme === '70004') &&
          <div className="title">
            <Icon className="iconSize" type='qita1'/>
            <span className="theme">其他</span>
          </div>
        }
          {
              (data.taskTheme === '70005') &&
              <div className="title">
                  <Icon className="iconSize" type='lianxi'/>
                  <span className="theme">TMK</span>
              </div>
          }
          {
              (data.taskTheme === '70006') &&
              <div className="title">
                  <Icon className="iconSize" type='lianxi'/>
                  <span className="theme">云语音</span>
              </div>
          }
          {
              (data.taskTheme === '70007') &&
              <div className="title">
                  <Icon className="iconSize" type='lianxi'/>
                  <span className="theme">TMK转入中心跟进</span>
              </div>
          }{
          (data.taskTheme === '70008') &&
          <div className="title">
              <Icon className="iconSize" type='lianxi'/>
              <span className="theme">TMK首次转入中心跟进</span>
          </div>
      }{
          (data.taskTheme === '70009') &&
          <div className="title">
              <Icon className="iconSize" type='lianxi'/>
              <span className="theme">转至TMK跟进</span>
          </div>
      }

        <div className="contentWrapper">
          <div className="content">
            {data.description}
          </div>
        </div>

        <div className="footer">
          <span>{moment(data.taskTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          {
            data.priority===priority['紧急'] &&
            <img src={require(`@/images/priority.png`)} />
          }
        </div>
      </div>
    )
  }
}

export {MemoItem}
