/**
 * @name   background.js
 * @author s_hiiragi
 */

chrome.runtime.onInstalled.addListener(
    function()
{
  console.log('onInstalled');
  console.log(new Date());
});

chrome.runtime.onStartup.addListener(
    function()
{
  console.log('onStartup');
  console.log(new Date());
});

console.log(new Date());

chrome.extension.onMessage.addListener(function (req, sender, res)
{
  console.log(req);
  
  switch (req.message) {
  default:
    res(null);
    break;
  }
});

var props = {
    'id' : 'hide_mascot', 
    'title' : 'ももんがを隠す', 
    'contexts' : ['link'], 
    'targetUrlPatterns' : [
      chrome.extension.getURL('dummy/mascot')
    ]
  };
chrome.contextMenus.create(props);

chrome.contextMenus.onClicked.addListener(function (info, tab)
{
  console.log(info, tab);
  
  switch (info.menuItemId) {
  case 'hide_mascot':
    chrome.tabs.sendMessage(tab.id, {message: 'hide_mascot'}, function (info) {
      console.log(info);
    });
    break;
  }
});

fetch_rss();
chrome.alarms.create({
  delayInMinutes: 1, 
  periodInMinutes: 10
});
chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log(alarm);
  fetch_rss();
});

function fetch_rss() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://blog.livedoor.jp/geek/index.rdf', false);
  xhr.send(null);
  if (xhr.status != 200) {
    console.log(xhr.status);
    return;
  }
  console.log(xhr);
  
  var rdf = xhr.responseXML;
  var items = Array.prototype.slice.call(rdf.querySelectorAll('item'))
    .map(function (e) {
      return {
        title: e.querySelector('title').textContent, 
        url: e.querySelector('link').textContent
      };
    });
  
  chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT
      , { populate: true }, function(window)
  {
    window.tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, { message: 'dispatch-rss', items: items });
    });
  });
  
  items.forEach(function (e) {
    console.log(e.title);
  });
}
