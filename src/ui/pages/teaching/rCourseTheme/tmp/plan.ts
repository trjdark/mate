const music = (id: string, url: string, musicName: string, pointName: string) => {
    return `<div style='width: 450px; margin-left: 40px'>
            <script>
              function clickAudio() {
                var paused =  document.querySelector('#audio-${id}').paused;
                window.gymboUbRecordsWithAPP.default({
                  screenName: '${pointName}',
                  eventName: paused? 'PlayAudio' : 'PauseAudio',
                });
              }
            </script>
            <div id='${id}' onclick='clickAudio()'></div>
            <script>
               setTimeout(function () {
                  new window.GymboWebAudio.GymboAudio({url: '${url}', anchor: '${id}', musicName: "${musicName}"});
                }, 100)
            </script>
          </div>`;
};

const video = ({ videoId, cover }: { videoId: string; cover: string }) => {
    return `
    <div class='videoElement'>
      ${
        cover
            ? `
      <img src="${cover}" alt=''>`
            : ''
    }
      <div class='videoMask'>
        <div class='videoBtn' onclick="window.jsApi.naviTo('gymbo://go/landscapeVideo?id=${videoId}')">
          <img src='https://ccms-up-img.gymbo-online.com/up/img/klHMWI5oanuKEjYO2DwIt.png' alt='' />
        </div>
      </div>
    </div>
  `;
};

