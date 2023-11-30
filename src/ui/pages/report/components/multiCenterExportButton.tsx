/*
 * @desc: 多中心导出按钮
 * @Author: luck
 * @User: luck.yuan@gymboglobal.com
 * @Date: 2021-12-08 17:45:16
 * @LastEditTime: 2022-01-14 18:16:29
 */
import React from "react";
import { Checkbox, Tooltip, message } from "antd";
import { ListModal } from "@/ui/component/listModal";
import { User } from "@/common/beans/user";
import { CommonUtils } from "@/common/utils/commonUtils";

interface centerSourceValue {
    label: string,
    value: string,
    [propName: string]: any
}

interface multiCenterExportProps {
    centerSource?: Array<centerSourceValue>,                // 中心列表
    tip?:string,                                            // 弹窗文字提示
    emitMultiCenterExport: (res: Array<string>) => void     // 回调函数（多中心导出下载）
    [propName: string]: any
}

interface multiCenterExportStates {
    visible: boolean,                           // 弹层开关
    checkAll: boolean,                          // 全选样式开关
    indeterminate: boolean,                     // 半选的样式开关
    tip:string,                                 // 弹窗文字提示
    centerSource: Array<centerSourceValue>,     // 中心列表（默认 当前用户有权限的中心（不含总部与测试中心））
    isCheckedCenter: Array<string>,             // 已选中心(默认全选)
    [propName: string]: any
}

class MultiCenterExportButton extends React.Component<multiCenterExportProps, multiCenterExportStates> {

    private DEFAULT_CENTER_SOURCE = User.staffCenterList.filter((item: any) => item.id !== 'C_HQ001').map((item: any) => ({
        label: `${item.centerCode}-${item.centerName}`,
        value: item.centerCode
    }));

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            checkAll: true,
            indeterminate: false,
            centerSource: props.centerSource ? props.centerSource : this.DEFAULT_CENTER_SOURCE,
            isCheckedCenter: props.centerSource
                ? props.centerSource.filter((item: any) => item.id !== 'C_HQ001').map((item: any) => item.centerCode)
                : User.staffCenterList.filter((item: any) => item.id !== 'C_HQ001').map((item: any) => item.centerCode),
            tip: props.tip ? props.tip : '请注意多中心导出时，涉及员工选项无效，默认导出全部员工的数据'
        };
    }
    render() {
        const { centerSource, isCheckedCenter, indeterminate, checkAll, visible, tip } = this.state;
        return (
            <div className="gym-report-multicenterexport">
                <button className='gym-button-default gym-button-sm ml10' onClick={this.showModal}>多中心导出</button>
                <ListModal
                    className={"gym-report-multicenterexport-listModal"}
                    visible={visible}
                    handleOk={this.multiCenterExport}
                    handleCancel={this.closeModal}
                    destroyOnClose={true}
                >
                    <div className="gym-report-multicenterexport-listModal-checkbox">
                        <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange}
                            checked={checkAll}
                        >
                            全选
                        </Checkbox>
                        <span style={{ color: '#009cbd' }}>{tip}</span>
                        <Checkbox.Group className="gym-report-multicenterexport-listModal-checkbox-group"
                            style={{ width: "100%" }} onChange={this.handleCenterChange} value={isCheckedCenter}
                        >
                            {(centerSource || []).map(option => (
                                <Checkbox
                                    className="gym-report-multicenterexport-listModal-checkbox-group-lable"
                                    key={option.value} value={option.value}
                                >
                                    <Tooltip placement="topLeft" title={option.label} >
                                        <span>{CommonUtils.cutstr(option.label, 20)}</span>
                                    </Tooltip>
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </div>
                </ListModal>
            </div>
        );
    }

    /**
     * 显示弹层
     */
    showModal = () => {
        this.setState({ visible: true })
    };
    /**
     * 关闭弹层
     */
    closeModal = () => {
        this.setState({ visible: false })
    };
    // 全选按钮的点击事件
    onCheckAllChange = e => {
        const centerList = this.state.centerSource.map((item: any) => item.value);
        this.setState({
            indeterminate: false,
            checkAll: e.target.checked,
            isCheckedCenter: e.target.checked ? centerList : []
        });
    };

    // checkbox onchange事件
    handleCenterChange = (checkedCenter: Array<string>) => {
        this.setState({
            isCheckedCenter: checkedCenter
        });
        this.allCheckStateChange(checkedCenter);
    };

    // 改变全选按钮状态
    allCheckStateChange = (checkedCenter: Array<string>) => {
        const centerLen = this.state.centerSource.map((item: any) => item.value).length;
        this.setState({
            indeterminate: !!checkedCenter.length && checkedCenter.length < centerLen,
            checkAll: checkedCenter.length === centerLen
        });
    };

    // 多中心导出（导出方法必传）
    multiCenterExport = () => {
        const { emitMultiCenterExport } = this.props;
        const { isCheckedCenter } = this.state;
        if (isCheckedCenter.length === 0) {
            message.warning('至少需要选择一家中心');
        } else {
            emitMultiCenterExport(isCheckedCenter);
            this.closeModal()
        }
    };

}
export default MultiCenterExportButton;
