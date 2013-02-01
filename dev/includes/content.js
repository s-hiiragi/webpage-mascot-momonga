/**
 * @name     content.js
 * @author   s_hiiragi, ne_Sachirou
 * @license  MIT
 */
(function () {

var file, reader, requestAnimationFrame, img, div,
    isChrome = false,
    isOpera = false;
try {  isChrome = chrome && true; } catch (err) {}
try {  isOpera = opera && true; } catch (err) {}
if (window.requestAnimationFrame) requestAnimationFrame = window.requestAnimationFrame;
else if (window.webkitRequestAnimationFrame) requestAnimationFrame = window.webkitRequestAnimationFrame;
else if (window.mozRequestAnimationFrame) requestAnimationFrame = window.mozRequestAnimationFrame;
else if (window.msRequestAnimationFrame) requestAnimationFrame = window.msRequestAnimationFrame;
else if (window.oRequestAnimationFrame) requestAnimationFrame = window.oRequestAnimationFrame;
else if (window.khtmlRequestAnimationFrame) requestAnimationFrame = window.khtmlRequestAnimationFrame;

/**
 * @param {function(tick:number)} callback
 * @return {function()}
 */
function animate (callback) {
  var stop, timerID,
      isStopped = false;;

  function animationFun () {
    if (isStopped) return;
    callback();
    requestAnimationFrame(animationFun);
  }

  if (requestAnimationFrame) {
    requestAnimationFrame(animationFun);
    stop = function () { isStopped = true; };
  } else {
    timerId = setInterval(callback, 1000 / 60);
    stop = function () { clearInterval(timerId); };
  }
  return stop;
}

img = document.createElement('img');
img.onload = function () {
  div.style.width = img.width + 'px';
  div.style.height = img.height + 'px';
};
if (isChrome) {
  img.src = chrome.extension.getURL('resources/momonga120.png');
} else if (isOpera) {
  file = opera.extension.getFile('/resources/momonga120.png');
  reader = new FileReader();
  reader.onload = function () { img.src = reader.result; };
  reader.readAsDataURL(file);
}
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
window.document.body.appendChild(img);

div = window.document.createElement('div');
div.style.cssText = [
    'position: fixed',
    'right: 0',
    'bottom: -1pt',
    'margin: 0',
    'padding: 0',
    'border: 0',
    'background-color: rgba(255, 0, 0, 0)',
    'z-index: 65535'
  ].join('; ');
window.document.body.appendChild(div);

div.onclick = function () {
  var stop, diff,
      scrollY = window.scrollY;

  diff = scrollY / 30;
  stop = animate(function (tick) {
    if (scrollY <= 0) stop();
    scrollY -= diff;
    window.scrollTo(window.scrollX, scrollY);
  });
};

}());
