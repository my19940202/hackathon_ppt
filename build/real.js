/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Cannot find module './_baseClone'\n    at Function.Module._resolveFilename (module.js:455:15)\n    at Function.Module._load (module.js:403:25)\n    at Module.require (module.js:483:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/baidu/Documents/mywork/git_project/chat_robot/node_modules/lodash/cloneDeep.js:1:79)\n    at Module._compile (module.js:556:32)\n    at Object.Module._extensions..js (module.js:565:10)\n    at Module.load (module.js:473:32)\n    at tryModuleLoad (module.js:432:12)\n    at Function.Module._load (module.js:424:3)\n    at Module.require (module.js:483:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/baidu/Documents/mywork/git_project/chat_robot/node_modules/babel-template/lib/index.js:57:18)\n    at Module._compile (module.js:556:32)\n    at Object.Module._extensions..js (module.js:565:10)\n    at Module.load (module.js:473:32)\n    at tryModuleLoad (module.js:432:12)\n    at Function.Module._load (module.js:424:3)\n    at Module.require (module.js:483:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/baidu/Documents/mywork/git_project/chat_robot/node_modules/babel-helpers/lib/helpers.js:5:22)\n    at Module._compile (module.js:556:32)\n    at Object.Module._extensions..js (module.js:565:10)\n    at Module.load (module.js:473:32)\n    at tryModuleLoad (module.js:432:12)\n    at Function.Module._load (module.js:424:3)\n    at Module.require (module.js:483:17)\n    at require (internal/module.js:20:19)\n    at Object.<anonymous> (/Users/baidu/Documents/mywork/git_project/chat_robot/node_modules/babel-helpers/lib/index.js:12:16)\n    at Module._compile (module.js:556:32)");

/***/ })
/******/ ]);