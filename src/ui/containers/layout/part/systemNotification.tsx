import React, { Component } from 'react'
import { Menu, Dropdown, Badge, Modal } from 'antd';
import {Icon} from "@/ui/component/icon";
import moment from 'moment';
import { User } from '@/common/beans/user';
import  {PageTitle} from "@/ui/component/pageTitle";
import {getNoReadSysNotice, changeReadStatus} from "@redux-actions/telephone/message";


class SystemNotification extends Component<any,any> {
  constructor(props){
    super(props)
    this.state = {
      isNoticeDropdown: false,
      noticeDisabled:true,
      menuList: [],
      visible:false,
      sysNoticeTheme:null,
      noticeDate:null,
      noticeTime:null,
      noticeDetails:null
    }
  }
  clickDetailHandler = async (item:any) => {
    await this.setState({
       visible:true,
       sysNoticeTheme:item.sysNoticeTheme || '',
       noticeDate:item.noticeDate || '',
       noticeTime:item.noticeTime || '',
       noticeDetails:item.noticeDetails || ''
     })
    await changeReadStatus({
       currentCenterId: User.currentCenterId,
       noticeId: item.noticeId
     })
    await this.getNoReadSysNotice({
       currentCenterId:User.currentCenterId,
     })
   }
  /**
   * 列表
   */
  menu = () => {
    const { menuList } = this.state
    return(
        <Menu className='gym-layout-operation-message'>
        {
         (menuList || []).map((item:any) => (
          <Menu.Item key={item.noticeId} className='gym-layout-operation-message-item' onClick={() => this.clickDetailHandler(item)}>
            <div className='gym-layout-operation-message-item-title'>
                <span>{item.sysNoticeTheme}</span>
               <span>{moment(item.noticeDate).format('YYYY-MM-DD')} {item.noticeTime}</span>
            </div>
            <div className='gym-layout-operation-message-item-content'>
              {
                item.noticeSummary
              }
            </div>
          </Menu.Item>
        ))
        }
        </Menu>
    )
  }
  /**
   * 判断点击
   * @param value
   */
  visibleMessageChang = (value:any) => {
    this.setState({
      isNoticeDropdown:value
    })
  }
  /**
   * 获取数据
   * @param params
   */
  getNoReadSysNotice(params:any){
    getNoReadSysNotice(params).then(res => {
      this.setState({
        menuList:res
      })
    })
  }
  componentDidMount(){
    this.getNoReadSysNotice({
      currentCenterId:User.currentCenterId,
    })
  }
  render() {
    const { isNoticeDropdown, visible, sysNoticeTheme, noticeDetails, menuList = [] } = this.state
    const noticeDisabled = menuList.filter(item => item.readStatus === 0).length > 0;
    return (
      <div>
        <Modal
         visible={visible}
         onCancel={() => this.setState({visible:false, isNoticeDropdown:false})}
         footer={false}
        >
          <PageTitle title={ sysNoticeTheme }/>
          <textarea readOnly style={{
            width:"100%",
            height:"200px",
            border:"0",
            maxHeight:"500px",
            overflowY:"auto"
          }}>
            {noticeDetails}
          </textarea>
        </Modal>
        <Dropdown
            overlay={ this.menu() }
            trigger={['click']}
            onVisibleChange={this.visibleMessageChang}
            disabled={!(menuList.length > 0)}
        >
            <div className={`gym-layout-header-right-item pointer ${isNoticeDropdown ? 'active' : ''}`}>
              <Icon className='gym-layout-header-icon' type={`gonggao`}></Icon>
              <Badge dot={noticeDisabled} offset={[10,-2]}>
                <span>通知</span>
              </Badge>
            </div>
        </Dropdown>
      </div>
    )
  }
}
export { SystemNotification }
