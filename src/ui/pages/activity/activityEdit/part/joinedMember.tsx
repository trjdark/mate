/**
 * desc: 会员活动组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {PageTitle} from "@/ui/component/pageTitle";
import {Input} from "@/ui/component/input";
import {connect} from "react-redux";
import {cloneDeep} from 'lodash';

class JoinedMember extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const {babys} = this.props;
        return (
            <Fragment>
                <PageTitle title="参与会员" className="mt25"/>
                <div className="gym-activity-plan-table gym-radius">
                    <table className="joined-member-table">
                        <thead>
                        <tr>
                            <th>宝宝姓名</th>
                            <th>活动记录</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            babys.map((item, index) => {
                                const {attendanceId, babyName, content} = item;
                                return (
                                    <tr key={attendanceId}>
                                        <td>{babyName}</td>
                                        <td>
                                            <Input
                                                value={content}
                                                placeholder="请输入"
                                                onChange={(e) => this.handleChange(e, index)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }

    /*编辑宝宝活动记录*/
    handleChange(e, index) {
        const {babys, setActivityData} = this.props;
        const newBabys = cloneDeep(babys);
        newBabys[index].content = e.target.value;
        setActivityData('BABYS', newBabys);
    }
}

const mapStateToProps = state => {
    const {
        babys,  // 参与客户列表
    } = state.activityDetail;

    return {
        babys
    }
};

export default connect(mapStateToProps)(JoinedMember);
