/**
 * desc: 邮箱
 * Date: 2018/7/30
 * Time: 下午3:57
 */

class Email{
    static checkEmail(email:string){
        return /(163.com|139.com|tom.com|189.cn|126.com|sina.com|qq.com|21cn.com|yeah.net|foxmail.com|wo.com.cn)$/.test(email);
    }
    static goToEmail(email:string){
        if(this.checkEmail(email)){
            if(/163.com$/.test(email)){
                window.open("http://mail.163.com");
            }
            if(/139.com$/.test(email)){
                window.open("http://mail.10086.cn");
            }
            if(/sohu.com$/.test(email)){
                window.open("http://mail.sohu.com");
            }
            if(/tom.com$/.test(email)){
                window.open("http://mail.tom.com");
            }
            if(/189.cn$/.test(email)){
                window.open("http://webmail28.189.cn");
            }
            if(/126.com$/.test(email)){
                window.open("http://mail.126.com");
            }
            if(/sina.com$/.test(email)){
                window.open("http://mail.sina.com.cn");
            }
            if(/vip.sina.com$/.test(email)){
                window.open("http://mai.sina.com.cn");
            }
            if(/sogou.com$/.test(email)){
                window.open("http://mai.sogou.com");
            }
            if(/qq.com$/.test(email)){
                window.open("http://mail.qq.com");
            }
            if(/vip.qq.com$/.test(email)){
                window.open("http://mail.qq.com");
            }
            if(/eyou.com$/.test(email)){
                window.open("http://www.eyou.com");
            }
            if(/21cn.com$/.test(email)){
                window.open("http://mail.21cn.com");
            }
            if(/188.com$/.test(email)){
                window.open("http://www.188.com");
            }
            if(/yeah.net$/.test(email)){
                window.open("http://www.yeah.net");
            }
            if(/foxmail.com$/.test(email)){
                window.open("http://mail.foxmail.com");
            }
            if(/wo.com.cn$/.test(email)){
                window.open("http://mail.wo.com.cn");
            }
            return true;
        }else{
            return false;
        }
    }
}

export {Email};
