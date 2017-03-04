(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BdVoice"] = factory();
	else
		root["BdVoice"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @file 入口
	 */
	/* global Box */

	if (!window.Box) {
	    throw new TypeError('JSSDK depend on baidu openjs');
	}

	if (!window.Promise) {
	    throw new TypeError('JSSDK depend on ES6 Promise');
	}

	var Recognizer = __webpack_require__(4);
	var Invoker = __webpack_require__(1);

	module.exports = {
	    Recognizer: Recognizer,
	    search: Invoker.voiceSearch
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @file 调起
	 */

	/* global Box */

	var Util = __webpack_require__(5);
	var sendUbsLog = __webpack_require__(2);

	/* eslint-disable fecs-camelcase, fecs-use-standard-promise */
	var invoke = exports.invoke = function (type, options, callback) {

	    if (Box.isFunction(options)) {
	        callback = options;
	    }

	    var args = Box.extend({
	        source_app: Box.isBox ? '6|' + Box.version.substr(0, 3) : 'BROWSER',
	        referer: location.href,
	        voiceSource: 'web',
	        method_name: type
	    }, options);

	    sendUbsLog({
	        act: 'b_invoke',
	        mod: type,
	        fr: args.voiceSource || 'self'
	    });

	    if (Box.isIOS) {
	        return ios(args, callback);
	    } else if (Box.isAndroid) {
	        args['User-Agent'] = navigator.userAgent || '';
	        args.COOKIE = document.cookie || '';
	        return android(args, callback);
	    }
	};

	function android(args, callback) {

	    var isSDK = Box.isBox && Box.version_compare(Box.version, '7.7') >= 0;

	    var voiceParams = {
	        package_name: 'com.baidu.speechbundle',
	        params: JSON.stringify(Util.objectWithoutProperties(args, ['method_name'])),
	        website_url: 'http://m.baidu.com',
	        from: 'web:search',
	        use_new_window: '1',
	        method_name: args.method_name
	    };

	    if (isSDK) {
	        voiceParams = args;
	    }

	    var invokeOption = [JSON.stringify(voiceParams)];

	    if (Box.isFunction(callback)) {
	        var fnName = 'window.' + Util.exposeFn(callback);

	        invokeOption.push(isSDK ? fnName : JSON.stringify({
	            callback: fnName,
	            listeners: [fnName // 插件在执行过程中可以多次调用这个回调，参数为自定义JSON结构
	            ]
	        }));
	    }

	    if (Box.isBox && !isSDK) {
	        return Promise.resolve(Box.android.invokeApp('Bdbox_android_plugin', 'invokePlugin', invokeOption));
	    } else if (Box.isBox) {

	        var output = void 0;

	        if (args.method_name === 'voiceSearch') {
	            output = Box.android.invokeApp('Bdbox_android_send_intent', 'send', ['intent:#Intent', 'action=com.baidu.searchbox.action.VOICESEARCH', 'category=android.intent.category.DEFAULT', 'S.voice_source=' + (args.voiceSource || 'app_from_webView'), 'end'].join(';'));
	        } else {
	            output = Box.android.invokeApp('Bdbox_android_utils', 'startVoice', invokeOption);
	        }

	        return Promise.resolve(output);
	    } else if (Util.isBaiduBrowser) {
	        var _window$_flyflowNativ;

	        return Promise.resolve((_window$_flyflowNativ = window._flyflowNative).exec.apply(_window$_flyflowNativ, ['Bdbrowser_android_plugin', 'invokePlugin'].concat(invokeOption)));
	    }

	    return openBox();
	}

	function ios(args, callback) {

	    // 百度畅听的特殊标志
	    if (args.voiceSource === 'sound_channel' && Box.version_compare(Box.version, '8.1') >= 0) {
	        args.voice_pid = args.voice_pid || 796;
	    } else if (/Recognition/i.test(args.method_name)) {
	        args.voice_pid = args.voice_pid || 795;
	    }

	    if (/light/i.test(navigator.userAgent)) {
	        args.from_o2o = 'true';
	    }

	    var argArray = Object.keys(args).map(function (key) {
	        return [key, args[key]].join('=');
	    });

	    var params = {
	        plugin_id: 'box.plugin.voicesearch',
	        url: 'args=' + encodeURIComponent(argArray.join('&'))
	    };

	    var pluginOptions = {
	        action: 'open',
	        params: encodeURIComponent(JSON.stringify(params)),
	        minver: '6.5.0.0'
	    };

	    if (Box.isBox) {
	        return Promise.resolve(Box.ios.invokeApp('invokePlug', pluginOptions, callback));
	    }

	    return openBox(args);
	}

	function openBox() {
	    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


	    // 微博、微信下必定失败
	    if (Box.os.isWeibo || Box.os.isWechat || Box.os.isQQ) {
	        return Promise.reject();
	    }

	    var browser = Util.getBrowser();

	    var source = ['invokeBdBox_voiceSdk', Util.getBDID(), Box.os.name + '_' + Box.os.version, browser].join(',');

	    var logargs = {
	        needlog: 1,
	        logargs: encodeURIComponent(JSON.stringify({ source: source }))
	    };

	    var schema = '';

	    if (Box.isIOS) {
	        (function () {
	            var iosArgs = Box.extend({
	                caller: 'voice',
	                args: encodeURIComponent(args)
	            }, logargs);

	            var iosArgsArray = Object.keys(iosArgs).map(function (key) {
	                return [key, iosArgs[key]].join('=');
	            });

	            schema = 'baiduboxapp://voicesearch?opennewwindow&' + iosArgsArray.join('&');
	        })();
	    } else if (Box.isAndroid) {
	        (function () {
	            var intent = ['intent:#Intent', 'package=com.baidu.searchbox', 'action=com.baidu.searchbox.action.VOICESEARCH', 'category=android.intent.category.DEFAULT', 'S.search_source=api_mbaiducom_voice', 'end'].join(';');

	            var androidArgs = Box.extend({
	                action: 'sendIntent',
	                minver: '6.9',
	                params: encodeURIComponent(JSON.stringify({
	                    intent: intent,
	                    mcmdf: 'inapp_mms'
	                }))
	            }, logargs);

	            var androidArgsArray = Object.keys(androidArgs).map(function (key) {
	                return [key, androidArgs[key]].join('=');
	            });
	            schema = 'baiduboxapp://utils?' + androidArgsArray.join('&');
	        })();
	    } else {
	        return Promise.reject();
	    }

	    return new Promise(function (resolve, reject) {
	        Box.schema(schema, function (t) {
	            if (t) {
	                if (Box.isAndroid) {
	                    deepLink().then(resolve, reject);
	                } else {
	                    reject();
	                }
	            } else {
	                resolve();
	            }
	        });
	    });
	}

	function deepLink() {

	    var intent = ['intent:#Intent', 'package=com.baidu.searchbox', 'action=com.baidu.searchbox.action.VOICESEARCH', 'category=android.intent.category.DEFAULT', 'S.search_source=api_mbaiducom_voice', 'S.source_app=' + encodeURIComponent('BROWSER'), 'S.referer=' + encodeURIComponent(location.href), 'end'].join(';');

	    return new Promise(function (resolve, reject) {
	        Box.schema(intent, function (t) {
	            if (t) {
	                reject();
	            } else {
	                resolve();
	            }
	        });
	    });
	}

	['voiceSearch', 'startRecognition', 'stopRecognition'].map(function (type) {
	    exports[type] = function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return invoke.apply(null, [type].concat(args));
	    };
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	/**
	 * @file 日志发送
	 * @author cxtom (cxtom2008@gmail.com)
	 */

	var list = [];

	function getToken() {
	    var time = new Date();
	    var rand = parseInt(Math.random() * 1000, 10);
	    if (rand < 10) {
	        rand = '00' + rand;
	    } else if (rand < 100) {
	        rand = '0' + rand;
	    }
	    return '' + time.getTime() + time.getMilliseconds() + rand;
	}

	var ACTION = 'http://vsclick.baidu.com/w.gif?';

	var token = getToken();

	var DEFAULT_DATA = {

	    ratio: window.screen.width + '*' + window.screen.height,

	    browser: Box.isBox ? 'bdbox' + Box.version : 'other',

	    // 不允许为默认值 -
	    url: location.href,

	    // 对应 nsclick 的 pid 概念。Nsclick 用 pid 将不同产品线的日志进行分割。
	    // 不允许为默认值 -
	    pid: 385,

	    // 比如 cat=home 表示人工编辑的首 页,cat=product 表示商品陈列页。
	    // 类比知 道 type 字段,type=2030 为检索页,2014 为问题页。
	    cat: 'voice-js-sdk',

	    // 在粒度上, cat > page > 具体 url。比如 cat=home&page= baby 表示 首页下的
	    // 母婴产品目录页。如果 cat 字段 符合层级结构,可以不使用此字段: cat=home-baby。
	    page: '-',

	    // 或者在某次实验中 记录特定的导流来源。粒度大于 refer。
	    fr: '-',

	    // 类似于大搜 索的 qid (query id)。应当由由后台生成, 保证前端日志和后端日志可以
	    // merge。 如 果系统不能生成,最简单的方法是用进入页 面的时间戳。
	    // 从页面发起的所有点击 pvid 一致,用于串联一次页面上的点击。
	    pvid: token,

	    // 一次 pv 下发出多个 request。每一个 request 用 rqid 唯一标识。
	    rqid: token,

	    // 用来 merge 大搜 索和中间页的点击日志。
	    // 不允许为默认值 -
	    qid: token,

	    // 大搜索的抽样 id,传导进入中间页
	    psid: '-',

	    // 如果由抽样平台统一接管, 则 psid = sid。
	    sid: '-',

	    // 搜索结果页、商品列表页翻页的次数
	    pn: '-',

	    // act=pv 表示页面加载, act=a[\w+]表示点击一个链接(离开本页)。
	    // act=b[\w+]表示在页面内的一个操作(筛选, 下拉菜单等,操作完毕后仍然停留在本页)。
	    // 一些重要的 b[\w+]操作可以单独列出。比如下单操作重要性高于筛选操作。
	    act: '-',

	    // 标识一些常用组件,在不同页面中保持稳定。通常可以 为页面 dom 元素的 id。
	    // 比如首页和商品页 都有 mod=recommend-left 的“热门商品推荐”。
	    mod: '-',

	    // 在微购中 item 对应商 品 id。在游戏中间页汇总,item 对应游戏 id。
	    item: '-',

	    // 类似于大搜索结果的 1~10 位。
	    p1: '-',

	    // 如果记录绝对 path 或者相对 path。
	    // 比如热门商品推荐在不同的不稳定,可以记录相对于 mod 的 xpath。
	    // 不允许为默认值 -
	    xpath: 'sdk',

	    // 参照大搜索的 f 字段, 如一次新的搜索来源是 sug, 主动改写,rs,ec
	    f: '-',

	    // 点击元素的文本(锚文字)
	    txt: '-',

	    // 用户的检索 query
	    q: '-',

	    // 其他不在通用字段中的结果 都可以用 dict 表示。比如微购产品页的地域 信息。
	    // 如果一个字段足够常用,再将它从 rsv 提升到固定字段中。
	    rsv: null
	};

	module.exports = function (data) {

	    data = _extends({}, DEFAULT_DATA, data);

	    // 某些浏览器在 Image 对象引用计数为 0 时，可能会 cancel 请求
	    // 所以通过闭包 list 持有引用
	    // 使用 document.createElement 比 new Image 更佳
	    var index = list.push(document.createElement('img')) - 1;

	    list[index].onload = list[index].onerror = function () {
	        list[index] = list[index].onload = list[index].onerror = null;
	        delete list[index];
	    };

	    if (null != data.rsv) {
	        data.rsv = JSON.stringify(data.rsv);
	    }

	    var url = ACTION + Object.keys(data).map(function (key) {
	        return key + '=' + (null == data[key] ? '' : encodeURIComponent(data[key]));
	    }).join('&');

	    // 新规范无时间戳字段上报，自动加上以防止缓存
	    list[index].src = url + '&' + (+new Date()).toString(36);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @file 提供事件相关操作的基类（观察者模式）
	 *       from er/Observable
	 * @author cxtom(cxtom2008@gmail.com)
	 */

	var guidKey = '_observerGUID';

	/**
	 * 提供与事件相关的操作的基类
	 *
	 * @class
	 */
	function Observer() {
	    this._events = {};
	}

	/**
	 * 注册一个事件处理函数
	 *
	 * @param {string} type 事件的类型，如果类型为`*`则在所有事件触发时执行
	 * @param {Function} handler 事件的处理函数
	 * @return {Object} Observer
	 * @public
	 */
	Observer.prototype.on = function (type, handler) {
	    if (!this._events) {
	        this._events = {};
	    }

	    var pool = this._events[type];
	    if (!pool) {
	        pool = this._events[type] = [];
	    }
	    if (!handler.hasOwnProperty(guidKey)) {
	        handler[guidKey] = +new Date();
	    }
	    pool.push(handler);
	    return this;
	};

	/**
	 * 注销一个事件处理函数
	 *
	 * @param {string} type 事件的类型，
	 * 如果值为`*`仅会注销通过`*`为类型注册的事件，并不会将所有事件注销
	 * @param {Function=} handler 事件的处理函数，
	 * 无此参数则注销`type`指定类型的所有事件处理函数
	 * @return {Object} Observer
	 * @public
	 */
	Observer.prototype.un = function (type, handler) {
	    if (!this._events) {
	        return;
	    }

	    if (!handler) {
	        this._events[type] = [];
	        return;
	    }

	    var pool = this._events[type];
	    if (pool) {
	        for (var i = 0; i < pool.length; i++) {
	            if (pool[i] === handler) {
	                pool.splice(i, 1);
	                // 当前Observer实现去重是在`fire`阶段做的，
	                // 因此可能通过`on`注册多个相同的handler，
	                // 所以继续循环，不作退出处理
	                i--;
	            }
	        }
	    }

	    return this;
	};

	/**
	 * 触发指定类型的事件
	 *
	 * 事件处理函数的执行顺序如下：
	 *
	 * 1. 如果对象上存在名称为`on{type}`的方法，执行该方法
	 * 2. 按照事件注册时的先后顺序，依次执行类型为`type`的处理函数
	 * 3. 按照事件注册时的先后顺序，依次执行类型为`*`的处理函数
	 *
	 * 关于事件对象，分为以下2种情况：
	 *
	 * - 如果`event`参数是个对象，则会添加`type`属性后传递给处理函数
	 * - 其它情况下，`event`参数的值将作为事件对象中的`data`属性
	 *
	 * 事件处理函数有去重功能，同一个事件处理函数只会执行一次
	 *
	 * @param {string=} type 事件类型
	 * @param {Object=} event 事件对象
	 * @public
	 */
	Observer.prototype.fire = function (type, event) {

	    // 无论`this._events`有没有被初始化，
	    // 如果有直接挂在对象上的方法是要触发的
	    var inlineHandler = this['on' + type];
	    if (typeof inlineHandler === 'function') {
	        inlineHandler.call(this, event);
	    }

	    if (!this._events) {
	        return;
	    }

	    // 到了这里，有`.fire(type)`和`.fire(type, event)`两种情况
	    if (event == null) {
	        event = {};
	    }
	    if (Object.prototype.toString.call(event) !== '[object Object]') {
	        event = { data: event };
	    }
	    event.type = type;
	    event.target = this;

	    var alreadyInvoked = {};
	    var pool = this._events[type];
	    if (pool) {
	        // 由于在执行过程中，某个处理函数可能会用`un`取消事件的绑定，
	        // 这可能导致循环过程中`i`的不准确，因此复制一份。
	        // 这个策略会使得在事件处理函数中把后续的处理函数取消掉在当前无效。
	        //
	        // NOTICE: 这个性能不高，有空再改改
	        pool = pool.slice();

	        for (var i = 0; i < pool.length; i++) {
	            var handler = pool[i];
	            if (!alreadyInvoked.hasOwnProperty(handler[guidKey])) {
	                handler.call(this, event);
	            }
	        }
	    }

	    // 类型为`*`的事件在所有事件触发时都要触发
	    if (type !== '*') {
	        var allPool = this._events['*'];
	        if (!allPool) {
	            return;
	        }

	        allPool = allPool.slice();

	        /* eslint-disable no-redeclare */
	        for (var _i = 0; _i < allPool.length; _i++) {
	            var _handler = allPool[_i];
	            if (!alreadyInvoked.hasOwnProperty(_handler[guidKey])) {
	                _handler.call(this, event);
	            }
	        }
	        /* eslint-enable no-redeclare */
	    }
	};

	module.exports = Observer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @file simple 组件
	 */

	var Observer = __webpack_require__(3);
	var Invoker = __webpack_require__(1);
	// import * as Util from './util';

	/* eslint-disable fecs-prefer-class */

	var DEFAULT_RECOGNIZERS = [{

	    condition: Box.isBox && (Box.isAndroid && Box.version_compare(Box.version, '7.3') >= 0 || Box.isIOS && Box.version_compare(Box.version, '7.5') >= 0),

	    start: function start(options, callback) {
	        /* eslint-disable fecs-camelcase */
	        // 安卓 8.0 以上改 SDK 以后，后台识别暂时有问题，退化为有 native 界面的识别
	        if (Box.isAndroid && Box.version_compare(Box.version, '7.7') >= 0 && +options.show_voiceUI === 0) {
	            options.show_voiceUI = 1;
	        }
	        /* eslint-enable fecs-camelcase */
	        return Invoker.startRecognition(options, callback);
	    },
	    stop: function stop(options, callback) {
	        // 安卓 8.0 以上改 SDK 以后，后台识别暂时有问题
	        // show_voiceUI 为 1 时不需要stop
	        if (Box.isAndroid && Box.version_compare(Box.version, '7.7') >= 0 || +options.show_voiceUI === 1) {
	            return Promise.resolve();
	        }
	        return Invoker.stopRecognition(options, callback);
	    },
	    process: function process() {
	        var isSDK = Box.version_compare(Box.version, '7.7');

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        if (Box.isAndroid) {

	            if (isSDK && args[0].data) {
	                var data = args[0].data;
	                return data.split('&').reduce(function (result, expression) {
	                    var t = expression.split('=');
	                    result[t[0]] = t[1];
	                    return result;
	                }, {});
	            }

	            return {
	                success: args[0]['0'],
	                isFinished: args[0]['1'],
	                result: args[0]['2']
	            };
	        } else if (Box.isIOS && args[2]) {
	            return {
	                success: args[0],
	                isFinished: args[1],
	                result: args[2]
	            };
	        }
	    }
	}];

	/**
	 * Recognizer
	 *
	 * @class
	 * @extend {Observer}
	 */
	function Recognizer(props) {

	    props = this.props = Box.extend({}, Recognizer.defaultProps, props);

	    this.onProcess = this.onProcess.bind(this);
	    this.onStop = this.onStop.bind(this);

	    this.current = this.getCurrent();

	    Observer.call(this);
	}

	Recognizer.prototype = Box.extend({}, Observer.prototype, {
	    add: function add(item) {
	        this.props.items.push(item);
	    },
	    start: function start() {
	        return this.current.start(this.props.pluginOptions, this.onProcess);
	    },
	    stop: function stop() {
	        return this.current.stop(this.props.pluginOptions, this.onStop);
	    },
	    getCurrent: function getCurrent() {

	        var current = this.props.items.filter(function (item) {
	            return item.condition;
	        });

	        if (!current.length) {
	            throw Error('当前浏览器暂不支持识别，可以通过接口添加该能力！');
	        }

	        return current[0];
	    },
	    onProcess: function onProcess() {
	        var _current;

	        var result = (_current = this.current).process.apply(_current, arguments);

	        this.fire('recognizing', {
	            target: this,
	            data: result
	        });

	        if (result.isFinished && result.success) {
	            this.fire('recognized', {
	                target: this,
	                data: result
	            });
	        } else if (!result.success) {
	            this.fire('error', {
	                target: this,
	                data: result
	            });
	        }
	    },
	    onStop: function onStop() {
	        this.fire('stop');
	    }
	});

	/* eslint-disable fecs-camelcase */

	Recognizer.defaultProps = {

	    items: DEFAULT_RECOGNIZERS,

	    pluginOptions: {

	        /**
	         * 是否弹出上屏页
	         *
	         * @type {number} 0 or 1
	         */
	        show_voiceUI: 0
	    }

	};

	/* eslint-enable fecs-camelcase */

	module.exports = Recognizer;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.exposeFn = exposeFn;
	exports.objectWithoutProperties = objectWithoutProperties;
	exports.getBDID = getBDID;
	exports.getBrowser = getBrowser;
	/**
	 * @file 工具函数
	 */

	/* global Box */
	/* eslint-disable fecs-valid-map-set, fecs-use-for-of */

	var ua = navigator.userAgent;

	var exposedFunctions = {};

	/**
	 * 将函数暴露到全局
	 *
	 * @param  {Function} fn 函数
	 * @return {string}      生成的函数民称
	 */
	function exposeFn(fn) {

	    if (!Box.isFunction(fn)) {
	        return;
	    }

	    var keys = Object.keys(exposedFunctions);
	    for (var i = 0, len = keys.length; i < len; i++) {
	        if (exposedFunctions[keys[i]] === fn) {
	            return keys[i];
	        }
	    }

	    var fnName = '_bdbox_js_voice_' + Box.getId();

	    window[fnName] = function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        fn.apply(window, args);
	    };

	    exposedFunctions[fnName] = fn;

	    return fnName;
	}

	function objectWithoutProperties(obj, keys) {
	    var target = {};

	    for (var i in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, i) && keys.indexOf(i) < 0) {
	            target[i] = obj[i];
	        }
	    }

	    return target;
	}

	function getBDID() {
	    var cookie = document.cookie.split(';');
	    var BAIDUID = '';
	    cookie.forEach(function (val, ind) {
	        if (val.split('=')[0].trim() === 'BAIDUID') {
	            var bcookie = val.split('=')[1] + '';
	            BAIDUID = bcookie.substr(bcookie.Length - 1).split(':')[0];
	        }
	    });
	    return BAIDUID;
	}

	function getBrowser() {
	    var browser = '';

	    var common = {
	        UCBrowser: 'UCBrowser',
	        QQBrowser: 'QQBrowser',
	        baidubrowser: 'baidubrowser',
	        SogouMobileBrowser: 'SogouMobileBrowser'
	    };

	    var iosUa = Box.extend({}, common, {
	        CriOS: 'Chrome',
	        OPiOS: 'OPRBrowser'
	    });

	    var androidUa = Box.extend({}, common, {
	        OPR: 'OPRBrowser',
	        MiuiBrowser: 'MiuiBrowser',
	        HUAWEI: 'HUAWEIBrowser'
	    });

	    if (Box.isIOS) {
	        Object.keys(iosUa).forEach(function (n) {
	            if (ua.indexOf(iosUa[n]) !== -1) {
	                browser = n;
	                return false;
	            }
	        });
	        browser = browser ? browser : 'Safari';
	    } else if (Box.isAndroid) {
	        Object.keys(androidUa).forEach(function (y) {
	            if (ua.indexOf(androidUa[y]) !== -1) {
	                browser = y;
	                return false;
	            }
	        });
	        if (ua.indexOf('360 Aphone Browser') !== -1) {
	            browser = '360AphoneBrowser';
	        }
	        browser = browser ? browser : 'origin';
	    }
	    return browser;
	}

	/**
	 * 是否是百度浏览器
	 *
	 * @type {bool}
	 */
	var isBaiduBrowser = exports.isBaiduBrowser = /baidubrowser\//.test(ua);

/***/ }
/******/ ])
});
;