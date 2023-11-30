const music = (id: string, url: string, musicName: string) => {
    return `<div style='width: 100%;'>
            <script>
              function clickAudio() {
                window.gymboUbRecordsWithAPP.default({
                  screenName: 'MiniCourseFeedback',
                  eventName: 'ClickAudio',
                });
              }
          </script>
            <div id='${id}' onclick='clickAudio()'></div>
            <script>
                new window.GymboWebAudio.GymboAudio({url: '${url}', anchor: '${id}', musicName: "${musicName}"});
            </script>
          </div>`;
};

const video = ({ videoId, cover }: { videoId: string; cover: string }) => {
    return `
    <div class='videoElement'>
      <script>
        function clickVideo${videoId}() {
          window.jsApi.naviTo('gymbo://go/landscapeVideo?id=${videoId}');
          window.jsApi.sendMessage(
            // @ts-ignore
            JSON.stringify({
              type: 'popBackWithRefresh',
              value: true,
            })
          );
          window.gymboUbRecordsWithAPP.default({
            screenName: 'MiniCourseFeedback',
            eventName: 'ClickVideo',
          });
          var audios = document.querySelectorAll('audio');
          for (const audio of audios) {
            audio.pause();
          }
        }
      </script>
      ${cover ? `<img src="${cover}" alt=''>` : ''}
      <div class='videoMask'>
        <div class='videoBtn' onclick="clickVideo${videoId}()">
          <img src='https://ccms-up-img.gymbo-online.com/up/img/klHMWI5oanuKEjYO2DwIt.png' alt='' />
        </div>
      </div>
    </div>
  `;
};

const themeDesc = (val: { text: string; content: string }) => {
    const { text, content } = val;
    return `
    <div class="label">${text || '主题介绍'}</div>
    ${content ? `<div class="content">${content.replaceAll('\n', '<br/>')}</div>` : ''}
  `;
};

const courseReceive = (val: string[]) => {
    return val
        .map((item) => {
            return `<p><img src="https://ccms-up-img.gymbo-online.com/up/img/29Qcp1tDqcxIM_MogMB~i.png" alt="" />${item.replaceAll(
                '\n',
                '<br/>'
            )} </p>`;
        })
        .join('');
};

const courseReview = (text: string) => {
    return `<div class="intro">${text}</div>`;
};

