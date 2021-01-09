/*
 * License:  see License.txt
 * Code for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */






/*

TODO


*/
var EXPORTED_SYMBOLS = ["imageview"];

var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");



var imageview = {
  WL: {},
  PrefBranch: function PrefBranch() {
  return Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefBranch);
},
  
  getMainWindowElement: function getMainWindowElement (id) {
    let mainWindow=Services.wm.getMostRecentWindow("mail:3pane");
    return mainWindow.document.getElementById(id);

  },

  showDownloadThumbnail: true

  

};


