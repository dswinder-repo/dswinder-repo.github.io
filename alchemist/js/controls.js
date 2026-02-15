/* === THE ALCHEMIST BOARD — Controls (Search, Filter, Zoom) === */

window.AlchemyBoard = window.AlchemyBoard || {};

AlchemyBoard.initControls = function() {
  var cy = AlchemyBoard.cy;
  if (!cy) return;

  var CATS = AlchemyBoard.CATEGORIES;
  var activeCategories = {};
  var searchTimeout;

  // Initialize all categories as active
  Object.keys(CATS).forEach(function(key) {
    activeCategories[key] = true;
  });

  // === SEARCH ===
  var searchInput = document.getElementById('search-input');
  var searchClear = document.getElementById('search-clear');

  searchInput.addEventListener('input', function() {
    var query = this.value.trim();
    searchClear.classList.toggle('visible', query.length > 0);

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      performSearch(query);
    }, 200);
  });

  searchClear.addEventListener('click', function() {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    clearSearch();
    searchInput.focus();
  });

  // Allow Escape to clear search
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      clearSearch();
      searchInput.blur();
    }
  });

  function performSearch(query) {
    // Clear selection state first
    cy.elements().removeClass('highlighted dimmed selected-node');
    AlchemyBoard.closePanel();

    if (!query) {
      clearSearch();
      return;
    }

    var lowerQuery = query.toLowerCase();

    cy.batch(function() {
      cy.nodes().forEach(function(node) {
        var label = (node.data('label') || '').toLowerCase();
        var desc = (node.data('description') || '').toLowerCase();
        var tags = (node.data('tags') || []).join(' ').toLowerCase();
        var sub = (node.data('subcategory') || '').toLowerCase();

        if (label.indexOf(lowerQuery) !== -1 ||
            desc.indexOf(lowerQuery) !== -1 ||
            tags.indexOf(lowerQuery) !== -1 ||
            sub.indexOf(lowerQuery) !== -1) {
          node.removeClass('search-dimmed').addClass('search-match');
        } else {
          node.removeClass('search-match').addClass('search-dimmed');
        }
      });

      cy.edges().addClass('search-dimmed');
    });

    // Fit to matches
    var matches = cy.nodes('.search-match');
    if (matches.length === 1) {
      cy.animate({
        center: { eles: matches },
        zoom: 1.8,
        duration: 500,
        easing: 'ease-out-cubic'
      });
    } else if (matches.length > 0 && matches.length <= 20) {
      cy.animate({
        fit: { eles: matches, padding: 60 },
        duration: 500,
        easing: 'ease-out-cubic'
      });
    }

    // Update count
    updateNodeCount(matches.length + ' match' + (matches.length !== 1 ? 'es' : ''));
  }

  function clearSearch() {
    cy.batch(function() {
      cy.elements().removeClass('search-match search-dimmed');
    });
    updateNodeCount();
  }

  // === FILTER BUTTONS ===
  var filterBar = document.getElementById('filter-bar');

  function renderFilterButtons() {
    // Filter label
    var label = document.createElement('span');
    label.className = 'filter-label';
    label.textContent = 'Filter:';
    filterBar.appendChild(label);

    Object.keys(CATS).forEach(function(key, i) {
      var cat = CATS[key];
      var btn = document.createElement('button');
      btn.className = 'filter-btn active';
      btn.dataset.category = key;
      btn.textContent = cat.icon + ' ' + cat.label;
      btn.style.borderColor = cat.color;
      btn.style.color = cat.color;
      btn.style.setProperty('--cat-color', cat.color);

      btn.addEventListener('click', function() {
        toggleCategory(key);
      });

      filterBar.appendChild(btn);
    });
  }

  function toggleCategory(category) {
    activeCategories[category] = !activeCategories[category];

    // Update button
    var btn = filterBar.querySelector('[data-category="' + category + '"]');
    if (btn) {
      btn.classList.toggle('active', activeCategories[category]);
      if (activeCategories[category]) {
        btn.style.color = CATS[category].color;
        btn.style.background = 'transparent';
      } else {
        btn.style.color = 'rgba(150,130,110,0.4)';
        btn.style.borderColor = 'rgba(150,130,110,0.3)';
        btn.style.background = 'transparent';
      }
    }

    applyFilters();
  }

  function applyFilters() {
    cy.batch(function() {
      cy.nodes().forEach(function(node) {
        var cat = node.data('category');
        if (activeCategories[cat]) {
          node.style('display', 'element');
        } else {
          node.style('display', 'none');
        }
      });
    });
    updateNodeCount();
  }

  renderFilterButtons();

  // === ZOOM CONTROLS ===
  var zoomInBtn = document.getElementById('zoom-in');
  var zoomOutBtn = document.getElementById('zoom-out');
  var zoomFitBtn = document.getElementById('zoom-fit');
  var zoomResetBtn = document.getElementById('zoom-reset');

  zoomInBtn.addEventListener('click', function() {
    cy.animate({ zoom: cy.zoom() * 1.3, duration: 200 });
  });

  zoomOutBtn.addEventListener('click', function() {
    cy.animate({ zoom: cy.zoom() / 1.3, duration: 200 });
  });

  zoomFitBtn.addEventListener('click', function() {
    cy.animate({ fit: { padding: 60 }, duration: 400, easing: 'ease-out-cubic' });
  });

  zoomResetBtn.addEventListener('click', function() {
    AlchemyBoard.deselectAll();
    clearSearch();
    searchInput.value = '';
    searchClear.classList.remove('visible');
    // Reset all filters to active
    Object.keys(CATS).forEach(function(key) {
      activeCategories[key] = true;
    });
    filterBar.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.classList.add('active');
      var cat = btn.dataset.category;
      btn.style.color = CATS[cat].color;
      btn.style.borderColor = CATS[cat].color;
      btn.style.background = 'transparent';
    });
    applyFilters();
    cy.animate({ fit: { padding: 60 }, duration: 400, easing: 'ease-out-cubic' });
  });

  // === NODE COUNT ===
  function updateNodeCount(override) {
    var countEl = document.getElementById('node-count');
    if (override) {
      countEl.textContent = override;
    } else {
      var visible = cy.nodes(':visible').length;
      var total = cy.nodes().length;
      if (visible === total) {
        countEl.textContent = total + ' nodes \u00B7 ' + cy.edges().length + ' connections';
      } else {
        countEl.textContent = visible + ' / ' + total + ' nodes';
      }
    }
  }

  updateNodeCount();

  // === HELP MODAL ===
  var helpBtn = document.getElementById('help-btn');
  var helpModal = document.getElementById('help-modal');
  var helpClose = document.getElementById('help-close');

  helpBtn.addEventListener('click', function() {
    helpModal.style.display = 'flex';
    renderLegend();
  });

  helpClose.addEventListener('click', function() {
    helpModal.style.display = 'none';
  });

  helpModal.addEventListener('click', function(e) {
    if (e.target === helpModal) {
      helpModal.style.display = 'none';
    }
  });

  function renderLegend() {
    var container = document.getElementById('help-legend-items');
    if (container.children.length > 0) return; // Already rendered

    Object.keys(CATS).forEach(function(key) {
      var cat = CATS[key];
      var item = document.createElement('span');
      item.className = 'help-legend-item';
      item.innerHTML =
        '<span class="help-legend-dot" style="background:' + cat.color + '"></span>' +
        cat.icon + ' ' + cat.label;
      container.appendChild(item);
    });
  }

  // Expose
  AlchemyBoard.updateNodeCount = updateNodeCount;
};
