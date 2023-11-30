/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {set_color} from "../../applyManage/filter/applyManageFilter";


class CourseDot extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {

        return (
            <div className="course-title">
                <span className={`course-title-dot ${set_color(this.props.status)}`}>
                </span>
                <span className='course-title-text'>{this.props.text}</span>
            </div>
        )
    }
}

export {CourseDot}
