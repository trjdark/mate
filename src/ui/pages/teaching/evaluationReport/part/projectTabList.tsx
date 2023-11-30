/**
 * desc: 测评报告五大项目
 * User: Vicky
 * Date: 2020/8/4
 * Time: 15:00
 */
import React from 'react';
import { Row, Col, Checkbox } from "antd";
import { form } from "@/common/decorator/form";
import '../style/project.scss';

const CheckboxGroup = Checkbox.Group;

declare interface PropsType {
    form: any,//传入表单
    babyInfo: any,
    value: any,
}
@form()
class ReportProject extends React.Component<PropsType, any>{
    constructor(props: any) {
        super(props);
        this.state = {

            isUseful: true,
            goalOptions: [],
        }
    }

    componentDidMount() {
        const { value } = this.props;
        this.setState({
            goalOptions: value.targetList.map((item) => ({
                value: item.id,
                label: item.targetName,
                checked: item.checked === 1 ? true : false,
                })
            )
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { validateFields } = this.props.form;
        validateFields((err: any, ) => {
            if (!err) {
                //
            }
        })
    };

    render() {
        const { form, value } = this.props;
        const { getFieldDecorator } = form;
        const { goalOptions } = this.state;
        // 过滤调未选中
        const targetList = value.targetList.filter(item => item.checked === 1);
        return (
            <div id='gym-contract-create-leave'>
                <div className='gym-add-application'>
                    <div className='gym-contract-add-form-wrap'>
                        <Row className='gym-contract-table-thead'>
                            <Col span={4} className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>测试项目:</span>
                            </Col>
                            <Col span={8} className=''>
                                <span className='gym-contract-table-thead-babyName'>{value.itemName}</span>
                            </Col>
                            <Col span={4} className='gym-contract-table-thead-babyName'>
                                <span className='gym-contract-table-thead-label'>沟通要点:</span>
                            </Col>
                            <Col span={8} className='gym-contract-table-thead-right'>
                                <span className='gym-contract-table-thead-babyName'>{value.point}</span>
                            </Col>
                        </Row>
                        <div className="gym-project-item gym-project-item-operation-line">
                            <div className="gym-project-item-label">
                                <span>操作方法：</span>
                            </div>
                            <div className="gym-project-item-operation-line-content">
                                <span>{value.method}</span>
                            </div>
                        </div>
                        <div className="gym-project-item">
                            <div className="complete-content">
                                <span>达成分解指标：</span>
                            </div>
                            <div className="gym-project-item-content">
                                {
                                    getFieldDecorator('targetList', {
                                        initialValue: targetList.map((item: any) => item.id)
                                    })(
                                        <CheckboxGroup
                                            className="gym-project-checkbox"
                                            options={goalOptions}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export { ReportProject }
