import React from 'react'
import {Row,Col,Form,Input,Button,Select,DatePicker} from 'antd'
import {getTransferCenterList,getCenterLeadsList} from "@redux-actions/customer/assignRecord";
import {User} from "@/common/beans/user";
import * as moment from 'moment';
import {form} from "@/common/decorator/form";
import {FormFieldPair} from '@/ui/component/FormFieldPair';
import {TablePagination} from '@/ui/component/tablePagination';
const FormItem = Form.Item;
const Option = Select.Option;

@form()
class AssignRecordLeadsList extends React.Component<any,any>{
    constructor(props){
        super(props);
        this.state={
            columns:[
                {title:'编号',dataIndex:'code',key:'code',width:160},
                {title:'宝宝姓名',dataIndex:'babyName',key:'babyName'},
                {title:'月龄',dataIndex:'monthValue',key:'monthValue'},
                {
                    title:'创建时间',
                    dataIndex:'createDate',
                    key:'createDate',
                    render: (text)=>{
                        if (text) {
                            let mon = moment(text).format('YYYY-MM-DD')
                            return mon;
                        } else {
                            return ''
                        }
                    }
                },
                {
                    title:'转中心时间',
                    dataIndex:'transferDate',
                    key:'transferDate',
                    render: (text,record,idx)=>{
                        if (text) {
                            let mon = moment(text).format('YYYY-MM-DD')
                            return mon;
                        } else {
                            return ''
                        }
                    }
                },
                {title:'转入中心',dataIndex:'newCenterName',key:'newCenterName'}
            ],
            options:{
              distributeType:'leadsTransfer',
              babyName:'',
              currentCenterId:User.currentCenterId,
              leadsCreatDate:null,
              transferCenterDate:null,
              newCenterId:''
            },
            transferCenterType:'leads',
            centerList:[],
            list:[],
            totalSize:0,
            pageNo:1,
            pageSize:10
        }
    }
    handleChangePage = ({pageNo,pageSize})=>{
        this.setState({pageNo,pageSize},()=>{
          this.search()
        })
    }
    search = ()=>{
      let params = Object.assign({},this.state.options,{
        pageNo:this.state.pageNo,
        pageSize:this.state.pageSize
      })
      getCenterLeadsList(params)
      .then(res=>{
        this.setState({list:res.list,totalSize:res.totalSize})
      })
    }

    onHandleReset = ()=>{
        this.props.form.setFieldsValue({
          babyName:'',
          leadsCreatDate:null,
          transferCenterDate:null,
          newCenterId:undefined
        })
        this.setState({
          options:{
            distributeType:'leadsTransfer',
            babyName:'',
            currentCenterId:User.currentCenterId,
            leadsCreatDate:null,
            transferCenterDate:null,
            newCenterId:''
          }
        })
    }

    onHandleSearch = ()=>{
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            babyName:values.babyName,
            leadsCreatDate:values.leadsCreatDate
                           ?values.leadsCreatDate.valueOf()
                           :null,
            transferCenterDate:values.transferCenterDate
                               ?values.transferCenterDate.valueOf()
                               :null,
            newCenterId:values.newCenterId
          }
          this.setState({
            options:Object.assign({},this.state.options,params),
            pageNo:1,
            pageSize:10
          },()=>{
            this.search()
          })
        }
      });
    }

    componentDidMount(){

        // 中心select列表
        getTransferCenterList({
          currentCenterId:User.currentCenterId,
          transferCenterType:this.state.transferCenterType
        })
        .then(res=>{
          this.setState({centerList:res})
        })

        // leads转移记录
        this.search()
    }

    render(){
        const {columns,list,totalSize,pageNo,pageSize,centerList}=this.state;
        const { getFieldDecorator } = this.props.form;

        return(
            <div>
                <Row className="search-row">
                    <Col span={8}>
                      <FormFieldPair labelTxt="宝宝姓名"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`babyName`, {
                                               rules: [],
                                               initialValue: ""
                                           })(
                                               <Input className="inputWidth" maxLength={50}/>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8}>
                      <FormFieldPair labelTxt="创建时间"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`leadsCreatDate`, {
                                               rules: [],
                                               initialValue: null
                                           })(
                                             <DatePicker className="inputWidth"/>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8}>
                      <FormFieldPair labelTxt="转中心时间"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`transferCenterDate`, {
                                               rules: [],
                                               initialValue: null
                                           })(
                                               <DatePicker className="inputWidth"/>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8} className="marginBottom20">
                      <FormFieldPair labelTxt="转入中心"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`newCenterId`, {
                                               rules: [],
                                               initialValue: undefined
                                           })(
                                               <Select className="inputWidth"
                                                       placeholder="转入中心"
                                               >
                                                 {
                                                   centerList.map((item,idx)=>
                                                     <Option key={idx} value={item.centerId}>
                                                       {item.centerName}
                                                     </Option>
                                                   )
                                                 }
                                               </Select>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8} className="btn-col">
                      <Button className='gym-button-blue-xs' onClick={this.onHandleSearch}>查询</Button>
                      <Button className='gym-button-wBlue-xs reset' onClick={this.onHandleReset}>重置</Button>
                    </Col>
                </Row>
                <Row className="table-row">
                    <TablePagination dataSource={list}
                                     columns={columns}
                                     rowKey="id"
                                     totalSize={totalSize}
                                     handleChangePage={this.handleChangePage}
                                     pageNo={pageNo}
                                     pageSize={pageSize}
                    />
                </Row>
            </div>
        )
    }
}

export {AssignRecordLeadsList}
