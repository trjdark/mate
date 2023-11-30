/**
 * Desc: 报名弹框
 * User: Vicky.Yu
 * Date: 2018/12/19,
 * Time: 上午11:50
 */
import React from "react";
import {selectBaby} from "../../../../../../../saga/actions/activity/activityDataList";
import {User} from "../../../../../../../common/beans/user";
import {Fetch} from "../../../../../../../service/fetch";
import {ActivityApi} from "../../../../../../../api/activityApi";
import {connect} from "react-redux";

interface PropsType {
    leadsId: string,
    type: string,
    [propName: string]: any,
}

class ChooseBaby extends React.Component<PropsType, any> {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            babyList: [], // 宝宝列表
        };
    }

    /**
     * Desc: 根据leadsId查询宝宝
     */
    onSearch() {
        const {leadsId, select} = this.props;
        const params = {
            url: ActivityApi.获取会员宝宝列表,
            data: {
                currentCenterId: User.currentCenterId,
                leadsId: leadsId,
                pageSize: 1000,
            }
        };
        Fetch.post(params).then(res => {
            const {list} = res;
            if (Array.isArray(list) && list.length > 0) {
                this.setState({
                    babyList: list
                });
                select(list[0]);
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    componentDidMount() {
        this.onSearch();
    }

    render() {
        const {babyList} = this.state;
        const {select,selectedBaby} = this.props;
        return (
            <ul className='baby-list'>
                {
                    babyList.map((item, index) => {
                        const {babyId, babyName} = item;
                        return (
                            <li
                                key={babyId}
                                className={selectedBaby.babyId === babyId ? 'active' : ''}
                                onClick={()=>select(babyList[index])}
                            >
                                {babyName}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

const mapStateToProps = state => {
    const {
        selectedBaby
    } = state.activityList;

    return {
        selectedBaby
    }
};

const mapDispatchToProps = dispatch => ({
    select(data) {
        dispatch(selectBaby(data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseBaby);
