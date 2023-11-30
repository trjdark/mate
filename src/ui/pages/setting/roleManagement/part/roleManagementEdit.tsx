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
import {connect} from "../../../../../common/decorator/connect";
import {Input} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {
    RoleStatus
} from "../../enum/role";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getRole,  updateRole} from "@redux-actions/setting/roleActions";
import {selectDefaultAddPermission} from "../../../../../saga/selectors/setting/role";
import {User} from "../../../../../common/beans/user";
import {selectPerissionList} from "../../../../../saga/selectors/home";
import {handleValidate, Validation} from "../../../../../common/utils/validate";
import {Message} from "@/ui/component/message/message";

//mock数据
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@form()
@connect((state:any) => ({
    permission: selectPerissionList(state).permissionTree,
    allPermission: selectDefaultAddPermission(state),
}), { })

class RoleManagementEdit extends React.Component<any, any>{
    roleId:string;
    /*设置初始化tree*/

    constructor(props:any) {
        super(props);
        if(CommonUtils.hasParams(props)){
            this.roleId = CommonUtils.parse(props).id
        }
        this.state = {
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: null,
            selectedKeys: [],
            expandAll:true,
            role: {}
        };
    }
    componentDidMount(){
        getRole({
            id:this.roleId,
            currentCenterId:User.currentCenterId
        }).then((res:any) => {
            this.setState({role: res})
        });
    }
    /*Todo 整个页面表单提交 失效设置检查是否备占用*/
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                const funsOri=this.state.checkedKeys|| this.state.role.btree;
                const funs=CommonUtils.fullfillPermission(funsOri);

                if(funs && funs.length){
                    values.functions=funs.join(',');
                }else{
                    values.functions='';
                }
                updateRole(Object.assign({}, values, {id: this.roleId}))
                    .then(() => {
                        Message.success("修改角色成功！", () => {
                            window.location.reload()
                        });
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
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
        this.props.form.setFieldsValue({
            functions: checkedKeys
        });
    };

    /**
     * 展开、收起
     * @returns {any}
     */
    toggleExpand=()=>{
        const {expandAll}=this.state;
        const {allPermission}=this.props;
        if(expandAll){
            this.setState({expandedKeys:allPermission,expandAll:!expandAll});
        }else{
            this.setState({expandedKeys:[],expandAll:!expandAll});
        }
    };

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

    render(){
        const {expandedKeys, autoExpandParent, selectedKeys,expandAll} = this.state;
        const { getFieldDecorator } = this.props.form;
        const { permission, allPermission} = this.props;
        const {role} = this.state;
        let checkedKeys=  this.state.checkedKeys || role.btree;
        checkedKeys=checkedKeys && checkedKeys.filter((func)=>{
            return allPermission.includes(func);
        });
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
                                            {required: true, message: '请输入角色名称', whitespace:true},
                                            {validator:handleValidate[Validation.非空格]}

                                        ],
                                        initialValue: role.roleName
                                    })(
                                        <Input placeholder={`请输入角色名称`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={'所属中心'} {...formItemLayout}>
                                {
                                    getFieldDecorator('currentCenterId', {
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
                                        initialValue: role.remark
                                    })(
                                        <Input placeholder={`请输入备注`}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={'默认角色'} {...formItemLayout}>
                                {role.defaultRoleName}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={'启用状态'} {...formItemLayout}>
                                {
                                    getFieldDecorator('isEnabled', {
                                        rules: [
                                            {required: true, message: '请选择状态',}
                                        ],
                                        initialValue: role.isEnabled
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
                    <FormItem {...formItemLayout}>
                        {
                            getFieldDecorator('functions', {
                                initialValue: role.btree
                            })(
                                <div>
                                    {
                                        permission.length  > 0 &&
                                        (
                                            <Tree
                                                checkable
                                                onExpand={this.onExpand}
                                                expandedKeys={expandedKeys}
                                                autoExpandParent={autoExpandParent}
                                                onCheck={this.onCheck}
                                                checkedKeys={checkedKeys}
                                                selectedKeys={selectedKeys}
                                            >
                                                {this.renderTreeNodes(permission)}
                                            </Tree>
                                        )
                                    }

                                </div>
                            )
                        }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export {RoleManagementEdit}
