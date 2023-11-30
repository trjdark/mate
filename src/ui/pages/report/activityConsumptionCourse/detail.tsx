/**
 * desc: 活动耗课明细
 * User: Dean
 * Date: 2020/9/11
 * Time: 16:38
 */
import React, {
  Component,
  Fragment
} from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import FullScreen from '../components/fullScreen';
import { TablePagination } from "@/ui/component/tablePagination";
import moment from 'moment';
import {
  getActiveDetail,
  getActiveDetailExports
} from "@redux-actions/report/messageReport";
import { User } from "@/common/beans/user";
import {
  Popover,
  message
} from 'antd';
import { CommonUtils } from "@/common/utils/commonUtils";
import './style.scss'
import { activityType } from './enum' // 枚举


class ActivityConsumptionCourseDetail extends Component<any,any> {
  private routes:Array<any> = [
    {
      name: '报表',
    },{
      name: '大服务类报表',
    },{
      name: '活动耗课统计/明细',
    }
  ]
  /**
     * 表格头配置
     * @type {({title: string; dataIndex: string; render: (text: any) => any} | {title: string; dataIndex: string; render: (text: any) => any} | {title: string; dataIndex: string; render: (date: any) => string} | {title: string; dataIndex: string} | {title: string; dataIndex: string; render: (text: any) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: string) => any} | {title: string; dataIndex: string; render: (text: any, record: any) => any})[]}
     */
  private columns:Array<object> = [
    {
      title:'宝宝姓名',
      dataIndex: 'babyName'
    },
    {
      title:'月龄',
      dataIndex: 'monthNum'
    },
    {
      title:'活动类型',
      dataIndex: 'activityType',
      render:(text:any) => (
        <span>
          {
            activityType[text * 1]
          }
        </span>
      )
    },
    {
      title:'活动名称',
      dataIndex: 'activityTheme'
    },
    {
      title:'活动日期',
      dataIndex: 'activityStartDate',
      render: (date:any) => (
        moment(date).format('YYYY-MM-DD')
      )
    },
    {
      title:'耗课数',
      dataIndex: 'activityConsumption'
    },
    {
      title:'GB',
      dataIndex: 'babysGb',
      render:(text:string) => this.cutstrHandler(text)
    },
    {
      title:'GA',
      dataIndex: 'babysGa',
      render:(text:string) => this.cutstrHandler(text)
    },
  ]
  // 气泡框结构
  /**
    * @params {any} text
  */
  popContent = (text:any)=>(
    <div className="popContent">
      {
        text
      }
    </div>
  )
  constructor(props:any){
    super(props)
    this.state = {
      pageSize: 10,
      pageNo:1,
      dataSource: [],
      totalNo:1,
      totalSize:10,
      canDownload: false
    }
  }
   // 文字处理
  cutstrHandler(text:string){
    return (
      <Popover content={this.popContent(text)}>
            {CommonUtils.cutstr(text,8)}
      </Popover>
    )
  }
  // 数据获取
  /**
   * @activityId {string} 活动id
   * @currentCenterId {string} 中心id
   * @pageNo {number} 页码
   * @pageSize {number} 几条/页
  */
  getActiveDetail(pageNo:number, pageSize:number){
    const {params:{params}} = this.props.match
    getActiveDetail({
      activityId: params,
      currentCenterId:User.currentCenterId,
      pageNo,
      pageSize
      }).then(res => {
        this.setState({
          dataSource: res.list,
          pageNo: res.pageNo,
          pageSize: res.pageSize,
          totalNo: res.totalNo,
          totalSize: res.totalSize,
          canDownload: res.list.length >= 1 ? true : false
        })
    })
  }
  componentDidMount(){
    // 进入页面渲染一次，默认1页10条数据
    this.getActiveDetail(this.state.pageNo, this.state.pageSize)
  }

    /**
     * 分页
     * @param pageInfo
     */
  handleChangePage = (pageInfo:any) => {
    // 翻页重新加载数据
    this.getActiveDetail(pageInfo.pageNo, pageInfo.pageSize)
  }
  // 明细导出
  handleDownLoadExcel(canDownload:boolean,pageNo:number, pageSize:number){
    // 导出所有的明细数据
    const {params:{params}} = this.props.match
    canDownload ? getActiveDetailExports({
      activityId: params,
      currentCenterId:User.currentCenterId,
      pageNo,
      pageSize
    }) : message.error('没有内容可以导出')
  }
  render() {
    const {pageNo, pageSize, dataSource, totalSize, totalNo, canDownload} = this.state
    return (
        <Fragment>
          <BreadCrumb routes={this.routes}/>
          <div className="page-wrap">
            <FullScreen handleDownLoadExcel={() => this.handleDownLoadExcel(canDownload,pageNo * 1, totalSize * 1)} canDownload={canDownload}>
            <TablePagination
            dataSource={dataSource}
            columns={this.columns}
            pageNo={pageNo}
            pageSize={pageSize}
            totalSize={totalSize}
            totalNo={totalNo}
            handleChangePage={this.handleChangePage}
            rowKey={(item:any,index:number) => index + 1}
            />
            </FullScreen>
          </div>
        </Fragment>
      );
  }
}

export { ActivityConsumptionCourseDetail };
