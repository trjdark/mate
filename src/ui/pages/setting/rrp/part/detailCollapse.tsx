/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import * as React from "react";
import {Form, Row} from "antd";
import {Input, TextArea} from "@/ui/component/input";
import {form} from "@/common/decorator/form";
import {CommonFrame} from "./common";
import {Icon} from "@/ui/component/icon";
import {Tooltip} from "@/ui/component/toolTip";

const FormItem = Form.Item;

declare interface BasicProps {
    form:any, // 传入表单
    isExpand:boolean, // 是否展开
    title:string, // 组件Title
    mainTheme:string, // 组件Title
    prepare:string,
    recap:string,
    review:string,
    index:number,
    word:string,
    firstWord:string,
}

@form()
class DetailCollapse extends React.Component<BasicProps,any>{
    render(){
        const {form,word, firstWord, isExpand,title, mainTheme,prepare,recap,review, index}=this.props;
        const {getFieldDecorator}=form;
        return (
            <div>
                <CommonFrame index={index} firstWord={firstWord}  word={word} title={title} isExpand={isExpand}>
                    <div className='gym-collapse-lesson'>
                        <Row>
                            <FormItem
                                label={'主题名:'}
                                className='gym-collapse-lesson-mainTheme'
                            >
                                {
                                    getFieldDecorator(`subjectName-${index}`, {
                                        initialValue: mainTheme
                                    })(
                                        <Input maxLength={50} placeholder={'请输入'}/>
                                    )
                                }
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                label={
                                    <Tooltip title={'此处内容将在上一次课程的《下周预告》内显示'} placement="bottom">
                                        <span>课程预告 - Prepare</span>
                                        <Icon className='gym-collapse-lesson-icon' type='beizhu'/>
                                    </Tooltip>
                                }
                            >
                                {
                                    getFieldDecorator(`prepare-${index}`, {
                                        initialValue: prepare

                                    })(
                                        <TextArea
                                            style={{width:'650px'}}
                                            placeholder={'请输入课程名称'}
                                            minLength={1}
                                            maxLength={1000}
                                            autosize={{minRows: 2, maxRows: 3}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                label={'课程回顾 - Recap:'}
                            >
                                {
                                    getFieldDecorator(`recap-${index}`, {
                                        initialValue: recap

                                    })(
                                        <TextArea
                                            style={{width:'650px'}}
                                            placeholder={'请输入课程回顾'}
                                            minLength={1}
                                            maxLength={1000}
                                            autosize={{minRows: 2, maxRows: 3}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem
                                label={'家庭游戏 - Review:'}
                            >
                                {
                                    getFieldDecorator(`review-${index}`, {
                                        initialValue: review
                                    })(
                                        <TextArea
                                            style={{width:'650px'}}
                                            placeholder={'请输入家庭游戏'}
                                            minLength={1}
                                            maxLength={1000}
                                            autosize={{minRows: 2, maxRows: 3}}
                                        />
                                    )
                                }
                            </FormItem>
                        </Row>
                    </div>
                </CommonFrame>
            </div>
        )
    }
}

export {DetailCollapse}
