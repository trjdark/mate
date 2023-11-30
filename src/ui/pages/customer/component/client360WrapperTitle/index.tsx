// dave.zhang
import React from 'react';
import {Icon} from "@/ui/component/icon";
import './index.scss';

declare interface PageTitleProps {
    title:string | React.ReactNode;
    hn:string;
    className?:string;
    news?:string;
    collapseStatus?:any;
    isCollapse?:any;
}

class Title extends React.Component<any,any>{
  render(){
    const {title,news} = this.props;
    const img = require('@/images/new-task.png')
    return(
      <React.Fragment>
        <Icon className='gym-page-title-icon' type={`biaoti`}/>
        <span className="title">
          <span>{title}</span>
          {
            (news && news>0)?(
              <div className="news"
                   style={{background:`no-repeat center url(${img})`}}
              >{news}</div>
            ):(null)
          }
        </span>
      </React.Fragment>
    )
  }
}

class PageTitle extends React.Component<PageTitleProps,any>{
    render(){
        const {
          title,hn,className,news,
          collapseStatus,isCollapse
        } = this.props;
        return(
            <div className={`gym-page-title-360 ${className}`}>
              {(hn==='h3')?(
                <h3>
                  <Title title={title} news={news} />
                </h3>
              ):(null)}
              {(hn==='h4')?(
                <h4>
                  <Title title={title} news={news} />
                </h4>
              ):(null)}

              {
                (isCollapse && collapseStatus === true) &&
                <div className="title-arrow">
                  <span className="name">展开</span>
                </div>
              }
              {
                (isCollapse && collapseStatus === false) &&
                <div className="title-arrow">
                  <span className="name">收起</span>
                </div>
              }
            </div>
        )
    }
}

export {PageTitle}
