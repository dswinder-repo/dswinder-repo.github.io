/* === THE ALCHEMIST BOARD — App Bootstrap === */

window.AlchemyBoard = window.AlchemyBoard || {};

(function() {
  'use strict';

  // Detect touch device
  AlchemyBoard.isTouchDevice = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0);

  if (AlchemyBoard.isTouchDevice) {
    document.body.classList.add('touch-device');
  }

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {
    var loadingOverlay = document.getElementById('loading-overlay');

    // Validate dependencies
    if (typeof cytoscape === 'undefined') {
      loadingOverlay.querySelector('.loading-subtitle').textContent =
        'Error: Failed to load graph library. Please refresh.';
      return;
    }

    if (!window.GRAPH_DATA || !window.GRAPH_DATA.nodes || window.GRAPH_DATA.nodes.length === 0) {
      loadingOverlay.querySelector('.loading-subtitle').textContent =
        'Error: No graph data found.';
      return;
    }

    // Register fcose layout if available
    if (typeof cytoscapeFcose !== 'undefined') {
      cytoscape.use(cytoscapeFcose);
    }

    // Initialize graph
    AlchemyBoard.initGraph();

    // Initialize interactions
    AlchemyBoard.initInteractions();

    // Initialize controls (search, filter, zoom)
    AlchemyBoard.initControls();

    // Initialize panels (detail panel, bottom sheet)
    AlchemyBoard.initPanels();

    // Run layout
    AlchemyBoard.onLayoutDone = function() {
      // Hide loading overlay after layout completes
      setTimeout(function() {
        loadingOverlay.classList.add('hidden');
      }, 300);
    };

    // Start the layout
    AlchemyBoard.runLayout();

    // Fallback: hide loading after 8 seconds even if layout takes long
    setTimeout(function() {
      if (!loadingOverlay.classList.contains('hidden')) {
        loadingOverlay.classList.add('hidden');
      }
    }, 8000);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Escape to deselect
      if (e.key === 'Escape') {
        if (document.getElementById('help-modal').style.display !== 'none') {
          document.getElementById('help-modal').style.display = 'none';
          return;
        }
        if (document.getElementById('search-input') === document.activeElement) {
          return; // Let search handler deal with Escape
        }
        AlchemyBoard.deselectAll();
      }
      // / to focus search
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('search-input').focus();
      }
    });
  });
})();
