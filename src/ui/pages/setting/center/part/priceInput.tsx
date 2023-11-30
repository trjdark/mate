/**
 * desc: PriceInput
 * User: dean.yue
 * Date: 2020/09/27
 * Time: 上午9:58
 */
import { InputNumber, Select } from 'antd';
import React from 'react'

const { Option } = Select;

class PriceInput extends React.Component<any,any> {
  handleNumberChange = value => {
    const appAllowLeaveSetting = parseInt(value);
    if (isNaN(appAllowLeaveSetting)) {
      return;
    }
    this.triggerChange({ appAllowLeaveSetting });
  };

  handleCurrencyChange = appAllowLeaveUnit => {
    this.triggerChange({ appAllowLeaveUnit });
  };

  triggerChange = changedValue => {
    const { onChange, value } = this.props;
    if (onChange) {
    onChange({
        ...value,
        ...changedValue,
      });
    }
  };
  appAllowLeaveUnitEnum = {
    '1001003':'天',
    '1001004':'时',
  }
  render() {
    const { value, optionList } = this.props;
    return (
      <span>
        <InputNumber
          value={value.appAllowLeaveSetting}
          onChange={this.handleNumberChange}
          style={{ width: '30%', marginRight: '3%' }}
          min={value.appAllowLeaveUnit === '1001003' ? 1 : 2}
          precision={0}
          maxLength={3}
        />
        <Select
          value={this.appAllowLeaveUnitEnum[value.appAllowLeaveUnit]}
          style={{ width: '20%' }}
          onChange={this.handleCurrencyChange}
        >
          {
            optionList.map(item => (
              <Option value={item} key={item}>{
                this.appAllowLeaveUnitEnum[item]
              }</Option>
            ))
          }
        </Select>
      </span>
    );
  }
}
export {PriceInput}
