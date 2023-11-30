import React, { Component } from "react";
import { Icon } from "antd";

export class GaPanelBarItem extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            updateBtn: false
        };
    }
    render() {
        const { title, icon, value } = this.props;
        const { updateBtn } = this.state;
        return (
            <div className="gym-dashboard-ga-panel-card-data-bar-container-item">
                <span className="gym-dashboard-ga-panel-card-data-bar-container-item-title">
                    {title}
                    {icon ? (
                        <Icon
                            className={`gym-dashboard-ga-panel-card-data-bar-container-item-title-icon ${
                                updateBtn ? "start" : "end"
                            }`}
                            type={icon}
                            onClick={this.updateClick}
                        />
                    ) : (
                        ""
                    )}
                </span>
                <span
                    className="gym-dashboard-ga-panel-card-data-bar-container-item-info"
                    onClick={this.numClick}
                >
                    {value}
                </span>
            </div>
        );
    }
    /*更新按钮被点击*/
    updateClick = () => {
        const { handleUpdateClick } = this.props;
        this.setState({
            updateBtn: !this.state.updateBtn
        });
        if (typeof handleUpdateClick === "function") {
            handleUpdateClick();
        }
    };

    /*数字被点击*/
    numClick = () => {
        const { handleNumClick } = this.props;
        if (typeof handleNumClick === "function") {
            handleNumClick();
        }
    };
}
