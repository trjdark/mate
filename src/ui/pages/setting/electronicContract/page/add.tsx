/**
 * desc: 添加电子合同用印
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/9/7
 * Time: 下午4:52
 */
import React, {Component} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {form} from "@/common/decorator/form";
import {Input} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {PageTitle} from "@/ui/component/pageTitle";
import {Form, Row, Col, Icon} from  'antd';
import {ListModal} from "@/ui/component/listModal";
import {CourseGeneralSelectCenter} from "@/ui/pages/setting/courseGeneral/part/courseGeneralSelectCenter";
import {Routes} from "@/router/enum/routes";
import {CancelButton} from "@/ui/component/cancelButton";
import {User} from "@/common/beans/user";
import {typeEnum} from "@/ui/pages/setting/electronicContract/enum/sealType";
import {addElectronicContract} from "@redux-actions/setting/electronicContract";
import {Message} from "@/ui/component/message/message";
import history from "@/router/history";

const FormItem = Form.Item;

@form()
class ElectronicContractAdd extends Component <any, any>{
    private breadCrumbRoutes: Array<any> = [
        {name: '设置', path: '', link: '#', id: ''},
        {name: '电子合同管理', path: '', link: '#', id: ''},
        {name: '新建中心用印', path: '', link: '#',}
    ];
    constructor(props){
        super(props)
        this.state = {
            addCenterFlag: false,
            centerIdList: []
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                const {centerIdList} = this.state;
                let centerIds = centerIdList.map(item => item.centerId);
                centerIds = Array.from(new Set(centerIds));
                const param = Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    centerIdList: centerIds
                })
                addElectronicContract(param).then(() => {
                    Message.success('添加成功', 3, () => {
                        history.push(Routes.电子用印列表.path)
                    });
                });
            }
        });
    };
    /**
     * 添加中心
     */
    operateAddCenterFlag = (e) => {
        e.preventDefault();
        this.setState({addCenterFlag: true})
    };
    handleAddCenter = (selectedCenter) => {
        const {centerIdList} = this.state;
        this.setState({
            centerIdList: [...centerIdList, ...selectedCenter]
        });
    };
    /**
     * 删除
     * @param key
     */
    deleteCenterRow = (key) => {
        const {centerIdList} = this.state;
        this.setState({
            centerIdList: centerIdList.filter((item:any, index:number) => index !== key)
        })
    };
    render(){
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {centerIdList} = this.state;
        return (
            <div className='gym-electronic-contract-add'>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className='page-wrap'>
                    <Form onSubmit={this.onSubmit}>
                        <FormItem label={'用印名称'} >
                            {
                                getFieldDecorator('sealName', {
                                    rules: [{required: true, message: '请输入'}],
                                })(<Input placeholder={`请输入`} maxLength={50}/>)}
                        </FormItem>
                        <FormItem label={'启用状态'} >
                            {
                                getFieldDecorator('enable', {
                                    rules: [{required: true, message: '请输入'}],
                                })(
                                    <Select placeholder={`请输入`}>
                                        <Option value={1} >启用</Option>
                                        <Option value={0} >停用</Option>
                                    </Select>
                                )}
                        </FormItem>
                        <FormItem label={'用印类型'} >
                            {
                                getFieldDecorator('sealType', {
                                    rules: [{required: true, message: '请输入'}],
                                })(
                                    <Select placeholder={`请输入`}>
                                        {
                                            (typeEnum || []).map((item) => (
                                                <Option value={item.postCode} key={item.postCode}>
                                                    {item.postName}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )}
                        </FormItem>
                        <div>
                            <PageTitle title='适用中心'/>
                            <button className='gym-electronic-contract-add-button mb25' onClick={this.operateAddCenterFlag.bind(this)}>
                                + 添加中心
                            </button>
                            <div>
                                <Row gutter={16}>
                                    {
                                        (centerIdList).map((center,key)=>{
                                            return (
                                                <Col lg={8} xxl={6} key={key}>
                                                    <div className='mb10 gym-button-block gym-center-add'>
                                                        <span style={{verticalAlign:'middle'}}>{center.centerCode}-{center.centerName}</span>
                                                        <span className='icon delete gym-center-add-icon cDDD size20'
                                                              onClick={this.deleteCenterRow.bind(this, key)}>
                                                        <Icon type='close'/>
                                                    </span>
                                                    </div>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </div>
                        </div>
                        <Row>
                            <Col span={24}>
                                <CancelButton form={form} goBackLink={Routes.电子用印列表.path}/>
                            </Col>
                        </Row>
                    </Form>
                    <ListModal visible={this.state.addCenterFlag}
                               width={`calc(100% - 100px)`}
                               destroyOnClose={true}
                               closable={true}
                               maskClosable={true}
                               footer={null}
                               onCancel={() => {this.setState({addCenterFlag: false})}}
                    >
                        <CourseGeneralSelectCenter
                            onAddCenter={this.handleAddCenter.bind(this)}
                            closeAddCenter={() => {this.setState({addCenterFlag: false})}}
                        />
                    </ListModal>
                </div>

            </div>
        )
    }
}

export {ElectronicContractAdd}
