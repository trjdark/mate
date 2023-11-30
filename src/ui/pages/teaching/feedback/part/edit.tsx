/**
 * desc: 随堂反馈测评
 * User: Vicky.Yu
 * Date: 2020/9/27
 * Time: 15:00
 */
import * as React from 'react';
import { BreadCrumb } from '@/ui/component/breadcrumb';
import { Form, Tabs, Checkbox } from 'antd';
import { Routes } from "@/router/enum/routes";
import { form } from "@/common/decorator/form";
import { CancelButton } from "@/ui/component/cancelButton";
import '../style/index.scss';
import { UploadImg } from "@/ui/component/uploadImg";
import { PageTitle } from '@/ui/component/pageTitle';
import { TextArea } from "../../../../component/input";

const FormItem = Form.Item;
const { TabPane } = Tabs;
const list = [
    {
        id: 1,
        name: '宝宝1'

    }, {
        id: 2,
        name: '宝宝2'
    }, {
        id: 3,
        name: '宝宝3'
    }
]
const list2 = [
    {
        "commentsNum": "1",
        "commentsStatus": false,
        "content": "无论是双手握住沙盒对敲，还是用沙盒敲击地板，宝宝都努力尝试模仿敲出”E-a, E-a。",
        "id": "d0cbe076-1d80-11eb-b42e-7cd30ae00946",
        "pieceContent": "Featured Style Song Shaker",
        "threeCode": "Smart",
        "commentsRecordings": [
            {
                "id": "557b5f82008e11ebbe44005056b4085c",
                "content": "能轮流玩游戏，遵守非常简单的规则",
                "threeCode": "Sweet维度",
                "commentsStatus": false,
                "commentsNum": 0
            },
            {
                "id": "558c4d77008e11ebbe44005056b4085c",
                "content": "能根据活动要求或角色分配做简单的互动",
                "threeCode": "Sweet维度",
                "commentsStatus": false,
                "commentsNum": 0
            },
            {
                "id": "5590416e008e11ebbe44005056b4085c",
                "content": "愿意与其他小朋友分享教学用玩具",
                "threeCode": "Sweet维度",
                "commentsStatus": false,
                "commentsNum": 0
            }
        ]
    },
    {
        "pieceContent": "场景认知",
        "commentsAbilityResponseList": [
            {
                "id": "55bac0f8008e11ebbe44005056b4085c",
                "content": "能理解基本的时间",
                "threeCode": "Smart维度",
                "commentsStatus": false,
                "commentsNum": 0
            },
            {
                "id": "55c6a9d3008e11ebbe44005056b4085c",
                "content": "能理解基本的时间先后顺序与逻辑",
                "threeCode": "Smart维度",
                "commentsStatus": false,
                "commentsNum": 0
            },
            {
                "id": "55cf8ad6008e11ebbe44005056b4085c",
                "content": "对事物的理解出现",
                "threeCode": "Smart维度",
                "commentsStatus": false,
                "commentsNum": 0
            },
            {
                "id": "55d73bd6008e11ebbe44005056b4085c",
                "content": "对事物的理解出现了简单的概括能力",
                "threeCode": "Smart维度",
                "commentsStatus": false,
                "commentsNum": 0
            }
        ]
    },
]
const list3 =
    [
        {
            "pieceContent": "合作",
            "pieceStatus": true,
            "commentsAbilityResponseList": [
                {
                    "id": "557b5f82008e11ebbe44005056b4085c",
                    "content": "能轮流玩游戏，遵守非常简单的规则",
                    "threeCode": "Sweet维度",
                    "commentsStatus": true,
                    "commentsNum": 1
                },
                {
                    "id": "558c4d77008e11ebbe44005056b4085c",
                    "content": "能根据活动要求或角色分配做简单的互动",
                    "threeCode": "Sweet维度",
                    "commentsStatus": false,
                    "commentsNum": 0
                },
                {
                    "id": "5590416e008e11ebbe44005056b4085c",
                    "content": "愿意与其他小朋友分享教学用玩具",
                    "threeCode": "Sweet维度",
                    "commentsStatus": false,
                    "commentsNum": 0
                }
            ]
        },
        {
            "pieceContent": "场景认知",
            "pieceStatus": false,
            "commentsAbilityResponseList": [
                {
                    "id": "55bac0f8008e11ebbe44005056b4085c",
                    "content": "能理解基本的时间先后顺序与逻辑",
                    "threeCode": "Smart维度",
                    "commentsStatus": false,
                    "commentsNum": 0
                },
                {
                    "id": "55c6a9d3008e11ebbe44005056b4085c",
                    "content": "能理解基本的时间先后顺序与逻辑",
                    "threeCode": "Smart维度",
                    "commentsStatus": false,
                    "commentsNum": 0
                },
                {
                    "id": "55cf8ad6008e11ebbe44005056b4085c",
                    "content": "对事物的理解出现了简单的概括能力",
                    "threeCode": "Smart维度",
                    "commentsStatus": false,
                    "commentsNum": 0
                },
            ]
        }
    ]
