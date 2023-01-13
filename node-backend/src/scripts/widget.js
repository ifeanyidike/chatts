(function (d, w) {
  console.log(w.location);
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
    iframe.setAttribute(
      'src',
      `http://localhost:3000/chat-widget?key=${w.key}&location=${window.location.origin}`
    ),
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

  window.addEventListener('load', () => {
    iframe.contentWindow.postMessage('loaded', src.origin);
  });
  // let post_message = function (message) {
  //   iframe.contentWindow.postMessage(message, src.origin);
  // };
  // post_message('received');
  // iframe.contentWindow.postMessage('loaded', src.origin);
  // bindEvent(w, 'load', function (e) {
  //   post_message('loaded');
  // });
  // const frameElement = document.getElementById('chatts__container');
  // console.log({ frameElement });

  bindEvent(w, 'message', function (e) {
    if (e.data !== 'chatts__loaded') return;

    iframe.classList.toggle('chatts__compress_style');
    iframe.classList.toggle('chatts__expand_style');
  });
})(document, window);
