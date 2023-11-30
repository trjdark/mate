/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/13
 * Time: 上午10:41
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Checkbox} from 'antd';
import {form} from "@/common/decorator/form";
import {CancelButton} from "@/ui/component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getNoticeSetting, updateNoticeSetting} from "@redux-actions/telephone/message";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import {noticeTemplateConfig} from "@/ui/pages/teaching/message/enum/messageEnum";
import history from "@/router/history";

const FormItem = Form.Item;

@form()
class SystemMessageSet extends React.Component<any, any> {
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: '教学管理',
            path: '',
            link: '#',
            id: 'teachingOperation'
        }, {
            name: '系统通知设置',
            path: '',
            link: '#',
            id: 'systemAlert'
        }
    ];

    constructor(props:any){
        super(props)
        this.state = {
            noticeSettingInfo : {},            // 消息配置
            flag:false,                        // 显示
        }
    }
    componentDidMount(){
        getNoticeSetting({currentCenterId: User.currentCenterId})
            .then((res:any) => {
                this.setState({noticeSettingInfo:res, flag:true})
            });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {noticeSettingInfo} = this.state;
        const {validateFields} = this.props.form;
        validateFields((err, values:any) => {
            for(let key in values){
                values[key] = values[key] ? 1 : 0;
            }
            const param = Object.assign({}, noticeSettingInfo, values, {currentCenterId: User.currentCenterId});
            updateNoticeSetting(param).then((res:any) => {
                Message.success("更新成功！", 2, () => {history.goBack();});

            })
        })
    };
    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {noticeSettingInfo, flag} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div className="gym-system-alert page-wrap" id="gym-system-alert">
                    <Form className="gym-system-alert-form" onSubmit={this.handleSubmit}>

                        {
                            noticeTemplateConfig.map((item:any) => (
                                <div key={item.id} className='gym-system-alert-form-row'>
                                    {
                                        item.component.map((item2:any) => (
                                            <Fragment key={item2.id}>
                                                <FormItem className='gym-system-alert-form-item'>
                                                    {
                                                        flag && getFieldDecorator(item2.checkboxName, {
                                                            initialValue: noticeSettingInfo[item2.checkboxName] === 1
                                                        })(
                                                            <Checkbox
                                                                defaultChecked={noticeSettingInfo[item2.checkboxName] === 1}
                                                            />
                                                        )
                                                    }
                                                    <span>{item2.label}</span>
                                                </FormItem>
                                                <Link to={`${Routes.系统消息模版.link}${CommonUtils.stringify({type:item2.type})}`}>
                                                    <button className="gym-button-xs gym-button-default mr100">模版</button>
                                                </Link>
                                            </Fragment>
                                        ))
                                    }

                                </div>
                            ))
                        }
                        <div className="gym-system-alert-form-row-recommend">
                            <span>课程智能推荐：</span>
                            <FormItem className='gym-system-alert-form-item mr15'>
                                {
                                    flag && getFieldDecorator('nextGradeClassRecommend', {
                                        initialValue: noticeSettingInfo.nextGradeClassRecommend === 1
                                    })(
                                        <Checkbox
                                            defaultChecked={noticeSettingInfo.nextGradeClassRecommend === 1}
                                        />
                                    )
                                }
                                <span>升班课程推荐</span>
                            </FormItem>
                            <FormItem className='gym-system-alert-form-item mr15'>

                                {
                                    flag && getFieldDecorator('absentCoverageRecommend', {
                                        initialValue: noticeSettingInfo.absentCoverageRecommend === 1
                                    })(
                                        <Checkbox
                                            defaultChecked={noticeSettingInfo.absentCoverageRecommend === 1}
                                        />
                                    )
                                }
                                <span>旷课课程补位推荐</span>
                            </FormItem>
                            <FormItem className='gym-system-alert-form-item mr15'>

                                {
                                    flag && getFieldDecorator('weekFreeCourseRecommend', {
                                        initialValue: noticeSettingInfo.weekFreeCourseRecommend === 1
                                    })(
                                        <Checkbox
                                            defaultChecked={noticeSettingInfo.weekFreeCourseRecommend === 1}
                                        />
                                    )
                                }
                                <span>周中空闲课程推荐</span>
                            </FormItem>
                            <FormItem className='gym-system-alert-form-item mr15'>

                                {
                                    flag && getFieldDecorator('singleCourseRecommend', {
                                        initialValue: noticeSettingInfo.singleCourseRecommend === 1
                                    })(
                                        <Checkbox
                                            defaultChecked={noticeSettingInfo.singleCourseRecommend === 1}
                                        />
                                    )
                                }
                                <span>单一课程推荐</span>
                            </FormItem>
                        </div>
                        <CancelButton form={form} />
                    </Form>


                </div>
            </Fragment>
        )
    }
}

export {SystemMessageSet};
