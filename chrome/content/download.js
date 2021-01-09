
/*
 * License:  see License.txt
 * Code for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */





var { MailUtils } = ChromeUtils.import("resource:///modules/MailUtils.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var {NetUtil} =   ChromeUtils.import("resource://gre/modules/NetUtil.jsm");
var { MsgHdrToMimeMessage } = ChromeUtils.import(
  "resource:///modules/gloda/MimeMessage.jsm");

// MIT Licensed
// Author: jwilson8767

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions. This waits for src attribute
 *
 * @param selector
 * @returns {Promise}
 *
 * MIT Licensed, variation of original function
 * Author: jwilson8767
 */

async function elementReady(selector) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if ((el.src!="") && (el.contentType !="undefined")) {resolve(el);}
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}




  function getMime (mimeHdr, aMimeMsg)  {
    console.log (aMimeMsg);
    let test=aMimeMsg;
    debugger;
    return;
    };



async function StartThumb(){
    var img;
  //debugger;
	  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		        .getService(Components.interfaces.nsIWindowMediator);
		var win = wm.getMostRecentWindow("mail:3pane");
  //debugger;
    var attachList = win.document.getElementById('attachmentList');
    var attachment = attachList.childNodes[0].attachment;
    let stpos = attachment.url.indexOf("filename");
    let imgname = attachment.url.substr(stpos+9);
  // console.log(imgname);
    var img = window.document.getElementById("contentTypeImage");
    //console.log(img);//
    //console.log(img.nextSibling);
    await elementReady("#contentTypeImage");
    let img_src = img.src;
    let QM = img_src.indexOf("?");
    let filename= img_src.substring(11, QM);
    let stpos1 = img_src.indexOf("contentType");
    let contentType = img_src.substr(stpos1+12);
    //console.log("after el ready");
    //console.log(filename);
 //debugger;
    if (contentType == "image/jpeg"
    || contentType == "image/jpg"
    || contentType == "image/pjpeg"
    || contentType == "image/pjpg"
    || contentType == "image/gif"
    || contentType == "image/tif"
    || contentType == "image/png")
    {

 
    let ii=0;
    //debugger;
    for (ii=0; ii<attachList.childNodes.length; ii++) {
       attachment = attachList.childNodes[ii].attachment;
      let stpos = attachment.url.indexOf("filename");
      let imgname = attachment.url.substr(stpos+9);
     //console.log(imgname);
     if (imgname == filename) {
     //  console.log("found");
       break;
     }
  
    }
    var vBox= window.document.getElementById("container");
    var vBox2= window.document.createXULElement("hbox");
    var vBox3= window.document.createXULElement("hbox");
    vBox3.setAttribute("pack", "center");
    vBox3.setAttribute("id", "thumb1a");
    vBox2.setAttribute("style", "max-height: 25ch; max-width: 25ch;"); //may not be needed
    vBox2.setAttribute("pack", "center");
    vBox2.setAttribute("id", "thumb1");
    vBox3.appendChild(vBox2);
    var jpg= window.document.createXULElement("image");
    img_src = img.src;
    QM = img_src.indexOf("?");
    filename= img_src.substring(11, QM);
    console.log(filename);
  //  jpg.setAttribute("height", "200px");
  //  jpg.setAttribute("width", "200px");
  //  jpg.setAttribute("flex", "1");
    jpg.setAttribute("style", "max-height: 25ch; max-width: 25ch;");
 //   jpg.setAttribute("style", "max-height: 200; max-width:200;");
  //  jpg.setAttribute("style", "max-height: 25ch;");
    jpg.setAttribute("src", attachment.url);
   
   // style="max-height: 25ch; max-width: 25ch;"
    vBox2.appendChild(jpg);
    vBox.appendChild(vBox3);
    //console.log(jpg);

  }
     
  
  
}

function StreamListener  (resolve, reject) {
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
    //    resolve.src="data:image/jpeg;base64,"+ btoa( this._data);
 //       resolve.height="200px";
 //       resolve.width="200px";
     //  resolve(this._data);
        console.log(this._data);
      } catch (e) {
       // reject("Error inside stream listener:\n" + e + "\n");
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

