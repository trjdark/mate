import React from 'react';
import './index.scss'

class ReserveRow extends React.Component<any,any>{
  constructor(props){
    super(props)
    this.state={};
  }

  render(){
    const {
      name,
      nameWidth,
      render,
      className,
      hasBordertop
    } = this.props;

    return(
      <React.Fragment>
        <div className={`reserve-row ${hasBordertop?'reserve-row-border-top':''} ${className}`}>
          <div className="left"
               style={{width:nameWidth?nameWidth:'150px'}}>
            {name}
          </div>
          <div className="right">
            {
              render()
            }
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export {ReserveRow};