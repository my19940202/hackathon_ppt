var pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var srcList = [];
var imgSrcPrefix = 'http://www.buick.com.cn/img/lacrosse_hev/360/red/';
// 语音输入相关
var search = window.BdVoice.search;
var Recognizer = window.BdVoice.Recognizer;
for (var i = 36; i >= 1; i--) {
    var indexStr = i;
    if (indexStr < 10) {
        indexStr = '0' + indexStr;
    }
    srcList.push({
        class: 'hide',
        width: pageWidth,
        src: imgSrcPrefix + indexStr + '.png'
    })
}

Vue.component('message-item', {
    props: ['message'],
    template: `<div class="chat_item bounceIn animated">
        <div :class="[message.pos, message.type]">
            {{{message.content}}}
        </div>
    </div>`
});

Vue.component('menu-item', {
    props: ['menu'],
    template: `<a v-if="!menu.upload" onclick="{{menu.clickHandler}}" href="#">{{menu.hint}}</a>
        <a v-if="menu.upload" href="#">
            <input class="hide" type="file" id="menuFile" accept="images/*" />
            <label for="file">上传</label>
        </a>`
});

Vue.component('imgs-item', {
    props: ['img'],
    template: '<img widht="{{img.width}}" :src="img.src" class="{{img.class}}" />'
});

Vue.component('top-thumb-imgs-item', {
    props: ['img'],
    template: `<div class="display_top_bar_item"><div>`
});

