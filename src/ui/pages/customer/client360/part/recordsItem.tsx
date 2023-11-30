import React from 'react';
import { taskThemeCode} from '../../enum/client360';
import moment from 'moment';
import { Filter } from "@/common/filters/filter";


class RecordsItem extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state={}
  }

  getThemeElement = ()=>{
    const data = this.props.data;
    let elem = "未知";
    for(let key in taskThemeCode){
        if(taskThemeCode[key] === data.taskTheme){
            elem = key;
            break;
        }
    }
    return <div className="typeBtn">{elem}</div>
  };

  onItemClick = ()=>{
    this.props.onItemClick(this.props.data)
  };

  render(){
    const {data} = this.props;
    return(
      <React.Fragment>
        <div className="records-item" onClick={this.onItemClick}>
          <div className="upper">
            {this.getThemeElement()}
            <div className="miaoshu">
                <div>{Filter.formatTaskStatus(data.taskStatus)}</div>
                <div>{data.description}</div>
            </div>
          </div>
          <div className="timestr">
            <span>创建人：{data.createByName}</span>
              <div>
                  <div>创建时间：{data.createDate && moment(data.createDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div>任务时间：{data.taskTime && moment(data.taskTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                  {/*Todo */}
                  <div>任务完成时间：{data.completeTime && moment(data.completeTime).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export {RecordsItem};
