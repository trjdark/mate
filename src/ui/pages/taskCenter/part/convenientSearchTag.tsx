/**
 * desc:跟进预约到访，任务中心快速查询标签
 * User: lyon.li@gymboglobal.com
 * Date: 2018/11/1
 * Time: 上午11:44
 */
import React, {Component} from "react";
import {connect} from 'react-redux';
import {convenientSearchTag} from "../enum";

// 定义组件的props和state结构
interface ConvenientSearchTagProps {
    searchTaskList: any,

    [propName: string]: any
}

interface ConvenientSearchTagState {
    [propName: string]: any
}

class ConvenientSearchTag extends Component<ConvenientSearchTagProps, ConvenientSearchTagState> {
    constructor(props) {
        super(props);
    }

    render() {
        const {selectedConvenientSearchTag} = this.props;
        return (
            <div className="task-round-nav">
                <span>快速定位：</span>
                {
                    convenientSearchTag.map(item => {
                        const {type} = item;
                        return (
                            <button
                                className={`gym-filter-btn ${type === selectedConvenientSearchTag ? 'active' : ''}`}
                                key={type}
                                onClick={() => this.switchTag(type)}
                            >
                                {item.name}
                            </button>
                        )
                    })
                }
            </div>
        )
    }

    switchTag = (type) => {
        /* 切换快速查询tag并搜索数据 */
        const {selectedConvenientSearchTag, searchTaskList, changeTag, changeFormData,form, startDate, endDate} = this.props;

        if (type !== selectedConvenientSearchTag) {
            changeTag(type);
            changeFormData({
                createStaffId: '',
                executeStaffIdList: [],
                leadId: '',
                taskStatus: '',
                taskTheme: '',
                customerKeyWord: '',
                taskDateBegin: startDate,
                taskDateEnd: endDate
            });
            form.resetFields();
            requestAnimationFrame(() => searchTaskList());
        }
    }
}

const mapDispatchToProps = dispatch => ({});

export default connect( mapDispatchToProps)(ConvenientSearchTag);
