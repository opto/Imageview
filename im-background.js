/*
 * License:  see License.txt

 * Code  for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */

// Keep track of attachment data per message, as we currently cannot get the attachment
// from the message directly
var attachmentData = {};

// Register listener for info popups on install/update.
messenger.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  if (temporary) {
    // skip during development
    return; 
  }
  
  switch (reason) {
    case "install":
    {
      const url = messenger.runtime.getURL("popup/installed.html");
      await messenger.windows.create({ url, type: "popup", height: 680, width: 900, });
    }
    break;
    
    case "update":
    {
      const url = messenger.runtime.getURL("popup/update.html");
      await messenger.windows.create({ url, type: "popup", height: 680, width: 990, });
    }
    break;
  }
});

// Activate/Deativate or button depending of included images
messenger.messageDisplay.onMessageDisplayed.addListener( async (tab, message) => {
  // console.log(`Message displayed in tab ${tab.id}: ${message.subject}`);
  
  let data = await messenger.Utilities.attachmentGetImages(tab.windowId);
  if (data.length == 0) {
    messenger.messageDisplayAction.disable(tab.tabID);
  } else {
    messenger.messageDisplayAction.enable(tab.tabID);
  };
});

messenger.messageDisplayAction.onClicked.addListener(async (tab, info) => {  
  let data = await messenger.Utilities.attachmentGetImages(tab.windowId, {populate: true});
  if (data.length == 0) {
    messenger.messageDisplayAction.disable(tab.tabID);
    return;
  }
  
  // get displayed message and store the attachment data of this message
  let message = await messenger.messageDisplay.getDisplayedMessage(tab.id);
  // store the attachment Data in the background page, per message
  attachmentData[message.id] = data;
  
  // get dimensions from main window to calculate matching size of image viewer popup
  let mainWnd = await messenger.windows.getLastFocused();
  let popupWidth = parseInt( 0.89 * mainWnd.width);
  let popupHeight = parseInt(  0.92*mainWnd.height);
  
  // This window should be bound to the message (and its attachments) and not to the window, 
  // using the windowId as reference information seems wrong, we need to connect the popup 
  // with the attachmentData directly
  messenger.windows.create({
    allowScriptsToClose: true, 
    url: `./popup/imgview.html?messageId=${message.id}`,
    height: popupHeight, 
    width: popupWidth, 
    type: "popup"
  });
});

// communication with other parts of the add-on, for eample to gain access to the attachmentData
messenger.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.msg) {
    case "getAttachmentData":
      sendResponse(attachmentData[request.messageId]);
      delete attachmentData[request.messageId];
      break;
  }
});


/*
async function main() {
  messenger.WindowListener.registerDefaultPrefs("chrome/content/scripts/im-defaults.js");
  messenger.WindowListener.registerChromeUrl([ 
    ["content", "imageview", "chrome/content/"],
     ]);

  messenger.WindowListener.registerWindow("chrome://messenger/content/messenger.xhtml", "chrome/content/scripts/im-messenger.js");
  messenger.WindowListener.registerWindow("chrome://mozapps/content/downloads/unknownContentType.xhtml", "chrome/content/scripts/im-download.js");
  messenger.WindowListener.startListening();
}

main();
*/