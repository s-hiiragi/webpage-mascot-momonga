/**
 * background通信用ラッパーモジュール
 * 
 * TODO
 * ・hoge(a, b, callback)形式で呼び出せるようにする
 */
(function() {
	var global_ = Function('return this')();
	var bg = global_.bg = {};
	
	/**
	 * backgroundの処理を呼び出す
	 */
	bg.request = function bg_request(msg, params, callback) {
		var data = {
			msg : msg, 
			params : params || {}
		};
		
		if (callback) {
			chrome.extension.sendRequest(data, callback);
		} else {
			chrome.extension.sendRequest(data);
		}
	};
	
	/**
	 * 初期化処理
	 *   ・用意されているメソッドをbg.メソッド名で呼べるようにする
	 */
	bg.startup = function bg_startup(callback) {
		delete this.startup;  // 1度だけ呼べる
		
		bg.request('_startup', {}, function(methods) {
			methods.forEach(function(name) {
//				bg[name] = Function('return function bg_' + m.name + '() {}')();
				bg[name] = (function(name) {
					return function bg_anonymous_method(params, callback) {
						bg.request(name, params, callback);
					};
				})(name);
			});
			
			callback();
		});
	};
})();
