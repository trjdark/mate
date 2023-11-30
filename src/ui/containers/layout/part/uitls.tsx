/**
 * desc: 业务工具
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/6
 * Time: 下午2:37
 */
import React, {Fragment, Component} from 'react';
import {Dropdown, Menu, Modal} from 'antd';
import {Icon} from "@/ui/component/icon";
import {uitlsOptions} from "@/ui/containers/layout/enum/headerEnum";


class Utils extends Component<any, any> {
    state = {
        isUtilsDropdown: false,
        qrCode: '',     // 二维码原图路径
        visible: false, // 二维码弹层开关

    };
    /**
     * 监听点击业务工具事件，
     */
    visibleUtilsChang = (value: boolean) => {
        this.setState({isUtilsDropdown: value})
    };
    uitlList = () => (
        <Menu className='gym-layout-operation-uitls'>
            {
                uitlsOptions.map((item:any) => (
                    <Menu.Item key={item.id}>
                        <div className="gym-layout-operation-uitls-item">
                            <div className="gym-layout-operation-uitls-item-icon">
                                {
                                    item.iconUrl
                                        ? <img className="gym-layout-operation-uitls-item-icon-img"
                                               src={require(`@/images/${item.iconUrl}`)}
                                               alt={``}
                                               onClick={(e) => this.showQRcode(e, item.iconUrl)}
                                        />
                                        : <div className="gym-layout-operation-uitls-item-icon-coming"><span>敬请期待</span></div>
                                }
                            </div>
                            <div className="gym-layout-operation-uitls-item-text">
                                <div className="gym-layout-operation-uitls-item-text-title">
                                    <span>{item.title}</span>
                                    {
                                        item.url &&
                                        <a href={item.url} target="_blank">
                                            <button className="gym-button-white gym-layout-operation-uitls-item-text-title-link">
                                                点击进入
                                            </button>
                                        </a>
                                    }
                                </div>
                                <p className="gym-layout-operation-uitls-item-text-content">{item.content}</p>
                            </div>
                        </div>
                    </Menu.Item>
                ))
            }
        </Menu>
    )
    showQRcode = (e, url:string) => {
        e.preventDefault();
        this.setState({
            visible: true,
            qrCode: url
        })
    }
    render() {
        const {isUtilsDropdown, visible, qrCode}:any = this.state;
        return (
            <Fragment>
                <Modal
                    visible={visible}
                    footer={false}
                    destroyOnClose={false}
                    closable={false}
                    centered={true}
                    onCancel={() => this.setState({visible:false, isUtilsDropdown:false})}
                >
                    <div className="gym-layout-operation-uitls-item-icon-modal-img">
                        {
                            qrCode && <img src={require(`@/images/${qrCode}`)}/>
                        }
                    </div>
                </Modal>
                <Dropdown
                    overlay={this.uitlList()}
                    trigger={['click']}
                    onVisibleChange={this.visibleUtilsChang}
                >
                    <div className={`gym-layout-header-right-item pointer ${isUtilsDropdown ? 'active' : ''}`}>
                        <Icon className='gym-layout-header-icon' type={`gongjuxiang`}/>
                        <span>业务工具</span>
                    </div>
                </Dropdown>
            </Fragment>
        )
    }
}

export {Utils}
