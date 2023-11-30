import {Events} from "../../../events/events";

/**
 * Desc
 * @param {any}
 * @returns {any}
 */
export const getSubmitToReservation = (state:any) => {
    const cache = state["course-selection"];
    return (cache[Events.SELECTION_TO_RESERVATION] || {}).data || {};
};