/**
 * desc: 随堂反馈管理查看
 * User: Vicky.Yu
 * Date: 2020/9/27
 * Time: 19:00
 */
import * as React from 'react';
import { BreadCrumb } from '@/ui/component/breadcrumb';
import { Form, Checkbox } from 'antd';
import { form } from "@/common/decorator/form";
import '../style/detail.scss';
import { PageTitle } from '@/ui/component/pageTitle';
import { TextArea } from "../../../../component/input";
import { CommonUtils } from "@/common/utils/commonUtils";
import { getManageListDetail, getManagePieceContent } from "@redux-actions/teaching/feedBack";
import { User } from '@/common/beans/user';
import * as moment from 'moment';
import { Thumbnail } from "@/ui/component/thumbnail";

const FormItem = Form.Item;
@form()

class FeedBackManageDetail extends React.Component<any, any> {
    commentsId: string;
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching-feed'
        }, {
            name: '随堂反馈管理(Art)',
            path: '',
            link: '#',
            id: 'feedBack-manage'
        }, {
            name: '查看',
            path: '',
            link: '#',
            id: 'feedBack-manage-detail'
        }
    ]
    constructor(props: any) {
        super(props);
        this.state = {
            manageDetail: '', // 详情内容
            pieceContent: [], // 教具
        };
    }
    componentDidMount(){
        this.commentsId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : '';
        getManageListDetail({
            currentCenterId: User.currentCenterId,
            id: this.commentsId
        }).then(res=>{
            this.setState({manageDetail: res})
        })
        getManagePieceContent({ id: this.commentsId, currentCenterId: User.currentCenterId }).then(res => {
            this.setState({ pieceContent: res })
        })

    }
    /**
     * 上传图片
     * @param file
     */
    handleUploadImg = (file: any, fileList: Array<any>) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ photoList: fileList.map((item: any) => item.response.data) })
    }
    render() {
        const { manageDetail,pieceContent} = this.state;
        return (
            <div className='gym-feed-back-evaluate'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-feed-back-evaluate-content'>
                    <Form>
                        <div id="gym-call-baby-info-card" className="gym-feed-back-evaluate-content-form gym-call-baby-info-card">

                            <div className='gym-feed-back-evaluate-content-form-every page-wrap'>
                                <div className='gym-feed-back-evaluate-content-form-every-one'>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>上课时间：</span>
                                        <span>{moment(manageDetail.courseDate).format('YYYY-MM-DD')} {manageDetail.courseWeek} {manageDetail.courseStartDate}-{manageDetail.courseEndDate}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>课程类型：</span>
                                        <span>{manageDetail.courseType}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>课程代码：</span>
                                        <span>{manageDetail.courseCode}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>课程主题：</span>
                                        <span>{manageDetail.courseTheme}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>宝宝姓名：</span>
                                        <span>{manageDetail.babyName}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>主教：</span>
                                        <span>{manageDetail.primaryInsStaffName}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>助教：</span>
                                        <span>{manageDetail.assistantInsStaffName}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>点评INS：</span>
                                        <span>{manageDetail.commentsStaffName}</span>
                                    </div>
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-two title'>
                                    <PageTitle title='照片' />
                                    {
                                    manageDetail.photoId&&
                                    <FormItem className='gym-feed-back-evaluate-content-form-every-two-photo'>
                                        {
                                            <Thumbnail key={manageDetail.photoId} imgSrc={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${manageDetail.photoId}&token=${User.getToken}`} />
                                        }
                                    </FormItem>
                                    }
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-three title'>
                                    <PageTitle title='随堂表现' />
                                    <div className='gym-feed-back-evaluate-content-form-every-three-tools'>
                                        <span className='tools-name'>使用的教具：</span>
                                        <span>
                                            {
                                                (pieceContent || []).map((item: any, index) => (
                                                    <span key={`tools_${index}`}>
                                                        <span className='tools-name-con'>
                                                            <Checkbox checked={true} disabled={true}/>
                                                            <span>{item.pieceContent}</span>
                                                        </span>
                                                    </span>
                                                ))
                                            }
                                        </span>
                                        <div className='gym-feed-back-evaluate-content-form-every-four-all ability-con'>
                                            {
                                                (manageDetail.performanceList || []).map((i, index) => (
                                                    <div key={`i_${index}`} className='gym-feed-back-evaluate-content-form-every-four-all-ability'>
                                                <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-con  manage-detail'>
                                                            <span>{i.content.replace(/XXX/g, manageDetail.babyNickName ? manageDetail.babyNickName:'宝宝')}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-four title'>
                                    <PageTitle title='能力发展' />
                                    <div className='gym-feed-back-evaluate-content-form-every-four-all'>
                                        {
                                            (manageDetail.abilityList || []).map((abilityItem: any, index) => (
                                                <div key={`i_${index}`} className='gym-feed-back-evaluate-content-form-every-four-all-ability manage-detail'>
                                                    <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-con'>
                                                    <span>{abilityItem.content}</span>
                                                    </div>
                                                </div>
                                            ))

                                        }
                                    </div>
                                </div>
                                <div className='gym-feed-back-evaluate-content-form-every-five title'>
                                    <PageTitle title='Ins点评' />
                                    <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} disabled={true} value={manageDetail.commentsContent}/>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export { FeedBackManageDetail };
