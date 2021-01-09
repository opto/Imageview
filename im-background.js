/*
 * License:  see License.txt

 * Code  for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */



/*
 * Documentation:
 * https://github.com/thundernest/addon-developer-support/wiki/Using-the-WindowListener-API-to-convert-a-Legacy-Overlay-WebExtension-into-a-MailExtension-for-Thunderbird-78
 */

var noticeWnd, imageCode =[], imgNames = [], no_img=0, no_found = 0, imageReady = [], popupWidth = 800, popupHeight = 600;

function displayPopup() {
    messenger.windows.create({url: "./popup/imgview.html", height: popupHeight,  width: popupWidth,  type: "popup"});

};
messenger.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
 // if (temporary) return; // skip during development
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



async function main() {
    messenger.WindowListener.registerDefaultPrefs("chrome/content/scripts/im-defaults.js");
    

    messenger.WindowListener.registerChromeUrl([ 
        ["content", "imageview", "chrome/content/"],
 //       ["locale", "imageview", "en-US", "chrome/locale/en-US/"],
  //      ["locale", "quickfolders", "ca", "chrome/locale/ca/"],
//        ["locale", "imageview", "de", "chrome/locale/de/"],
  /*      ["locale", "quickfolders", "es-MX", "chrome/locale/es-MX/"],
        ["locale", "quickfolders", "es", "chrome/locale/es/"],
        ["locale", "quickfolders", "fr", "chrome/locale/fr/"],
        ["locale", "quickfolders", "hu-HU", "chrome/locale/hu-HU/"],
        ["locale", "quickfolders", "it", "chrome/locale/it/"],
        ["locale", "quickfolders", "ja-JP", "chrome/locale/ja-JP/"],
        ["locale", "quickfolders", "nl", "chrome/locale/nl/"],
        ["locale", "quickfolders", "pl", "chrome/locale/pl/"],
        ["locale", "quickfolders", "pt-BR", "chrome/locale/pt-BR/"],
        ["locale", "quickfolders", "ru", "chrome/locale/ru/"],
        ["locale", "quickfolders", "sl-SI", "chrome/locale/sl-SI/"],
        ["locale", "quickfolders", "sr", "chrome/locale/sr/"],
        ["locale", "quickfolders", "sv-SE", "chrome/locale/sv-SE/"],
        ["locale", "quickfolders", "vi", "chrome/locale/vi/"],
        ["locale", "quickfolders", "zh-CN", "chrome/locale/zh-CN/"],
        ["locale", "quickfolders", "zh-CHS", "chrome/locale/zh-CN/"],
        ["locale", "quickfolders", "zh", "chrome/locale/zh/"],
        ["locale", "quickfolders", "zh-CHT", "chrome/locale/zh/"],
        ["locale", "quickfolders", "zh-TW", "chrome/locale/zh/"]
    */
       ]);

 
 //   messenger.WindowListener.registerOptionsPage("chrome://imageview/content/edit_prefs.xhtml"); 
    
 //attention: each target window (like messenger.xul) can appear only once
 // this is different from chrome.manifest
 // xhtml for Tb78
     messenger.WindowListener.registerWindow("chrome://messenger/content/messenger.xhtml", "chrome/content/scripts/im-messenger.js");

     messenger.WindowListener.registerWindow("chrome://mozapps/content/downloads/unknownContentType.xhtml", "chrome/content/scripts/im-download.js");

 /* 
  
    messenger.WindowListener.registerStartupScript("chrome/content/scripts/qf-startup.js");
    messenger.WindowListener.registerShutdownScript("chrome/content/scripts/qf-shutdown.js");
*/
 /*
  * Start listening for opened windows. Whenever a window is opened, the registered
  * JS file is loaded. To prevent namespace collisions, the files are loaded into
  * an object inside the global window. The name of that object can be specified via
  * the parameter of startListening(). This object also contains an extension member.
  */


    messenger.WindowListener.startListening();
 /*   */
    messenger.messageDisplay.onMessageDisplayed.addListener( async (tab, message) => {
     // console.log(`Message displayed in tab ${tab.id}: ${message.subject}`);
      no_img = 0; //don't know yet how many images

      no_img = await messenger.Utilities.attachmentHasImages();
     // console.log( no_img);
      if ( no_img) {
        messenger.messageDisplayAction.enable(tab.tabID);

      } else {
        messenger.messageDisplayAction.disable(tab.tabID);

      };
      let i = 0;
      for (i = 0; i < no_img; i++) {
         imageReady[i]= false;
         imgNames[i]= "";
         imageCode[i]= "";
      }
   
      });

      /*
      messenger.browserAction.onClicked.addListener(async (tab, info) => {

   
       let page =  messenger.extension.getBackgroundPage();
        console.log(page.imageCode);
  //      let num = await messenger.Utilities.attachmentHasImages();
   //     console.log(num);
  //      messenger.windows.create({url: "./popup/imageview.html", type: "popup"});
    //    if ()
      });
 */      
  messenger.runtime.onMessage.addListener((msg)=>{
        //console.log(msg);
        //console.log(noticeWnd);
        if (msg.msg == "close loading")  messenger.windows.remove(noticeWnd.id);
    });

   messenger.messageDisplayAction.onClicked.addListener(async (tab, info) => {
      //console.log("button");

      noticeWnd = await messenger.windows.create({allowScriptsToClose: true, url: "./popup/loading.html"  , titlePreface: "loading images", height: 100,  width: 300,  type: "popup"});

 
      let mainWnd = await  messenger.windows.getLastFocused();
  //      console.log("mainWnd "+ mainWnd.height + " " +mainWnd.width + " " + mainWnd.type);
      popupWidth = parseInt( 0.89 * mainWnd.width);
      popupHeight = parseInt(  0.92*mainWnd.height);
      // console.log(popupWidth, popupHeight);
  
  
       no_found = 0;
       await messenger.Utilities.getImage();
      //console.log(num);
      // created after  getimage     messenger.windows.create({url: "./popup/imageview.html", type: "popup"});
    });
/**/  
}

main();
