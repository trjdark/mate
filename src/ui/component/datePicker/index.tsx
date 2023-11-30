/**
 * desc:
 * User: colin lu
 * Date: 2018/9/30
 * Time: 上午10:10
 */
import React from 'react';
import {DatePicker} from "antd";
import {DatePickerProps, MonthPickerProps} from 'antd/lib/date-picker/interface';
import './index.scss';
import locale from 'antd/lib/date-picker/locale/zh_CN';

const {MonthPicker, RangePicker} = DatePicker;

class DateInput extends React.Component<DatePickerProps, any>{
    render(){
        return(
            <DatePicker
                placeholder={'请选择日期'}
                className={`gym-date-packer ${this.props.className ? this.props.className: ''}`}
                format={"YYYY/MM/DD"}
                allowClear={false}
                showToday={false}
                onChange={this.props.onChange}
                disabled={this.props.disabled}
                disabledDate={this.props.disabledDate}
                getCalendarContainer={() => document.querySelector('.gym-content')}
                locale={locale}
                {...this.props}
            />
        )
    }
}

class MonthInput extends React.Component<MonthPickerProps, any>{
    render(){
        return(
            <MonthPicker
                placeholder={'请选择月份'}
                className={`gym-date-month-picker ${this.props.className ? this.props.className: ''}`}
                getCalendarContainer={() => document.querySelector('.gym-content')}
                onChange={this.props.onChange}
                locale={locale}
                {...this.props}
            />
        )
    }
}

class RangeDateInput extends React.Component<any, any> {
    render(){
        return(
            <RangePicker
                className={`gym-date-range-picker ${this.props.className ? this.props.className: ''}`}
                getCalendarContainer={() => document.querySelector('.gym-content')}
                onChange={this.props.onChange}
                {...this.props}
            />
        )
    }
}

export {DateInput, MonthInput, RangeDateInput}
