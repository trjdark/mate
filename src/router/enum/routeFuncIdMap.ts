import {User} from "@/common/beans/user";
import {message} from "antd";
import {FUNC} from "@/ui/pages/setting/enum/functions";

let PermissionMap:any = {};
for(let key in FUNC){
    PermissionMap[key] = [FUNC[key]];
}
/**
 * 权限
 */
const requirePermission = (name, isChangeTitle?: boolean) => {
    return function () {
        let permissionList = PermissionMap[name];
        // 修改页签，（客户360除外）
        if (!isChangeTitle) {
            document.title = 'Mate'
        }
        if (!permissionList) {
            message.info('你没有权限登录本系统', 3);
            return {
                permission: false,
                message: '你没有权限登录本系统',
            }
        }
        // 总部中心才有权限，非总部中心没有权限
        if (
            name === '默认角色设置' || name === '总部课程包' ||
            name === '课程分类' || name === '课程资料' || name === '测评库'
        ) {
            if (!User.user.isHQ) {
                return {
                    permission: false,
                    message: `您没有${name}权限，请联系中心进行设置`,
                };
            }
        }
        // 是否包含本权限
        const permission = permissionList.every((val) => User.permissionList.includes(val));
        return {
            permission,
            message: permission ? '' : `您没有${name}权限，请联系中心进行设置`,
        };
    }
};

export {PermissionMap, requirePermission}
