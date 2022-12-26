(function (d, w) {
  let iframe = d.createElement('iframe'),
    src = new URL(d.currentScript.src),
    s = d.createElement('link');
  s.setAttribute('rel', 'stylesheet'),
    s.setAttribute('id', 'chatts__stylesheet'),
    s.setAttribute('href', `${src.origin}/widget.css`),
    d.head.appendChild(s),
    (iframe.id = 'chatts__container'),
    (iframe.setAttribute('allow', 'autoplay; fullscreen *;'),
    (iframe.setAttribute('allowtransparency', true),
    iframe.setAttribute('src', 'http://localhost:3000/chat-widget'),
    // (iframe.src = 'http://localhost:3000/chat-widget'),
    d.body.appendChild(iframe))),
    iframe.classList.add('chatts__compress_style');
  function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
      element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, eventHandler);
    }
  }
  let post_message = function (message) {
    iframe.contentWindow.postMessage(message, 'http://localhost:3000');
  };
  iframe.contentWindow.postMessage('loaded', '*');
  bindEvent(w, 'load', function (e) {
    post_message('loaded');
  });
  bindEvent(w, 'message', function (e) {
    if (e.data !== 'chatts__loaded') return;
    iframe.classList.toggle('chatts__compress_style');
    iframe.classList.toggle('chatts__expand_style');
  });
})(document, window);
