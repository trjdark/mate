/**
*Desc: 课程资料reducer数据选择器
*User: Debby.Deng
*Date: 2018/8/24,
*Time: 上午9:44
*/
import {Events} from "../../../events/events";

/**
 * 课程分类名称
 * @param state
 * @returns {any}
 */
export const lessonMatType = (state:any) => {
    const lessonMat = state["lessonMaterial"];
    const resData=lessonMat[Events.LESSON_MATERIAL_TYPE];
    return (resData||{}).data || [];
};
