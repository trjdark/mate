import React from 'react';
import {Row,Col,Input,Form,Select,Button} from 'antd';
import {findRecommendList} from '@redux-actions/customerCreate'
import {User} from "@/common/beans/user";
import {TablePagination} from '@/ui/component/tablePagination';
import {FormFieldPair as Pairs} from '@/ui/component/FormFieldPair'
import {form} from "@/common/decorator/form";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {FUNC} from "@/ui/pages/setting/enum/functions";
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';


const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectGAOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GA', 'HGA']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GA", 'HGA']
    };
const selectGBOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ['GB', 'HGB']
    }
    : {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GB", 'HGB']
    };

@connect(state => ({
    gaList: selectTotalEmployeeList(state, selectGAOption),
    gbList: selectTotalEmployeeList(state, selectGBOption),
}))
@form()

class RecmdModalContent extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
          columns: [
            {title: '联系人',dataIndex: 'contactName',key: 'contactName',},
            {title: '手机',dataIndex: 'contactTel',key: 'contactTel',},
            {title: '宝宝姓名',dataIndex: 'babyName',key: 'babyName',},
            {title: '昵称',dataIndex: 'nickName',key: 'nickName',},
            {title: 'GA',dataIndex: 'ga',key: 'ga',},
            {title: 'GB',dataIndex: 'gb',key: 'gb',}
          ],
          totalSize:0,
          dataSource: [],
          selectedRowKeys: [],
          options:{
            contactTel:undefined,
            gaStaffId:undefined,
            gbStaffId:undefined,
            key:undefined,
            currentCenterId:User.currentCenterId,
            pageNo:1,
            pageSize:10
          }
        }
    }

    onSearch = () => {
      this.props.form.validateFields((err,values)=>{
        if (!err) {
          this.setState({
            options:{
              contactTel:values.contactTel,
              key: values.key,
              gaStaffId: values.gaStaffId,
              gbStaffId: values.gbStaffId,
              currentCenterId:User.currentCenterId,
              pageNo:1,
              pageSize:10
            }
          },()=>{
            findRecommendList(this.state.options)
            .then(res=>{
              this.setState({dataSource:res.list,totalSize:res.totalSize})
            })
          })
        }
      })
    }

    onReset = ()=>{
      this.props.form.setFieldsValue({
        contactTel:'',
        gaStaffId:undefined,
        gbStaffId:undefined,
        key:''
      })
      this.setState({
        options:{
          contactTel:undefined,
          gaStaffId:undefined,
          gbStaffId:undefined,
          key:undefined,
          currentCenterId:User.currentCenterId,
          pageNo:1,
          pageSize:10
        }
      })
    }

    handleChangePage = ({pageNo,pageSize})=>{
        this.setState({
          options:Object.assign({},this.state.options,{pageNo,pageSize})
        },()=>{
          findRecommendList(this.state.options)
          .then(res=>{
            this.setState({dataSource:res.list,totalSize:res.totalSize})
          })
        })
    }

    onSelectChange = (arr)=>{
        this.setState({selectedRowKeys:arr})
        let recommend = this.state.dataSource.filter(data=>data['leadsId']===arr[0])
        this.props.callback(recommend[0])
    }

    componentDidMount(){
      findRecommendList(this.state.options)
      .then(res=>{
        this.setState({dataSource:res.list,totalSize:res.totalSize})
      })
    }

    getOptions = (type)=>{
      const {gaList, gbList} = this.props;
      if (type==='ga') {
        return gaList.map((item,idx)=>
          <Option value={item.staffId} key={idx}>{item.englishName+' '+item.chineseName}</Option>
        )
      }
      if (type==='gb') {
        return gbList.map((item,idx)=>
          <Option value={item.staffId} key={idx}>{item.englishName+' '+item.chineseName}</Option>
        )
      }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {selectedRowKeys,dataSource,columns,totalSize} = this.state;
        const rowSelection = {
            selectedRowKeys,
            hideDefaultSelections: true,
            onChange: this.onSelectChange,
            type:'radio'
        }

        return (
            <div className="">
                <Row>
                  <Col span={8}>
                    <Pairs labelTxt="手机号"
                           labelCol={8}
                           render={()=>(
                             <FormItem>
                               {getFieldDecorator('contactTel', {
                                 rules:[],
                                 initialValue:''
                               })(
                                 <Input style={{width:'200px'}} placeholder="手机号" />
                               )}
                             </FormItem>
                           )}
                    />
                  </Col>
                  <Col span={8}>
                    <Pairs labelTxt="GA"
                           labelCol={8}
                           render={()=>(
                             <FormItem>
                               {getFieldDecorator('gaStaffId', {
                                 rules:[]
                               })(
                                  <Select style={{ width: 200 }}
                                          placeholder="请选择GA">
                                    {this.getOptions('ga')}
                                  </Select>
                               )}
                             </FormItem>
                           )}
                    />
                  </Col>
                  <Col span={8}>
                    <Pairs labelTxt="GB"
                           labelCol={8}
                           render={()=>(
                             <FormItem>
                               {getFieldDecorator('gbStaffId', {
                                 rules:[]
                               })(
                                  <Select style={{ width: 200 }}
                                          placeholder="请选择GB">
                                    {this.getOptions('gb')}
                                  </Select>
                               )}
                             </FormItem>
                           )}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Pairs labelTxt="关键字"
                           labelCol={8}
                           render={()=>(
                             <FormItem>
                               {getFieldDecorator('key', {
                                 rules:[],
                                 initialValue:''
                               })(
                                 <Input style={{width:'200px'}} placeholder="关键字" />
                               )}
                             </FormItem>
                           )}
                    />
                  </Col>
                  <Col span={8}></Col>
                  <Col span={8}>
                    <Row type="flex" justify="end">
                      <Button className="gym-button-wBlue-xs" style={{marginRight:20}} onClick={this.onReset}>重置</Button>
                      <Button className="gym-button-blue-xs" onClick={this.onSearch}>查询</Button>
                    </Row>
                  </Col>
                </Row>
                <TablePagination dataSource={dataSource}
                                 rowSelection={rowSelection}
                                 columns={columns}
                                 rowKey={`leadsId`}
                                 totalSize={totalSize}
                                 handleChangePage={this.handleChangePage}
                                 pageNo={this.state.options.pageNo}
                                 pageSize={this.state.options.pageSize}
                />
            </div>
        )
    }
}

export {RecmdModalContent};
