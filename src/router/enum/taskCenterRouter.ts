/**
 * desc: 中心业绩目标设置表单
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/3/12
 * Time: 上午10:38
 */
import {Task} from "@/ui/pages/taskCenter";
import TaskCenter from '../../ui/pages/taskCenter/page/task';
import {MessageCenter} from "@/ui/pages/taskCenter/page/message";

class TaskCenterRoutes {
    static 工作台 = {
        path: '/taskCenter',
        component: Task,
        authority: true,
    };
    static 任务中心 = {
        path: '/taskCenter/task/:params?',
        link:'/taskCenter/task',
        component: TaskCenter,
        authority: true,
    };
    static 消息中心 = {
        path: '/taskCenter/massage',
        component: MessageCenter,
        authority: true,
    };
}

export {TaskCenterRoutes}