// 教案模本
export const feedbackTemplate = ({
                                     title,
                                     fullData,
                                 }: {
    title: string;
    fullData: { type: string; [key: string]: any }[];
}) => {
    const main = fullData
        .map((item) => {
            if (item.type === 'music') {
                return music(item.id, item.previewUrl, item.musicName || '金宝音乐');
            }
            if (item.type === 'video') {
                return video({ videoId: item.video, cover: item.cover });
            }
            if (item.type === 'image') {
                return `<div style='width: 90%; margin: 10px auto; display: block; position: relative; overflow: hidden'><img src='${item.previewUrl}' style='width: 100%; border-radius: 8px' alt='' /></div>`;
            }
            if (item.type === 'carefullyReview') {
                return courseReview(item.text);
            }
            return null;
        })
        .join('');

    const themeDom = fullData
        .filter((item) => item.type === 'theme')
        .map((item) => {
            return themeDesc({ text: item.text, content: item.content });
        })
        .join('');

    const receiveDom = fullData
        .filter((item) => item.type === 'courseReceive')
        .map((item) => {
            return courseReceive(item.content);
        })
        .join('');

    const receiveDescDom = fullData
        .filter((item) => item.type === 'courseReceiveDesc')
        .map((item) => {
            return item.text.replaceAll('\n', '<br/>');
        })
        .join('');

    return `<!DOCTYPE html>
          <html lang="zh-cn">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
              <title>${title}</title>
              <script>
                  this.globalThis || (this.globalThis = this)
              </script>
              <!-- 随堂反馈页面模板-->
              <link rel="stylesheet" href="https://ccms-up-file.gymbo-online.com/up/file/0V6p95lgoqhXxbK0tAze_.css" >

              <!-- 音乐播放器样式-->
              <link rel="stylesheet" href="https://ccms-up-file.gymbo-online.com/up/file/ScHA80BJYbUJ6E3sORDEG.css" />

              <!-- swiper 样式-->
              <link rel="stylesheet" href="https://i.gymbo-online.com/static/cdn/libs/swiper.min.css" />

              <!--音频播放器-->
              <script type="text/javascript" src="https://ccms-up-file.gymbo-online.com/up/file/wqazB0SrJV~POWDG6pIGQ.js"></script>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                }
                .pageWrap {
                  width: 100%;
                  padding-bottom: 30px
                }

                .hidden {
                  height: 100%;
                  overflow: hidden;
                }

                .pageWrap img {
                  width: 100%;
                  display: block
                }

                .musicElement .right .top .name {
                  max-width: 160px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                .videoElement {
                  width: 90%;
                  height: 240px;
                  overflow: hidden;
                  position: relative;
                  border-radius: 10px;
                  border: 1px solid #eee;
                  margin: 10px auto 15px;
                }
                .videoElement img {
                  display: block;
                  width: 100%;
                }
                .videoElement .videoMask {
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  background-color: rgba(0, 0, 0, 0.3);
                }
                .videoElement .videoBtn {
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  width: 40px;
                  height: 40px;
                  margin: auto;
                  display: -webkit-box;
                  display: -ms-flexbox;
                  display: flex;
                  position: absolute;
                  border-radius: 100%;
                  -webkit-box-align: center;
                      -ms-flex-align: center;
                          align-items: center;
                  background-color: #fff;
                  -webkit-box-pack: center;
                      -ms-flex-pack: center;
                          justify-content: center;
                }
                .videoElement .videoBtn img {
                  width: 25px;
                  height: 25px;
                  display: block;
                }

                .mainBanner {
                  width: 90%;
                  overflow: hidden;
                  border-radius: 8px;
                  margin: 15px auto;
                  img {
                    width: 100%;
                  }
                }

                .swiper {
                  width: 100%;
                  height: 100%;
                }

                .swiper-slide {
                  border-radius: 8px;
                  text-align: center;
                  font-size: 18px;
                  background: #fff;

                  /* Center slide text vertically */
                  display: -webkit-box;
                  display: -ms-flexbox;
                  display: -webkit-flex;
                  display: flex;
                  -webkit-box-pack: center;
                  -ms-flex-pack: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  -webkit-box-align: center;
                  -ms-flex-align: center;
                  -webkit-align-items: center;
                  align-items: center;
                }

                .swiper-slide img {
                  display: block;
                  width: 100%;
                  border-radius: 8px;
                  object-fit: cover;
                }

                #codeBannerWrap img {
                  display: block;
                  width: 90%;
                  margin: 0 auto;
                  border-radius: 8px;
                  object-fit: cover;
                }
                .swiper-pagination-bullet-active {
                  background-color: #ff8700;
                }


              </style>
          </head>

          <body>
          <div class="feedback">
            <div class="userInfo">
              <div class="title">
                <div class="titleLeft">
                  <div class="titleLabel" style='margin-bottom: 5px'>宝宝姓名</div>
                  <div class="titleContent" id='babyName' style='font-weight: 500'>--</div>
                </div>
                <div class="titleRight">
                  <img src="https://ccms-up-img.gymbo-online.com/up/img/_LOMt3Ai_CbeVyPoTrwPe.png" alt="" />
                </div>
              </div>
              <div class="course">
                <div class="left">
                  <div class="courseLabel" style='margin-bottom: 5px'>课程时间</div>
                  <div class="courseTime" id='courseDate' style='font-weight: 500'>
                    --
                  </div>
                </div>
                <div class="dividerLine"></div>
                <div class="right">
                  <div class="courseLabel" style='margin-bottom: 5px'>所在中心</div>
                  <div class="centerName" id='currentCenter' style='font-weight: 500'>--</div>
                </div>
              </div>
            </div>
            <div class="courseInfo">
              <div class="sectionTitle">
                <img src="https://ali-static.gymbo-online.com/commonPicture/img/foqni9DroJ7P3SLKpnWoz.png" alt="" />
                课程信息
              </div>
              <div class="courseName" id='courseInfo' style='font-weight: 500'>--</div>
              <div class="teacher">
                <div class="label">指导老师</div>
                <div class="content" id='teacherName' style='font-size: 18px'>--</div>
              </div>
              <div class="theme">
                <!-- 主题内容-->
                ${themeDom}
              </div>
              <!-- 课程收获内容-->
              <div class="courseReceive" style='display: ${receiveDescDom && receiveDom ? 'block' : 'none'}'>
                <div class="label">课程收获</div>
                <div class="content">
                  <div style='margin-bottom: 10px'>${receiveDescDom}</div>
                  ${receiveDom}
                </div>
              </div>
              <div style='display: ${receiveDescDom && receiveDom ? 'none' : 'block'}; padding-bottom: 2px'></div>
            </div>
            <div class="review" style='padding-bottom: 20px'>
              <div class="sectionTitle">
                <img src="https://ccms-up-img.gymbo-online.com/up/img/hFbqaC1GUTOZHTkGzwcBW.png" alt="" /> 认真复习
              </div>
              <!-- 认真复习内容-->
              ${main}

              <!--音乐, banner 视频 位置-->
              <div class='codeBanner' id='codeBannerWrap' style='display: none'></div>
            </div>
            <div class='mainBanner' style='display: none; position: relative; padding-bottom: 20px'>
                <div class="swiper mySwiper">
                  <div class="swiper-wrapper" id='mainBannerWrap'>
                  </div>
                <div class="swiper-pagination"></div>
                </div>
              </div>
          </div>
          <!--js APi-->
          <script type="text/javascript"
                  src="https://ccms-up-file.gymbo-online.com/up/file/gNuO5~uBWC8WmkiOvKINL.js"></script>
          <!--js APi ub-app -->
          <script type="text/javascript"
                  src="https://ccms-up-file.gymbo-online.com/up/file/ViGwjqCX~YFBiR3wbRgZe.js"></script>

          <!-- swiper js -->
          <script type="text/javascript"
                  src="https://i.gymbo-online.com/static/cdn/libs/swiper.min.js"></script>
          <script>

            var searchArr = window.location.search.replace('?', '').split('&');
            var query = searchArr.reduce(function(acc, cur) {
              if (acc) {
                var child = cur.split('=');
                acc[child[0]] = child[1];
              }
              return acc;
            }, {});


            if (window.navigator.userAgent.toLowerCase().indexOf('gymbo') > -1) {
              window.gymboUbRecordsWithAPP.default({
                screenName: "MiniCourseFeedback",
                eventName: 'PageView',
                ext: JSON.stringify({Source: query.source ||'Push'})
              });
            }

            // 封装 ajax 方法
            var ajax = function(obj) {
              var data = '';
              for(var i in obj.data){
                data += '&'+i+'='+encodeURIComponent(obj.data[i]);
              }
              data = data.slice(1);
              if(obj.type === 'get'){
                obj.url = obj.url+'?'+data;
              }
              return new Promise(function(resolve, reject){
                var XHR = new XMLHttpRequest();
                XHR.open(obj.type, obj.url,obj.async);
                XHR.onreadystatechange = handler;
                XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                XHR.send(data);
                XHR.responseType = 'json';
                function handler() {
                  if (this.readyState !== 4) {
                    return;
                  }
                  if (this.status === 200) {
                    resolve(this.response);
                  } else {
                    reject(new Error(this.statusText));
                  }
                }
              });
            };

            // 设置页面信息
            function setCourseInfo(data) {
              var babyName = document.getElementById('babyName');
              var courseDate = document.getElementById('courseDate');
              var currentCenter = document.getElementById('currentCenter');
              var courseInfo = document.getElementById('courseInfo');
              var teacherName = document.getElementById('teacherName');

              babyName.innerHTML = data.babyName;
              courseDate.innerHTML = data.lessonDate + '<br/>' + data.startTime + '-' + data.endTime;
              currentCenter.innerHTML = data.centerName;
              courseInfo.innerHTML = data.courseCode + ' ' + data.courseName + '-' + data.courseTheme;
              teacherName.innerHTML = data.primaryIns;
            }

            function naviTo(url) {
              window.jsApi.naviTo(url)
            }

            var baseUrl = window.location.origin === 'https://dev-oss-public.gymbo-online.com'? 'https://test1-1-app.gymbo-online.com' :'https://app.gymbo-online.com';

            ajax({
              type: 'get',
              url: baseUrl + '/api/v2/offCrm/feedback/detail',
              async:true,
              data:{
                bookId: query.bookId || '',
                token: window.jsApi.getAccountInfo().token
              }
            }).then(function (resp) {
              if(resp.code === 0) {
               setCourseInfo(resp.data);

               ajax({
                type:'get',
                async: true,
                url: baseUrl + '/api/v1/banners',
                data: {
                  key: 'meta.class.feedback.v2.'+ resp.data.courseCode +'.banner',
                  token: window.jsApi.getAccountInfo().token
                }
               }).then(function (resp) {
                 if (resp.code === 0) {
                    var codeBannerWrap = document.getElementById('codeBannerWrap');
                    if (resp.data.length > 0) {
                      codeBannerWrap.style.display = 'block';
                      codeBannerWrap.innerHTML = '<img  onclick="naviTo('+"'"+resp.data[0].url+"'"+')" src="'+resp.data[0].imageUrl+'" alt="">'
                    }
                 }
               })

              }
            });

            ajax({
              type: 'get',
              async: true,
              url: baseUrl + '/api/v1/banners',
              data: {
                key: 'meta.class.feedback.v2.banner',
                token: window.jsApi.getAccountInfo().token
              }
            }).then(function (resp) {
              if (resp.code === 0) {
                var mainBanner = document.querySelector('.mainBanner');
                var mainBannerWrap = document.getElementById('mainBannerWrap');
                if (resp.data.length > 0) {
                  mainBanner.style.display = 'block';
                  var str = '';
                  resp.data.map(function (item) {
                    str += '<div class="swiper-slide" onclick="naviTo('+"'"+item.url+"'"+')"><img style="width:100%" src="'+ item.imageUrl +'" alt=""></div>'
                  })
                  mainBannerWrap.innerHTML = str;
                  new Swiper(".mySwiper", {
                    autoplay: {
                      delay: 4000,
                      disableOnInteraction: false
                    },
                    spaceBetween: 50,
                    speed: 500,
                    pagination: {
                      el: ".swiper-pagination",
                    },
                  });
                }
              }
            })
          </script>
          </body>
          </html>`;
};
