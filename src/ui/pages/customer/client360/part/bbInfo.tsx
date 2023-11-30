import React from 'react';
import {Client360Context} from '../context';
import moment from 'moment';
import {User} from "@/common/beans/user";

const Consumer = Client360Context.Consumer;

class BabyInfo360 extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {}
    }
    getUrlfromFileId = (photoPath) => {
        if (photoPath) {
            return `${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${photoPath}&token=${User.getToken}`
        } else {
            return (require(`@/images/defaultAvator.png`))
        }
    };

    render() {
        const {data, phase} = this.props;
        const imgSrc = this.getUrlfromFileId(data.photoPath);
        return (
            <Consumer>
                {({showModal, status}) => (
                    <div className="baby-info-360 shadow">
                        <div className="infoContent">
                            <div className="avatar">
                                <img className="avatarImg" src={imgSrc} alt=""/>
                                {
                                    data.gender === 0 ? (
                                        <i className="iconfont icon-nv iconSize gender"/>
                                    ) : (
                                        <i className="iconfont icon-nan iconSize gender"/>
                                    )
                                }
                            </div>
                            <div className="content">
                                <p className="bbname">{data.babyName}{data.nickname &&
                                <span>（{data.nickname}）</span>}</p>
                                <p>出生日期：{data.birthday ?  moment(data.birthday).format('YYYY-MM-DD') : ''}</p>
                                <p>月龄：{data.monthValue >= 0 ? data.monthValue : '-'}</p>
                                <p>已上课时：<span className="yishang">{data.usedCourseNum || 0}</span></p>
                                <p>旷课课时：<span className="yishang">{data.truancyCourseNum || 0}</span></p>
                                <p>试听课时：<span className="yishang">{data.previewCourseNum || 0}</span></p>
                                <p>活动耗课：<span className="yishang">{data.usedActivityNum || 0}</span></p>
                                <p>状态：
                                    <span className="phase">{phase}</span>
                                    <span
                                        className="btn"
                                        style={{backgroundColor: status ? '#009CBD' : '#b2e1eb'}}
                                        onClick={showModal}
                                    >
                                        更改
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Consumer>
        )
    }
}

export {BabyInfo360};
