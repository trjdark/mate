/**
 * desc: 活动耗课枚举
 * User: Dean
 * Date: 2020/9/11
 * Time: 16:38
 */
// 活动类型
  enum  activityType {
    恳谈会 = 76001,
    迎新会 = 76002,
    会员活动 = 76003,
    APP金宝儿歌动画 = 76005,
    APP读书会 = 76006,
    APP核心课 = 76007,
    其他 = 76004
  }
  // 活动目的
  enum  activityPurpose {
    会员推荐 = 49001,
    增加耗课 = 49002,
    提高满意度 = 49003,
    其他 = 49004
  }

export {activityType, activityPurpose}
