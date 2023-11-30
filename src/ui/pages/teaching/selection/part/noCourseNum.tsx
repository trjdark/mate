/**
 * Des: 课时数不足时的提示弹框
 */
import React, {Component} from 'react';

class NoCourseNum extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="no-num">
                {
                    this.props.message
                }
            </div>
        )
    }
}

export {NoCourseNum};
