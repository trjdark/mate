/**
 * desc: 角色管理
 * User: colin.lu
 * Date: 2018/8/5
 * Time: 上午10:00
 */

import React from 'react';
import {Button, Col, Form, Row, Tree} from "antd";
import {PageTitle} from "../../../../component/pageTitle";
import {form} from "../../../../../common/decorator/form";
import {Input} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {
    RoleStatus, DefaultRoleStatus
} from "../../enum/role";
import { addRole} from "@redux-actions/setting/roleActions";
import {connect} from "../../../../../common/decorator/connect";
import { selectDefaultAddPermission} from "../../../../../saga/selectors/setting/role";
import {User} from "../../../../../common/beans/user";
import {CancelButton} from "../../../../component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {selectPerissionList} from "../../../../../saga/selectors/home";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {handleValidate, Validation} from "../../../../../common/utils/validate";
import {Message} from "@/ui/component/message/message";

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@form()
@connect((state:any) => ({
    permission: selectPerissionList(state).permissionTree,
    defaultAddPermission: selectDefaultAddPermission(state),
}), { })

class RoleManagementAdd extends React.Component<any>{
    /*设置初始化tree*/
    state = {
        expandedKeys:[],
        checkedKeys:[],
        autoExpandParent: true,
        selectedKeys: [],
        expandAll:true
    };
    componentDidMount(){
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(values.functions instanceof Array){
                    const funs=CommonUtils.fullfillPermission(values.functions);
                    values.functions = funs.join(',');
                }
                if(!values.functions){
                    values.functions = '';
                }
                values.currentCenterId = User.currentCenterId;
                addRole(values).then(() => {
                    Message.success("添加角色成功");
                });
            }
        })
    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    /**
     * 选中权限
     * @param checkedKeys
     */
    onCheck = (checkedKeys) => {
        this.props.form.setFieldsValue({
            functions: checkedKeys
        });
        this.setState({ checkedKeys });
    };
    /**
     * 权限树
     * @param data
     * @returns {any}
     */
    renderTreeNodes = (data) => {
        const UN_EDIT_ROLE_LIST = ['FUNC02010101', 'FUNC02010102','FUNC02010103','FUNC02010104','FUNC02010105','FUNC02010106'];
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} disabled={item.key === 'FUNC02010100'}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} disabled={(UN_EDIT_ROLE_LIST.includes(item.key))}/>;
        });
    };
    /**
     * 展开、收起
     * @returns {any}
     */
    toggleExpand=()=>{
        const {expandAll}=this.state;
        const {defaultAddPermission}=this.props;
        if(expandAll){
            this.setState({expandedKeys:defaultAddPermission,expandAll:!expandAll});
        }else{
            this.setState({expandedKeys:[],expandAll:!expandAll});
        }
    };

    /**
     * 渲染
     * @returns {any}
     */
    render(){
        //设置props数据
        const { getFieldDecorator } = this.props.form;
        const {permission,defaultAddPermission, form} = this.props;
        const {expandedKeys, autoExpandParent, selectedKeys, expandAll} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            }
        };
        return(
            <div id='gym-general-course-create' className='gym-general-course-create'>
                <PageTitle title={`中心角色`}/>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col span={8}>
                            <FormItem label={'角色名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('roleName', {
                                        rules: [
                                            {required: true, message: '请输入角色名称',
                                                whitespace:true},
                                            {validator:handleValidate[Validation.非空格]}
                                        ],
                                    })(
                                        <Input placeholder={`请输入角色名称`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={'所属中心'} {...formItemLayout}>
                                {
                                    getFieldDecorator('centerId', {

                                        initialValue: User.currentCenterId
                                    })(
                                        <span>{User.currentCenterName}</span>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={'备注'} {...formItemLayout}>
                                {
                                    getFieldDecorator('remark', {
                                        rules: [
                                            {required: false, message: '请输入备注',}
                                        ],
                                    })(
                                        <Input placeholder={`请输入备注`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={'启用状态'} {...formItemLayout}>
                                {
                                    getFieldDecorator('isEnabled', {
                                        rules: [
                                            {required: true, message: '请选择状态',}
                                        ],
                                        initialValue: DefaultRoleStatus
                                    })(
                                        <Select style={{width:200}}>
                                            {
                                                (RoleStatus || []).map((item:any) =>
                                                    <Option key={item.key} value={item.value}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <PageTitle title='权限分配'/>
                    <p className='mb10'>
                        <Button className='gym-button-default-xs' onClick={this.toggleExpand}>
                            {expandAll? '展开权限' : '收起权限'}
                        </Button>
                    </p>
                    <div>
                        {
                            permission.length > 0 &&
                            getFieldDecorator('functions', {
                                initialValue: defaultAddPermission
                            })(
                                <Tree
                                    checkable
                                    onExpand={this.onExpand}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    onCheck={this.onCheck}
                                    defaultCheckedKeys={defaultAddPermission}
                                    selectedKeys={selectedKeys}
                                >
                                    {this.renderTreeNodes(permission)}
                                </Tree>
                            )
                        }
                    </div>
                    <CancelButton form={form} treeData={defaultAddPermission} goBackLink={Routes.中心角色管理.path}/>
                </Form>
            </div>
        )
    }
}

export {RoleManagementAdd}
