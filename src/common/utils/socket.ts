/**
 * desc: socket连接
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/4
 * Time: 上午11:22
 */
import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';
import {User} from "@/common/beans/user";
import moment from "moment";

class Socket {
    static socket:SockJS;
    static stompClient:any;
    static headers:any = {};
    static timer:any;
    /**
     * 初始化
     */
    static init(options:any){
        this.timer = setTimeout(() => this.connection(options), 1000);
    }

    static send(url, params){
        this.stompClient.send(url, {
            userName: User.userName
        }, JSON.stringify(params));
    }

    static connection(option:any){
        const time = moment().valueOf();
        this.socket = null;
        this.stompClient = null;
        const socketUrl = process.env.socketUrl;
        if(process.env.NODE_ENV === 'develop'){
            this.socket = new SockJS(`${socketUrl}/api/mate-live/endpoint?token=${User.getToken}&time=${time}&currentCenterId=${User.currentCenterId}&socketType=${option.socketType || 'live'}`);
        }else{
            this.socket = new SockJS(`${location.protocol}//${location.host}/api/mate-live/endpoint?token=${User.getToken}&time=${time}&currentCenterId=${User.currentCenterId}&socketType=${option.socketType || 'live'}`);
        }
        this.stompClient = Stomp.over(this.socket);
        // 定义客户端的连接信息
        this.stompClient.connect({
            userName: User.userName
        }, (frame:any) => {
            const url = `${option.subscribe}${User.getToken},${time},${User.currentCenterId}`;
            this.stompClient.subscribe(url, option.callback)
        }, (err) => {
            console.log(err)
        })


    }

    static disconnect(){
        clearTimeout(this.timer);
        if (this.stompClient != null && this.stompClient.connected) {
            this.stompClient.disconnect();
            console.log("断开连接");
        }
    }
}

export {Socket}
