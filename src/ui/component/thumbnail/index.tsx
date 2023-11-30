/**
 * desc: 缩略图
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/12/5
 * Time: 上午10:59
 */
import React from 'react'
import './index.scss';
import {Icon, Modal} from "antd";

declare interface ThumbnailProps {
    imgSrc:string;
}

class Thumbnail extends React.Component<ThumbnailProps, any>{
    state = {
        visible:false
    }
    render(){
        const {imgSrc} = this.props;
        const {visible} = this.state;
        return(
            <div className='gym-thumbnail'>
                <Modal
                    visible={visible}
                    closable={false}
                    footer={false}
                    onCancel={() => this.setState({visible: false})}
                    width={800}
                >
                    <img src={imgSrc} style={{width: '100%'}} alt=""/>
                </Modal>
                <div className='gym-thumbnail-info'>
                    <a href="#">
                        <img src={imgSrc} alt=""/>
                    </a>
                    <a href="#" className='gym-thumbnail-info-layout'>
                        <Icon type="eye"  onClick={() => this.setState({visible: true})}/>
                    </a>
                </div>
            </div>
        )
    }
}

export {Thumbnail}
