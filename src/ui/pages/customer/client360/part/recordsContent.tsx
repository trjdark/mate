import React from 'react';
import {RecordsItem} from './recordsItem';
import EditorTaskForm from '@/ui/component/editTaskForm';

class RecordsContent extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state = {
      showEditModel:false,
      currTaskId:''
    }
  }
  onItemClick = (data)=>{
    this.setState({
      currTaskId:data.mainTaskId
    },()=>{
      this.switchEditModel(true)
    })
  }

  switchEditModel = (bool)=>{
    this.setState({showEditModel:bool})
  }

  render(){
    const {basicInfo} = this.props;
    return(
      <React.Fragment>
        <div className="records-content">
          {
            basicInfo &&
            (basicInfo.taskDoneInfos || []).map((item,idx)=>{
              return <RecordsItem data={item} key={idx} onItemClick={this.onItemClick} />
            })
          }
        </div>

        <div className="footer"></div>

        {
          this.state.showEditModel
              ? <EditorTaskForm
                  switchEditModel={this.switchEditModel}
                  taskId={this.state.currTaskId}
                  leadsId={this.props.leadsId}
              />
              : null
        }
      </React.Fragment>
    )
  }
}

export {RecordsContent};
