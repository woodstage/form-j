(function() {
  var node;
  var url = chrome.runtime.getURL("index.html");
  var origin = url.substr(0, url.lastIndexOf("/"));
  let intervalHandle;

  function sendMsg(msg) {
    node && node.contentWindow.postMessage(msg, origin);
  }

  function handleMsg(msg) {
    if (msg && msg.origin === origin) {
      switch (msg.data.action) {
        case "TOGGLE_FORM_HIGHLIGHT":
          toggleFormHighlight(msg.data.payload);
          break;
        default:
          break;
      }
    }
  }

  const toggleFormHighlight = data => {
    document
      .querySelectorAll("form")
      [data.id].classList.toggle("form_j_highlight");
  };

  window.addEventListener("message", handleMsg, false);

  function toggleControlPanel() {
    if (node) {
      node.classList.toggle("form_j_ctrl_panel_hidden");
    } else {
      node = document.createElement("iframe");
      node.id = "form_j";
      node.src = url;
      node.style.position = "fixed";
      node.style.top = "0";
      node.style.right = "0";
      node.style.width = "300px";
      node.style.height = "100vh";
      node.style.border = "none";
      node.style["background-color"] = "rgba(255, 255, 255, 0.6)";
      node.style["z-index"] = 999999;
      document.body.appendChild(node);
    }
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );
    if (request.action == "TOGGLE_MENU") {
      clearInterval(intervalHandle);
      intervalHandle = setInterval(detect, 1000);
      if (!document.querySelector("iframe#form_j")) {
        toggleControlPanel();
        node.onload = () => detect();
      } else {
        toggleControlPanel();
      }
      sendResponse({ farewell: "goodbye" });
    }
  });

  function detect() {
    const forms = document.querySelectorAll("form");
    const formsData = Array.prototype.map
      .call(forms, (f, i) => ({
        id: f.id || f.name || i,
        idType: f.id ? "id" : f.name ? "name" : "index",
        data: Array.prototype.map.call(
          f.querySelectorAll(
            "input[type=text], input[type=tel], input[type=password], input[type=email], input[type=radio], input[type=checkbox], select"
          ),
          n => ({
            name: n.name,
            value: n.value
          })
        )
      }))
      .filter(f => f.data.length > 0);
    sendMsg({ action: "FORMS_DATA", payload: formsData });
  }
})();
