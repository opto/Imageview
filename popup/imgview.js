/*
 * License:  see License.txt
 * Code  for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */
var messageId = null;

window.addEventListener('DOMContentLoaded', async function () {
  var galley = document.getElementById('galley');
  let imgList = document.getElementById('imgList');
  var fragment = new DocumentFragment();

  // Get the messageId via URL search params
  const queryString  = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  messageId = urlParams.get('messageId')
  
  // As our API does not get the attachment per message, but per window,
  // we store the attachmentg data in the the backgroud page and use message
  // service to get it here. Once the API can get the attachment data per message,
  // we can just call it here
  let attachmentData = await messenger.runtime.sendMessage({msg: "getAttachmentData", messageId: messageId});

  for (let data of attachmentData) {
    var li = document.createElement('li')
    var imgNew = document.createElement('img')
    imgNew.src =  "data:image/jpeg;base64,"+ btoa(data.imageData);
    imgNew.setAttribute("alt", data.filename);
    li.appendChild(imgNew);
    fragment.appendChild(li);
  };
  imgList.appendChild(fragment);

  var viewer = new Viewer(galley, {
    url: 'src',
    button: false, //no closing x
    title: true,
    interval: 4000,
    backdrop: "static", // don't close on click
  });
  viewer.show();
});
 