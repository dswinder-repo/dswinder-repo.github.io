/* === THE ALCHEMIST BOARD — Interactions === */

window.AlchemyBoard = window.AlchemyBoard || {};

AlchemyBoard.initInteractions = function() {
  var cy = AlchemyBoard.cy;
  if (!cy) return;

  var CATS = AlchemyBoard.CATEGORIES;
  var SIZES = AlchemyBoard.NODE_SIZES;
  var tooltip = document.getElementById('tooltip');
  var isTouchDevice = AlchemyBoard.isTouchDevice;
  var hoverTimeout = null;

  // === HOVER — Enlarge + Tooltip (desktop only) ===
  if (!isTouchDevice) {
    cy.on('mouseover', 'node', function(evt) {
      var node = evt.target;
      clearTimeout(hoverTimeout);

      // Enlarge node
      var cat = node.data('category');
      var size = SIZES[cat] || SIZES.concept;
      node.stop().animate({
        style: {
          'width': Math.round(size.w * 1.35),
          'height': Math.round(size.h * 1.35)
        },
        duration: 150,
        easing: 'ease-out'
      });

      // Show tooltip
      showTooltip(node, evt);
    });

    cy.on('mouseout', 'node', function(evt) {
      var node = evt.target;

      // Restore size
      var cat = node.data('category');
      var size = SIZES[cat] || SIZES.concept;
      node.stop().animate({
        style: {
          'width': size.w,
          'height': size.h
        },
        duration: 150,
        easing: 'ease-in'
      });

      // Hide tooltip
      hoverTimeout = setTimeout(function() {
        tooltip.style.display = 'none';
      }, 50);
    });

    // Track mouse for tooltip positioning
    cy.on('mousemove', 'node', function(evt) {
      if (tooltip.style.display === 'block') {
        positionTooltip(evt);
      }
    });
  }

  // === CLICK/TAP — Select + Highlight Connections ===
  cy.on('tap', 'node', function(evt) {
    var node = evt.target;
    selectNode(node);
  });

  // Tap background to deselect
  cy.on('tap', function(evt) {
    if (evt.target === cy) {
      deselectAll();
    }
  });

  // === TOOLTIP FUNCTIONS ===
  function showTooltip(node, evt) {
    var data = node.data();
    var cat = CATS[data.category] || CATS.concept;
    var connCount = node.connectedEdges().length;

    tooltip.innerHTML =
      '<div class="tooltip-name">' + escapeHtml(data.label) + '</div>' +
      '<span class="tooltip-badge" style="background:' + cat.color + '">' +
        cat.icon + ' ' + cat.label + '</span>' +
      (data.description ?
        '<div class="tooltip-desc">' + escapeHtml(truncate(data.description, 120)) + '</div>' : '') +
      '<div class="tooltip-connections">' + connCount + ' connection' + (connCount !== 1 ? 's' : '') + '</div>';

    tooltip.style.display = 'block';
    positionTooltip(evt);
  }

  function positionTooltip(evt) {
    var rendPos = evt.renderedPosition || evt.position;
    if (!rendPos) return;

    var container = cy.container().getBoundingClientRect();
    var x = container.left + rendPos.x + 15;
    var y = container.top + rendPos.y - 10;

    // Keep tooltip on screen
    var tw = tooltip.offsetWidth;
    var th = tooltip.offsetHeight;
    if (x + tw > window.innerWidth - 10) {
      x = container.left + rendPos.x - tw - 15;
    }
    if (y + th > window.innerHeight - 10) {
      y = window.innerHeight - th - 10;
    }
    if (y < 10) y = 10;

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  // === SELECT/DESELECT FUNCTIONS ===
  function selectNode(node) {
    var neighborhood = node.neighborhood();

    // Clear previous
    cy.elements().removeClass('highlighted dimmed selected-node search-match search-dimmed');

    // Dim everything
    cy.elements().addClass('dimmed');

    // Highlight selected + neighborhood
    node.removeClass('dimmed').addClass('selected-node');
    neighborhood.removeClass('dimmed').addClass('highlighted');

    // Open detail panel
    AlchemyBoard.openPanel(node);

    // Center on selection with some padding
    var selectedEles = node.union(neighborhood);
    cy.animate({
      fit: { eles: selectedEles, padding: 80 },
      duration: 400,
      easing: 'ease-out-cubic'
    });
  }

  function deselectAll() {
    cy.elements().removeClass('highlighted dimmed selected-node search-match search-dimmed');
    AlchemyBoard.closePanel();
    tooltip.style.display = 'none';
  }

  // Expose for use by other modules
  AlchemyBoard.selectNode = selectNode;
  AlchemyBoard.deselectAll = deselectAll;

  // === UTILITIES ===
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function truncate(str, len) {
    if (str.length <= len) return str;
    return str.substring(0, len).trim() + '...';
  }
};
