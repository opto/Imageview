// The download window has no knowledge of messages. It just knows a filename
// and a url. These information are made available via the context of the
// UNKNOWN_DOWNLOAD_LOCATION location.

async function isEnabled(addonId) {
  try {
    let nostalgy = await messenger.management.get("nostalgy@opto.one");
    return nostalgy.enabled;
  } catch (e) {
    return false;
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  // do not load or show previews if nostalgy is enabled
  if (await isEnabled("nostalgy@opto.one")) {
    return;
  }
  // Get the context object of the UNKNOWN_DOWNLOAD_LOCATION iframe.
  // This includes:
  // * filename
  // * url
  // * part (the part identifier from the mime message)
  // * type
  let context = await messenger.ex_customui.getContext();
  
  if (context && context.hasOwnProperty("type") && context.type.startsWith("image/")) {
    await messenger.ex_customui.setLocalOptions({hidden: false});
    let imageData = await messenger.Utilities.attachmentGetImageData(context.url);
    document.getElementById("preview").setAttribute("src", "data:image/jpeg;base64,"+ btoa(imageData));
  }
});
