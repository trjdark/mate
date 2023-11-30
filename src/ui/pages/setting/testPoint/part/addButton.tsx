/**
 * desc: 试点中心设置=>添加按钮
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/11
 * Time: 下午4:37
 */
import React, {Fragment} from "react";
import {Modal, Form} from "antd";
import {PageTitle} from "@/ui/component/pageTitle";
import {form} from "@/common/decorator/form";
import {Select, Option} from "@/ui/component/select";
import {TextArea} from "@/ui/component/input";
import {connect} from "@/common/decorator/connect";
import {selectAllCenterList} from "@/saga/selectors/setting/employee";
import {getDefaultRoles} from "@redux-actions/setting/roleActions";
import {User} from "@/common/beans/user";
import {getPermissionByRoleId} from "@redux-actions/setting/testPoint";

const FormItem = Form.Item;

@connect((state) => ({
    centerList: selectAllCenterList(state)
}))
@form()

class AddButton extends React.Component<any, any> {
    state = {
        visible: false,
        roleList: [],
        permissionList: [],
    };
    componentDidMount(){
        // Todo 取前50个默认角色信息
        const param = {
            currentCenterId: User.currentCenterId,
            pageNo:1,
            pageSize: 50,
        };
        getDefaultRoles(param).then((res) => {
            this.setState({roleList: res.list})
        });
    }
    /**
     * 打开碳层
     */
    showModal = () => {
        this.setState({visible: true})
    };
    /**
     * 保存
     */
    save = () => {
        this.props.form.validateFields((err: any, values: any) => {
            // 正常情况
            if (!err) {
                const param = {
                    roleId: values.role,
                    centers: values.centerCode.join(','),
                    functions: values.functions.join(','),
                    remark: values.remark,
                    currentCenterId:User.currentCenterId
                };
                this.props.emitAddTestPoint(param);
                this.close();

            }
        });
    };
    /**
     * 关闭
     */
    close = () => {
        this.setState({visible: false})
    };
    /**
     * 根据角色获取对应的可添加试点中心权限
     */
    handleChangeRole = (id:string) => {
        const param = {
            id: id,
            currentCenterId:User.currentCenterId
        };
        this.props.form.setFieldsValue({'functions':[]});

        getPermissionByRoleId(param).then((res) => {
            this.setState({permissionList: res})
        });
    }
    render(){
        const {centerList} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {roleList, visible, permissionList} = this.state;
        return (
            <Fragment>
                <button className="gym-button-default gym-button-xs ml25 mb25" onClick={this.showModal}>+ 新建</button>
                <Modal
                    destroyOnClose={true}
                    visible={visible}
                    footer={false}
                    maskClosable={false}
                    onCancel={this.close}
                    className='gym-test-point-modal'
                    title={<PageTitle title='新增试点中心'/>}
                    width={700}
                >
                    <Form className='mb25'>
                        <FormItem label='中心名'>
                            {getFieldDecorator('centerCode', {
                                rules: [{required: true, message: '请输入中心名!'},],
                            })(
                                <Select
                                    placeholder='请选择'
                                    mode="multiple"
                                    filterOption={
                                        (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        (centerList || []).map((item) => <Option key={item.id} value={item.centerCode}>
                                            {`${item.centerCode}-${item.centerName}`}
                                        </Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='角色'>
                            {getFieldDecorator('role', {
                                rules: [{required: true, message: '请选择角色!'},],
                            })(
                                <Select
                                    placeholder='请选择'
                                    showSearch
                                    filterOption={
                                        (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={this.handleChangeRole}
                                >
                                    {
                                        (roleList||[]).map((item) => <Option key={item.id} value={item.id}>{item.roleName}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='菜单'>
                            {getFieldDecorator('functions', {
                                rules: [{required: true, message: '请选择菜单!'},],
                            })(
                                <Select
                                    placeholder='请选择'
                                    mode="multiple"
                                    filterOption={
                                        (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        (permissionList || []).map((item) => <Option key={item.id} value={item.id}>{item.functionName}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='备注'>
                            {getFieldDecorator('remark')(
                                <TextArea placeholder='请输入内容'/>
                            )}
                        </FormItem>

                    </Form>
                    <div className='text-c'>
                        <button className='gym-button-xs gym-button-default mr10' onClick={this.save}>保存</button>
                        <button className='gym-button-xs gym-button-white' onClick={this.close}>取消</button>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export {AddButton}
