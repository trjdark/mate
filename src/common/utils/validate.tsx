/**
 * desc: 验证工具
 * Date: 2018/7/30
 * Time: 下午3:47
 */
enum Validation{
    手机号,座机,邮箱,密码,手机或邮箱,短信验证码,姓名,身份证,正整数,英文数字,非空格,
    新密码,用户名, 可为空手机号, 可为空邮箱
}

class Validate{
    static check(value:string, type:Validate){
        switch (type){
            case Validation.密码:
                return /^[A-Za-z0-9,.;~!@#$%^*()_+\-=/]{6,18}$/.test(value);
            case Validation.邮箱:
                return /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(value);
            case Validation.可为空邮箱:
                return /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(value);
            case Validation.座机:
                return /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(value);
            case Validation.手机号:
                return /^1[3456789]\d{9}$/.test(value);
            case Validation.可为空手机号:
                return /^1[3456789]\d{9}$/.test(value);
            case Validation.短信验证码:
                return /^\d{6}$/.test(value);
            case Validation.手机或邮箱:
                return /^1[3456789]\d{9}$/.test(value)||/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(value);
            case Validation.姓名:
                return /^[\u4E00-\u9FA5A-Za-z0-9]{1,10}$/.test(value);
            case Validation.身份证:
                return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$) | (^[\u0000-\u00ff]+$)/.test(value);
            case Validation.新密码:
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,18}$/.test(value);
            default:
                return false;
        }
    }
}

class ValidateRegEx {
    static 账号=/^[A-Za-z0-9,.;~!@#$%^*()_+\-=/]{6,18}$/;  // 账号长度6-18位
    static 正整数 = /^([1-9]\d*|[0]{1,1})$/;//含零正整数
    static 不含零正整数 = /^([1-9]\d*)$/;//不含零正整数
    static 英文数字 = /^[A-Za-z0-9]+$/;
    static 非空格 = /\s/g;
    static 新密码=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,18}$/;
    static 用户名=/^(?!\d+$)(?!\.+$)[A-Za-z0-9\.]{4,50}$/;
}

const handleValidate={
    [Validation.正整数] : (rule,value,callback)=>{
        let reg= ValidateRegEx.正整数;
        if(value && !reg.test(value)){
            callback('请输入正整数');
        }
        callback();
    },
    [Validation.英文数字] : (rule,value,callback)=>{
        let reg= ValidateRegEx.英文数字;
        let space=/\s/g;
        if(value && !reg.test(value)){
            if(space.test(value)){
                callback('请勿输入空格');
            }else{
                callback('请输入英文或数字');
            }
        }
        callback();
    },
    [Validation.非空格] : (rule,value,callback)=>{
        let space=ValidateRegEx.非空格;
        if(space.test(value)){
            callback('请勿输入空格');
        }
        callback();
    },
    [Validation.手机号]: (rule,value,callback)=>{
        let valid=Validate.check(value,Validation.手机号);
        if (!value) {
            callback('请输入手机号');
        }
        if (!valid) {
            callback('手机号格式错误');
        }
        callback();
    },
    [Validation.可为空手机号]: (rule,value,callback)=>{
        if(value === ''){
            callback();
        }else{
            let valid=Validate.check(value,Validation.手机号);
            if (!valid) {
                callback('手机号格式错误');
            }
            callback();
        }
    },
    [Validation.邮箱]: (rule,value,callback)=>{
        let valid=Validate.check(value,Validation.邮箱);
        if (!value) {
            callback()
        }
        if (!valid) {
            callback('邮箱格式错误')
        }
        callback();
    },
    [Validation.可为空邮箱]: (rule,value,callback)=>{
        if(value === ""){
            callback();
        }else{
            let valid=Validate.check(value,Validation.邮箱);
            if (!valid) {
                callback('邮箱格式错误')
            }
            callback();
        }
    },
    [Validation.座机]:(rule,value,callback)=>{
        let valid=Validate.check(value,Validation.座机);
        if (!value) {
            callback()
        }
        if (!valid) {
            callback('座机格式错误')
        }
        callback();
    },
    [Validation.用户名] : (rule,value,callback)=>{
        let reg= ValidateRegEx.用户名;
        if(value && !reg.test(value)){
            callback('用户名由4-50位的英文、数字、点号组成');
        }
        callback();
    },
    [Validation.新密码] : (rule,value,callback)=>{
        let reg= ValidateRegEx.新密码;
        if(value && !reg.test(value)){
            callback('新密码包含大小写字母、特殊字符(@$!%*?&)以及数字、并且长度在8到18位');
        }
        callback();
    },
}
export {Validation, Validate, ValidateRegEx,handleValidate}
