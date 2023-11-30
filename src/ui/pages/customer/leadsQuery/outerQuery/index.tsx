/**
*Desc: 跨中心查询
*User: Debby.Deng
*Date: 2019/1/16,
*Time: 3:02 PM
*/
import '../style/index.scss';
import * as React from "react";
import {BreadCrumb} from "../../../../component/breadcrumb";
import {Table} from "../../../../component/tablePagination";
import {Button, Form} from "antd";
import {form} from "../../../../../common/decorator/form";
import {Input} from "../../../../component/input";
import {handleValidate, Validation} from "../../../../../common/utils/validate";
import {crossCenterQuery} from "@redux-actions/customer/outerQuery";
import {User} from "../../../../../common/beans/user";
import {leadsStatus} from "../../enum/client360";
const FormItem = Form.Item;
import {Message} from "@/ui/component/message/message";
@form()
class OuterQuery extends React.Component<any>{
    breadCrumb=[
        {
            name: '客户',
            path: '',
            link: '#',
        },{
            name: '跨中心Leads查询',
            path: '',
            link: '#',
        }
    ];
    columns=[
        {
            title: '中心名称',
            dataIndex: 'centerName',
            key: 'centerName',
        },
        {
            title: '阶段',
            dataIndex: 'phase',
            key: 'phase',
            render:(text)=>(this.transferPhaseId(text)),

        },
        {
            title: '最后一次获取日期',
            dataIndex: 'lastInquireDate',
        },
        {
            title: 'GB',
            dataIndex: 'gb',
        },
    ];
    state={
        dataSource:[]
    };
    transferPhaseId=(id)=>{
        if(!id){
            return "";
        }else{
            switch(id.toString()){
                case leadsStatus.新会员:{return '新会员'}
                case leadsStatus.老会员:{return '老会员'}
                case leadsStatus.历史会员:{return '历史会员'}
                case leadsStatus.放弃:{return '回收站'}
                default : {return 'LEADS'}
            }
        }
    };
    handleSearch=()=>{
        const {form}=this.props;
       form.validateFields((err, value) => {
            if (!err) {
                if(!value.primaryContactTel){
                    Message.error('手机号不能为空！');
                    return;
                }
                const params={
                    currentCenterId: User.currentCenterId,
                    ...value,
                };
                crossCenterQuery(params).then((res)=>{
                    this.setState({dataSource:res.list});
                })
            }
        })

    };
    render(){
        const {dataSource}=this.state;
        const {getFieldDecorator}=this.props.form;
        return <div>
            <BreadCrumb routes={this.breadCrumb} />
            <div className='bgWhite gym-outer-query'>
                <Form className='gym-outer-query-form'>
                    <FormItem className='flex ml30' label={`跨中心查询`}>
                        {getFieldDecorator(`primaryContactTel`,{
                            rules:[{validator:handleValidate[Validation.手机号]}]
                        })(
                            <Input placeholder="请输入手机号码"/>
                        )}
                    </FormItem>
                    <Button className='gym-button-blue-xs gym-outer-query-search'
                            onClick={this.handleSearch}
                    >查询</Button>
                </Form>
                <Table columns={this.columns}
                       rowKey={`centerId`}
                       dataSource={dataSource}/>
            </div>
        </div>
    }
}

export {OuterQuery}
