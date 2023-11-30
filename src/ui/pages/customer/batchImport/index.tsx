import React from 'react'
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Row, Col, Button, Input, message} from 'antd';
import {fileDownload,importConfirm, downloadLeads, browseExcel} from '@redux-actions/customer/batchImport'
import {User} from "@/common/beans/user";
import {TablePagination} from '@/ui/component/tablePagination';
import {Icon} from '@/ui/component/icon';
import _ from 'lodash';
import './index.scss';
import {Loading} from "@/ui/component/loading";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {AnalysisExcel} from "@/ui/pages/customer/batchImport/analysisExcel";

class BatchImportIdx extends React.Component<any,any> {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileName: undefined,
      crumbdata: [
        {name: '客户', path: '', link: '#', id: 'customer'},
        {name: '客户信息管理', path: '', link: '#', id: 'customerInfoMangage'},
        {name: '批量导入Leads', path: '', link: '#', id: 'customerBatchImport'},
      ],
      failColumns: [
        {
          title: '行号',
          dataIndex: 'lineId',
          key: 'lineId',
          width: 160
        }, {
          title: '错误原因',
          dataIndex: 'remark',
          key: 'remark',
        }
      ],
      warningColumns:[
        {
            title: '行号',
            dataIndex: 'lineNumber',
            key: 'lineNumber',
            width: 160
        }, {
            title: '原因描述',
            dataIndex: 'description',
            key: 'description',
        }
      ],
      pager:{
        pageNo:undefined,
        pageSize:undefined,
        totalSize:undefined,
      },
      success: undefined, // '1':成功，'0':失败
      isSuccessImport: false, // 是否导入成功
      lockValue:undefined, // 上传锁
        excelInfoList:[],
    }
  }

  handleChangePage = ({pageNo,pageSize})=>{
    let _totalSize = this.state.pager.totalSize
    this.setState({
      pager:{pageNo,pageSize,totalSize:_totalSize}
    })
  }
    /**
     * 错误解析
     * @param type
     * @returns {any}
     */
    currPageNoDataSource = (type)=>{
        let file = this.state.fileList;
        let source;
        if(type==='error'){
            source = file.errorDetailsList
        }else if(type === 'warning'){
            source = file.repeatList
        }
        let pager = this.state.pager;
        let start = pager.pageSize*(pager.pageNo-1)
        let end = start+pager.pageSize
        return _.slice(source,start,end)
    }
  /**
   * 浏览
   */
  handleChange2 = (body:any, valueName:string) => {
      const param = {currentCenterId:User.currentCenterId, importLeadsInfo : body};
      this.setState({
          fileName: valueName,
          success:undefined,
          isSuccessImport:false,
          pager:{
              pageNo:undefined,
              pageSize:undefined,
              totalSize:undefined
          }
      });
      browseExcel(param)
          .then((res:any) => {
              let errorInfo = res.errorInfoResponse;
              if (errorInfo && errorInfo.errorIndex === "0") {
                  this.setState({
                      fileList:errorInfo,
                      success:errorInfo.errorIndex,
                      lockValue: res.lockValue,
                      pager:{
                          pageNo:1,
                          pageSize:10,
                          totalSize:errorInfo.errorDetailsList.length
                      },
                      excelInfoList:errorInfo.leadsReportExcelItemRequest,
                  })
              }else{
                  this.setState({
                      fileList:errorInfo,
                      success:errorInfo.errorIndex,
                      lockValue: res.lockValue,
                      pager:{
                          pageNo:1,
                          pageSize:10,
                          totalSize:errorInfo.repeatList.length
                      },
                      excelInfoList:errorInfo.repeatList,
                  })
              }
          })
  }
  handleChange = ({file}) => {
      // 上传中
      if(file.status === 'uploading'){
          Loading.show();
          this.setState({
              fileList:[file],
              success:undefined,
              isSuccessImport:false,
              pager:{
                  pageNo:undefined,
                  pageSize:undefined,
                  totalSize:undefined
              }
          });

      }
      // 上传完成
      if(file.status === 'done'){
          Loading.close();
          if (file.response && file.response.code===1) {
              let errorInfo = file.response.data.errorInfoResponse;
              if (errorInfo) {
                  this.setState({
                      success:errorInfo.errorIndex,
                      lockValue: file.response.data.lockValue,
                      pager:{
                          pageNo:1,
                          pageSize:10,
                          totalSize:errorInfo.errorDetailsList.length
                      },
                      excelInfoList:errorInfo.leadsReportExcelItemRequest,
                  })
              }
          }

          // 上传失败，如有多个sheet
          if (file.response && file.response.code===0) {
              message.error(file.response.msg)
          }
      }
  }

  onDownload = () => {
    fileDownload({
      currentCenterId: User.currentCenterId,
      fileName:'leads_load_template.xlsx'
    })
  }

  // 导入提交
  tijiao = ()=>{
      let response = this.state.fileList;
      importConfirm({
      currentCenterId:User.currentCenterId,
      excelInfoList:response.leadsReportExcelItemRequest,
      lockValue: this.state.lockValue
    }).then(res=>{
      message.success('导入成功',()=>{
        this.setState({
          fileList:null,
          success:undefined,
          isSuccessImport:true,
          pager:{
            pageNo:undefined,
            pageSize:undefined,
            totalSize:undefined
          }
        })
      })
    },err=>{})
  }
    /**
     * 倒出今日的例子
     */
  handleDownloadLeads = () => {
    downloadLeads({
      currentCenterId: User.currentCenterId,
    })
  };
   /**
    * 导出重复leads
    *
    * @returns {any}
    */
   onDownloadRepeat=()=>{
       const {excelInfoList}=this.state;
       downloadLeads({
           excelInfoList,
           currentCenterId: User.currentCenterId,
       },'上传')
   };
  render() {
    const {fileList, fileName, pager, success, isSuccessImport} = this.state;
    return (
      <div>
        <BreadCrumb routes={this.state.crumbdata}/>
        <div id="gym-customer-batch-import" className='page-wrap'>
          <Row type="flex" align="middle">
            <Col span={4} className="col-left">
              <div>Leads导入（.xls）：</div>
            </Col>
            <Col span={20} className="col-right col-padding">
              <div>
                <Input disabled style={{width:200}}
                       value={fileName}
                />
              </div>
                <AnalysisExcel handleEmit={this.handleChange2}/>
              <div>
                  <Button className="gym-button-blue-xs import-btn"
                        disabled={(!this.state.success || this.state.success==='0')?true:false}
                        onClick={this.tijiao}
                >导入</Button>
                  <button className='gym-button-lg gym-button-default ml30' onClick={this.handleDownloadLeads}>下载今日导入leads</button>
              </div>
              <div>
                  {
                    isSuccessImport &&
                    <Link to={`${Routes.分配客户.link}/${CommonUtils.stringify({phaseId: '1'})}`}>
                      <button className='gym-button-lg gym-button-default import-btn'>现在分配</button>
                    </Link>
                  }
              </div>
            </Col>
          </Row>

          <div className="row-download">
            <p className="no-template">
              没有导入模版？
              <span onClick={this.onDownload} className="download">点击下载</span>
            </p>
            <p　className="limits">请保证excel文件只有一个sheet页，支持每次最多导入2000条leads，<br />上传小于500条，速度更快哦。</p>
          </div>
          {
            (success === '1') ? (
                <div>
                  <Row className="importRes" align="middle" type="flex">
                    <div className="success-col">
                      <Icon className="iconSize iconSuccess" type="zhengque" />
                      <div className="importResTitle">上传成功</div>
                    </div>
                    <Col span={20} className="col-padding">
                        <span>
                            {fileList.tipMessage}
                        </span>
                      <span onClick={this.onDownloadRepeat} className="download ml30">点击下载</span>

                    </Col>
                  </Row>
                    {
                        this.currPageNoDataSource('warning').length>0?
                            <TablePagination dataSource={this.currPageNoDataSource('warning')}
                                             columns={this.state.warningColumns}
                                             rowKey='lineNumber'
                                             totalSize={pager.totalSize}
                                             pageNo={pager.pageNo}
                                             pageSize={pager.pageSize}
                                             handleChangePage={this.handleChangePage}
                            /> : null
                    }
                </div>
            ) : (null)
          }
          {
            (success === '0') ? (
              <div>
                <Row className="importRes" align="middle" type="flex">
                  <Icon className="iconSize iconError" type="weitongguo" />
                  <div className="importResTitle">上传错误</div>
                </Row>
                {
                  <TablePagination dataSource={this.currPageNoDataSource('error')}
                                   columns={this.state.failColumns}
                                   rowKey='lineId'
                                   totalSize={pager.totalSize}
                                   pageNo={pager.pageNo}
                                   pageSize={pager.pageSize}
                                   handleChangePage={this.handleChangePage}
                  />
                }
              </div>
            ) : null
          }
        </div>
      </div>
    )
  }
}

export {BatchImportIdx};
