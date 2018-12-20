(function(w) {
  "use strict";

  if (typeof w.PerformanceObserver === 'undefined' || typeof Object.keys !== 'function') {
    return
  }

  var attributes = [
    'alt',
    'title'
  ], imageNodes;

  new PerformanceObserver(function(entryList) {
    var resourceTimingEntries = entryList.getEntries()
    for (var rtIndex = 0; rtIndex < resourceTimingEntries.length; rtIndex++) {
      var resourceTimingEntry = resourceTimingEntries[rtIndex]

      var metadata = {}, found = false
      for (var stIndex = 0; stIndex < (resourceTimingEntry.serverTiming || []).length; stIndex++) {
        var serverTimingEntry =  resourceTimingEntry.serverTiming[stIndex]
        if (attributes.indexOf(serverTimingEntry.name) > -1) {
          metadata[serverTimingEntry.name] = serverTimingEntry.description
          found = true
        }
      }

      if (found) {
        annotateImage(resourceTimingEntry.name, metadata)
      }
    }
  }).observe({entryTypes: ['resource']})

  function annotateImage(url, metadata) {
    if (!Object.keys(metadata).length) {
      return
    }

    if (!imageNodes) {
      imageNodes = w.document.getElementsByTagName('img')
    }

    for (var imageNodeIndex = 0; imageNodeIndex < imageNodes.length; imageNodeIndex++) {
      if (imageNodes[imageNodeIndex].src !== url)
        continue

      var keys = Object.keys(metadata)
      for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var attribute = keys[keyIndex]
        imageNodes[imageNodeIndex].setAttribute(attribute, metadata[attribute])
      }
    }
  }
}(window))
