/**
 * Desc: 分配leads给中心
 * User: Debby.Deng
 * Date: 2018/10/10,
 * Time: 上午10:22
 */

import * as React from "react";
import {Button, Form, Select} from "antd";
import {form} from "@/common/decorator/form";
import {getAssignCenterList, leadsToCenter} from "@redux-actions/customer/assignActions";
import {selectAssignCenterList} from "@/saga/selectors/customer/assignSelector";
import {connect} from "@/common/decorator/connect";
import {User} from "@/common/beans/user";
import {Modal} from "@/ui/component/customerCreateModal";
import {Message} from "@/ui/component/message/message";
import {Consumer} from "@/common/decorator/context";
import {PageTitle} from "@/ui/component/pageTitle";

const Option = Select.Option;

@form()
@connect(
    (state) => ({
        centerList: selectAssignCenterList(state),
    }),
    {getAssignCenterList}
)
class LeadsToCenter extends React.Component<any, any> {
    state = {
        successResult: false,
        centerListVal: '',
        optionVal: '',
        submitDis: true,
        btnText: '分配',
        timer: 5,
        displayBtnAss: 'block',
        displayBtnCli: 'none',
    };
    private selectBtn = null;

    handleOk = () => {
        this.setState({successResult: false});
    };
    handleCancel = () => {
        this.setState({successResult: false});
    };
    handleChange = () => {

    };
    // 分配确定
    handleAssign = () => {
        let {timer} = this.state;
        this.setState({
            submitDis: true,
            btnText: timer+'s 分配'
        });
        // 等待五秒显示确认按钮
        this.selectBtn = setInterval(
            () => {
                this.setState({ timer: timer--, btnText: timer+'s 分配' }, () => {
                    if (timer === 0) {
                        clearInterval(this.selectBtn);
                        this.setState({displayBtnAss: 'none', displayBtnCli: 'block'});
                    }
                });
            }, 1000);
    };
    handleClick = (value) => {
        const {leadsArr, form} = this.props;
        const params = Object.assign(
            {},
            {
                currentCenterId: User.currentCenterId,
                leadsList: leadsArr
            },
            form.getFieldsValue()
        );
        leadsToCenter(params).then(
            (data) => {
                this.props.onHideClick();
                if (data instanceof Array && data.length > 0) {// 转中心不成功
                    this.props.handleErr(data);
                    value.callback && value.callback(false);
                } else {
                    Message.success('转中心成功');
                    value.callback && value.callback(true);

                }
            }, res => {
                this.props.onHideClick();
            })
    };
    handleSelect = (value) => {
        const { centerList } = this.props;
        const { optionVal } = this.state;
        clearInterval(this.selectBtn);
        if(optionVal !== value) {
            for (let v of centerList) {
                if (value === v.id){
                    this.setState({
                        centerListVal: `确定要分配至${v.centerCode}-${v.centerName}么？分配后就再也见不到我们咯！`,
                        optionVal: value,
                        submitDis: false,
                        timer: 5,
                        btnText: '分配',
                        displayBtnAss: 'block',
                        displayBtnCli: 'none'
                    });
                    break;
                }
            }
        }
    };

    componentDidMount() {
        const {getAssignCenterList} = this.props;
        const params = {currentCenterId: User.currentCenterId};
        getAssignCenterList(params);
    }

    render() {
        const {totalLeadsNum, leadsArr, centerList, form} = this.props;
        const assignLeads = leadsArr.length;
        const {getFieldDecorator} = form;
        return (
            <Consumer>
                {value => (<div>
                    <div className='gym-leads-assign-center'>
                        <PageTitle title='Leads分配至中心'/>
                        <p className='gym-leads-assign-number'>
                            已选中<span className='cDefault'>{assignLeads || 1}</span>
                            个Leads(共有<span className='corange'>{totalLeadsNum}</span>个Leads待分配)
                        </p>
                        <div className='gym-leads-assign-center-content'>
                            <Form>
                                <div className='gym-leads-assign-center-content-title'>
                                    <span className='gym-leads-assign-center-content-title-black'>分配至: </span>
                                    {
                                        getFieldDecorator('newCenterId')(
                                            <Select
                                                style={{width: '200px'}}
                                                showSearch={true}
                                                optionFilterProp="children"
                                                onSelect={this.handleSelect}
                                            >
                                                {(centerList).map((list) => {
                                                    return (
                                                        <Option key={list.id} value={`${list.id}`}>
                                                            {list.centerCode}-{list.centerName}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        )
                                    }
                                </div>
                                <div className='gym-part-option'>{this.state.centerListVal}</div>
                                <div className='gym-bottom-btn-group' style={{display: 'flex'}}>
                                    <Button
                                        htmlType="submit"
                                        className='gym-button-xs gym-button-default mr20'
                                        disabled={this.state.submitDis}
                                        onClick={this.handleAssign}
                                        style={{display: this.state.displayBtnAss}}
                                    >
                                        {this.state.btnText}
                                    </Button>
                                    <Button
                                        htmlType="submit"
                                        className='gym-button-xs gym-button-default mr20'
                                        onClick={this.handleClick.bind(this, value)}
                                        style={{display: this.state.displayBtnCli}}
                                    >
                                        确定
                                    </Button>
                                    <Button
                                        className='gym-button-xs gym-button-white'
                                        onClick={this.props.onHideClick}
                                    >
                                        取消
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                    <Modal
                        visible={this.state.successResult}
                        handleOk={this.handleOk}
                        handleCancel={this.handleCancel}
                        contentText="确定转中心吗？"
                    />

                </div>)}
            </Consumer>
        )
    }
}

export {LeadsToCenter};
