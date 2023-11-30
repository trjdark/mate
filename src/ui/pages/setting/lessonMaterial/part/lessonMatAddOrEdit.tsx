/**
 * Desc: 课程分类管理编辑、新建
 * User: Colin.lu
 * Date: 2019/06/02,
 * Time: 下午5:09
 */
import React from 'react';
import {Form, Row, Col} from "antd";
import {form} from "@/common/decorator/form";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import {
    getLessonMatInfo,
    createLessonMat, editLessonMat
} from "@redux-actions/setting/lessonMaterialActions";
import {CancelButton} from "@/ui/component/cancelButton";
import {message} from "antd";
import {User} from "@/common/beans/user";
import {LessonContent} from "../part/lessonContent";
import history from "@/router/history";
import {connect} from "@/common/decorator/connect";
import {lessonMatType} from "@/saga/selectors/setting/lessonMat";

declare interface LessonContentProps {
    getLessonMatInfo:any,
    getLessonMatType:any,
    editLessonMat:any,
    getLessonMat:any,
    getUpgradeMatInfo:any,
    createLessonMat:any,
    pid: string,
    form: any,
    picUrl: String,
    lessonMatInfo:any,
    lessonMatType:any
}


@form()
@connect((state)=>({
    lessonMatType:lessonMatType(state),
}), {})
class LessonMatAddOrEdit extends React.Component<LessonContentProps,any>{
    pid = CommonUtils.hasParams(this.props)? CommonUtils.parse(this.props).id : null;
    constructor(props:any) {
        super(props);
        this.state = {
            courseTypeId: "",
            nextCourseId: "",
            picUrl: "",
            lessonTypeId: "24", // 默认课程等级对应的课程是Play id：24
            lessonLevelList: [],
            configList: [],
            lessonLevelDataList: [],
            picPath: '',
            lessonMatInfo: {},  // 课程分类信息
            lessonMatType: [],  // 课程分类名称列表
        };
    }
    componentDidMount(){
        Promise.all([
            this.pid && getLessonMatInfo({
                id: this.pid,
                currentCenterId: User.currentCenterId
            })
        ]).then((res) => {
            const [lessonMatInfo] = res;
            this.setState({
                lessonMatInfo:lessonMatInfo
            })
        })
    }

    /**
     * 提交
     */
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            let lessonList = [];
            for(let i = 0; i < this.state.lessonLevelDataList.length; i++){
                lessonList.push(this.state.lessonLevelDataList[i].id)
            }
            if(!err){
                for(let i = 0;i < values.length; i++){
                    if(values[i].id === ' ' || (values[i].levelName === '' && values[i].endMonth === '0')){
                        message.warning('请先填写完成课程等级!', 5);
                        return false;
                    }
                }
                const params = Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    id: this.pid,
                    coursePicPath: this.state.picPath,
                    courseLevelIdList:lessonList
                });
                if(this.pid){
                    const {lessonMatInfo} = this.state;
                    editLessonMat(params).then((res) => {
                        message.success('保存成功！');
                        if(res.isUpdateLevel){
                            message.warning(
                                (
                                    <span>
                                        <span>
                                            系统提示
                                        </span>
                                        <div>
                                            本次操作已对课程等级进行修改，可能影响{lessonMatInfo.courseTypeName}的RRP模板，请及时前往"RRP模板管理"重新配置
                                        </div>
                                        <div style={{textAlign:'center',marginTop:'20px'}}>
                                            <button onClick={() => {this.goToRRP()}} className='gym-button-lg gym-button-white'>前往RRP模板管理</button>
                                            <button onClick={() => {this.closeMessage()}} className='gym-button-sm gym-button-white gym-lesson-message-cancel'>取消</button>
                                        </div>
                                    </span>
                                ),
                                60)
                        }
                    }, (err) => {
                       message.error(err.msg);
                    })
                }else{
                    createLessonMat(params).then(() => {
                        message.success('创建成功！');
                    })
                }
            }else{
                if(err){
                }
            }
        })
    };

    /**
     * 前往RRP模板管理
     */
    goToRRP = () => {
        history.push(Routes.RRP课程类型列表.path);
        message.destroy()
    };

    closeMessage = () => {
        message.destroy();
    };

    /**
     * 上传图片
     * @param response
     * @param fileList
     */
    setHandleUpload = (response,fileList)=> {
        if (response && response.code) {
            this.setState({
                picUrl: `${location.protocol}//${location.host}/api/mate-basic/basic/file/${response.data.id}/fileView`,
                picPath: `${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${response.data.id}&token=${User.getToken}`
            },()=>{
            });
        } else if (response === null) {// 删除图片
            if (fileList.length) {
                this.setState({
                    picUrl: fileList[0].url
                });
            } else {
                this.setState({
                    picUrl: ''
                });
            }
        }
    }
    setLevelList = (value) => {
        this.setState({
            lessonLevelDataList: value
        })
    };

    render(){
        const {form, lessonMatType} = this.props;
        const {lessonMatInfo} = this.state;
        return(
            <div id='gym-lesson-material-add-edit' className='gym-material-create'>
                <Form onSubmit={this.onSubmit}>
                    <div>
                        <LessonContent
                            pid={this.pid ? this.pid : undefined}
                            lessonMatInfo={lessonMatInfo}
                            lessonMatType={lessonMatType}
                            form={form}
                            type={(this.pid && this.pid !== '') ? "edit" : "create"}
                            setLevelList={this.setLevelList}
                            setImgSrc={this.setHandleUpload}
                        />
                    </div>
                    <Row>
                        <Col span={24}>
                            <CancelButton form={form} goBackLink={Routes.课程资料管理.path}/>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export {LessonMatAddOrEdit}
