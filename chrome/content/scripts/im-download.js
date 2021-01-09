
/*
 * License:  see License.txt
 * Code for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */



 var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
Services.scriptloader.loadSubScript("chrome://imageview/content/imageview.jsm", window, "UTF-8");


Services.scriptloader.loadSubScript("chrome://imageview/content/download.js", window, "UTF-8");

function onLoad(activatedWhileWindowOpen) {
 //    console.log("imageview Download");
 debugger;
 let prefs = window.imageview.PrefBranch();
 window.imageview.showDownloadThumbnail =  prefs.getBoolPref("extensions.imageview.showDownloadThumbnail");
 if (window.imageview.showDownloadThumbnail)   window.StartThumb();
}

function onUnload(isAddOnShutDown) {
  console.log("imageview-download onUnload");
  Components.classes["@mozilla.org/xre/app-info;1"].
  getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
}