// 聊天整体app
var chatDom = new Vue({
    el: '#wrapper',
    data: {
        voice2text: '',
        inputText: '',
        pageWidth: pageWidth,
        pageHeight: pageHeight,
        displayImgDom: document.querySelector('.display_img'),
        displayImg360Dom: document.querySelector('.display_img360'),
        chatListDom: document.querySelector('.chat_list'),
        audioSrcPrefix: 'http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=',
        audioSrc: 'http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=Hi%252C%25E4%25BD%25A0%25E5%25A5%25BD%252C%25E6%2588%2591%25E6%2598%25AF%25E5%25BA%25A6%25E7%25A7%2598',
        audioText: '',
        firstImg: true,
        messageList: [{
                content: '<p>Hi,你好,我是度秘!</p>',
                pos: 'left'
            }
        ],
        tipsIndex: 0,
        // 提示模板
        tplList: {
            singleText: '<p>小度暂时还没有听懂</p>',
            singleCard:  `<div class="chat_card">
                <div class="card_title">
                    轿车(car)
                </div>
                <div class="card_img">
                    <img width="300" src="img/result_img.png" />
                </div>
                <div class="card_bottom_bar">
                    <a class="flash animated" href="#">百科</a>
                    <a class="flash animated" href="#">汽车之家</a>
                    <a class="flash animated" href="#">经销商</a>
                </div>
            </div>`,
            singleTips: `<div class="chat_card single_tips">
                <div class="card_title">
                    拍下车的前脸和侧面,小度可以更精准帮你识别哦
                </div>
                <div class="card_img flash animated" onclick="chatDom.displayTipsImg('origin')"></div>
            </div>`,
            singleResultCard: `<div class="chat_card result">
                <div class="card_title">别克-君越</div>
                <div class="card_img" onclick="chatDom.displayCar360()">
                    <img class="flash animated" width="200" src="img/buick_car_side.jpg" />
                </div>
                <div class="card_bottom_bar">
                    <a class="flash animated" href="#">价格</a>
                    <a class="flash animated" href="#">参数</a>
                    <a class="flash animated" href="#">其他车型</a>
                    <a class="flash animated" href="#">经销商</a>
                </div>
            </div>`,
            multicard: `<div class="multicard_wrapper">
                <div class="multicard_item">
                    <p>前脸</p>
                    <img src="img/car_front_small.jpg" />
                </div>
                <div class="multicard_item">
                    <p>侧视图</p>
                    <img src="img/car_side_small.jpg" />
                </div>
                <div class="multicard_item">
                    <p>背面</p>
                    <img src="img/car_back_small.jpg" />
                </div>
                <div class="multicard_item">
                    <p>原图</p>
                    <img src="img/car_side45_small.jpg" />
                </div>
            </div>`
        },
        menu: false,
        menuList: [{
            hint: '车型是什么',
            clickHandler: 'chatDom.addText("车型是什么")'
        },
        {
            hint: '价格多少'
        },
        {
            hint: '小度猜错了'
        }],
        timer: null,
        display360: false,
        srcList: srcList,
        transClass: '',
        transScanClass: '',
        topImageHideObj: {
            back: 'hide',
            front: 'hide',
            side: 'hide'
        }
    },
    methods: {
        addText: function (paramText) {
            var text = this.inputText.trim();
            if (paramText) {
                text = paramText;
            }
            if (text) {
                this.messageList.push({
                    type: 'text',
                    content: `<p>${text}</p>`,
                    pos: 'right'
                });
                this.inputText = '';
                this.fakeReply();
            }
        },
        addImg: function (e) {
            var img = e.target.files[0];
            var reader = new FileReader();
            var me = this;
            reader.readAsDataURL(img);
            reader.onload = function() {
                chatDom.messageList.push({
                    type: 'img',
                    content: `<img src=${this.result} /><div class="scan_line"></div>`,
                    pos: 'right'
                });
                me.fakeReply();
            }
        },
        addVoice: function (data) {
            myRecognizer.start();
        },
        // 多形式返回
        fakeReply: function (fakeTip) {
            var me = this;
            var lastestMsg = me.messageList[me.messageList.length - 1];
            var index = (Math.random() * 2000000).toString(36);
            var tmpTplNameArr = [];
            var tmpTypeArr = [];
            var displayMenu = false;
            fakeTip = fakeTip || lastestMsg.type;
            me.firstImg = false;
            switch (fakeTip) {
                case 'text':
                    if (lastestMsg.content.match('车型') 
                        || lastestMsg.content.match('型号')
                        || lastestMsg.content.match('价格')
                        || lastestMsg.content.match('钱')
                        ) {
                        tmpTypeArr.push('');
                        tmpTplNameArr.push('singleTips');
                    }
                    else if (lastestMsg.content.match('result')) {
                        tmpTplNameArr.push('singleResultCard');
                    }
                    else if (lastestMsg.content.match('scroll')) {
                        tmpTplNameArr.push('multicard');
                        tmpTypeArr.push('multicard');
                    }
                    // 展现menu
                    else if (lastestMsg.content.match('menu')) {
                        me.menu = true;
                    }
                    else {
                        tmpTplNameArr.push('singleText');
                    }
                    break;
                // step 1
                case 'img':
                    tmpTplNameArr.push('singleCard');
                    displayMenu = true;
                    break;
                case 'menu':
                    tmpTplNameArr.push('multicard');
                    break;
                // step 2
                case 'car_model':
                    tmpTypeArr.push('');
                    tmpTplNameArr.push('singleTips');
                    me.audioText = '拍下车的前脸和侧面,小度可以更精准帮你识别哦';
                    break;
                case 'multicard':
                    tmpTypeArr.push('multicard');
                    tmpTplNameArr.push('multicard');
                    break;
                case 'result':
                    tmpTypeArr.push('');
                    tmpTplNameArr.push('singleResultCard');
                    break;
            }

            var arrInx = 0;
            tmpTplNameArr.map(function (val) {
                setTimeout(function() {
                    chatDom.messageList.push({
                        type: tmpTypeArr[arrInx],
                        content: me.tplList[val],
                        pos: 'left'
                    });
                    // scroll到最下方
                    me.autoScroll();
                    // 语音输出提示 audio有变化的时候 才会autoplay
                    if (val === 'singleTips') {
                        me.audioSrc = me.audioSrcPrefix 
                        + encodeURIComponent(encodeURIComponent(me.audioText))
                        + '&dri'
                        + index;
                    }
                    if (displayMenu === true) {
                        me.menu = true;
                    } else {
                        me.menu = false;
                    }
                    arrInx++;
                }, 1500);
            });
        },
        // 聊天记录滚动到最新处
        autoScroll: function () {
            var me = this;
            setTimeout(function() {
                if (me.chatListDom.scrollHeight > me.chatListDom.offsetHeight) {
                    me.chatListDom.scrollTop = me.chatListDom.scrollHeight - me.chatListDom.offsetHeight;
                }
            }, 300);
        },
        // 真实输出 需要和后端进行真正的交互
        reply: function () {
            console.log('real reply');
        },
        // 展示图片拍摄角度
        displayTipsImg: function (dire, clickDom) {
            var me = this;
            var carViewImg = {
                front: 'img/car_front.jpg',
                side: 'img/car_side.jpg',
                back: 'img/car_back.jpg',
                origin: 'img/first_origin.jpg'
            };
            me.topImageHideObj[dire] = '';
            me.display360 = false;
            me.displayImgDom.style.cssText = `top:0;background-image: url(${carViewImg[dire]})`;
            switch(dire) {
                case 'origin':
                    me.audioText = '拍下车的前脸,侧面和背面';
                    break;
                case 'front':
                    me.audioText = '请拍侧面照';
                    break;
                case 'side':
                    me.audioText = '请拍背面';
                    break;
            }
            me.audioSrc = me.audioSrcPrefix + encodeURIComponent(encodeURIComponent(me.audioText));
        },
        // 360展现汽车
        displayCar360: function () {
            var index = 0;
            var max = 36;
            var me = this;
            me.displayImgDom.style.cssText = 'top:0;background: #FFF;';
            me.display360 = true;
            me.audioText = '这款车型是别克君越2016款,它的最低配价格是22.98万';
            me.audioSrc = me.audioSrcPrefix + encodeURIComponent(encodeURIComponent(me.audioText));
            me.timer = setInterval(function () {
                if (index === max) {
                    index = 0;
                }
                me.srcList = me.srcList.map(function (val) {
                    val.class = 'hide';
                    return val;
                });
                me.srcList[index]['class'] = '';
                index++;
            }, 88);
        },
        hideTipsImg: function () {
            var me = this;
            me.displayImgDom.style.top = '100%';
            me.fakeReply('multicard');
            setTimeout(function () {
                me.fakeReply('result');
            }, 800)
            if (me.timer) {
                me.timer = clearInterval(me.timer);
            }
            if (me.display360) {
                me.display360 = false;
            }
        },
        hideFirstImg: function () {
            var me = this;
            me.displayImgDom.style.top = '100%';
            if (me.firstImg) {
                me.messageList.push({
                    type: 'img',
                    content: `<img src="img/car_origin_small.jpg"/><div class="scan_line"></div>`,
                        pos: 'right'
                    }
                );
                me.fakeReply('img');
            }
        },
        onlyhideTips: function () {
            var me = this;
            me.displayImgDom.style.cssText = 'top:100%;';
            me.transClass = '';
            me.topImageHideObj = {
                back: 'hide',
                front: 'hide',
                side: 'hide',
                origin: 'hide'
            };
            me.transScanClass = '';
            if (me.timer) {
                me.timer = clearInterval(me.timer);
            }
        },
        postText: function (text) {
            var me = this;
            var defaultUserId = 123456;
            $.ajax({
                type: 'post',
                url: "http://127.0.0.1:8878/json",
                data:  {
                    'type': 'text',
                    'content': text || '询问其他图片', 
                    'user_id': 123456
                },
                dataType: 'json'
            })
            .done(function (data) {
                me.handleRes(data);
                console.log('内容保存成功');
            })
            .fail(function () {
                console.log('内容保存失败');
            });
        },
        // 处理post返回内容
        handleRes: function (res) {
            var me = this;
            me.menuList = [];
            me.menu = true;
            res.hint.map(function (val) {
                var upload = false;
                if (val.match('拍摄')) {
                    upload = true;
                }
                me.menuList.push({
                    hint: val,
                    upload: upload,
                    clickHandler: 'chatDom.menuClickHandler(this)'
                })
            })
            me.messageList.push({
                type: 'text',
                content: `<p>${res.text}</p>`,
                pos: 'left'
            });
        },
        menuClickHandler: function (dom) {
            if (dom && dom.innerHTML) {
                this.postText(dom.innerHTML);
            }
        },
        postImg: function (imgBase64) {
            var me = this;
            var defaultUserId = 123456;
            $.ajax({
                type: 'post',
                url: "http://127.0.0.1:8878/json",
                data:  {
                    "type": "image",
                    "content": imgBase64, 
                    "user_id": 123456
                },
                dataType: 'json'
            })
            .done(function (data) {
                me.handleRes(data);
                console.log('内容保存成功');
            })
            .fail(function () {
                console.log('内容保存失败');
            });
        },
        addTransClass: function () {
            var me = this;
            me.transClass = 'display_top_bar_item_trans';
            setTimeout(function (){
                me.transScanClass = 'scan_line';
                // 输出内容
                me.fakeReply('multicard');
                setTimeout(function () {
                    me.fakeReply('result');
                }, 800)
                setTimeout(function() {
                    me.transClass = 'display_top_bar_item_trans fadeOut animated';
                    me.displayCar360();
                }, 3000)
            }, 1000);
        }
    }
});

