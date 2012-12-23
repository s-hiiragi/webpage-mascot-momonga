/**
 * background通信用ラッパーモジュール (background側)
 * 
 * Usage:
 *   //-- background.js
 *   
 *   bg.startup();  // 初期化
 *   bg.add_method('do_hoge', function(param, callback) {
 *       console.log(param);  // 100
 *       callback(param * 2);
 *   });
 *   
 *   //-- content_script.js
 *   
 *   bg.startup(function(){
 *       bg.do_hoge(100, function(res){
 *           console.log(res);  // 200
 *       });
 *   });
 * 
 * 処理の流れ:
 * 
 * bg.
 */
(function() {
	var global_ = Function('return this;')();
	var bg = global_.bg = {};
	
	/**
	 * 何もしないハンドラ
	 */
	bg.null_handler = function null_handler() {};
	
	var handlers = {};
	handlers._default = bg.null_handler;
	bg._handlers = handlers;
	
	// 用意されているメソッドをbg.メソッド名で呼べるようにする
	// _で始まるメソッドは呼び出せない (隠蔽される)
	handlers._startup = function startup_handler(params, callback) {
		var names = Object.getOwnPropertyNames(handlers)
			.filter(function(name) {
				return (name[0] !== '_');
			});
		callback(names);
	};
	
	// Chrome API sendRequestハンドラ
	function request_handler(req, sender, sendRes) {
		var msg = req.msg, 
			params = req.params;
		
		if (msg in handlers) {
			handlers[msg](params, sendRes);
		} else {
			handlers._default(params, sendRes);
		}
	}
	
	
	/**
	 * 処理を登録
	 * @param  {string}  name
	 * @param  {function}  method
	 */
	bg.add_method = function bg_add_method(name, method) {
		handlers[name] = method;
	};
	
	/**
	 * 処理を一度に登録
	 * @param  {object}  methods
	 *   { name : method }
	 */
	bg.add_methods = function bg_add_methods(methods) {
		for (var name in methods) {
			handlers[name] = methods[name];
		}
	};
	
	/**
	 * 初期化処理
	 *   ・用意されているメソッドをbg.メソッド名で呼べるようにする
	 */
	bg.startup = function bg_startup() {
		delete this.startup;  // 1度だけ呼べる
		
		chrome.extension.onRequest.addListener(request_handler);
	};
	
})();
