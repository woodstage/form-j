(function(){
  var node;
  var url = chrome.runtime.getURL('index.html');

  function addNode() {
    node = document.createElement('iframe');
    node.id = 'form_j';
    node.setAttribute('src', url);
    node.style.position = 'fixed';
    node.style.top = '100px';
    node.style.right = '50px';
    node.style.width = '240px';
    node.style.height = '450px';
    document.body.appendChild(node);
  }

  function removeNode() {
    if (node) {
      node.parentNode.removeChild(node);
      node = undefined;
    }
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.action == 'TOGGLE_MENU') {
      if (document.querySelector('iframe#form_j')) {
        removeNode();
        cleanup();
      } else {
        addNode();
        detectForms();
      }
      sendResponse({farewell: "goodbye"});
    }
  });

  var origin = url.substr(0, url.lastIndexOf('/'));

  function sendMsg(msg) {
    node && node.contentWindow.postMessage(msg, origin);
  }

  function handleMsg(msg) {
    if (msg && msg.origin === origin) {
      switch(msg.data.action) {
        case 'DETECT_FORMS_REQ': detectForms(); break;
        default: break;
      }
    }
  }

  window.addEventListener('message', handleMsg, false);

  var buttons = [];
  function cleanup() {
    if (buttons.length) {
      buttons.forEach(function(b, index){
        if (b.onclicklistener) {
          b.removeEventListener('click', b.onclicklistener);
          b.onclicklistener = null;
        }
        b.parentNode && b.parentNode.removeChild && b.parentNode.removeChild(b);
        b = null;
      })
      buttons.splice(0, buttons.length);
    }
    var forms = document.querySelectorAll('form');
    for(var i = 0; i < forms.length; i++) {
      forms[i].classList.remove('form_j');
    }  
  }
  function detectForms() {
    cleanup();
    var forms = document.querySelectorAll('form');
    for(var i = 0; i < forms.length; i++) {
      var id;
      var form = forms[i];
      form.classList.add('form_j');
      if (!form.getAttribute('form_j_id')) {
        id = form.id || form.name || i;
        form.setAttribute('form_j_id', id);
      }
      var button = document.createElement('button');
      button.innerText = 'Add';
      button.type = 'button';
      button.classList.add("form_pickup");
      button.onclicklistener = function(event) {
        var elements = form.querySelectorAll('input[type=text], input[type=tel], input[type=password], input[type=email], input[type=radio], input[type=checkbox], select')
        ;
        var obj = {};
        for( var j = 0; j < elements.length; j++ ) {
          var element = elements[j];
          var name = element.name;
          var value = element.value;
          if(name) {
            obj[name] = value;
          }
          sendMsg({action: 'ADD_FORM', payload: {id: id, formdata: obj}});
        }
      }
      button.addEventListener('click', button.onclicklistener);
      buttons.push(button);
      form.appendChild(button);
    }
  }

})()

