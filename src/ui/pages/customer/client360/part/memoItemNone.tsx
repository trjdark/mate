import React from 'react';

class MemoItemNone extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state={};
  }

  render(){
    return(
      <React.Fragment>
        <div className="memoItemNone">
          <img src={require(`@/images/default.png`)} />
          <div>暂无数据</div>
        </div>
      </React.Fragment>
    )
  }
}

export {MemoItemNone};