import {Events} from "@/events/events";

export const selectRCourseVideo = (state:any) => {
    const cache = state["rSource"];
    return (cache[Events.CRM_VIDEO_LIST] || {}).data || [];
};
export const selectRCourseAudio = (state:any) => {
    const cache = state["rSource"];
    return (cache[Events.CRM_AUDIO_LIST] || {}).data || [];
};
export const selectRCourseImage = (state:any) => {
    const cache = state["rSource"];
    return (cache[Events.CRM_IMAGE_LIST] || {}).data || [];
};
