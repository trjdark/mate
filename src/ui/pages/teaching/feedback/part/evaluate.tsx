/**
 * desc: 随堂反馈测评
 * User: Vicky.Yu
 * Date: 2020/9/27
 * Time: 15:00
 */
import * as React from 'react';
import { Fragment } from 'react';
import moment from 'moment';
import { BreadCrumb } from '@/ui/component/breadcrumb';
import { Form, Tabs, Checkbox, Button, message } from 'antd';
import { Routes } from "@/router/enum/routes";
import { form } from "@/common/decorator/form";
import '../style/index.scss';
import { UploadImg } from "@/ui/component/uploadImg";
import { PageTitle } from '@/ui/component/pageTitle';
import { User } from "@/common/beans/user";
import { CommonUtils } from "@/common/utils/commonUtils";
import { TextArea } from "../../../../component/input";
import { getInitData, getPerformanceList, getAbilityList, getPerformancePiece, addComments, getPhotoByCommentsId } from "@redux-actions/teaching/feedBack";
import { Thumbnail } from "@/ui/component/thumbnail";
import history from '../../../../../router/history';

const FormItem = Form.Item;
const {TabPane} = Tabs;

@form()
class FeedBackEvaluate extends React.Component<any, any> {
    lessonId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).lessonId : undefined;
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching-feed'
        },{
            name: '课程表',
            path: '',
            link: '#',
            id: 'teaching-course'
        },{
            name: '随堂反馈(Art)',
            path: '',
            link: '#',
            id: 'feedBack'
        }
    ]
    constructor(props: any) {
        super(props);
        this.state = {
            babyList:[], // 宝宝list
            pieceContent: [], // 教具
            abilityList: [],  // 能力发展
            commentsId: '',   // 有无新增
            babyId: '',       // 宝宝ID
            themeId: '',      // 主题ID
            lessonId: '',     // lesson ID
            courseId: '',     // 课程ID
            courseTypeId: '', // 课程类型Id
            courseDate: '',   // 课程时间
            courseStartDate: '', // 开始时间
            courseEndDate: '',   // 结束、时间
            courseCode: '',      // 课程代码
            pieceContentDetail: [], // 随堂表现内容
            checkedAbility: [], // 选中的能力发展
            checkedPerformanceList: [], // 选中的随堂表现
            assistantInsStaffId: '',
            primaryInsStaffId: '',
            photoList: [],       // 编辑图片回显
            babyIDA:'', // tab栏默认值
        };
    }

    componentDidMount() {
       this.getData();
    }
    getData () {
        getInitData({
            id: this.lessonId,
            currentCenterId: User.currentCenterId
        }).then((res: any) => {
            this.setState({
                babyList: res,
                commentsId: res[0].commentsId || '',
                commentsStaffId: res[0].commentsStaffId || [],
                babyId: res[0].babyId,
                themeId: res[0].themeId,
                lessonId: res[0].lessonId,
                courseId: res[0].courseId,
                courseTypeId: res[0].courseTypeId,
                courseDate: res[0].courseDate,
                courseStartDate: res[0].courseStartDate,
                courseEndDate: res[0].courseEndDate,
                courseCode: res[0].courseCode,
                assistantInsStaffId: res[0].assistantInsStaffId,
                primaryInsStaffId: res[0].primaryInsStaffId,
                babyIDA: res[0].babyId,

            })
            // 图片
            if (res[0].commentsId) {
                getPhotoByCommentsId({ id: res[0].commentsId, currentCenterId: User.currentCenterId }).then((res: any) => {
                    if (JSON.stringify(res) === "{}") {
                        this.setState({ photoList: [] })
                    } else {
                        this.setState({ photoList: [res] })
                    }
                })
            }
            //  教具
            getPerformancePiece({
                commentsId: res[0].commentsId,
                courseTypeId: res[0].courseTypeId,
                themeId: res[0].themeId,
                babyId: res[0].babyId,
                currentCenterId: User.currentCenterId
            }).then(res => {
                this.setState({ pieceContent: res })
                const aidList = res.filter((item: any) => item.pieceStatus);
                if (aidList.length > 0) {
                    Promise.all(aidList.map((item: any) => {
                        const param = {
                            commentsId: this.state.commentsId,
                            currentCenterId: User.currentCenterId,
                            courseTypeId: this.state.courseTypeId,
                            themeId: this.state.themeId,
                            babyId: this.state.babyId,
                            pieceContent: item.pieceContent
                        };
                        return getPerformanceList(param);
                    })).then((res: any) => {
                        const list = res.reduce((pre = [], cur = []) => [...pre, ...cur], []);
                        this.setState({
                            pieceContentDetail: list,
                            checkedPerformanceList: list.filter((item: any) => item.commentsStatus).map((item: any) => ({
                                performanceId: item.id,
                                performanceStatus: true,
                                pieceContent: item.pieceContent
                            }))
                        });
                    });
                }
            })
            getAbilityList({
                commentsId: res[0].commentsId,
                courseTypeId: res[0].courseTypeId,
                themeId: res[0].themeId,
                babyId: res[0].babyId,
                currentCenterId: User.currentCenterId
            }).then(res => {
                const abilityList = res.map(item => item.commentsAbilityResponseList)
                    .reduce((pre = [], cur = []) => [...pre, ...cur], []);
                this.setState({
                    abilityList: abilityList,
                    checkedAbility: abilityList
                        .filter((item: any) => item.commentsStatus)
                        .map((item: any) => ({ abilityId: item.id, abilityStatus: true })),
                })
            })
        })
    }

    /**
     * 上传图片
     * @param file
     */
    handleUploadImg = (file: any, fileList: Array<any>) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ attachmentList: fileList.map((item: any) => item.response.data) })
        this.setState({ photoList: fileList.map((item: any) => item.response.data)})
    }
    /**
     * 选择教具获取随堂表现评语
     * @param
     */
    onCheckTeachingAid = (e,id) => {
        const { courseTypeId, themeId, babyId, commentsId } = this.state;
        // 教具
        if(e.target.checked){
            getPerformanceList({
                pieceContent: id, currentCenterId: User.currentCenterId,
                courseTypeId, themeId, babyId, commentsId
            }).then((res: any) => {
                const list = res.filter((item: any) => item.commentsStatus).map((item: any) => ({
                    performanceId: item.id,
                    performanceStatus: true,
                    pieceContent: item.pieceContent
                }));
                this.setState(prevState => ({
                    pieceContentDetail: [...prevState.pieceContentDetail, ...res],
                    checkedPerformanceList: [...prevState.checkedPerformanceList, ...list]
                }))
            })
        }else{
            const newList = this.state.pieceContentDetail.filter((item: any) => item.pieceContent !== id);
            const selectedList = this.state.checkedPerformanceList.map((item: any) => item.pieceContent === id
            ?{
                performanceId: item.performanceId,
                performanceStatus: false,
                pieceContent: item.pieceContent,
            }
            :
            item
            );
            this.setState({
                pieceContentDetail: newList,
                checkedPerformanceList: selectedList
            })
        }
    }
    /**
     * 选择随堂表现评语
     */
    onCheckPerformance = (e: any, node: any) => {
        if (e.target.checked) {
            this.setState(prevState => ({
                checkedPerformanceList: [...prevState.checkedPerformanceList, {
                    performanceId: node.id,
                    performanceStatus: true,
                    pieceContent: node.pieceContent,
                }],
                pieceContentDetail: prevState.pieceContentDetail.map((item: any) => {
                    if (item.id === node.id) {
                        item.commentsNum += 1;
                        return item
                    }
                    return item
                })
            }))
        } else {
            const newSelectPerformanceList = this.state.checkedPerformanceList.map((item: any) => item.performanceId === node.id
                ?
                {
                    performanceId: node.id,
                    performanceStatus: false,
                    pieceContent: node.pieceContent,
                }
                :
                item
            );
            this.setState(prevState => ({
                checkedPerformanceList: newSelectPerformanceList,
                pieceContentDetail: prevState.pieceContentDetail.map((item: any) => {
                    if (item.id === node.id) {
                        item.commentsNum -= 1;
                        item.checked = false;
                        return item
                    }
                    return item
                })
            }))
        }
    };
    /**
     * 选择能力发展
     */
    onCheckAbility = (e,id) =>{
        if (e.target.checked) {
            this.setState(prevState => ({
                checkedAbility: [...prevState.checkedAbility, { abilityId: id, abilityStatus: true }],
                abilityList: prevState.abilityList.map((item: any) => {
                    if (item.id === id) {
                        item.commentsNum += 1;
                        return item
                    }
                    return item
                })
            }))
        } else {
            const newSelectAbilityList = this.state.checkedAbility.map((item: any) => item.abilityId === id ? { abilityId: id, abilityStatus: false}:item);
            this.setState(prevState => ({
                checkedAbility: newSelectAbilityList,
                abilityList: prevState.abilityList.map((item: any) => {
                    if (item.id === id) {
                        item.commentsNum -= 1;
                        return item
                    }
                    return item
                })
            }));
        }
    }
    // 顶部tab栏切换
    tabChange = (id) => {
        this.setState({
            pieceContent:null,
            abilityList: null,
            babyIDA: id,
        })
        const targetBaby =   this.state.babyList.filter(list => list.babyId === id)
        const { commentsId, courseTypeId, themeId, babyId,photoId } = targetBaby[0]
        if (!photoId){
            this.setState({photoList: null});
        }else{
            getPhotoByCommentsId({ id: commentsId, currentCenterId: User.currentCenterId }).then((res: any) => {
                this.setState({ photoList: [res] })
            })
        }
        if (!commentsId) {
            this.props.form.setFieldsValue({ commentsContent: null });
        }
        this.setState({
            commentsId: targetBaby[0].commentsId,
            babyId: targetBaby[0].babyId,
            commentsStaffId: targetBaby[0].commentsStaffId || [],
            assistantInsStaffId: targetBaby[0].assistantInsStaffId,
            primaryInsStaffId: targetBaby[0].primaryInsStaffId,
            commentsContent: targetBaby[0].commentsContent
        })
        const params = {
            commentsId,
            courseTypeId,
            themeId,
            babyId,
            currentCenterId: User.currentCenterId
        }
        Promise.all([
            getAbilityList(params),
            getPerformancePiece(params),
        ]).then((res:any)=> {
            const abilityList = res[0].map(item => item.commentsAbilityResponseList)
                .reduce((pre = [], cur = []) => [...pre, ...cur], []);
            this.setState({
                abilityList: abilityList,
                checkedAbility: abilityList
                    .filter((item: any) => item.commentsStatus)
                    .map((item: any) => ({ abilityId: item.id, abilityStatus: true })),
            })
            this.setState({ pieceContent: res[1]})
            const aidList = res[1]&&res[1].filter((item: any) => item.pieceStatus);
            Promise.all(aidList.map((item: any) => {
                const param = {
                    commentsId: this.state.commentsId,
                    currentCenterId: User.currentCenterId,
                    courseTypeId: this.state.courseTypeId,
                    themeId: this.state.themeId,
                    babyId: this.state.babyId,
                    pieceContent: item.pieceContent
                };
                return getPerformanceList(param);
            })).then((res: any) => {
                const list = res.reduce((pre = [], cur = []) => [...pre, ...cur], []).map(item => {
                    item.commentsStatus ? item.checked = true : item.checked = false;
                    return item
                });
                this.setState({
                    pieceContentDetail: list,
                    checkedPerformanceList: list.filter((item: any) => item.commentsStatus).map((item: any) => ({
                        performanceId: item.id,
                        performanceStatus: true,
                        pieceContent: item.pieceContent
                    }))
                });
            });
        })
    }
    /**
     * 测评提交
     */
    handleSubmit=(e)=>{
        e.preventDefault()
        const {validateFields} = this.props.form;
        const { babyId, themeId, lessonId, courseId, courseTypeId,
                courseDate, courseStartDate, courseEndDate,
            courseCode, commentsId, checkedAbility,
            checkedPerformanceList, primaryInsStaffId, assistantInsStaffId,photoList
                } = this.state;
        validateFields((err:any,values) => {
            if(!err){
                values.performanceList = checkedPerformanceList
                values.abilityList = checkedAbility
            }else{}
            const params = {
                currentCenterId: User.currentCenterId,
                attachmentList: photoList,
                babyId, themeId, lessonId, courseId, courseTypeId,
                courseDate, courseStartDate, courseEndDate,
                courseCode, commentsId, primaryInsStaffId, assistantInsStaffId

            }
            addComments(Object.assign({},values,params)).then(res=>{
                if (commentsId){
                    window.location.reload();
                    message.success('修改成功')
                }else{
                    window.location.reload();
                    message.success('点评成功')
                }
            })
        })
    }
    // 回退
    goBack =()=> {
        history.push(Routes.随堂反馈列表.path);
    }
    render() {
        const {form} = this.props;
        const {
            babyList, pieceContent, abilityList, commentsStaffId, photoList,pieceContentDetail,
            checkedPerformanceList, babyIDA
        } = this.state;
        const {getFieldDecorator} = form;
        const fileList = (photoList || []).map((item: any) => ({
            url: `${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.id}&token=${User.getToken}`,
            status: 'done',
            uid: item.id,
            name: item.fileName,
            response: Object.assign({}, {}, { data: item })
        }));
        return (
            <div className='gym-feed-back-evaluate'>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-feed-back-evaluate-content'>
                    <Form onSubmit={this.handleSubmit}>
                        <div id="gym-call-baby-info-card" className="gym-feed-back-evaluate-content-form gym-call-baby-info-card">
                            <Tabs type="card" className="gym-call-baby-info-card-tabs" onChange={this.tabChange} activeKey={babyIDA}>
                                {
                                    (babyList||[]).map((item:any,index)=>(
                                        <TabPane tab={<Fragment> <span className="font-bold"><span>{item.courseBookWay === "26003" ? 'P' : ''}</span> {item.babyAllName}</span>{item.commentsId && <img className='gym-feedBack-done-img' src={require("../../../../../images/done.png")} alt="" />}</Fragment>} key={item.babyId}>
                                            <div className='gym-feed-back-evaluate-content-form-every page-wrap'>
                                                <div className='gym-feed-back-evaluate-content-form-every-one'>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>上课时间：</span>
                                                        <span>{moment(item.courseDate).format('YYYY-MM-DD')} {item.courseWeek} {item.courseStartDate}-{item.courseEndDate}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>课程类型：</span>
                                                        <span>{item.courseType}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>课程代码：</span>
                                                        <span>{item.courseCode}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>课程主题：</span>
                                                        <span>{item.courseTheme}</span>
                                                    </div>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-two title'>
                                                    {
                                                        commentsStaffId.length===0 || commentsStaffId === User.userId?
                                                        <PageTitle title='上传照片' />
                                                        :
                                                        <PageTitle title='照片' />
                                                    }
                                                    {
                                                        commentsStaffId.length === 0 || commentsStaffId === User.userId ?
                                                        <FormItem className='gym-feed-back-evaluate-content-form-every-two-photo'>
                                                                <UploadImg
                                                                    onChange={this.handleUploadImg}
                                                                    maxFileLength={1}
                                                                    fileList={fileList}
                                                                />
                                                        </FormItem>
                                                        :
                                                        <FormItem className='gym-act-modal-form'>
                                                            {
                                                            item.photoId&&
                                                            <Thumbnail key={item.id} imgSrc={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoId}&token=${User.getToken}`} />
                                                            }
                                                        </FormItem>
                                                    }
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-three title'>
                                                    <PageTitle title='随堂能力项'/>
                                                    <div className='gym-feed-back-evaluate-content-form-every-three-tools'>
                                                        <span className='tools-name'>教具：</span>
                                                        <span>
                                                            {
                                                                (pieceContent || []).map((item: any, index) => (
                                                                    getFieldDecorator('performanceList',{
                                                                        initialValue: pieceContent.map((item: any) => item.performanceId)
                                                                    })(
                                                                        <span key={item.pieceContent}>
                                                                            <span className='tools-name-con'>
                                                                            <Checkbox
                                                                                onChange={(e) => this.onCheckTeachingAid(e,item.pieceContent)}
                                                                                defaultChecked={item.pieceStatus}
                                                                            />
                                                                                <span>{item.pieceContent}</span>
                                                                            </span>
                                                                        </span>
                                                                    )
                                                                ))
                                                            }
                                                        </span>
                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all ability-con'>
                                                            {
                                                                (pieceContentDetail||[]).map((aidsItem: any, index) => (
                                                                    <div key={`piece_content_${index}`} className='gym-feed-back-evaluate-content-form-every-four-all-ability'>
                                                                        <div className={`gym-feed-back-evaluate-content-form-every-four-all-ability-num ${aidsItem.commentsNum > 0 ? 'feed-black' : ''}`}>
                                                                        [{aidsItem.commentsNum}]
                                                                    </div>
                                                                        <div className={`gym-feed-back-evaluate-content-form-every-four-all-ability-con ${aidsItem.commentsNum > 0 ? 'feed-black' : ''}`}>
                                                                            <Checkbox
                                                                                className='gym-checkbox'
                                                                                checked={checkedPerformanceList.map(item => item.performanceStatus && item.performanceId).includes(aidsItem.id)}
                                                                                onChange={(e) => this.onCheckPerformance(e, aidsItem)}

                                                                            />
                                                                            <span>{aidsItem.content.replace(/XXX/g, item.babyNickName ? item.babyNickName:'宝宝')}</span>
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
                                                                    getFieldDecorator('abilityList',{
                                                                        initialValue: abilityList.map((item: any) => item.abilityId)
                                                                    })(
                                                                        <div key={`ability_${index}`} className='gym-feed-back-evaluate-content-form-every-four-all-ability'>
                                                                        <div className={`gym-feed-back-evaluate-content-form-every-four-all-ability-num ${abilityItem.commentsNum > 0 ?'feed-black':''}`}>
                                                                            [{abilityItem.commentsNum}]
                                                                        </div>
                                                                        <div className={`gym-feed-back-evaluate-content-form-every-four-all-ability-con ${abilityItem.commentsNum > 0 ? 'feed-black' : ''}`}>
                                                                                <Checkbox
                                                                                    className='gym-checkbox'
                                                                                    onChange={(e) => this.onCheckAbility(e, abilityItem.id)}
                                                                                    defaultChecked={abilityItem.commentsStatus}
                                                                                />
                                                                                <span>{abilityItem.content}</span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-five title'>
                                                    <PageTitle title='Ins点评'/>
                                                    <FormItem>
                                                        {
                                                            getFieldDecorator('commentsContent', {
                                                                initialValue: item.commentsContent
                                                            })(
                                                                <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} setfieldsvalue={item.commentsContent}/>
                                                            )
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-six'>
                                                    <Button
                                                        htmlType='submit'
                                                        className='gym-button-xs gym-button-default mr20'
                                                        disabled={commentsStaffId.length===0 || commentsStaffId === User.userId?false:true}
                                                    >
                                                        提交
                                                    </Button>
                                                    <Button
                                                        onClick={this.goBack}
                                                        className='gym-button-xs gym-button-white'
                                                    >
                                                        取消
                                                    </Button>
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

export { FeedBackEvaluate };
