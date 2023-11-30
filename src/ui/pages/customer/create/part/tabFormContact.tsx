/**
 * desc: 联系人切换页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/1/12
 * Time: 下午4:01
 */
import React, {Component} from 'react';
import { Tabs, Form } from 'antd';
import {form} from "@/common/decorator/form";
import {ContactInformationContent} from "@/ui/pages/customer/create/part/contactInfoContent";
import {getCodeInfoByType} from "@redux-actions/customerCreate";
import {User} from "@/common/beans/user";


const TabPane = Tabs.TabPane;

@form()
class TabFormContact extends Component <any, any>{
    private LIMIT_PANES_COUNT:number = 15;
    constructor(props){
        super(props)
        this.state = {
            panes: [{}],
            jobList:[],
            familyRelationList: [],
        }
    }
    componentDidMount(){
        Promise.all([
            getCodeInfoByType({type:'job',currentCenterId:User.currentCenterId}),
            getCodeInfoByType({type:'familyRelation',currentCenterId:User.currentCenterId}),
        ]).then((res) => {
            const [jobList, familyRelationList] = res;
            this.setState({jobList, familyRelationList})
        })
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.contacts && nextProps.contacts.length > 0 && !prevState.flag){
            return {
                panes: nextProps.contacts,
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
                    Object.assign({}, prevState.panes[key], {familyRelation: value}),
                    ...prevState.panes.slice(key + 1)
                ]}
        })
    };
    /**
     * 提交下一步
     */
    handleSubmit = (e) => {
        e.preventDefault();
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
                    const value = keyName === 'familyRelation' ? values[key].key : values[key];
                    babys[index][keyName] = value;
                }
                this.props.emitNext(babys)
            }
        })
    };
    /**
     * 上一步
     */
    handlePrev = () => {
        this.props.emitPrev();
    };
    /**
     * 格式化家庭关系
     */
    formatFamilyRelation = (type:string) => {
        const {familyRelationList} = this.state;
        const result = familyRelationList.filter((item) => item.code === type);
        return result.length > 0 ? result[0].codeValue : false;
    }
    render(){
        const {isEdit, isPhoneEdit} = this.props;
        const {jobList, familyRelationList} = this.state;
        return(
            <Form className='gym-customer-create-tabs' style={this.props.style}>
                <Tabs
                    onEdit={this.onEdit}
                    type="editable-card"
                    hideAdd={true}
                >
                    {this.state.panes.map((pane:any, index) =>
                        <TabPane
                            tab={ this.formatFamilyRelation(pane.familyRelation) || '新联系人'}
                            key={`contact_${index}`}
                            forceRender={true}
                            closable={false}
                        >
                            <ContactInformationContent
                                form={this.props.form}
                                tabKey={index}
                                onTitleChange={this.handleChangeTabs}
                                data={pane}
                                jobList={jobList}
                                familyRelationList={familyRelationList}
                                isPhoneEdit={isPhoneEdit}
                                isEdit={isEdit}
                            />
                        </TabPane>
                    )}
                </Tabs>
                <button
                    className='gym-customer-create-tabs-add gym-button-xs gym-button-blue'
                    onClick={this.handleAddTabs}
                >+新增</button>
                {
                    isEdit
                    ?<div className='gym-customer-create-tabs-button mt20'>
                            <button className='gym-button-default gym-button-xs' onClick={this.handleSubmit}>保存</button>
                        </div>
                    :<div className='gym-customer-create-tabs-button mt20'>
                            <button className='gym-button-white gym-button-xs mr15' onClick={this.handlePrev}>上一步</button>
                            <button className='gym-button-default gym-button-xs' onClick={this.handleSubmit}>下一步</button>
                        </div>
                }

            </Form>
        )
    }
}

export {TabFormContact}
