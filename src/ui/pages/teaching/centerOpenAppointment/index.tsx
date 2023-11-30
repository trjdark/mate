/**
 * desc: 自主约课等位
 * User: deanyue
 * Date: 2020/12/01
 * Time: 上午10:00
 */
import React, { Component } from 'react';
import { TablePagination } from '@/ui/component/tablePagination';
import { BreadCrumb } from '@/ui/component/breadcrumb';
import { SearchForm } from '@/ui/component/searchForm';
import { Checkbox, Modal, Form, Row, Col, message } from 'antd';
import { getClassesAlleleList, whetherClassesAlleleList, updateClassesAlleleList } from '@/redux-actions/teaching/appointmentClasses';
import { User } from '@/common/beans/user';
import {PageTitle} from '@/ui/component/pageTitle';
import './style.scss'
class CenterOpenAppointment extends Component<any, any> {
  routes = [
    {
        name: '教学',
        path: '',
        link: '#',
        id: 'contract'
    },{
        name: '教学管理',
        path: '',
        link: '#',
        id: 'contractManagement'
    },{
      name: '中心开放约课/等位设置',
      path: '',
      link: '#',
      id: 'contractManagement'
  }
];
  columns = [
    {
    title: '中心编号',
    dataIndex: 'centerCode',
    },{
      title: '中心名称',
      dataIndex: 'centerName',
    },{
      title: '中心类型',
      dataIndex:'typeName'
    },{
      title: '是否开放自主约课',
      dataIndex: 'eableAppBook',
      render:(text)=>{
        const eableAppBookEnum = new Map([
          [0,'否'],
          [1,'是']
        ])
        return eableAppBookEnum.get(text)
      }
      },{
        title: '启蒙可约等位课程',
        dataIndex: 'eableAppWait',
        render:(text)=>{
          const eableAppBookEnum = new Map([
            [0,'否'],
            [1,'是']
          ])
          return eableAppBookEnum.get(text)
        }
      },{
        title: '操作',
        dataIndex:'operation',
        render:(text,record)=>(<button className='gym-button-white gym-button-xxs' onClick={()=>this.clickHandler(record.id,record.centerCode + '-' + record.centerName)}>设置</button>)
      }
  ];
  searchFormItem:Array<any> = [
    {
      type:"select",
      label:"中心类型",
      name:"type",
      options:[
        {
          postCode:'47001',
          postName:'直营店'
        },{
          postCode:'47002',
          postName:'加盟店'
        }
      ]
    },{
      type:"select",
      label:"启蒙可约等位课程",
      name:"eableAppWait",
      options:[
        {
          postCode:'0',
          postName:'否'
        },{
          postCode:'1',
          postName:'是'
        }
      ]
    },{
      type:"select",
      label:"是否开放自主约课",
      name:"eableAppBook",
      options:[{
        postCode:'0',
        postName:'否'
      },{
        postCode:'1',
        postName:'是'
      }]
    },{
      type:"text",
      label:"关键字",
      name:"key",
      placeholder:"中心名称或中心代号",
    }
  ];
  constructor(props){
    super(props)
    this.state = {
      eableAppBook:null,
      eableAppWait:null,
      key:null,
      pageNo:1,
      pageSize:10,
      type:null,
      totalSize:null,
      totalNo:null,
      visible:false,
      list:[],
      centerCode:null,
      flagEableAppBook:'',
      flagEableAppExchange:'',
      centerId:null
    }
  };
  componentDidMount(){
    this.getClassesAlleleList();
  };
  /**
   * 搜索
   * @param values
   */
  SearchHandler = (values)=>{
    this.setState({...values,pageNo:1,pageSize:10},this.getClassesAlleleList);
  };
  /**
   * 点击进入修改中心约课等位状态弹框获取配置中心列表
   * @param currentCenterId
   */
  clickHandler = (centerId:string,centerCode:string)=>{
    whetherClassesAlleleList({centerId,currentCenterId:User.currentCenterId}).then(res => {
      const flagEableAppBook = (res.filter(item =>  item.pilotType === "1502001"))[0];
      const flagEableAppExchange = (res.filter(item =>  item.pilotType === "1502002"))[0];
      this.setState({visible:!this.state.visible,centerCode , flagEableAppBook, flagEableAppExchange,centerId});
    });
  };
  /**
   * 获取列表数据
   */
  getClassesAlleleList = ()=>{
    const {
      eableAppBook, eableAppWait, key, pageNo,
      pageSize, type } = this.state;
    getClassesAlleleList({
      currentCenterId:User.currentCenterId,eableAppBook,
      eableAppWait,key,pageNo,pageSize,type
    }).then(res => {
      this.setState(res);
    });
  };
  /**
   * 关闭莫态框
   */
  handleCancel = ()=>{
      this.setState({visible:false});
  };
  /**
   * 保存修改好的状态
   */
  onOkclickHandler = ()=>{
    const {flagEableAppBook, flagEableAppExchange, centerId} = this.state
    const pilotTypeList = [];
    flagEableAppBook.enable ? pilotTypeList.push(flagEableAppBook.pilotType) : '';
    flagEableAppExchange.enable ? pilotTypeList.push(flagEableAppExchange.pilotType) : '';
    updateClassesAlleleList({
      currentCenterId:User.currentCenterId,
      centerId,
      pilotTypeList
    }).then(()=>{
      message.success('保存成功');
      this.setState({visible:false},this.getClassesAlleleList)
    });
  }
  /**
   * 翻页
   * @param page
   */
  handleChangePage = (page)=>{
    this.setState(page,this.getClassesAlleleList);
  };
  render() {
    const { list, pageNo, pageSize, totalSize, totalNo, visible, centerCode, flagEableAppBook, flagEableAppExchange} = this.state;
    return (
      <div className='page-wrap'>
        <BreadCrumb routes={this.routes}/>
        <div id='gym-general-course-select-center' className='gym-general-course-center'>
            <SearchForm
              items={this.searchFormItem}
              onSearch={this.SearchHandler}
            />
            <TablePagination
              columns={this.columns}
              handleChangePage={this.handleChangePage}
              dataSource={list}
              rowKey="id"
              pageNo={pageNo}
              pageSize={pageSize}
              totalSize={totalSize}
              totalNo={totalNo}
            />
          </div>
          <Modal
           title={<PageTitle className='gym-teaching-open-setting-title' title={`${centerCode}开放约课/等位设置`}/>}
           visible={visible}
           onCancel={this.handleCancel}
           footer={false}
           centered={true}
           destroyOnClose={true}
           bodyStyle={{
             padding:"0 25px 25px 25px"
           }}
           width='auto'
           style={{
             minWidth:"520px",
           }}
          >
            <Form>
              <Row>
                <Col span={12}>
                  <Form.Item label={`开放自主约课`} className='flex'>
                      <Checkbox checked={flagEableAppBook.enable} onChange={(e)=>{
                        e.target.checked ? this.setState({
                          flagEableAppBook:Object.assign(flagEableAppBook,{enable: e.target.checked})
                        }) : this.setState({
                          flagEableAppBook:Object.assign(flagEableAppBook,{enable: e.target.checked}),
                          flagEableAppExchange:Object.assign(flagEableAppExchange,{enable: e.target.checked})
                        })
                      }}></Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={`启蒙可约等位课程`} className='flex'>
                      <Checkbox checked={flagEableAppExchange.enable} onChange={(e)=>{
                       e.target.checked ? this.setState({
                          flagEableAppExchange:Object.assign(flagEableAppExchange,{enable: e.target.checked}),
                          flagEableAppBook:Object.assign(flagEableAppBook,{enable: e.target.checked})
                        }) : this.setState({
                          flagEableAppExchange:Object.assign(flagEableAppExchange,{enable: e.target.checked}),
                        });
                      }}></Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              <div className='flex' style={{
                justifyContent:"center",
                alignItems:"center",
                width:"100%"
              }}>
                <button className='gym-button-white gym-button-xs mlr5' onClick={this.onOkclickHandler}>保存</button>
                <button className='gym-button-white gym-button-xs mlr5' onClick={this.handleCancel}>取消</button>
              </div>
            </Form>
          </Modal>
      </div>
    );
  }
}

export  { CenterOpenAppointment };
