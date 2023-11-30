/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/12/1
 * Time: 下午4:38
 */
import React, {Component, Fragment} from 'react';
import {Table} from "@/ui/component/tablePagination";
import {Icon as AntdIcon} from 'antd';
import {Tooltip} from "@/ui/component/toolTip";
import {Select, Option} from "@/ui/component/select";
import {getCenterEmployeeRole} from "@redux-actions/setting/employee";
import {User} from "@/common/beans/user";

declare interface PostRoleTableProps {
    dataSource:Array<any>,
    centerList:Array<any>,
    postList:Array<any>,
    emitChangeData: (value, index, type) => void
    emitInsertData: (node) => void
}

class PostRoleTable extends Component <PostRoleTableProps, any> {
    state:any = {
        selectIndex:null,
        defaultRoleList: [],
        roleList: [],
        level: 0,
        addFlag: false,
        addPostRole: {addId: 'add'}
    };
    /**
     * 修改
     */
    handleEdit = (index:number, record:any = null) => {
        if(record){
            this.setState({
                selectIndex: index,
                level: record.priority,
                addFlag: false,
            }, () => {
                this.getRoleList(record.centerId);
            });
        }else{
            this.setState({
                selectIndex: index,
            })
        }
    };
    handleDelete = (index, type) => {
        this.props.emitChangeData(null, index, type);
    };
    /**
     * 保存
     */
    handleSave = () => {
        this.setState({
            selectIndex: null,
            level: 0
        })
    };
    /**
     * 获取中心对应角色列表
     * @param {string} centerId
     */
    getRoleList = (centerId:string) => {
        const param = {
            centerId: centerId,
            currentCenterId:User.currentCenterId
        };
        getCenterEmployeeRole(param).then((res) => {
            this.setState({defaultRoleList: res}, this.filterRoleList);
        });
    };
    /**
     * 过滤角色列表
     * @type {{}}
     */
    filterRoleList = () => {
        const {level, defaultRoleList} = this.state;
        this.setState({roleList: defaultRoleList.filter(role => role.priority <= level)});
    };
    /**
     * 选择
     */
    handleChange = (value:any, index:number, type:string) => {
        const {centerList, postList} = this.props;
        const {roleList} = this.state;
        let node;
        switch (type) {
            case 'centerId':
                this.getRoleList(value);
                node = centerList.filter((center) => center.id === value)[0];
                break;
            case 'postId':
                node = postList.filter((post) => post.id === value)[0];
                this.setState({level: node.priority}, this.filterRoleList);
                break;
            case 'roleId':
                node = roleList.filter((role) => value.includes(role.id)).map(role => ({
                    roleId: role.id,
                    roleName:role.roleName,
                    centerId: role.cid,
                    defaultRoleName: role.defaultRoleName,
                }));
                break;
        }
        this.props.emitChangeData(node, index, type);
    };
    /**
     *
     * @param value
     * @param {number} index
     * @param {string} type
     */
    handleChangeAdd = (value:any, index:number, type:string) => {
        const {centerList, postList} = this.props;
        const {roleList} = this.state;
        switch (type) {
            case 'centerId':
                this.getRoleList(value);
                const center = centerList.filter((center) => center.id === value)[0];
                this.setState(prevState => ({
                    addPostRole: Object.assign({}, prevState.addPostRole, {
                        centerCode: center.centerCode,
                        centerId: center.id,
                        centerName: center.centerName,
                    })
                }));
                break;
            case 'postId':
                const post = postList.filter((post) => post.id === value)[0];
                this.setState({level: post.priority}, this.filterRoleList);
                this.setState(prevState => ({
                    addPostRole: Object.assign({}, prevState.addPostRole, {
                        postCode: post.postCode,
                        postId: post.id,
                        postName: post.postName,
                        roleList: []
                    }),
                }));
                break;
            case 'roleId':
                const roles = roleList.filter((role) => value.includes(role.id)).map(role => ({
                    roleId: role.id,
                    roleName:role.roleName,
                    centerId: role.cid,
                    defaultRoleName: role.defaultRoleName
                }));
                this.setState(prevState => ({
                    addPostRole: Object.assign({}, prevState.addPostRole, {
                        roleList: roles,
                    })
                }));
                break;
        }

    };
    /**
     * 添加
     */
    handleAdd = () => {
        this.setState({
            addFlag: true,
            selectIndex: null,
            roleList: [],
            level: 0,
        })
    };
    /**
     * 保存添加
     */
    handleSaveAdd = () => {
        const {addPostRole,level} = this.state;
        const param = {
            centerCode: addPostRole.centerCode,
            centerId: addPostRole.centerId,
            centerName: addPostRole.centerName,
            postCode: addPostRole.postCode,
            postId: addPostRole.postId,
            postName: addPostRole.postName,
            roleList: addPostRole.roleList,
            priority:level
        };
        if(param.centerId && param.postId && param.roleList.length > 0){
            this.props.emitInsertData(param);
        }
        this.setState({
            addFlag: false,
            addPostRole: {addId: 'add'},
            level: 0
        });
    };
    /**
     * 表格表头设置
     */
    columns = [
        {
            title: '中心',
            dataIndex: 'centerName',
            width: 300,
            render: (text, record, index) => {
                const {selectIndex, addFlag, addPostRole} = this.state;
                const {centerList, dataSource} = this.props;
                const selectedCenterList = dataSource.map(item => item.centerId);
                if(record.addId === 'add'){
                    if(addFlag){
                        return (
                            <Select
                                showSearch={true}
                                optionFilterProp="children"
                                value={addPostRole.centerId}
                                onChange={(e) => this.handleChangeAdd(e, index, 'centerId')}
                            >
                                {
                                    centerList.map((item) => (
                                        <Option
                                            title={`${item.centerCode}-${item.centerName}`}
                                            value={item.id}
                                            key={item.id}
                                            disabled={selectedCenterList.includes(item.id)}
                                        >
                                            {item.centerCode}-{item.centerName}
                                        </Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                }
                if(selectIndex === index){
                    return (
                        <Select
                            showSearch={true}
                            optionFilterProp="children"
                            value={record.centerId}
                            onChange={(e) => this.handleChange(e, index, 'centerId')}
                        >
                            {
                                centerList.map((item) => (
                                    <Option
                                        title={`${item.centerCode}-${item.centerName}`}
                                        value={item.id}
                                        key={item.id}
                                        disabled={selectedCenterList.includes(item.id)}
                                    >
                                        {item.centerCode}-{item.centerName}
                                    </Option>
                                ))
                            }
                        </Select>
                    )
                }else{
                    return (record.centerCode && text) ? `${record.centerCode}-${text}`: null;
                }
            }
        },
        {
            title: '岗位',
            dataIndex: 'postName',
            render: (text, record, index) => {
                const {selectIndex, addFlag, addPostRole} = this.state;
                const {postList} = this.props;
                if(record.addId === 'add'){
                    if(addFlag){
                        return (
                            <Select
                                showSearch={true}
                                optionFilterProp="children"
                                value={addPostRole.postId}
                                onChange={(e) => this.handleChangeAdd(e, index, 'postId')}
                            >
                                {
                                    (postList || []).map((item: any) =>
                                        (<Option
                                            value={item.id}
                                            key={item.id}
                                            disabled={ (!User.isHQ && ['1', '2'].includes(item.id))}
                                        >
                                            {item.postName}
                                        </Option>)
                                    )
                                }
                            </Select>
                        )
                    }
                }
                if(selectIndex === index){
                    return (
                        <Select
                            showSearch={true}
                            optionFilterProp="children"
                            value={record.postId}
                            onChange={(e) => this.handleChange(e, index, 'postId')}
                        >
                            {
                                (postList || []).map((item: any) =>
                                    (<Option
                                        value={item.id}
                                        key={item.id}
                                        disabled={ (!User.isHQ && ['1', '2'].includes(item.id))}
                                    >
                                        {item.postName}
                                    </Option>)
                                )
                            }
                        </Select>
                    )
                }else{
                    return text;
                }
            }
        },
        {
            title: '角色',
            dataIndex: 'roleList',
            render: (list, record, index) => {
                const {selectIndex, roleList, addFlag, addPostRole} = this.state;
                if(record.addId === 'add'){
                    if(addFlag){
                        const value = (addPostRole.roleList || []).map((role) => role.roleId);
                        const valueNames = (record.roleList || []).map((role) => role.defaultRoleName);
                        let unSelectRole = User.isHQ ? [] : ['CD', 'GI', '_启蒙APP客服（中心请勿使用）'];
                        if(valueNames.includes('HR')){
                            unSelectRole.push('EA');
                        }else if(valueNames.includes('EA')){
                            unSelectRole.push('HR');
                        }
                        return (
                            <Select
                                mode="multiple"
                                showSearch={true}
                                optionFilterProp="children"
                                value={value}
                                onChange={(e) => this.handleChangeAdd(e, index, 'roleId')}
                            >
                                {
                                    (roleList || []).map((item: any) =>
                                        (<Option
                                            value={item.id}
                                            key={item.id}
                                            disabled={unSelectRole.includes(item.defaultRoleName)}
                                        >
                                            {item.roleName}
                                        </Option>)
                                    )
                                }
                            </Select>
                        )
                    }
                }
                if(selectIndex === index){
                    const value = (record.roleList || []).map((role) => role.roleId);
                    const valueNames = (record.roleList || []).map((role) => role.defaultRoleName);
                    let unSelectRole = User.isHQ ? [] : ['CD', 'GI', "_启蒙APP客服（中心请勿使用）"];
                    if(valueNames.includes('HR')){
                        unSelectRole.push('EA');
                    }else if(valueNames.includes('EA')){
                        unSelectRole.push('HR');
                    }
                    return (
                        <Select
                            mode="multiple"
                            showSearch={true}
                            optionFilterProp="children"
                            value={value}
                            onChange={(e) => this.handleChange(e, index, 'roleId')}
                        >
                            {
                                (roleList || []).map((item: any) =>
                                    (<Option
                                        value={item.id}
                                        key={item.id}
                                        disabled={unSelectRole.includes(item.defaultRoleName)}
                                    >
                                        {item.roleName}
                                    </Option>)
                                )
                            }
                        </Select>
                    )
                }else{
                    return (list || []).map((role) => role.roleName).join(',');
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (text, record, index) => {
                const {selectIndex, addFlag} = this.state;
                if(record.addId === 'add'){
                    if(!addFlag){
                        return (
                            <Tooltip placement="bottom" title={'添加'}>
                                <AntdIcon
                                    className='gym-teach-theme-content-col-icon'
                                    type='plus'
                                    onClick={() => this.handleAdd()}
                                />
                            </Tooltip>
                        )
                    }else {
                        return (
                            <Tooltip placement="bottom" title={'保存'}>
                                <AntdIcon
                                    className='gym-teach-theme-content-col-icon'
                                    type='save'
                                    onClick={() => this.handleSaveAdd()}
                                />
                            </Tooltip>)
                    }
                }
                if(selectIndex === index){
                    return (
                        <Fragment>
                            <Tooltip placement="bottom" title={'保存'}>
                                <AntdIcon
                                    className='gym-teach-theme-content-col-icon'
                                    type='save'
                                    onClick={() => this.handleSave()}

                                />
                            </Tooltip>
                        </Fragment>
                    )
                }else{

                    return (
                        <Fragment>
                            <Tooltip placement="bottom" title={'删除'}>
                                <AntdIcon
                                    className='gym-teach-theme-content-col-icon close'
                                    type='close'
                                    onClick={() => this.handleDelete(index, 'delete')}
                                />
                            </Tooltip>
                            <Tooltip placement="bottom" title={'编辑'}>
                                <AntdIcon
                                    className='gym-teach-theme-content-col-icon'
                                    type='edit'
                                    onClick={() => this.handleEdit(index, record)}
                                />
                            </Tooltip>
                        </Fragment>
                    )
                }
            }
        },
    ];
    render(){
        let {dataSource} = this.props;
        const {addPostRole} = this.state;
        return (
            <Table
                columns={this.columns}
                dataSource={[...dataSource, addPostRole]}
                rowKey={(record) => `${record.centerId}_${record.postId}`}
            />
        )
    }
}

export {PostRoleTable}
