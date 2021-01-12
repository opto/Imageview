
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

function getImageData(src) {
  return new Promise((resolve, reject) => {
    let listener = {
      _data: "",
      _stream: null,
      
      QueryInterface: ChromeUtils.generateQI([
        Ci.nsIStreamListener,
        Ci.nsIRequestObserver,
      ]),

      onStartRequest(aRequest) {},
      onStopRequest(aRequest, aStatusCode) {
        resolve(this._data);
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
    
    let url = Services.io.newURI(src, null, null);
    const tmpChannel = NetUtil.newChannel({
      uri: url,
      loadUsingSystemPrincipal: true,
    });  
    tmpChannel.asyncOpen(
      listener,
      url
    );
  });
};

var Utilities = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {    

    return {
      Utilities: {
        
        async attachmentGetImageData (url) {
          return await getImageData(url);
        },
        
        async attachmentGetImagesInfo (windowId) {          
          // returns array of attachment infos
          let rv = [];
          
          let window = context.extension.windowManager.get(windowId, context).window;
          let attachList = window.document.getElementById('attachmentList');
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
              let url = attachList.childNodes[i].attachment.url;
              
              let attachmentInfo = {};
              attachmentInfo.type = contentType;
              attachmentInfo.url = url;
              attachmentInfo.filename = url.split("&filename=").pop();
              rv.push(attachmentInfo)
            }

          };
          return rv;
        }  

     }
  }
};
}
