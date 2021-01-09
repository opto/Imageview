
/*
 * License:  see License.txt
 * Code for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */



 /* eslint-disable object-shorthand */

var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var {NetUtil} =   ChromeUtils.import("resource://gre/modules/NetUtil.jsm");
var win = Services.wm.getMostRecentWindow("mail:3pane"); 

function StreamListener  (index) {
  return {
    _data: "",
    _stream: null,

    QueryInterface: ChromeUtils.generateQI([
      Ci.nsIStreamListener,
      Ci.nsIRequestObserver,
    ]),

    onStartRequest(aRequest) {},
    onStopRequest(aRequest, aStatusCode) {
      try {
        let bPage = win.imageview.WL.messenger.extension.getBackgroundPage();
        bPage.imageCode[index] = this._data;
        bPage.no_found++;
        bPage.imageReady [index] =true;
        //displaying first image/slide. Hoping all did arrive in background whhen user chooses next image
  //   if (index==0)  win.imageview.WL.messenger.windows.create({url: "./popup/imageview.html", type: "popup"});
 //        if (index==0)  win.imageview.WL.messenger.windows.create({url: "./popup/viewerjs/docs/examples/custom-title.html", state: "maximized",  type: "popup"});
         if (bPage.no_found==bPage.no_img)  bPage.displayPopup();
         //TODO what if not all are found?

         //if (index==0)  bPage.displayPopup();
         
          
      } catch (e) {
      }
    },

    onDataAvailable(aRequest, aInputStream, aOffset, aCount) {
      if (this._stream == null) {
        this._stream = Cc["@mozilla.org/binaryinputstream;1"].createInstance(
          Ci.nsIBinaryInputStream
        );
        this._stream.setInputStream(aInputStream);
      }
      this._data += this._stream.readBytes(aCount);
    },
  };
}

function copyImageToBackground(src, index) {
  let url = Services.io.newURI(src, null, null);
  //console.log(url);
 
  //debugger;
  const tmpChannel = NetUtil.newChannel({
    uri: url,
    loadUsingSystemPrincipal: true,
  });
 // console.log( "contentType");
 //console.log( tmpChannel.contentType);
 
  tmpChannel.asyncOpen(
    new StreamListener(index),
    url
  );

 /* */

};

//console.log("impl utilities");
var Utilities = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {    
    
    const PrefTypes = {
      [Services.prefs.PREF_STRING] : "string",
      [Services.prefs.PREF_INT] : "number",
      [Services.prefs.PREF_BOOL] : "boolean",
      [Services.prefs.PREF_INVALID] : "invalid"
    };

    return {
      Utilities: {

        logDebug (text) {
          console.log(text);
        },
        
        attachmentHasImages () {
          let anzImg = 0;
       
    /*  */ 
          let attachList = win.document.getElementById('attachmentList');
          let noAtt = attachList.childNodes.length;
          let i = 0;
          for (i = 0; i< noAtt; i++) {
            let attachment = attachList.childNodes[i].attachment;
            let contentType = attachment.contentType;
            if (contentType == "image/jpeg"
            || contentType == "image/jpg"
            || contentType == "image/pjpeg"
            || contentType == "image/pjpg"
            || contentType == "image/gif"
            || contentType == "image/tif"
            || contentType == "image/png")
            {
               anzImg++;
            }

          };
               
                          return anzImg;
          
        },
  

        getImage () {
          let anzImg = 0;
          let bPage = win.imageview.WL.messenger.extension.getBackgroundPage();
        
    /*  */ 
          let attachList = win.document.getElementById('attachmentList');
          let noAtt = attachList.childNodes.length;
          let i = 0;
          for (i = 0; i< noAtt; i++) {
            let attachment = attachList.childNodes[i].attachment;
            let contentType = attachment.contentType;
            if (contentType == "image/jpeg"
            || contentType == "image/jpg"
            || contentType == "image/pjpeg"
            || contentType == "image/pjpg"
            || contentType == "image/gif"
            || contentType == "image/tif"
            || contentType == "image/png")
            {
               
             let img_url = attachList.childNodes[i].attachment.url;
             copyImageToBackground(img_url, anzImg);
             let QM = img_url.indexOf("&filename=");
             //console.log(attachList.childNodes[i].attachment.url);
             let filename= img_url.substring(10+ QM);
             bPage.imgNames[anzImg] = filename;
                         
             anzImg++;
            }

          };
          
        },
        


        openLinkExternally: function(url) {
          let uri = url;
          if (!(uri instanceof Ci.nsIURI)) {
            uri = Services.io.newURI(url);
          }
          
          Cc["@mozilla.org/uriloader/external-protocol-service;1"]
            .getService(Ci.nsIExternalProtocolService)
            .loadURI(uri);
        },

        showXhtmlPage: function(uri) {
          let mail3PaneWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
            .getService(Components.interfaces.nsIWindowMediator)
            .getMostRecentWindow("mail:3pane");  
          mail3PaneWindow.openDialog(uri);
        }
  

     }
  }
};
}
