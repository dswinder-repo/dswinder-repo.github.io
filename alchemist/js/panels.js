/* === THE ALCHEMIST BOARD — Detail Panel & Bottom Sheet === */

window.AlchemyBoard = window.AlchemyBoard || {};

AlchemyBoard.initPanels = function() {
  var cy = AlchemyBoard.cy;
  var CATS = AlchemyBoard.CATEGORIES;
  var panel = document.getElementById('detail-panel');
  var panelContent = document.getElementById('panel-content');
  var panelClose = document.getElementById('panel-close');
  var bottomSheet = document.getElementById('bottom-sheet');
  var sheetContent = document.getElementById('sheet-content');
  var isMobile = window.innerWidth < 768;

  panelClose.addEventListener('click', function() {
    AlchemyBoard.closePanel();
    AlchemyBoard.deselectAll();
  });

  // Bottom sheet touch handling
  if (bottomSheet) {
    var startY = 0;
    var sheetHandle = bottomSheet.querySelector('.sheet-handle');

    bottomSheet.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
    }, { passive: true });

    bottomSheet.addEventListener('touchmove', function(e) {
      var deltaY = startY - e.touches[0].clientY;
      if (deltaY > 50 && bottomSheet.classList.contains('peek')) {
        bottomSheet.classList.remove('peek');
        bottomSheet.classList.add('expanded');
      } else if (deltaY < -50 && bottomSheet.classList.contains('expanded')) {
        bottomSheet.classList.remove('expanded');
        bottomSheet.classList.add('peek');
      } else if (deltaY < -50 && bottomSheet.classList.contains('peek')) {
        bottomSheet.classList.remove('peek');
        AlchemyBoard.deselectAll();
      }
    }, { passive: true });
  }

  // Respond to window resize
  window.addEventListener('resize', function() {
    isMobile = window.innerWidth < 768;
  });

  // === OPEN PANEL ===
  AlchemyBoard.openPanel = function(node) {
    var data = node.data();
    var cat = CATS[data.category] || CATS.concept;

    // Get connections
    var connectedEdges = node.connectedEdges(':visible');
    var connections = [];
    connectedEdges.forEach(function(edge) {
      var other = edge.source().id() === node.id() ? edge.target() : edge.source();
      if (other.visible()) {
        connections.push({
          id: other.id(),
          label: other.data('label'),
          category: other.data('category'),
          relationship: edge.data('label') || edge.data('relationship') || 'connected'
        });
      }
    });

    // Sort connections by category then label
    connections.sort(function(a, b) {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.label.localeCompare(b.label);
    });

    // Group connections by category
    var grouped = {};
    connections.forEach(function(c) {
      if (!grouped[c.category]) grouped[c.category] = [];
      grouped[c.category].push(c);
    });

    // Build HTML
    var html = '';

    // Icon and name
    html += '<div class="panel-photo-area">';
    html += '<span class="panel-icon">' + cat.icon + '</span>';
    html += '</div>';
    html += '<h2 class="panel-name">' + escapeHtml(data.label) + '</h2>';
    html += '<span class="panel-badge" style="background:' + cat.color + '">' + cat.label + '</span>';
    if (data.subcategory) {
      html += '<span class="panel-sub">' + escapeHtml(data.subcategory) + '</span>';
    }

    // Description
    if (data.description) {
      html += '<div class="panel-divider"></div>';
      html += '<p class="panel-desc">' + escapeHtml(data.description) + '</p>';
    }

    // YouTube embed (for episode nodes with a youtubeId)
    if (data.youtubeId) {
      var ytId = escapeHtml(data.youtubeId);
      html += '<div class="panel-divider"></div>';
      html += '<div class="panel-youtube">';
      html += '<iframe width="100%" height="180" src="https://www.youtube.com/embed/' +
        ytId + '" title="' + escapeHtml(data.label) + '" frameborder="0" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen style="border-radius:6px;"></iframe>';
      html += '</div>';
      html += '<a href="https://www.youtube.com/watch?v=' + ytId +
        '" target="_blank" rel="noopener" class="panel-yt-link">Watch on YouTube &#8599;</a>';
    }

    // Connections grouped by category
    if (connections.length > 0) {
      html += '<div class="panel-divider"></div>';
      html += '<h3 class="panel-section-title">Connections (' + connections.length + ')</h3>';

      Object.keys(grouped).forEach(function(catKey) {
        var group = grouped[catKey];
        var groupCat = CATS[catKey] || CATS.concept;

        html += '<div style="margin-top:6px;font-size:0.75rem;color:#7a6858;font-weight:700;text-transform:uppercase;letter-spacing:1px">' +
          groupCat.icon + ' ' + groupCat.label + '</div>';
        html += '<ul class="panel-connections">';
        group.forEach(function(c) {
          var cCat = CATS[c.category] || CATS.concept;
          html += '<li class="connection-item" data-node-id="' + c.id + '">';
          html += '<span class="connection-dot" style="background:' + cCat.color + '"></span>';
          html += '<span class="connection-label">' + escapeHtml(c.label) + '</span>';
          html += '<span class="connection-rel">' + escapeHtml(c.relationship) + '</span>';
          html += '</li>';
        });
        html += '</ul>';
      });
    }

    // Episodes (with YouTube embeds for connected episodes)
    if (data.episodes && data.episodes.length > 0) {
      html += '<div class="panel-divider"></div>';
      html += '<h3 class="panel-section-title">Episodes</h3>';
      html += '<ul class="panel-episodes">';
      data.episodes.forEach(function(epId) {
        var epNode = cy.$id(epId);
        if (epNode.length) {
          html += '<li class="episode-item" data-node-id="' + epId + '">' +
            escapeHtml(epNode.data('label')) + '</li>';
          // Show YouTube embed if the episode has a video
          var ytId = epNode.data('youtubeId');
          if (ytId) {
            html += '<div class="panel-youtube panel-youtube-sm">';
            html += '<iframe width="100%" height="140" src="https://www.youtube.com/embed/' +
              escapeHtml(ytId) + '" frameborder="0" ' +
              'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
              'allowfullscreen loading="lazy" style="border-radius:6px;margin:4px 0 8px;"></iframe>';
            html += '</div>';
          }
        }
      });
      html += '</ul>';
    }

    // Tags
    if (data.tags && data.tags.length > 0) {
      html += '<div class="panel-divider"></div>';
      html += '<div class="panel-tags">';
      data.tags.forEach(function(t) {
        html += '<span class="tag">#' + escapeHtml(t) + '</span>';
      });
      html += '</div>';
    }

    // Render to appropriate container
    if (isMobile) {
      sheetContent.innerHTML = html;
      bottomSheet.classList.remove('expanded');
      bottomSheet.classList.add('peek');
    } else {
      panelContent.innerHTML = html;
      panel.classList.add('open');
    }

    // Wire up connection clicks
    var container = isMobile ? sheetContent : panelContent;
    container.querySelectorAll('[data-node-id]').forEach(function(item) {
      item.addEventListener('click', function() {
        var targetNode = cy.$id(this.dataset.nodeId);
        if (targetNode.length && targetNode.visible()) {
          AlchemyBoard.selectNode(targetNode);
        }
      });
    });
  };

  // === CLOSE PANEL ===
  AlchemyBoard.closePanel = function() {
    panel.classList.remove('open');
    bottomSheet.classList.remove('peek', 'expanded');
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
