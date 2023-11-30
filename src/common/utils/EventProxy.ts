/**
 * Desc: react 事件订阅触发机制
 * User: Dave
 * Date: 2018/12/29,
 * Time: 上午10:36
 */
const EventProxy = {
    events: {},

    on(key, fn) {
        if (this.events[key] === undefined) {
            this.events[key] = []
        }
        this.events[key].push(fn);
    },

    remove(key?) {
        if (!key) {
            this.events = {};
        } else {
            this.events[key] = []
        }
    },

    async trigger(key) {
        let args = [].concat(Array.prototype.slice.call(arguments, 1));
        try {
            if (this.events[key]) {
                for (let i in this.events[key]) {
                    if (this.events[key].hasOwnProperty(i)) {
                        this.events[key][i].apply(null, args);
                    }
                }
            }
        } catch (e) {
            return false;
        }
    }
};

export default EventProxy;
