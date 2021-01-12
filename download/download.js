// The download window has no knowledge of messages. It just knows a filename
// and a url. These information are made available via the context of the
// UNKNOWN_DOWNLOAD_LOCATION location.
window.addEventListener('DOMContentLoaded', async function () {
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
