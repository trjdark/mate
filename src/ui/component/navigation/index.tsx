/**
 *Desc: 页面椭圆状导航栏
 *User: Debby.Deng
 *Date: 2018/9/25,
 *Time: 上午10:53
 */
import * as React from "react";
import './index.scss';


declare interface navProps {
  name?: string,//阶段后台字段
  title: any,//阶段名称
  phaseId: string,//阶段ID
  number?: string,//阶段数量
  onClick?: (i) => (void),
}

declare interface navConfig {
  navList: Array<navProps>,//导航栏文本数组，可写元素
  className?: string,
  onClick?: (i, id) => (void),//最外层点击事件
  activeIndex?: number,//哪个导航高亮
}

class Navigation extends React.Component <navConfig, any> {
  state = {
    activeIndex: this.props.activeIndex
  };
  handleClick = (i, phaseId) => {
      if(i!==this.state.activeIndex){
          this.setState({activeIndex: i});
          const clickProps = this.props.navList[i].onClick;
          clickProps && clickProps(i);
          this.props.onClick(i, phaseId);
      }
  };

  componentDidMount() {

  }

  render() {
    const activeIndex = this.state.activeIndex;
    return (
      <ul className={`gym-round-nav ${this.props.className}`}>
        {(this.props.navList || []).map((nav, index) => {
          return (<li key={index}
                      className={` gym-round-nav-li ${index === activeIndex - 1 ? 'bgDefault' : ''}`}>
            <div className={`${activeIndex === index ? 'active' : ''} gym-round-nav-li-inside`}
                 onClick={this.handleClick.bind(this, index, nav.phaseId)}>
              <div>{nav.title}<p>{nav.number}</p></div>
            </div>
          </li>)
        })}
      </ul>
    )
  }
}

export default Navigation;
