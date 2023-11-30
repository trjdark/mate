/**
 * desc: 默认角色管理
 * User: colin.lu
 * Date: 2018/8/16
 * Time: 上午10:00
 */

import React from 'react';
import {Button, Col, Form, Row, Tree} from "antd";
import {Input} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {PageTitle} from "../../../../component/pageTitle";
import {form} from "../../../../../common/decorator/form";
import {RoleStatus} from "../../enum/role";
import {connect} from "../../../../../common/decorator/connect";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getDefaultRole, updateDefaultRole} from "@redux-actions/setting/roleActions";
import {Routes} from "@/router/enum/routes";
import {CancelButton} from "../../../../component/cancelButton";
import {handleValidate, Validation} from "../../../../../common/utils/validate";
import {User} from "../../../../../common/beans/user";
import {selectPerissionList} from "../../../../../saga/selectors/home";
import {selectDefaultAddPermission} from "@/saga/selectors/setting/role";
import {Message} from "@/ui/component/message/message";

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@form()
@connect((state:any) =>({
    permissionList: selectPerissionList(state).permissionTree,
    defaultAddPermission: selectDefaultAddPermission(state),
}), {})
class DefaultRoleManagementEdit extends React.Component<any, any>{
    defaultRoleId:string;
    constructor(props:any) {
        super(props);
        if(CommonUtils.hasParams(props)){
            this.defaultRoleId = CommonUtils.parse(props).id;
        }
        this.state = {
            defaultRole: {},
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: null,
            selectedKeys: [],
            expandAll:true,
        }
    }
    componentDidMount(){
        getDefaultRole({
            id: this.defaultRoleId,
            currentCenterId:User.currentCenterId
        }).then((res:any) => {
            this.setState({defaultRole:res})
        })
    }

    /**
     * 提交
     * @param e
     */
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                const {defaultRole} = this.state;
                const funsOri=this.state.checkedKeys|| defaultRole.btree;
                const funs=CommonUtils.fullfillPermission(funsOri);
                if(funs && funs.length){
                 values.functions=funs.join(',');
                }else{
                 values.functions='';
                }
                updateDefaultRole(Object.assign({}, values, {
                    id: this.defaultRoleId,
                    currentCenterId:User.currentCenterId
                })).then(() => {
                    Message.success("修改成功!", () => {
                        window.location.reload();
                    });
                })
            }
        })
    };
    /*treeUI控件action*/
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys });
        //每次勾选更新一下form值
        this.props.form.setFieldsValue({
            functions: checkedKeys
        });
    };
    /**
     * 渲染权限树
     * @param data
     * @returns {any}
     */
    renderTreeNodes = (data) => {
        const UN_EDIT_ROLE_LIST = ['FUNC02010101', 'FUNC02010102','FUNC02010103','FUNC02010104','FUNC02010105','FUNC02010106'];
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode
                        title={item.title}
                        key={item.key}
                        disabled={item.key === 'FUNC02010100'}
                    >
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode
                {...item}
                disabled={(UN_EDIT_ROLE_LIST.includes(item.key))}
            />;
        });
    };
    /**
     * 展开、收起
     * @returns {any}
     */
    toggleExpand=()=>{
        const {expandAll} = this.state;
        const {defaultAddPermission} = this.props;
        if(expandAll){
            this.setState({expandedKeys:defaultAddPermission,expandAll:!expandAll});
        }else{
            this.setState({expandedKeys:[],expandAll:!expandAll});
        }
    };
    render(){
        //设置props数据
        const { getFieldDecorator } = this.props.form;
        const {permissionList, form} = this.props;
        const {defaultRole} = this.state;
        const checkedKeys=  this.state.checkedKeys || defaultRole.btree;
        const {expandedKeys, autoExpandParent, selectedKeys,expandAll} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            }
        };
        return(
            <div id='gym-general-course-create' className='gym-general-course-create'>
                <PageTitle title={`默认角色`}/>
                <Form onSubmit={this.onSubmit}>
                    <Row>
                        <Col span={8}>
                            <FormItem label={'角色名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('roleName', {
                                        rules: [
                                            {required: true, message: '请输入角色名称',whitespace:true},
                                            {validator:handleValidate[Validation.非空格]}
                                        ],
                                        initialValue: defaultRole.roleName
                                    })(
                                        <Input placeholder={`请输入角色名称`}/>
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
                                        initialValue: defaultRole.remark
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
                                        initialValue: defaultRole.isEnabled
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
                            {expandAll ? '展开权限' : '收起权限'}
                        </Button>
                    </p>
                    <FormItem {...formItemLayout}>
                        {
                            getFieldDecorator('functions', {
                                initialValue:checkedKeys
                            })(
                                <div>
                                    {
                                        (permissionList.length > 0 && defaultRole )&&
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
                                            {this.renderTreeNodes(permissionList)}
                                            </Tree>
                                        )
                                    }
                                </div>
                            )
                        }
                    </FormItem>
                    <CancelButton form={form} treeData={defaultRole.btree} goBackLink={Routes.默认角色管理列表.path}/>

                </Form>
            </div>
        )
    }
}

export {DefaultRoleManagementEdit}
