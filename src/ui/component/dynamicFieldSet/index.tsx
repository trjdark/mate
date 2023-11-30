/**
 * desc: 动态添加表单
 * Date: 2018/8/17
 * Time: 上午10:46
 */
import React from 'react';
import {Form, Button} from 'antd';
import {Fetch} from "../../../service/fetch";
import {SetApi} from "../../../api/settingApi";
import {User} from "../../../common/beans/user";
import {Select, Option as SelectOption} from "@/ui/component/select";
const FormItem = Form.Item;


declare interface propsObj {
    form: any,
    className?: string,
    centerList: any,
    typeList: any,//岗位下拉列表的值
    staffTypeList: any,//当前员工岗位、角色列表
    name: string,// 角色|| 岗位
    label: string,//角色，岗位field label
    onCenterChange?: (id) => (void),
    canFetchStaffRole?:boolean,//是否在拉取角色数据
    changeFetchingStatus?:(status)=>(void),//改变isFetchingStaffRole状态
}

/**
 * 编辑动态按钮
 * @param props
 * @returns {any}
 */

class DynamicEditBtn extends React.Component<any, any> {
    state = {
        isEdit: true,
    };
    toogleEdit = () => {
        const {isEdit} = this.state;
        this.setState({isEdit: !isEdit});
        if (isEdit) {
            this.props.onEdit()
        } else {
            this.props.onSave();
        }
    };

    render() {
        const {uuid} = this.props;
        const {isEdit} = this.state;
        return <Button className='fl gym-button-wBlue-xs mt5 ml10'
                       onClick={this.toogleEdit.bind(this, uuid)}>
            {`${isEdit ? '编辑' : '保存'}`}
        </Button>
    }
}

class DynamicFieldSet extends React.Component<propsObj, any> {
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    add = () => {
        const {form, label} = this.props;
        const keys = form.getFieldValue(label);
        const nextKeys = keys.concat({uuid: new Date().getTime()});
        form.setFieldsValue({
            [label]: nextKeys,
        });
    };

    delete(k) {
        const {form, label} = this.props;
        const keys = form.getFieldValue(label);
        form.setFieldsValue({
            [label]: keys.filter((key, index) => {
                return key.uuid !== k
            }),
        });
    }

    /**
     * 编辑角色（后期需求）
     * @param uuid
     * @param roleId
     * @returns {any}
     */
    handleEdit = (uuid, roleId) => {
        this.changeSelect(roleId, 'role', uuid, true);
    };

    changeSelect(value, name, uuid, fromEditBtn = false) {
        const {label} = this.props;
        const fieldLabel = `${label}##${uuid}`;
        const disableLabel = `${label}${uuid}`;
        const employeeRoleList = `roleList_${uuid}`;
        if (name.indexOf('role') >= 0) {
            //如果通过编辑按钮解除disable状态，不需要清空表单值
            !fromEditBtn && this.props.form.setFieldsValue({[fieldLabel]: ''});
            if (!!value) {//centerId存在，再去请求数据
                Fetch.post({
                    url: `${SetApi.获取中心角色列表}`,
                    data: {centerId: `${value}`, currentCenterId: User.currentCenterId}
                }).then((res) => {
                    this.setState({
                        [disableLabel]: true,
                        [employeeRoleList]: res
                    })
                });
            } else {
                this.setState({
                    [disableLabel]: true,
                    [employeeRoleList]: []
                })
            }
        }
    }

    static getDerivedStateFromProps(props: any, state: any) {
        const {staffTypeList, label, canFetchStaffRole} = props;
        if(canFetchStaffRole && staffTypeList.length > 0 && label.indexOf('role')>=0 ){
            const obj = {};
            staffTypeList.forEach((item) => {
                obj[`roleList_${item.centerId}${item.postId}${item.roleId}`] = [{
                    id: item.roleId,
                    roleName: item.roleName
                }]
            });
            props.changeFetchingStatus(false);
            return {
                ...obj
            }
        }
        return null
    }

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        let {className, centerList, typeList, name, label, staffTypeList} = this.props;
        staffTypeList.map((item) => {
            const uuid = `${item.centerId}${item.postId}${item.roleId}`;
            item.uuid = uuid;
        });
        getFieldDecorator(label, {initialValue: staffTypeList});
        const keys = getFieldValue(label);
        const formItems = keys.map((staffType: any, index: number) => {
                const defaultValue = staffType.roleId || staffType.postId;
                const fieldLabel = staffType.staffId ? `${name}` : `请选择${name}`;

                const shouldShowEdit = (label.indexOf('role') >= 0 && !(this.state[`${label}${staffType.uuid}`]) && !!defaultValue);
                return <div key={index} className='clear ml30'>
                    <div className='gym-employee-info-part fl'>
                        <FormItem label={`${name}所属中心`} className={className}>
                            {
                                getFieldDecorator(`${label}center##${staffType.uuid}`, {
                                    initialValue: staffType.centerId
                                })(
                                    <Select
                                        showSearch={true}
                                        optionFilterProp="children"
                                        disabled={shouldShowEdit}
                                        onSelect={(value: any) => this.changeSelect(value, label, `${staffType.uuid}`)}

                                    >
                                        {
                                            (centerList || []).map((item: any) => (
                                                <SelectOption title={`${item.centerCode}-${item.centerName}`}
                                                              value={item.id} key={item.id}>
                                                    {item.centerCode}-{item.centerName}
                                                </SelectOption>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </div>

                    <div className='gym-employee-info-part fl mr20'>
                        <FormItem label={`${fieldLabel}`} className={className}>
                            {
                                getFieldDecorator(`${label}##${staffType.uuid}`, {
                                    initialValue: defaultValue || ''

                                })(
                                    <Select showSearch
                                            disabled={shouldShowEdit}>
                                        {
                                            (name === '角色' &&
                                                (this.state[`roleList_${staffType.uuid}`] || []).map((item: any, i: number) =>

                                                    (<SelectOption value={item.id}
                                                                   key={item.id}>
                                                        {item.roleName}
                                                    </SelectOption>)
                                                ))
                                            ||
                                            (name === '岗位' &&
                                                (typeList || []).map((item: any, i: number) =>
                                                    (<SelectOption value={item.id}
                                                                   key={item.id}>
                                                        {item.postName}
                                                    </SelectOption>)
                                                ))

                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </div>
                    <Button className='fl gym-button-wBlue-xs mt5'
                            onClick={this.delete.bind(this, staffType.uuid)}>删除</Button>
                    {
                        shouldShowEdit &&
                        <DynamicEditBtn
                            onEdit={this.handleEdit.bind(this, staffType.uuid, staffType.centerId)}
                        />
                    }
                </div>
            }
        );
        return (
            <div>
                {formItems}
                <FormItem>
                    <Button className='gym-button-default-xs ml30' onClick={this.add.bind(this)}>添加</Button>
                </FormItem>

            </div>
        )
    }
}

export {DynamicFieldSet}
