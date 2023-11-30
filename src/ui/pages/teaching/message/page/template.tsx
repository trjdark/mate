/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/13
 * Time: 下午6:53
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {TextArea} from "@/ui/component/input";
import {Form} from 'antd';
import {form} from "@/common/decorator/form";
import {CancelButton} from "@/ui/component/cancelButton";
import {CommonUtils} from "@/common/utils/commonUtils";
import {noticeTemplateType} from "@/ui/pages/teaching/message/enum/messageEnum";
import {getTemplate, updateTemplate} from "@redux-actions/telephone/message";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";

const FormItem = Form.Item;


@form()
class SystemMessageTemplate extends React.Component<any, any> {
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
        }, {
            name: '模版',
            path: '',
            link: '#',
            id: 'systemAlertTemplate'
        }
    ];
    type:string;
    typeId:string;
    constructor(props:any){
        super(props);
        this.type = CommonUtils.parse(props).type;
        this.typeId = noticeTemplateType[this.type];
        this.state = {
            noticeTemplateInfo: {}
        }
    }
    componentDidMount(){
        getTemplate({currentCenterId: User.currentCenterId, noticeTemplateType: this.typeId})
            .then((res) => {
                this.setState({noticeTemplateInfo: res})
            })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        const {noticeTemplateInfo} = this.state;
        validateFields((err, values) => {
            const param = Object.assign({}, noticeTemplateInfo, values, {currentCenterId: User.currentCenterId});
            updateTemplate(param).then(() => {
                Message.success('更新成功！');
            })
        });
    };
    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {noticeTemplateInfo} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div className="page-wrap gym-system-template">
                    <Form onSubmit={this.handleSubmit}>
                        <PageTitle title={this.type}/>
                        <FormItem className="gym-system-template-form-item">
                            {
                                getFieldDecorator('noticeTemplate', {
                                    initialValue: noticeTemplateInfo.noticeTemplate
                                })(
                                    <TextArea autosize={{minRows: 6, maxRows: 6}} maxLength={5000}/>
                                )
                            }
                        </FormItem>
                        <CancelButton form={form} />
                    </Form>
                </div>
            </Fragment>
        )
    }
}

export {SystemMessageTemplate};
