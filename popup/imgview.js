/*
 * License:  see License.txt
 * Code  for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */

var  doc_stored = document;

window.addEventListener('DOMContentLoaded', function () {
    var galley = document.getElementById('galley');
    let imgList = document.getElementById('imgList');
   	var bPage = messenger.extension.getBackgroundPage();
    var fragment = new DocumentFragment();
    //debugger;
    //var a1 = document.createElement('a');

   for (i=0; i< bPage.no_img ;i++) {
      var li = document.createElement('li')
      var imgNew = document.createElement('img')
      imgNew.src =  "data:image/jpeg;base64,"+ btoa(bPage.imageCode[i]);
      imgNew.setAttribute("alt", bPage.imgNames[i]);
      li.appendChild(imgNew);
      fragment.appendChild(li);
    };
    imgList.appendChild(fragment);
    
 
    messenger.runtime.sendMessage({msg:"close loading"}).catch();   
  
    var viewer = new Viewer(galley, {
      url: 'src',
      button: false, //no closing x
      title: true,
      interval: 4000,
      backdrop: "static", // don't close on click
 /*     toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 1,
        play: {
          show: 1,
          size: 'large',
        },
        next: 1,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
        download: function() {
          console.log("download");
         debugger;
          let a = doc_stored.createElement('a');

          a.href = viewer.image.src;
          a.download = viewer.image.alt;
          doc_stored.body.appendChild(a);
          a.click();
          doc_stored.body.removeChild(a);
          console.log("download done");
      }
      },      
   */  // download jquery click not working 
      //function (image) {
      //  return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
      //},
 /*     toolbar: {
        oneToOne: true,

        prev: function() {
          viewer.prev(true);
        },

        play: true,

        next: function() {
          viewer.next(true);
        },

        download: function() {
          const a = document.createElement('a');

          a.href = viewer.image.src;
          a.download = viewer.image.alt;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
      }
*/
    });
    viewer.show();
  });


  window.addEventListener('unload', function () {
  	var bPage = messenger.extension.getBackgroundPage();
    for (i=0; i< bPage.no_img ;i++) {
     bPage.imageCode[i]= "";
     bPage.imgNames[i]= "";
     bPage.imageReady[i]= false;
    };
 });
 