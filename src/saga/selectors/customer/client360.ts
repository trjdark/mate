import {Events} from "@/events/events";

/**
 * 客户360基本信息
 * @param state
 * @returns {{}}
 */
export const selectClient360 = (state:any) => {
    const cache = state["client360"];
    return (cache[Events.GET_CLIENT_360_BASIC_INFO] || {}).data || {};
};

export const selectFamilyRelation = (state:any) => {
    const cache = state["client360"];
    return (cache[Events.GET_CODE_INFO_BY_TYPE] || []).data || {};
};

export const selectEditPermission = (state:any) => {
    const cache = state["client360"];
    return (cache[Events.GET_EDIT_PERMISSION] || []).data || {hasModifiedMobilePermission:false,hasEditPermission:false};
};

