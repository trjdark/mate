import React from 'react'
import {Row,Col,Form,Input,Button,Select,DatePicker} from 'antd'
import {
  getTransferCenterList,
  getCenterMemberList
} from "@redux-actions/customer/assignRecord";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {form} from "@/common/decorator/form";
import {FormFieldPair} from '@/ui/component/FormFieldPair';
import {TablePagination} from '@/ui/component/tablePagination';
import {getAllGaList,getAllGbList} from '@redux-actions/customerCreate';
import {Icon} from "@/ui/component/icon";
const FormItem = Form.Item;
const Option = Select.Option;

@form()
class VipList extends React.Component<any,any>{
    constructor(props){
        super(props);
        this.state={
            columns:[
                {title:'宝宝姓名',dataIndex:'babyName',key:'babyName'},
                {title:'合同编号',dataIndex:'contractCode',key:'contractCode'},
                {
                  title:'转出时间',dataIndex:'auditDate',key:'auditDate',
                  render:(text)=>(text? moment(text).format('YYYY-MM-DD') : '')
                },
                {title:'转出中心',dataIndex:'outCenterName',key:'outCenterName'},
                {
                    title: '',
                    dataIndex: 'trans',
                    key: 'trans',
                    render: () => <Icon className='gym-contract-transIcon' type={`youjiantou`}/>
                },
                {title:'转入中心',dataIndex:'inCenterName',key:'inCenterName'},
                {title:'转中心金额',dataIndex:'amount',key:'amount'},
                {title:'GB',dataIndex:'gbStaffName',key:'gbStaffName'},
                {title:'GA',dataIndex:'gaStaffName',key:'gaStaffName'},
            ],
            options:{
              transMode:'out',
              currentCenterId:User.currentCenterId,
              babyName:undefined,
              auditDate:null,
              gaStaffIdList:[],
              gbStaffIdList:[],
              newCenterId:undefined,
              contractCode:undefined
            },
            transferCenterType:'vip',
            centerList:[],
            galist:[],
            gblist:[],
            list:[],
            totalSize:0,
            pageSize:10,
            pageNo:1
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
      getCenterMemberList(params)
      .then(res=>{
        this.setState({list:res.list,totalSize:res.totalSize})
      })
    }

    onHandleReset = ()=>{
        let params = {
          babyName:undefined,
          gaStaffIdList:[],
          gbStaffIdList:[],
          auditDate:null,
          newCenterId:undefined,
          contractCode:undefined
        }
        this.props.form.setFieldsValue(params)
        this.setState({
          options:Object.assign({},this.state.options,params),
        })
    }

    onHandleSearch = ()=>{
        this.props.form.validateFields((err, values) => {
          if (!err) {
            let params = {
              babyName:values.babyName,
              auditDate:values.auditDate
                               ?values.auditDate.valueOf()
                               :null,
              gaStaffIdList:values.gaStaffIdList,
              gbStaffIdList:values.gbStaffIdList,
              newCenterId:values.newCenterId,
              contractCode:values.contractCode
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

        // galist
        getAllGaList({currentCenterId:User.currentCenterId})
        .then(res=>{
          this.setState({galist:res})
        })

        // gblist
        getAllGbList({currentCenterId:User.currentCenterId})
        .then(res=>{
          this.setState({gblist:res})
        })

        // leads转移记录
        this.search()
    }

    render(){
        const {columns,list,totalSize,pageSize,pageNo}=this.state;
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
                                               initialValue:undefined
                                           })(
                                               <Input className="inputWidth" maxLength={50} placeholder="宝宝姓名"/>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8}>
                      <FormFieldPair labelTxt="转出时间"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`auditDate`, {
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
                      <FormFieldPair labelTxt="合同编号"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`contractCode`, {
                                               rules: [],
                                               initialValue:undefined
                                           })(
                                               <Input className="inputWidth" maxLength={50} placeholder="合同编号"/>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8}>
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
                                                 {this.state.centerList.map((item,idx)=>
                                                     <Option key={idx} value={item.centerId}>{item.centerName}</Option>
                                                 )}
                                               </Select>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8}>
                      <FormFieldPair labelTxt="GB"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`gbStaffIdList`, {
                                               rules: [],
                                               initialValue: []
                                           })(
                                               <Select className="inputWidth"
                                                       mode="multiple"
                                                       placeholder="GB"
                                               >
                                                 {this.state.gblist.map(item=>
                                                     <Option key={item.staffId} value={item.staffId}>{item.userName}</Option>
                                                 )}
                                               </Select>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8}>
                      <FormFieldPair labelTxt="GA"
                                     labelCol={8}
                                     render={()=>(
                                       <FormItem>
                                           {getFieldDecorator(`gaStaffIdList`, {
                                               rules: [],
                                               initialValue: []
                                           })(
                                               <Select className="inputWidth"
                                                       mode="multiple"
                                                       placeholder="GA"
                                               >
                                                 {this.state.galist.map(item=>
                                                     <Option key={item.staffId} value={item.staffId}>{item.userName}</Option>
                                                 )}
                                               </Select>
                                           )}
                                       </FormItem>
                                     )}
                      />
                    </Col>
                    <Col span={8}></Col>
                    <Col span={8}></Col>
                    <Col span={8} className="btn-col">
                        <Button className='gym-button-blue-xs' onClick={this.onHandleSearch}>查询</Button>
                        <Button className='gym-button-wBlue-xs reset' onClick={this.onHandleReset}>重置</Button>
                    </Col>
                </Row>

                <Row className="vip-table-row">
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

export {VipList}