chatDom.srcList = srcList;

window.chatDom = chatDom;

// 页面切换组件
var pageDom = new Vue({
    el: '#wrapperList',
    data: {
        index: 0,
        pageLength: 13,
        demoPageIndex: 8,
        pageWidth: pageWidth,
        posStyle: ''
    },
    methods: {
        posHandler: function () {
            if (this.index > this.pageLength - 1) {
                this.index = this.pageLength - 1;
            }
            if (this.index < 0) {
                this.index = 0;
            }

            if (this.index === this.demoPageIndex) {
                document.querySelector('.input_area').style.cssText = 'display:block;';
            }
            else {
                document.querySelector('.input_area').style.cssText = 'display:none;';
            }
            var tmp = this.index * this.pageWidth;
            this.posStyle = 'left: -' + tmp + 'px';
        },
        nextPage: function () {
            this.index++;
            this.posHandler();
        },
        prePage: function () {
            this.index--;
            this.posHandler();
        }
    }
});
window.pageDom = pageDom;

var myRecognizer = new Recognizer({
    pluginOptions: {
        show_voiceUI: '1',
        voiceSource: 'sound_channel'
    }
}).on('recognizing', function(e) {
    var voice2Word = '<span class="glyphicon glyphicon-volume-up"></span>' + e.data.result || '';
    chatDom.messageList.push({
        type: 'text',
        content: `<p>${voice2Word}</p>`,
        pos: 'right'
    });
    chatDom.fakeReply();
});
