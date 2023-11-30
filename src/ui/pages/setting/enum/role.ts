/**
 * desc: 角色管理
 * User: colin.lu
 * Date: 2018/8/5
 * Time: 上午10:00
 */
// 课程包状态
const RoleStatus = [
    {
        key: 'roleStatus1',
        value: 1,
        name: '启用'
    },{
        key: 'roleStatus2',
        value: 0,
        name: '失效'
    },
];

const DefaultRoleStatus = 1;


export {
    RoleStatus, DefaultRoleStatus,
}
