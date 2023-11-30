/**
 * desc: 随堂反馈数据统计查看
 * User: Vicky.Yu
 * Date: 2020/9/27
 * Time: 15:00
 */
import * as React from 'react';
import { BreadCrumb } from '@/ui/component/breadcrumb';
import { Form, Tabs, Checkbox, Popover} from 'antd';
import { form } from "@/common/decorator/form";
import '../style/index.scss';
import '../style/detail.scss';
import { PageTitle } from '@/ui/component/pageTitle';
import { TextArea } from "../../../../component/input";
import { CommonUtils } from '@/common/utils/commonUtils';
import { User } from '@/common/beans/user';
import { getStatisticsDetail, getStatisticsPerformance, getStatisticsAbility, getStatisticsPieceContent} from "@redux-actions/teaching/feedBack";
import * as moment from 'moment';

const { TabPane } = Tabs;

@form()
class FeedBackStatisticsDetail extends React.Component<any, any> {
    babyId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : undefined;
    courseTypeId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).courseTypeId : undefined;
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching-feed'
        }, {
            name: '随堂反馈数据统计',
            path: '',
            link: '#',
            id: 'feedBack'
        }
    ]
    constructor(props: any) {
        super(props);
        this.state = {
            contentInfo: [], // 详情内容
            courseId: '',    // 课程ID
            babyId: '',      // 宝宝ID
            performanceList: [],// 能力发展
            abilityList: [], // 随堂表现
            babyNickName: '',    // 宝宝姓名
            pieceContent: [], // 教具
        };
    }
    componentDidMount() {
        getStatisticsDetail({ babyId: this.babyId, currentCenterId: User.currentCenterId, courseTypeId: this.courseTypeId}).then((res:any) => {
            this.setState({
                contentInfo: res,
                courseId: res[0].courseId,
                babyId: res[0].babyId,
                babyNickName: res[0].babyNickName,
            });
            const params ={
                courseId: res[0].courseId,
                babyId: res[0].babyId,
                currentCenterId: User.currentCenterId
            }
            getStatisticsPerformance(params).then(res=>{
                this.setState({performanceList: res})
            })
            getStatisticsAbility(params).then(res=>{
                this.setState({abilityList: res})
            })
            getStatisticsPieceContent(params).then((res:any)=>{
                this.setState({pieceContent:res})
            })
        })
    }
    /**
     * 气泡框内容
     */
    renderContent = (list: Array<any>) => {
        return(
            <div className='gym-feedBack-table'>
                <div className='gym-feedBack-table-title'>
                    <div className="left">课程时间</div>
                    <div className="right">点评ins</div>
                </div>
                {
                    (list || []).map((item: any, index: number) => (
                        <div className='gym-feedBack-table-content' key={`${item.commentsStaffName}_${index}`}>
                            <div className="content-left">{moment(item.courseDate).format('YYYY-MM-DD')} {item.courseStartDate}</div>
                            <div className="content-right">{item.commentsStaffName}</div>
                        </div>
                    ))
                }
            </div>
        )
    };
    /**
     * 上传图片
     * @param file
     */
    handleUploadImg = (file: any, fileList: Array<any>) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ photoList: fileList.map((item: any) => item.response.data) })
    }

    /**
     * 切换Tab栏
     */
    tabChange = (id) => {
        const targetBaby = this.state.contentInfo.filter(list => list.courseId === id)
        const { courseId, babyId } = targetBaby[0];
        this.setState({
            courseId: targetBaby[0].courseId,
            babyId: targetBaby[0].babyId
        })
        const params = {
            courseId,
            babyId,
            currentCenterId: User.currentCenterId
        }
        getStatisticsPerformance(params).then(res => {
            this.setState({ performanceList: res })
        })
        getStatisticsAbility(params).then(res => {
            this.setState({ abilityList: res })
        })
        getStatisticsPieceContent(params).then((res: any) => {
            this.setState({ pieceContent: res })
        })
    }
    render() {
        const { contentInfo, performanceList, abilityList, babyNickName,pieceContent} = this.state;
        return (
            <div className='gym-feed-back-evaluate'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-feed-back-evaluate-content'>
                    <Form>
                        <div id="gym-call-baby-info-card" className="gym-feed-back-evaluate-content-form gym-call-baby-info-card">
                            <Tabs type="card" className="gym-call-baby-info-card-tabs" onChange={this.tabChange}>
                                {
                                    (contentInfo || []).map((item: any, index) => (
                                        <TabPane tab={item.courseId} key={item.courseId} >
                                            <div className='gym-feed-back-evaluate-content-form-every page-wrap'>
                                                <div className='gym-feed-back-evaluate-content-form-every-one'>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>宝宝姓名：</span>
                                                        <span>{item.babyName}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>课程类型：</span>
                                                        <span>{item.courseType}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>主教：</span>
                                                        <span>{item.primaryInsStaffName}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>助教：</span>
                                                        <span>{item.assistantInsStaffName}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>点评Ins：</span>
                                                        <span>{item.commentsStaffName}</span>
                                                    </div>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-three title'>
                                                    <PageTitle title='随堂表现' />
                                                    <div className='gym-feed-back-evaluate-content-form-every-three-tools'>
                                                        <span className='tools-name'>使用的教具：</span>
                                                        <span>
                                                            {
                                                                (pieceContent || []).map((perforItem: any, index) => (
                                                                    <span key={`tools_${index}`}>
                                                                        <span className='tools-name-con'>
                                                                            <Checkbox disabled={true} checked={true}/>
                                                                            <span>{perforItem.pieceContent}</span>
                                                                        </span>
                                                                    </span>
                                                                ))
                                                            }
                                                        </span>
                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all ability-con'>
                                                            {
                                                                (performanceList || []).map((item: any, index) => (
                                                                    <div
                                                                        key={`i_${index}`}
                                                                        className='gym-feed-back-evaluate-content-form-every-four-all-ability'
                                                                        style={{color: '#000'}}
                                                                    >
                                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-num'>
                                                                            {
                                                                                <Popover placement="bottom" content={this.renderContent(item.commentsRecordings)}>
                                                                                    [{item.commentsNum}]
                                                                                </Popover>
                                                                            }
                                                                        </div>

                                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-con'>
                                                                            <span>{item.content.replace(/XXX/g, babyNickName ? babyNickName:'宝宝')}</span>
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
                                                            (abilityList || []).map((abilityItem: any, index) => (
                                                                <div
                                                                    key={`i_${index}`}
                                                                    className='gym-feed-back-evaluate-content-form-every-four-all-ability'
                                                                    style={{color: '#000'}}
                                                                >
                                                                    <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-num'>
                                                                        {
                                                                            <Popover placement="bottom" content={this.renderContent(abilityItem.commentsRecordings)}>
                                                                                [{abilityItem.commentsNum}]
                                                                            </Popover>
                                                                        }
                                                                    </div>
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
                                                    <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} value={item.commentsContent} disabled={true}/>
                                                </div>
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

export { FeedBackStatisticsDetail };