@form()
class FeedBackEdit extends React.Component<any, any> {
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching-feed'
        }, {
            name: '课程表',
            path: '',
            link: '#',
            id: 'teaching-course'
        }, {
            name: '随堂反馈',
            path: '',
            link: '#',
            id: 'feedBack'
        }
    ]
    constructor(props: any) {
        super(props);
        this.state = {
        };
    }
    /**
     * 上传图片
     * @param file
     */
    handleUploadImg = (file: any, fileList: Array<any>) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ photoList: fileList.map((item: any) => item.response.data) })
    }

    /**
     * 测评提交
     */
    handleSubmit = (e) => {

    }
    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className='gym-feed-back-evaluate'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-feed-back-evaluate-content'>
                    <Form onSubmit={this.handleSubmit}>
                        <div id="gym-call-baby-info-card" className="gym-feed-back-evaluate-content-form gym-call-baby-info-card">
                            <Tabs type="card" className="gym-call-baby-info-card-tabs">

                                {
                                    (list || []).map((item: any, index) => (
                                        <TabPane tab={item.name} key={`baby_${index}`}>
                                            <div className='gym-feed-back-evaluate-content-form-every page-wrap'>
                                                <div className='gym-feed-back-evaluate-content-form-every-one'>
                                                    上课时间：<span>{}</span>
                                                    课程类型：<span>{}</span>
                                                    课程代码：<span>{}</span>
                                                    课程主题：<span>{}</span>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-two title'>
                                                    <PageTitle title='上传照片' />
                                                    <FormItem className='gym-feed-back-evaluate-content-form-every-two-photo'>
                                                        {
                                                            getFieldDecorator('photoList')(<span />)
                                                        }
                                                        <UploadImg onChange={this.handleUploadImg} maxFileLength={1} />
                                                    </FormItem>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-three title'>
                                                    <PageTitle title='随堂表现' />
                                                    <div className='gym-feed-back-evaluate-content-form-every-three-tools'>
                                                        <span className='tools-name'>教具：</span>
                                                        <span>
                                                            {
                                                                (list3 || []).map((item: any, index) => (
                                                                    <span key={`tools_${index}`}>
                                                                        <span className='tools-name-con'>
                                                                            <Checkbox />
                                                                            <span>{item.pieceContent}</span>
                                                                        </span>
                                                                    </span>
                                                                ))
                                                            }
                                                        </span>
                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all ability-con'>
                                                            {
                                                                (list3 || []).map((abilityItem: any, index) => (
                                                                    (abilityItem.commentsAbilityResponseList || []).map((i, index) => (
                                                                        <div key={`i_${index}`} className='gym-feed-back-evaluate-content-form-every-four-all-ability'>
                                                                            <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-num'>
                                                                                [{i.commentsNum}]
                                                                        </div>
                                                                            <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-con'>
                                                                                <Checkbox
                                                                                    className='gym-checkbox'
                                                                                />
                                                                                <span>{i.content}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ))

                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-four title'>
                                                    <PageTitle title='能力发展' />
                                                    <div className='gym-feed-back-evaluate-content-form-every-four-all'>
                                                        {
                                                            (list2 || []).map((abilityItem: any, index) => (
                                                                (abilityItem.commentsAbilityResponseList || []).map((i, index) => (
                                                                    <div key={`i_${index}`} className='gym-feed-back-evaluate-content-form-every-four-all-ability'>
                                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-num'>
                                                                            [{i.commentsNum}]
                                                                        </div>
                                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-con'>
                                                                            <Checkbox
                                                                                className='gym-checkbox'
                                                                            />
                                                                            <span>{i.content}</span>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ))

                                                        }
                                                    </div>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-five title'>
                                                    <PageTitle title='Ins点评' />
                                                    <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} />
                                                </div>
                                                <CancelButton
                                                    form={form}
                                                    goBackLink={`${Routes.随堂反馈列表.path}`}
                                                    submitText='保存'
                                                />
                                            </div>
                                        </TabPane>
                                    ))
                                }
                            </Tabs>
                        </div>

                    </Form>
                </div>
            </div>
        );
    }
}

export {FeedBackEdit};
