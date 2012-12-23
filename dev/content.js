/**
 * @name         content.js
 * @author       s_hiiragi
 */

var img = document.createElement('img');
img.src = chrome.extension.getURL('resources/momonga120.png');
img.style.cssText = [
		'position: fixed', 
		'right: 0px', 
		'bottom: -3px', 
		'margin: 0px', 
		'padding: 0px', 
		'border: 0px', 
		'background-color: rgba(0, 0, 0, 0)', 
		'z-index: -1'
	].join('; ');
document.body.appendChild(img);

img.onload = function () {
	div.style.width = img.width + 'px';
	div.style.height = img.height + 'px';
};

var div = document.createElement('div');
div.style.cssText = [
		'position: fixed', 
		'right: 0px', 
		'bottom: -3px', 
		'margin: 0px', 
		'padding: 0px', 
		'border: 0px', 
		'background-color: rgba(255, 0, 0, 0)', 
		'z-index: 65535'
	].join('; ');
document.body.appendChild(div);

div.onclick = function () {
	//console.debug('div.onclick');
	
	var scroll_y = window.scrollY;
	$('<div/>')
		.animate({opacity: 0}, {
			step: function (progress) {
				//console.debug('animate.step ' + progress);
				
				window.scrollTo(window.scrollX, scroll_y * progress);
			}
		});
};