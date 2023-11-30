/**
 * desc: 切换页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/1/5
 * Time: 下午2:50
 */
import React, {Component} from 'react';
import { Tabs, Form, Modal } from 'antd';
import {form} from "@/common/decorator/form";
import {BabyInformationContent} from "@/ui/pages/customer/create/part/bbInfoContent";
import moment from "moment";
import {PageTitle} from "@/ui/component/pageTitle";
import {Table} from "@/ui/component/tablePagination";
import {User} from "@/common/beans/user";

const TabPane = Tabs.TabPane;

@form()
class TabForm extends Component <any, any>{
    private LIMIT_PANES_COUNT:number = 15;
    constructor(props){
        super(props)
        this.state = {
            panes: [{}],
            flag:false,
            visibleLogo: false
        }
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.babys && nextProps.babys.length > 0 && !prevState.flag){
            return {
                panes: nextProps.babys,
                flag:true
            }
        }
        return null;
    }
    /**
     * 添加标签
     */
    handleAddTabs = () => {
        if(this.state.panes.length < this.LIMIT_PANES_COUNT){
            this.setState(prevState => {
                return {panes : [...prevState.panes, {}]}
            });
        }
    };
    /**
     * 新增，删除标签
     * @param targetKey
     * @param action
     */
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
    /**
     * 删除
     * @param targetKey
     */
    remove = (targetKey) => {
        if (this.state.panes.length === 1) return;
        this.setState(prevState => {
            return {panes: [...prevState.panes.slice(0, targetKey), ...prevState.panes.slice(targetKey+1)]}
        })
    };
    /**
     * 修改标签页
     */
    handleChangeTabs = (object) => {
        const {value, key} = object;
        this.setState(prevState => {
            return { panes: [
                    ...prevState.panes.slice(0, key),
                    Object.assign({}, prevState.panes[key], {babyName: value}),
                    ...prevState.panes.slice(key + 1)
                ]}
        })
    };
    /**
     * 提交下一步
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {centerBusinessStatus} = User.tmkStatus;
        if(centerBusinessStatus){
            return;
        }
        const {validateFields} = this.props.form;
        validateFields((err, values) => {
            if(!err){
                let babys = [];
                for(let key in values){
                    const index = Number(key.split('-')[1]);
                    const keyName = key.split('-')[0];
                    if(!babys[index]){
                        babys.push({});
                    }
                    let value = '';
                    if(keyName === 'birthday'){
                        value = values[key].valueOf()
                    }else if(keyName === 'photoPath'){
                        value = values[key][0] ? values[key][0].fileId : '';
                    }else{
                        value = values[key];
                    }
                    babys[index][keyName] = value;
                }
                this.props.emitNext(babys)
            }
        })
    };
    /**
     * 显示日志
     */
    showLogoInfo = () => {
        this.setState({visibleLogo:true})

    };
    columns = [
        {
            title: '修改日期',
            dataIndex: 'createDate',
            render: (date) => date&&moment(date).format("YYYY-MM-DD"),
            width: 120
        },
        {
            title: '操作人',
            dataIndex: 'operator',
            width: 150
        },
        {
            title: '修改明细',
            dataIndex: 'remark',
        },
    ];
    render(){
        const {isEdit} = this.props;
        const {visibleLogo} = this.state;
        const {centerBusinessStatus} = User.tmkStatus;

        // 是否可编辑
        return(
            <Form className='gym-customer-create-tabs' style={this.props.style}>
                <Tabs
                    onEdit={this.onEdit}
                    type="editable-card"
                    hideAdd={true}
                >
                    {this.state.panes.map((pane:any, index) =>
                        <TabPane
                            tab={pane.babyName || '新客户'}
                            key={`baby-${index}`}
                            forceRender={true}
                            closable={false}
                        >
                            <BabyInformationContent
                                form={this.props.form}
                                tabKey={index}
                                onTitleChange={this.handleChangeTabs}
                                data={pane}
                                isEdit={isEdit}
                            />
                        </TabPane>
                    )}
                </Tabs>
                {isEdit && <button className="gym-button-xs gym-button-wBlue gym-customer-create-tabs-log" onClick={this.showLogoInfo}>修改日志</button>}
                {
                    isEdit!==false&&
                    <button
                        className='gym-customer-create-tabs-add gym-button-xs gym-button-blue'
                        onClick={this.handleAddTabs}
                    >+新增</button>
                }
                <div className='gym-customer-create-tabs-button mt20'>
                    {
                        isEdit
                            ? <button className='gym-button-default gym-button-xs' onClick={this.handleSubmit}>保存</button>
                            : <button className={`gym-button-${centerBusinessStatus ? 'grey' :'default'} gym-button-xs`} onClick={this.handleSubmit}>下一步</button>
                    }
                </div>
                <Modal
                    visible={visibleLogo}
                    onCancel={() => {this.setState({visibleLogo: false})}}
                    width={800}

                    footer={false}
                >
                    <PageTitle title="修改日志"/>
                    <Table
                        dataSource={this.props.logInfoList}
                        columns={this.columns}
                        rowKey="id"
                    />
                </Modal>
            </Form>
        )
    }
}

export {TabForm}
