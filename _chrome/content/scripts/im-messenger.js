
/*
 * License:  see License.txt
 * Code for TB 78 or later: Creative Commons (CC BY-ND 4.0):
 *      Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0) 
 
 * Contributors:  see Changes.txt
 */



 var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");


Services.scriptloader.loadSubScript("chrome://imageview/content/imageview.jsm", window, "UTF-8");
/**/

function onLoad(activatedWhileWindowOpen) {
    console.log (Services.appinfo.version);
    window.imageview.WL = WL;
   
 /*
    let layout = WL.injectCSS("chrome://quickfolders/content/quickfolders-layout.css");
    layout.setAttribute("title", "QuickFolderStyles");
    
    let tb = WL.injectCSS("chrome://quickfolders/content/quickfolders-thunderbird.css");
    // tb.setAttribute("title", "QuickFolderStyles");
    
*/
/*
    WL.injectElements(`
    <commandset id="tasksCommands">
    <command id="cmd_nostalgyconfig" label="Nostalgy..."
      oncommand="openDialog('chrome://nostalgy/content/edit_prefs.xhtml', 'nostalgy', 'resizable');"/>
   </commandset>
 

`, ["chrome://nostalgy/locale/nostalgy.dtd"]);
*/
console.log("messenger-imageview");

/*   
    window.QuickFolders.Util.logDebug('Adding Folder Listener...');
*/
}

function onUnload(isAddOnShutDown) {
    console.log("messenger-imageview unload");
    Components.classes["@mozilla.org/xre/app-info;1"].
    getService(Components.interfaces.nsIXULRuntime).invalidateCachesOnRestart();
}
