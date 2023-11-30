/**
 * desc: 随堂反馈测评
 * User: Vicky.Yu
 * Date: 2021/3/1
 * Time: 15:00
 */
import * as React from 'react';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { BreadCrumb } from '@/ui/component/breadcrumb';
import { Form, Tabs, Checkbox, Button, message, } from 'antd';
import { Routes } from "@/router/enum/routes";
import { form } from "@/common/decorator/form";
import '../style/index.scss';
import { Modal } from "@/ui/component/customerCreateModal";
import { UploadImg } from "@/ui/component/uploadImg";
import { PageTitle } from '@/ui/component/pageTitle';
import { User } from "@/common/beans/user";
import { CommonUtils } from "@/common/utils/commonUtils";
import { TextArea } from "../../../../component/input";
import { getInitDataNew, getPerformanceListNew, getPerformancePieceNew, addCommentsNew } from "@redux-actions/teaching/feedBack";
import { Thumbnail } from "@/ui/component/thumbnail";
import history from '../../../../../router/history';

const FormItem = Form.Item;
const {TabPane} = Tabs;
const CheckboxGroup = Checkbox.Group;


@form()
class FeedBackEvaluateNew extends React.Component<any, any> {
    lessonId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).lessonId : undefined;
    checkboxAll:any;
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
            name: '随堂反馈2.0',
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
            courseTypeCodeId: '', // 课程类型Id
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
            visible: false, // 未勾选任何点评
            babyName: '',
            babyNickName: '', // 宝宝姓名
            feedBackContent: '', // 点评内容
            indeterminate: false, //半选
            checkAll: false,    // 全选
        };
    }

    componentDidMount() {
       this.getData();
    }
    getData = async () => {
        const initDate = await this.getInitData();
        const imgUrl = initDate.babyFeedBackRespList[0].photoId
            ? `${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${initDate.babyFeedBackRespList[0].photoId}&token=${User.getToken}`
            : null;
        const babyId = initDate.babyFeedBackRespList[0].babyId || '';
        const param = {
            feedBackId: initDate.babyFeedBackRespList[0].feedBackId,
            programThemeId: initDate.programThemeId,
            currentCenterId: User.currentCenterId,
            babyId: babyId
        };
        const performance = await this.getPerformance(param);
        this.setState({
            babyList: initDate,
            feedBackStaffId: initDate.babyFeedBackRespList[0].feedBackStaffId||'',
            babyIDA: initDate.babyFeedBackRespList[0].babyId,
            feedBackId: initDate.babyFeedBackRespList[0].feedBackId,
            babyName: initDate.babyFeedBackRespList[0].babyName || '',
            babyNickName: initDate.babyFeedBackRespList[0].babyNickName || '',
            babyId: initDate.babyFeedBackRespList[0].babyId || '',
            programThemeId: initDate.programThemeId,
            courseTypeCodeId: initDate.courseTypeCodeId,
            courseId: initDate.courseId,
            lessonId: initDate.lessonId,
            assistantInsStaffId: initDate.assistantInsStaffId,
            primaryInsStaffId: initDate.primaryInsStaffId,
            photoList: imgUrl ? [{ url: imgUrl,id:2}]:[],
            pieceContent:performance,
        })
        // 如果点评过
        const aidList = performance.filter((item: any) => item.pieceStatus);
        if (aidList.length > 0) {
            const checkedPiece = aidList.map(item => item.mainPiece);
            const params = {
                feedBackId: initDate.babyFeedBackRespList[0].feedBackId,
                currentCenterId: User.currentCenterId,
                programThemeId: initDate.programThemeId,
                mainPiece: checkedPiece,
                babyId: babyId,
            };
            getPerformanceListNew(params).then(res => {
                this.setState({
                    pieceContentDetail: res,
                    checkedPerformanceList: res.filter((item: any) => item.behaviorStatus),
                    checkAll: aidList.length === performance.length,
                    indeterminate: !!aidList.length && aidList.length < performance.length,
                }, () => {
                    this.props.form.setFieldsValue({behaviorList: checkedPiece})
                })
            });
        }
        if(!initDate.babyFeedBackRespList[0].feedBackStaffId){
            const check:any = ReactDOM.findDOMNode(this.checkboxAll);
            check.click();
        }
    };

    /**
     * 初始化数据
     * @returns {Promise<any>}
     */
    getInitData = () => {
        const param = {
            id: this.lessonId,
            currentCenterId: User.currentCenterId
        }
        return getInitDataNew(param);
    };
    /**
     * 初始化教具
     * @param param
     * @returns {Promise<any>}
     */
    getPerformance = (param) => {
        return getPerformancePieceNew(param)
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
     * @param values
     */
    onCheckTeachingAid = (values) => {
        const { feedBackId, programThemeId, pieceContent, babyId } = this.state;
        // 教具
        getPerformanceListNew({
            mainPiece: values, currentCenterId: User.currentCenterId,
            feedBackId, programThemeId, babyId
        }).then((res) => {
            this.setState( preState => {
                const checkedList = preState.checkedPerformanceList.map(item => item.behaviorId);
                return {
                    pieceContentDetail: res,
                    checkedPerformanceList: res.filter(item => (checkedList.includes(item.behaviorId) || item.behaviorStatus)),
                    checkAll: values.length === pieceContent.length,
                    indeterminate: !!values.length && values.length < pieceContent.length,
                }
            })
        });
    };
    /**
     * 全选
     */
    onCheckAllTeachingAid = (e) => {
        const flag = e.target.checked;
        const {feedBackId, programThemeId, pieceContent, babyId} = this.state;
        const {form} = this.props;
        let mainPieceList = flag ? pieceContent.map(item => item.mainPiece) : [];
        const param = {
            mainPiece: mainPieceList, currentCenterId: User.currentCenterId,
            feedBackId, programThemeId,
            babyId,

        }
        getPerformanceListNew(param).then((res) => {
            this.setState( preState => {
                const checkedList = preState.checkedPerformanceList.map(item => item.behaviorId);
                return {
                    pieceContentDetail: res,
                    checkedPerformanceList: res.filter(item => (checkedList.includes(item.behaviorId) || item.behaviorStatus)),
                    checkAll: e.target.checked,
                    indeterminate: false,
                }
            });
            form.setFieldsValue({behaviorList: mainPieceList})
        });

    };
    /**
     * 选择随堂表现评语
     */
    onCheckPerformance = (e: any, node: any) => {
        if (e.target.checked) {
            this.setState(prevState=>({
                checkedPerformanceList:[
                    ...prevState.checkedPerformanceList,{
                        behaviorId: node.behaviorId,
                        behaviorStatus: true,
                        behaviorContent: node.behaviorContent,
                        mainPiece: node.mainPiece,
                    }
                ]
            }))
        } else {
            const newList = this.state.checkedPerformanceList.filter((item) => item.behaviorId !== node.behaviorId);
            this.setState({ checkedPerformanceList: newList });
        }
    };
    // 顶部tab栏切换
    tabChange = async (id) => {
        const {babyList} = this.state;
        const babyInfo = babyList.babyFeedBackRespList;
        const targetBaby =   babyInfo.filter(list => list.babyId === id);
        const { feedBackContent, feedBackId, photoId } = targetBaby[0];
        this.props.form.setFieldsValue({
            feedBackContent: feedBackContent,
            behaviorList: []
        })
        const imgUrl = photoId
            ? `${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${photoId}&token=${User.getToken}`
            : null;
        const babyId = targetBaby[0].babyId;
        const params = {
            feedBackId: targetBaby[0].feedBackId ? targetBaby[0].feedBackId : '',
            programThemeId: babyList.programThemeId,
            currentCenterId: User.currentCenterId,
            babyId
        };
        const performance = await this.getPerformance(params);
        this.setState({
            pieceContent:performance,
            abilityList: null,
            babyIDA: id,
            feedBackId: targetBaby[0].feedBackId,
            babyId: babyId,
            feedBackStaffId: targetBaby[0].feedBackStaffId || [],
            programThemeId: babyList.programThemeId,
            babyNickName: targetBaby[0].babyNickName,
            assistantInsStaffId: babyList.assistantInsStaffId,
            primaryInsStaffId: babyList.primaryInsStaffId,
            photoList: imgUrl ? [{ url:imgUrl,id:1}]:[],
            babyName: targetBaby[0].babyName,
            // Todo
            pieceContentDetail: [],
            checkedPerformanceList: [],
            checkAll: false,
            indeterminate: false,
        });
        const aidList = (performance || []).filter((item: any) => item.pieceStatus);
        // 如果之前有点评过
        if (aidList.length > 0) {
            const checkedPiece = aidList.map(item => item.mainPiece);
            const params = {
                feedBackId: feedBackId,
                currentCenterId: User.currentCenterId,
                programThemeId: babyList.programThemeId,
                mainPiece: checkedPiece,
                babyId: babyId,
            };
            getPerformanceListNew(params).then(res => {
                this.setState({
                    pieceContentDetail: res,
                    checkedPerformanceList: res.filter((item: any) => item.behaviorStatus),
                    checkAll: aidList.length === performance.length,
                    indeterminate: !!aidList.length && aidList.length < performance.length,
                }, () => {
                    this.props.form.setFieldsValue({behaviorList: checkedPiece})

                })
            });
        }
        if(!targetBaby[0].feedBackStaffId){
            const check:any = ReactDOM.findDOMNode(this.checkboxAll);
            check.click();
        }
    }
    /**
     * 测评提交
     */
    handleSubmit=(e)=>{
        e.preventDefault()
        const {validateFields} = this.props.form;
        const { babyId, courseId, feedBackId, lessonId, primaryInsStaffId,
            assistantInsStaffId, programThemeId, checkedPerformanceList,
            photoList, courseTypeCodeId
                } = this.state;
        const photoId = photoList.length>0?photoList[0].id:'';
        const photoName = photoList.length>0?photoList[0].fileName:'';
        if (checkedPerformanceList.length===0){
            this.setState({ visible:true})
        }else{
            validateFields((err: any, values) => {
                if (!err) {
                    values.behaviorList = checkedPerformanceList
                }
                const params = {
                    currentCenterId: User.currentCenterId,
                    attachmentList: photoList, feedBackId, photoId, photoName,
                    babyId, lessonId, courseId, programThemeId,
                    primaryInsStaffId, assistantInsStaffId, courseTypeCodeId
                }
                addCommentsNew(Object.assign({}, values, params)).then(res => {
                    if (feedBackId) {
                        window.location.reload();
                        message.success('修改成功')
                    } else {
                        window.location.reload();
                        message.success('点评成功')
                    }
                })
            })
        }
    }
    // 回退
    goBack =()=> {
        history.push(Routes.随堂反馈列表新.path);
    }
    // 未勾选确认
    onOk = () => {
        const { babyId, courseId, feedBackId, lessonId, primaryInsStaffId,
            assistantInsStaffId, programThemeId, courseTypeCodeId,
            photoList, feedBackContent
        } = this.state;
        const photoId = photoList.length>0?photoList[0].id:'';
        const photoName = photoList.length>0?photoList[0].fileName:'';
        const params = {
            currentCenterId: User.currentCenterId,
            attachmentList: photoList, feedBackId,
            babyId, lessonId, courseId, programThemeId,
            primaryInsStaffId, assistantInsStaffId,
            courseTypeCodeId, photoId, photoName, feedBackContent
        }
        addCommentsNew(Object.assign({}, params)).then(res => {
            if (feedBackId) {
                window.location.reload();
                message.success('修改成功')
            } else {
                window.location.reload();
                message.success('点评成功')
            }
        })
        this.setState({visible: false})
    }
    // 弹框再想想
    onCancel = () => {
        this.setState({ visible: false })
    }
    // 改变点评内容
    changeContent = (e) => {
        this.setState({ feedBackContent:e.target.value});
    };
    render() {
        const {form} = this.props;
        const {
            babyList, pieceContent, photoList,pieceContentDetail,
            checkedPerformanceList, babyIDA, visible, babyNickName, babyName,
            indeterminate, checkAll
        } = this.state;
        const {getFieldDecorator} = form;
        const fileList = (photoList || []).map((item: any,index) => ({
            url: item.url,
            status: 'done',
            uid: index,
        }));
        return (
            <div className='gym-feed-back-evaluate'>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-feed-back-evaluate-content'>
                    <Form onSubmit={this.handleSubmit}>
                        <div id="gym-call-baby-info-card" className="gym-feed-back-evaluate-content-form gym-call-baby-info-card">
                            <Tabs type="card" className="gym-call-baby-info-card-tabs" onChange={this.tabChange} activeKey={babyIDA}>
                                {
                                    (babyList.babyFeedBackRespList || []).map((item: any, index) => (
                                        <TabPane
                                            tab={<Fragment> <span className="font-bold"><span>{item.courseBookWay === "26003" ? 'P' : ''}</span> {item.babyAllName}</span>{item.feedBackStaffId && <img className='gym-feedBack-done-img' src={require("../../../../../images/done.png")} alt="" />}</Fragment>}
                                            key={item.babyId}
                                        >
                                            <div className='gym-feed-back-evaluate-content-form-every page-wrap'>
                                                <div className='gym-feed-back-evaluate-content-form-every-one'>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>上课时间：</span>
                                                        <span>{moment(babyList.courseDate).format('YYYY-MM-DD')} {babyList.courseWeek} {babyList.courseStartDate}-{babyList.courseEndDate}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>课程类型：</span>
                                                        <span>{babyList.programType}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>课程代码：</span>
                                                        <span>{babyList.courseCode}</span>
                                                    </div>
                                                    <div className='gym-feed-back-evaluate-content-form-every-one-info'>
                                                        <span>课程主题：</span>
                                                        <span>{babyList.programThemeName}</span>
                                                    </div>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-two title'>
                                                    {
                                                        item.feedBackStaffId === null
                                                            ? <PageTitle title={`上传照片`} />
                                                            : <PageTitle title={`照片`} />
                                                    }
                                                    {
                                                        item.feedBackStaffId === null || item.feedBackStaffId===User.userId ?
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
                                                                <Thumbnail key={item.photoId} imgSrc={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoId}&token=${User.getToken}`} />
                                                            }
                                                        </FormItem>
                                                    }
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-three title'>
                                                    <PageTitle title={`随堂能力项`} />
                                                    <div className='gym-feed-back-evaluate-content-form-every-three-tools'>
                                                        <span className='tools-name'>教具：</span>
                                                        <Checkbox
                                                            ref={ref => this.checkboxAll = ref}
                                                            indeterminate={indeterminate}
                                                            checked={checkAll}
                                                            onChange={this.onCheckAllTeachingAid}
                                                        >全选</Checkbox>
                                                        <span>
                                                            {
                                                                getFieldDecorator('behaviorList')(
                                                                    <CheckboxGroup
                                                                        onChange={(e) => this.onCheckTeachingAid(e)}
                                                                    >
                                                                        {
                                                                            (pieceContent || []).map((item: any, index) => (
                                                                                <Checkbox
                                                                                    key={`check_${index}`}
                                                                                    defaultChecked={item.pieceStatus}
                                                                                    value={item.mainPiece}
                                                                                >{item.mainPiece}</Checkbox>
                                                                            ))
                                                                        }
                                                                    </CheckboxGroup>
                                                                )
                                                            }
                                                        </span>
                                                        <div className='gym-feed-back-evaluate-content-form-every-four-all ability-con'>
                                                            {
                                                                (pieceContentDetail||[]).map((aidsItem: any, index) => (
                                                                    <div key={`piece_content_${index}`} className='gym-feed-back-evaluate-content-form-every-four-all-ability'>
                                                                        <div className={`gym-feed-back-evaluate-content-form-every-four-all-ability-con ${aidsItem.commentsNum > 0 ? 'feed-black' : ''}`}>
                                                                            <Checkbox
                                                                                className='gym-checkbox'
                                                                                checked={checkedPerformanceList.map(item => item.behaviorId).includes(aidsItem.behaviorId)}
                                                                                onChange={(e) => this.onCheckPerformance(e, aidsItem)}
                                                                            />
                                                                            <span>{aidsItem.behaviorContent.replace(/XXX/g, item.babyNickName ? item.babyNickName:'宝宝')}</span>
                                                                            {
                                                                                item.feedBackStaffId
                                                                                    ? null
                                                                                    :
                                                                                    <span className='ml15 c999 '>
                                                                                        {`${aidsItem.domainName}已得${aidsItem.score}分，该词条点评后分数将${aidsItem.isReview ? '不变': '上升'}`}
                                                                                    </span>
                                                                            }

                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-five title'>
                                                    <PageTitle title={`Ins点评`}/>
                                                    <FormItem>
                                                        {
                                                            getFieldDecorator('feedBackContent', {
                                                                initialValue: item.feedBackContent
                                                            })(
                                                                <TextArea maxLength={500} className="remark" placeholder="请输入内容" style={{ height: '100px' }} setfieldsvalue={item.feedBackContent} onChange={(e)=>this.changeContent(e)}/>
                                                            )
                                                        }
                                                    </FormItem>
                                                </div>
                                                <div className='gym-feed-back-evaluate-content-form-every-six'>
                                                    <Button
                                                        htmlType='submit'
                                                        className='gym-button-xs gym-button-default mr20'
                                                        disabled={!item.feedBackStaffId || item.feedBackStaffId === User.userId?false:true}
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
                                                <Modal
                                                    visible={visible}
                                                    handleOk={this.onOk}
                                                    handleCancel={this.onCancel}
                                                    cancelText="再想想"
                                                    contentText={<div><div style={{ 'color': '#009CBD', }}>如未勾选任何点评，家长会收到</div><div style={{ 'fontSize': 13 }}>“期待在下次的课堂中看到<span>{babyName}（{babyNickName}）</span>更多更具体的表现”</div></div>}
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

export { FeedBackEvaluateNew };
