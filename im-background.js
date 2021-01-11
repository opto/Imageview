/*
 * License:  see License.txt

 * Code  for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */

// Keep track of attachment data per message, as we currently cannot get the attachment
// from the message directly.
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

// Activate/Deativate our button depending on included images.
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
  // show a loading screen, while we wait fort the images to be loaded
  let loadingScreen = await messenger.windows.create({url: "./popup/loading.html", titlePreface: "ImageViewer: ", height: 120,  width: 340,  type: "popup"});
  
  let data = await messenger.Utilities.attachmentGetImages(tab.windowId, {populate: true});
  if (data.length == 0) {
    messenger.messageDisplayAction.disable(tab.tabID);
    return;
  }
  
  // Get displayed message and store the attachment data of this message.
  let message = await messenger.messageDisplay.getDisplayedMessage(tab.id);
  // store the attachment Data in the background page, per message
  attachmentData[message.id] = data;
  
  // Get dimensions from main window to calculate matching size of image viewer popup.
  let mainWnd = await messenger.windows.getLastFocused();
  let popupWidth = parseInt( 0.89 * mainWnd.width);
  let popupHeight = parseInt(  0.92*mainWnd.height);
  
  // remove loading screen
  messenger.windows.remove(loadingScreen.id);
  
  // The popup window should be bound to the message (and its attachments) and not to the
  // current main window. Using the windowId as reference information seems wrong, we need
  // to connect the popup with the message directly and allow the popup to get the attachments
  // from the provided message.
  messenger.windows.create({
    allowScriptsToClose: true, 
    url: `./popup/imgview.html?messageId=${message.id}`,
    height: popupHeight, 
    width: popupWidth, 
    type: "popup"
  });
});

// Communication with other parts of the add-on, for example to gain access to the
// attachmentData for a given messageId.
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