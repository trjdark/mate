import React from 'react';
import {getLeadsInOtherCenterByTel} from "@/redux-actions/customerCreate";
import {User} from "@/common/beans/user";
import {TablePagination} from '@/ui/component/tablePagination';
import moment from 'moment'

declare interface searchProps {
  tel:string
}

class CrossCenterSearch extends React.Component<searchProps,any>{
  constructor(props){
    super(props)
    this.state={
      list: [],
      totalSize:0,
      pageNo:1,
      pageSize:10,
      columns:[
        {title:'其他中心',dataIndex:'centerName',key:'centerName'},
        {title:'当前状态',dataIndex:'status',key:'status'},
        {title:'试听日期',dataIndex:'previewDate',key:'previewDate'}
      ]
    }
  }

  handleChangePage = ({pageNo,pageSize})=>{
    this.setState({pageNo,pageSize},()=>{
      getLeadsInOtherCenterByTel({
        currentCenterId:User.currentCenterId,
        pageNo:this.state.pageNo,
        pageSize:this.state.pageSize,
        primaryContactTel:this.props.tel
      })
      .then(res=>{
        this.setState({list:res.list,totalSize:res.totalSize})
      })
    })
  }

  componentDidMount(){
    getLeadsInOtherCenterByTel({
      currentCenterId:User.currentCenterId,
      pageNo:this.state.pageNo,
      pageSize:this.state.pageSize,
      primaryContactTel:this.props.tel
    })
    .then(res=>{
      this.setState({list:res.list,totalSize:res.totalSize})
    })
  }

  render(){
    const {list,columns,totalSize} = this.state;
    let list2 = []
    if (list && list.length>0) {
      list2 = list.map((item,idx)=>{

        // 对日期做处理
        if (item.previewDate) {
          item.previewDate = moment(item.previewDate).format('YYYY-MM-DD')
        }
        return item;
      })
    }
    return(
      <React.Fragment>
        <TablePagination dataSource={list2}
                         columns={columns}
                         rowKey=""
                         totalSize={totalSize}
                         handleChangePage={this.handleChangePage}
                         pageNo={this.state.pageNo}
                         pageSize={this.state.pageSize}
        />
      </React.Fragment>
    )
  }
}

export {CrossCenterSearch};
