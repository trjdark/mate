/**
 * desc: 随堂反馈报告详情
 * User: Vicky.Yu
 * Date: 2020/9/29
 * Time: 16:00
 */
import * as React from 'react';
import { BreadCrumb } from '@/ui/component/breadcrumb';
import { Form } from 'antd';
import { form } from "@/common/decorator/form";
import { PageTitle } from '@/ui/component/pageTitle';
import { TextArea } from "../../../../component/input";
import { CommonUtils } from '@/common/utils/commonUtils';
import { getClientFeedBackReport} from '@redux-actions/teaching/feedBack';
import { User } from '@/common/beans/user';
import * as moment from 'moment';
import { Thumbnail } from '@/ui/component/thumbnail';

const FormItem = Form.Item;

@form()
class FeedBackReport extends React.Component<any, any> {
    commentsId =  CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : undefined;
    private routes: Array<any> = [
        {
            name: '客户',
            path: '',
            link: '#',
            id: 'customer'
        }, {
            name: '客户360',
            path: '',
            link: '#',
            id: 'customer-feedback'
        }, {
            name: '客户成长',
            path: '',
            link: '#',
            id: 'customer-growth-feedback'
        }
    ]
    constructor(props: any) {
        super(props);
        this.state = {
            reportInfo: '', // 详情
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
    componentDidMount(){
        getClientFeedBackReport({ id: this.commentsId,currentCenterId: User.currentCenterId}).then(res=>{
            this.setState({ reportInfo: res})
        })
    }

    /**
     * 测评提交
     */
    handleSubmit = (e) => {

    }
    render() {
        const { reportInfo={}} = this.state;
        return (
            <div className='gym-feed-back-evaluate'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-feed-back-evaluate-content'>
                    <Form onSubmit={this.handleSubmit}>
                        <div id="gym-call-baby-info-card" className="gym-feed-back-evaluate-content-form gym-call-baby-info-card">

                            <div className='gym-feed-back-evaluate-content-form-every page-wrap'>
                                <div className='gym-feed-back-evaluate-content-form-every-one'>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span style={{width:'3rem'}}>上课时间：</span>
                                        <span>{moment(reportInfo.courseDate).format('YYYY-MM-DD')} {reportInfo.courseWeek} {reportInfo.courseStartDate}-{reportInfo.courseEndDate}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span style={{ width: '4rem' }}>课程类型：</span>
                                        <span>{reportInfo.courseType}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span style={{ width: '4rem' }}>课程代码（学阶）：</span>
                                        <span>{reportInfo.courseCode}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span style={{ width: '4rem' }}>课程主题：</span>
                                        <span>{reportInfo.courseTheme}</span>
                                    </div>
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-two title'>
                                    <PageTitle title='照片' />
                                    <FormItem className='gym-feed-back-evaluate-content-form-every-two-photo'>
                                        {
                                            reportInfo.photoId&&
                                            <Thumbnail key={reportInfo.photoId} imgSrc={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${reportInfo.photoId}&token=${User.getToken}`} />
                                        }
                                    </FormItem>
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-five title'>
                                    <PageTitle title='Ins点评' />
                                    <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} value={reportInfo.commentsContent} disabled={true}/>
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-five title'>
                                    <PageTitle title='课程回顾' />
                                    <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} value={reportInfo.recap} disabled={true}/>
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-five title'>
                                    <PageTitle title='家庭游戏' />
                                    <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} value={reportInfo.review} disabled={true}/>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export { FeedBackReport };
