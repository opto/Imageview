// The customUI API includes a few pre-defined locations where all the ugly
// legacy things are taken care of internally and the developer just has to
// provide the WebExtension page which schould be loaded into the provided
// iFrame. If those pre-defined locations are not sufficient, developers can
// use the LOCATION_LEGACY location. This location needs an additional glue
// script to return all the information from the legacy host window, which
// could be needed by the WebExtension page inside the iframe.

async function init(window) {
  //get url from the dialog
  let url = window.dialog.mLauncher.source.spec;
  //get just the query, for example "part=1.2&type=image/jpeg&filename=IMG_0101.jpg"
  let query = window.dialog.mLauncher.source.query;
  
  let data = {};
  for (const part of query.split("&")) {
    const [key,value] = part.split("=");
    data[key] = decodeURIComponent(value);
  }
  data.url = url;
  return data;
}
