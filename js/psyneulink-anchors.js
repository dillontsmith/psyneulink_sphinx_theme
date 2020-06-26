window.psyneulinkAnchors = {
  offsetHeightPx: function() {
    return utilities.headersHeight() + utilities.OFFSET_HEIGHT_PADDING;
  },

  bind: function() {
    // Replace Sphinx-generated anchors with anchorjs ones
    $(".headerlink").text("");

    window.anchors.add(".psyneulink-article .headerlink");

    $(".anchorjs-link").each(function() {
      var $headerLink = $(this).closest(".headerlink");
      var href = $headerLink.attr("href");
      var clone = this.outerHTML;

      $clone = $(clone).attr("href", href);
      $headerLink.before($clone);
      $headerLink.remove();
    });
  }
};
