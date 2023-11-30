import React from 'react';
import {Carousel} from 'antd';
import {MemoItem} from './memoItem'
import {MemoItemNone} from './memoItemNone'
import EditorTaskForm from '@/ui/component/editTaskForm';
import _ from 'lodash'

class Memos extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state={
      idx:'',
      currTaskId:'',
      showEditModel:false
    }
  }

  switchEditModel = (boolean)=>{
    this.setState({showEditModel:boolean})
  }

  handleOk = ()=>{
    this.props.pageRefresh()
  }

  onItemClick = (idx,task)=>{
    this.setState({
      idx,
      currTaskId:task.mainTaskId
    },()=>{
      this.setState({showEditModel:true})
    })
  }

  render() {
    const {memoArr,leadsId} = this.props;
    let newArr = [[]];
    if (memoArr && memoArr.length>0) {
      newArr = _.chunk(memoArr,3)
    }
    if (newArr.length>3) {
      newArr = _.take(newArr,3)
    }

    return(
      <div className="memosContent">

        {
          this.state.showEditModel
              ? <EditorTaskForm
                  switchEditModel={this.switchEditModel}
                  taskId={this.state.currTaskId}
                  handleOk={this.handleOk}
                  leadsId={leadsId}
              />
              : null
        }

        <Carousel>
          {newArr.map((items,idx)=>
            <div className="memoItemsWrapper" key={idx}>
              <div className="memoItemsFuxxingWrapper2">
                {items[0]?(
                  <MemoItem data={items[0]}
                            idx={idx*3+0}
                            onItemClick={this.onItemClick}
                            currIdx={this.state.idx}
                  />
                ):(
                  <MemoItemNone />
                )}
                {items[1]?(
                  <MemoItem data={items[1]}
                            idx={idx*3+1}
                            onItemClick={this.onItemClick}
                            currIdx={this.state.idx}
                  />
                ):(
                  <MemoItemNone />
                )}
                {items[2]?(
                  <MemoItem data={items[2]}
                            idx={idx*3+2}
                            onItemClick={this.onItemClick}
                            currIdx={this.state.idx}
                  />
                ):(
                  <MemoItemNone />
                )}
              </div>
            </div>
          )}
        </Carousel>
      </div>
    )
  }
}

export {Memos}
