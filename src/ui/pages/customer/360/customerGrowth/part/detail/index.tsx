/**
 * desc: 月度回顾查看
 * User: Katarina.yuan
 * Date: 2021/6/21
 * Time: 10:00
 */
 import * as React from 'react';
 import { BreadCrumb } from '@/ui/component/breadcrumb';
 import { Form } from 'antd';
 import './style/index.scss';
 import { PageTitle } from '@/ui/component/pageTitle';
 import { CommonUtils } from "@/common/utils/commonUtils";
 import {getManageDetail} from "@redux-actions/teaching/feedBack";
 import { User } from '@/common/beans/user';
 import * as moment from 'moment';
 class MonthlyReportDetail extends React.Component<any, any> {
    feedBackId: string;
    // 面包屑
    private routes: Array<any> = [
        {name: '客户'},
        {name: '客户360'},
        {name: '客户成长'},
        {name: '月度回顾'}
    ]
    constructor(props: any) {
        super(props);
        this.state = {
            manageDetail: null,    // 详情内容
            babyAllName: null,     // 宝宝名字
            monthValue: null,      // 月龄
            feedbackTime: null,    // 出生日期
            gymDays: null,         // 认识天数
            attendNum: null,       // 上课次数
            activityNum: null,     // 活动次数
            canCourse: null,       // 可上课程
            badgeValues: [],       // 徽章
            nextContent: null      // 下月预告
        };
    }
    componentDidMount(){
        this.feedBackId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).monthlyFeedbackId : '';
        getManageDetail({
            currentCenterId: User.currentCenterId,
            id: this.feedBackId
        }).then(res=>{
            this.setState({
                  babyAllName: res.babyAllName,
                  monthValue: res.monthValue,
                  feedbackTime: res.feedbackTime,
                  gymDays: res.gymDays,
                  attendNum: res.attendNum,
                  activityNum: res.activityNum,
                  canCourse: res.canCourse,
                  badgeValues: res.badgeValues,
                  nextContent: res.nextContent,
            })
        })
    }
     // 出席次数M与中心活动次数N在不同范围下的话术
     attendAndActivity = (M, N) => {
        if (M>0 && N>0) {
            return (
                <div>
                    上月出席了
                    <span className='cDefault fontBold'> {M} </span>
                    次课程，并且上月还参加了中心活动：
                    <span className='cDefault fontBold'> {N} </span>
                    课时。
                </div>
            )
        } else if (M>0) {
            return (
                <div>
                    上月出席了
                    <span className='cDefault fontBold'> {M} </span>
                    次课程。
                </div>
            )
        } else if (N>0) {
            return (
                <div>
                    上月参加了中心活动：
                    <span className='cDefault fontBold'> {N} </span>
                    课时。
                </div>
            )
        }
     }
     // 出席次数N在不同范围下的话术
     attendance = (n) => {
         if (n<4) {
             return '宝宝上月来金宝贝的次数不多，爸爸妈妈们再忙也要记得抽出时间来陪伴宝宝哦！'
         } else if (n>=4 && n<=7) {
             return '很高兴宝宝能坚持出席课程，也感谢爸爸妈妈们的支持，要加油保持下去哦！'
         } else if (n>7)  {
             return '宝宝能积极参与课程实在是太棒了，爸爸妈妈们也一定花了不少心思吧，希望这个月继续保持哦！'
         } else {
             return ''
         }
     }
    render() {
        let {babyAllName, monthValue, feedbackTime, gymDays, attendNum, activityNum, canCourse, badgeValues, nextContent} = this.state;
        return (
            <div className='gym-feed-back-evaluate'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-feed-back-evaluate-content'>
                    <Form>
                        <div id="gym-call-baby-info-card" className="gym-feed-back-evaluate-content-form gym-call-baby-info-card">

                            <div className='gym-feed-back-evaluate-content-form-every page-wrap'>
                                <div className='gym-feed-back-evaluate-content-form-every-one'>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>宝宝姓名：</span>
                                        <span>{babyAllName}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>月龄：</span>
                                        <span>{monthValue}</span>
                                    </div>
                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                        <span>报告时间：</span>
                                        <span>{moment(feedbackTime).format('YYYY-MM-DD')}</span>
                                    </div>
                                </div>
                                <div className='gym-monthly-report-detail-ml18 gym-monthly-report-detail-title'>
                                    {`${babyAllName}与金宝认识`}
                                    <span className='cDefault'> {gymDays} </span>
                                    '天啦！'
                                </div>
                                <div className='title'>
                                    <PageTitle title='上月回顾' />
                                    <div className='gym-monthly-report-detail-ml18'>
                                        {this.attendAndActivity(attendNum, activityNum)}
                                        {this.attendance(attendNum)}
                                        {/*判断是否有课上课程，假如没有则不显示*/}
                                        {
                                            canCourse &&
                                            <div>
                                                '宝宝现在'
                                                <span className='cDefault fontBold'> {monthValue} </span>
                                                '个月了，在我们金宝贝还可以上的课程有：'
                                                <span className='cDefault fontBold'>{canCourse}</span>
                                                '。快来预约课程，让宝宝体验不同课程所带来的乐趣吧！（详情可咨询您的成长顾问）'
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='title'>
                                    <PageTitle title='上月达成徽章' />
                                    <ul className='gym-monthly-report-detail-ml18'>
                                        {
                                            badgeValues.map((item, index) => {
                                                return <li className='cDefault' key={index}> {item}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='title'>
                                    <PageTitle title='本月预告' />
                                        <div className='gym-feed-back-evaluate-content-form-every-four-all ability-con'>
                                            <div className='gym-feed-back-evaluate-content-form-every-four-all-ability'>
                                                <div className='gym-feed-back-evaluate-content-form-every-four-all-ability-con  manage-detail'>
                                                    <span className='c999'>{nextContent}</span>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

 export { MonthlyReportDetail };