// 教案模本
export const planTemplate = ({
                                 title,
                                 fullData,
                                 pointName = 'CenterSourcePlanDetail',
                             }: {
    title: string;
    fullData: { type: string; [key: string]: any }[];
    pointName?: string;
}) => {
    const menu = fullData
        .filter((item) => item.type === 'planMenu')
        .map((menu, index) => {
            return `<div class="drawItem ${index === 0 ? 'drawItemActive' : ''}" onclick="planScrollIntoView('${
                menu.id
            }', this)">${menu.text}</div>`;
        })
        .join('');
    const main = fullData
        .map((item) => {
            if (item.type === 'music') {
                return music(item.id, item.previewUrl, item.musicName || '金宝音乐', pointName);
            }
            if (item.type === 'video') {
                return video({ videoId: item.video, cover: item.cover });
            }
            if (item.type === 'planMenu') {
                return `<div style='width: 100%; height: 90px; line-height: 90px; position: relative; overflow: hidden'>
                  <div class='markWrap' style='position: absolute; width: 100%; height: 90px; background-size: 35%; transform: rotate(-35deg)'></div>
                  <h3 id='${item.id}' style='width: 95%;
                   margin: 0 auto; font-size: 16px'>${item.text}</h3>
                </div>`;
            }
            if (item.type === 'image') {
                return `<div style='width: 95%; margin: 0 auto; display: block; position: relative; overflow: hidden'><div class='waterMarkAnchor'></div><img src='${item.previewUrl}' alt='' /></div>`;
            }
            return null;
        })
        .join('');
    return `<!DOCTYPE html>
          <html lang="zh-cn">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <title>${title}</title>
              <script>
                  this.globalThis || (this.globalThis = this)
              </script>
              <link rel="stylesheet" href="https://ccms-up-file.gymbo-online.com/up/file/ScHA80BJYbUJ6E3sORDEG.css" />
              <!--音频播放器-->
              <script src="https://ccms-up-file.gymbo-online.com/up/file/wqazB0SrJV~POWDG6pIGQ.js"></script>
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

                .headerWrap {
                  top: 0;
                  left: 0;
                  min-height: 48px;
                  position: relative;
                }

                .customer-header {
                  top: 0;
                  width: 100%;
                  z-index: 1000;
                  position: fixed;
                  background-color: #ffffff;
                }

                .customer-header-wrap {
                  width: 100%;
                  height: 48px;
                  display: flex;
                  line-height: 48px;
                  padding-left: 5px;
                  padding-right: 15px;
                  align-items: center;
                  justify-content: space-between;
                  background-color: transparent;
                }

                .customer-left {
                  width: 40px;
                  z-index: 1;
                  display: flex;
                  position: relative;
                  align-items: flex-start;
                  justify-content: flex-start;
                }

                .customer-left svg {
                  width: 40px;
                  height: 40px;
                  display: block;
                }

                .customer-title {
                  z-index: 0;
                  display: flex;
                  color: #000000;
                  font-weight: bold;
                  align-items: center;
                  font-size: 18px!important;
                  justify-content: flex-start;
                }
                .customer-menu {
                  width: 40px;
                  font-size: 18px;
                  color: #ef7420;
                  font-weight: bold;
                  margin-right: 20px;
                  text-align: center;
                }
                .draw {
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  z-index: 10;
                  overflow: scroll;
                  position: fixed;
                  padding-top: 50px;
                  padding-bottom: 50px;
                  transition-duration: .2s;
                  background-color: #ffffff;
                  transform: translateX(100%);
                }
                .open {
                  transition-duration: .2s;
                  transform: translateX(0);
                }
                .drawItem {
                  color: #ef7420;
                  font-size: 16px;
                  padding-top: 15px;
                  font-weight: bold;
                  padding-left: 20px;
                  padding-bottom: 15px;
                }
                .drawItem:last-child {
                  margin-bottom: 120px;
                }
                .drawItemActive {
                  color: #ffffff!important;
                  background-color: #ef7420!important;
                }
                .drawItem:not(:last-child) {
                  border-bottom: 1px solid #dddddd;
                }

                .musicElement .right .top .name {
                  max-width: 160px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }

                .videoElement {
                  width: 450px;
                  height: 253px;
                  margin-left: 60px;
                  overflow: hidden;
                  position: relative;
                  border: 1px solid #eee;
                  border-radius: 10px;
                  margin-top: 10px;
                  margin-bottom: 15px;
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
                .waterMarkAnchor {
                  z-index: 1;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  position: absolute;
                  background-size: 40%;
                  background-repeat: repeat;
                  transform: rotate(-35deg);
                }
              </style>
          </head>

          <body>
          <div class="headerWrap">
              <div id="header" class="customer-header">
                  <div class="customer-header-wrap">
                      <div class="customer-left" onclick="clickBack()">
                          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                               width="128" height="128">
                              <path d="M624.5 654.5l-146.25-146.24999999L624.5 362a36.263 36.263 0 0 0 0-52.5 36.263 36.263 0 0 0-52.5 0L399.5 482a36.263 36.263 0 0 0 0 52.5L572 707a37.125 37.125 0 1 0 52.5-52.5z"
                                      fill="#000000"></path>
                          </svg>
                      </div>
                      <div class="customer-title">
                          ${title}
                      </div>
                      <div class="customer-menu">
                          目录
                      </div>
                  </div>
              </div>
          </div>
          <div class="draw">
              ${menu}
          </div>
          <div id="content" class="pageWrap">
            ${main}
          </div>
          <!--水印-->
          <canvas id='can' style='display: none; width: 80px; height: 20px'></canvas>
          <!--js APi-->
          <script type="text/javascript"
                  src="https://ccms-up-file.gymbo-online.com/up/file/gNuO5~uBWC8WmkiOvKINL.js"></script>
          <!--js APi ub-app -->
          <script type="text/javascript"
                  src="https://ccms-up-file.gymbo-online.com/up/file/ViGwjqCX~YFBiR3wbRgZe.js"></script>
          <script>
            if (window.navigator.userAgent.toLowerCase().indexOf('gymbo') > -1) {
              if (window.navigator.userAgent.toLowerCase().indexOf('ipad') > -1) {
                var statusBarHeight = window.jsApi.getAppAndDeviceInfo().statusBarHeight || 0;
                document.querySelector('.customer-header').style.paddingTop = statusBarHeight + 'px';
                document.querySelector('.draw').style.paddingTop = statusBarHeight + 44 + 'px';
              }
              if (window.navigator.userAgent.toLowerCase().indexOf('iphone') > -1)  {
                document.querySelector('.customer-header').style.paddingTop = '10px';
                document.querySelector('.customer-menu').style.paddingRight = '20px'

              }
              window.gymboUbRecordsWithAPP.default({
                screenName: "${pointName}",
                eventName: 'PageView',
              });

            }
            // 展示 抽屉
            var draw = document.querySelector('.draw');
            var menu = document.querySelector('.customer-menu');
            menu.addEventListener('click', function () {
              window.gymboUbRecordsWithAPP.default({
                screenName: "${pointName}",
                eventName: 'ClickCatalogue',
              });
              draw.classList.toggle('open');
              document.body.classList.toggle('hidden');
            }, false);

            // 滚动到指定位置
            function planScrollIntoView(id, self) {
              draw.classList.toggle('open');
              document.body.classList.toggle('hidden');
              window.gymboUbRecordsWithAPP.default({
                screenName: "${pointName}",
                eventName: 'ChooseCatalogue',
                ext: JSON.stringify({
                  CatalogueName: self.innerHTML
                })
              });
              var drawItems = document.querySelectorAll('.drawItem');
              for(var i = 0; i < drawItems.length; i++) {
                drawItems[i].classList.remove('drawItemActive');
              }
              self.classList.add('drawItemActive');
              document.getElementById(id).scrollIntoView({behavior: 'smooth'})
            }

            // 点击左上返回按钮
            function clickBack() {
              if(draw.classList.contains('open')) {
                draw.classList.toggle('open');
                document.body.classList.toggle('hidden');
              } else {
                window.jsApi.naviBack();
              }
            }

            // 获取用户信息
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

            function generateMark(name, mobile) {
              // 添加水印
              var canvas = document.getElementById('can');
              var ctx = canvas.getContext('2d');
              var waterMarks = document.querySelectorAll('.waterMarkAnchor');
              var markWraps = document.querySelectorAll('.markWrap');
              ctx.font="12px -apple-system, blinkmacsystemfont";
              ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
              ctx.fillText(name + '(' +(mobile.slice(-4))+')', 10, 15);
              var img = ctx.canvas.toDataURL();
              for(var i = 0; i < waterMarks.length; i++) {
                waterMarks[i].style.backgroundImage = 'url('+img+')';
              }
              for(var j = 0; j < markWraps.length; j++) {
                markWraps[j].style.backgroundImage = 'url('+img+')';
              }
            }

            var baseUrl = window.location.origin === 'https://dev-oss-public.gymbo-online.com'? 'https://test1-1-app.gymbo-online.com' :'https://app.gymbo-online.com';
            ajax({
              type: 'get',
              url: baseUrl + '/api/v1/offCrm/staff/info',
              async:true,
              data:{
                token: window.jsApi.getAccountInfo().token
              }
            }).then(function (resp) {
              console.log('resp', resp);
              if(resp.code === 0) {
               generateMark(resp.data.name, resp.data.mobile);
              } else {
               generateMark('金宝贝科技', '00000');
              }
            });

          </script>
          </body>
          </html>`;
};
