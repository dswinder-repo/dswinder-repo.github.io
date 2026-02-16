/* === THE ALCHEMIST BOARD — Graph Initialization === */

window.AlchemyBoard = window.AlchemyBoard || {};

// --- Scribble SVG generator for handwritten note-card effect ---
(function() {
  var _cache = {};

  // 3 wavy-line pattern variants for visual variety
  var PATTERNS = [
    [
      "M8,16 Q22,12 38,17 Q54,22 68,14 Q82,10 92,16",
      "M10,27 Q26,23 40,28 Q52,33 66,25 Q78,19 92,27",
      "M8,38 Q24,34 36,39 Q50,44 64,36 Q76,30 92,38",
      "M12,49 Q28,45 42,50 Q56,55 68,47 Q80,41 92,49",
      "M8,60 Q20,56 34,61 Q48,66 62,58 Q76,52 92,60"
    ],
    [
      "M10,15 Q28,11 44,18 Q58,23 70,13 Q84,8 92,17",
      "M8,26 Q20,22 36,27 Q50,32 62,24 Q76,18 92,26",
      "M12,37 Q28,33 42,38 Q54,43 66,35 Q80,29 92,37",
      "M8,48 Q24,44 38,49 Q52,54 66,46 Q78,40 92,48",
      "M10,59 Q26,55 40,60 Q54,65 68,57 Q80,51 92,59"
    ],
    [
      "M12,17 Q24,13 40,18 Q56,23 70,15 Q82,11 92,18",
      "M8,28 Q22,24 38,29 Q52,34 66,26 Q78,20 92,28",
      "M10,39 Q26,35 42,40 Q56,45 68,37 Q80,31 92,39",
      "M12,50 Q26,46 40,51 Q54,56 68,48 Q80,42 92,50",
      "M8,61 Q22,57 36,62 Q50,67 64,59 Q78,53 92,61"
    ]
  ];

  var OPACITIES = [0.20, 0.15, 0.18, 0.13, 0.16];
  var WIDTHS    = [1.3, 1.0, 1.15, 0.9, 1.05];

  AlchemyBoard.getScribbleSVG = function(category, nodeId) {
    var variant = AlchemyBoard.simpleHash(nodeId || 'x') % 3;
    var key = category + '-' + variant;
    if (_cache[key]) return _cache[key];

    var cat = AlchemyBoard.CATEGORIES[category] || AlchemyBoard.CATEGORIES.concept;
    var color = cat.color;
    var paths = PATTERNS[variant];

    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 72' preserveAspectRatio='none'>" +
      // Red pushpin
      "<circle cx='50' cy='5' r='3.5' fill='#CC2200' opacity='0.30'/>" +
      "<circle cx='50' cy='5' r='1.5' fill='#FF6644' opacity='0.45'/>";

    for (var i = 0; i < paths.length; i++) {
      svg += "<path d='" + paths[i] + "' stroke='" + color + "' fill='none' " +
        "stroke-width='" + WIDTHS[i] + "' stroke-linecap='round' opacity='" + OPACITIES[i] + "'/>";
    }

    svg += "</svg>";
    _cache[key] = "data:image/svg+xml," + encodeURIComponent(svg);
    return _cache[key];
  };
})();

AlchemyBoard.initGraph = function() {
  var hash = AlchemyBoard.simpleHash;
  var CATS = AlchemyBoard.CATEGORIES;
  var SIZES = AlchemyBoard.NODE_SIZES;
  var getScribble = AlchemyBoard.getScribbleSVG;

  // Convert data to Cytoscape format
  var elements = [];

  // Nodes
  if (window.GRAPH_DATA && window.GRAPH_DATA.nodes) {
    window.GRAPH_DATA.nodes.forEach(function(n) {
      elements.push({
        group: 'nodes',
        data: {
          id: n.id,
          label: n.label,
          category: n.category,
          subcategory: n.subcategory || '',
          description: n.description || '',
          tags: n.tags || [],
          episodes: n.episodes || [],
          links: n.links || [],
          image: n.image || '',
          youtubeId: n.youtubeId || ''
        }
      });
    });
  }

  // Edges
  if (window.GRAPH_DATA && window.GRAPH_DATA.edges) {
    window.GRAPH_DATA.edges.forEach(function(e) {
      elements.push({
        group: 'edges',
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label || '',
          relationship: e.relationship || 'connected_to',
          weight: e.weight || 1,
          episodes: e.episodes || [],
          notes: e.notes || ''
        }
      });
    });
  }

  // Cytoscape stylesheet
  var stylesheet = [
    // === BASE NODE ===
    {
      selector: 'node',
      style: {
        'shape': 'round-rectangle',
        'corner-radius': 3,
        'width': function(ele) { return (SIZES[ele.data('category')] || SIZES.concept).w; },
        'height': function(ele) { return (SIZES[ele.data('category')] || SIZES.concept).h; },
        'background-color': '#F5F0E8',
        'border-width': 2,
        'border-color': function(ele) { return (CATS[ele.data('category')] || CATS.concept).color; },
        'border-opacity': 0.8,
        // Scribble SVG background — handwritten note-card effect
        'background-image': function(ele) { return getScribble(ele.data('category'), ele.id()); },
        'background-width': '100%',
        'background-height': '100%',
        'background-clip': 'node',
        // Label text — centered inside the node
        'label': 'data(label)',
        'font-family': '"Caveat", cursive',
        'font-size': 11,
        'font-weight': 700,
        'color': '#2C1810',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-outline-color': 'rgba(245, 240, 232, 0.85)',
        'text-outline-width': 2.5,
        'text-max-width': function(ele) {
          return ((SIZES[ele.data('category')] || SIZES.concept).w - 10) + 'px';
        },
        'text-wrap': 'wrap',
        'text-overflow-wrap': 'anywhere',
        'ghost': 'yes',
        'ghost-offset-x': 2,
        'ghost-offset-y': 2,
        'ghost-opacity': 0.08,
        'overlay-opacity': 0,
        'z-index': 1
      }
    },

    // === PERSON ===
    {
      selector: 'node[category="person"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': '#F5F0E8',
        'border-color': '#4A90D9'
      }
    },

    // === EVENT ===
    {
      selector: 'node[category="event"]',
      style: {
        'shape': 'rectangle',
        'background-color': '#FFF8DC',
        'border-color': '#D94A4A',
        'border-style': 'dashed',
        'font-family': '"Patrick Hand", cursive',
        'font-size': 10
      }
    },

    // === CRAFT ===
    {
      selector: 'node[category="craft"]',
      style: {
        'shape': 'ellipse',
        'background-color': '#E8E8E8',
        'border-color': '#8B8B8B'
      }
    },

    // === ALIEN / NHI ===
    {
      selector: 'node[category="alien"]',
      style: {
        'shape': 'diamond',
        'background-color': '#E8F5E9',
        'border-color': '#4AD94A'
      }
    },

    // === PROGRAM ===
    {
      selector: 'node[category="program"]',
      style: {
        'shape': 'rectangle',
        'background-color': '#FFFDE7',
        'border-color': '#D9C84A',
        'font-family': '"Courier New", monospace',
        'font-size': 9,
        'text-transform': 'uppercase'
      }
    },

    // === ORGANIZATION ===
    {
      selector: 'node[category="organization"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': '#FFF3E0',
        'border-color': '#D9854A'
      }
    },

    // === EPISODE ===
    {
      selector: 'node[category="episode"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': '#F3E5F5',
        'border-color': '#9B59B6',
        'font-size': 9
      }
    },

    // === CONCEPT ===
    {
      selector: 'node[category="concept"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': '#FAFAFA',
        'border-color': '#95A5A6',
        'font-style': 'italic'
      }
    },

    // === LOCATION ===
    {
      selector: 'node[category="location"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': '#E0F7FA',
        'border-color': '#1ABC9C'
      }
    },

    // === EDGES — Red String ===
    {
      selector: 'edge',
      style: {
        'line-color': '#CC2200',
        'width': function(ele) { return 0.8 + (ele.data('weight') || 1) * 0.3; },
        'curve-style': 'unbundled-bezier',
        'control-point-distances': function(ele) {
          var h = hash(ele.id());
          var offset = 12 + (h % 30);
          return (h % 2 === 0) ? offset : -offset;
        },
        'control-point-weights': 0.5,
        'opacity': 0.45,
        'target-arrow-shape': 'none',
        'source-arrow-shape': 'none',
        'overlay-opacity': 0
      }
    },

    // === HIGHLIGHTED STATES ===
    {
      selector: 'node.highlighted',
      style: {
        'border-width': 3.5,
        'border-color': '#FF0000',
        'underlay-color': '#FF0000',
        'underlay-padding': 6,
        'underlay-opacity': 0.12,
        'z-index': 20,
        'opacity': 1
      }
    },
    {
      selector: 'node.selected-node',
      style: {
        'border-width': 4,
        'border-color': '#FF0000',
        'underlay-color': '#FF0000',
        'underlay-padding': 8,
        'underlay-opacity': 0.2,
        'z-index': 30,
        'opacity': 1
      }
    },
    {
      selector: 'edge.highlighted',
      style: {
        'line-color': '#FF0000',
        'width': 2.5,
        'opacity': 0.9,
        'z-index': 10
      }
    },

    // === DIMMED STATES ===
    {
      selector: 'node.dimmed',
      style: {
        'opacity': 0.12,
        'z-index': 0
      }
    },
    {
      selector: 'edge.dimmed',
      style: {
        'opacity': 0.05,
        'z-index': 0
      }
    },

    // === SEARCH MATCH ===
    {
      selector: 'node.search-match',
      style: {
        'border-width': 3,
        'border-color': '#FFD700',
        'underlay-color': '#FFD700',
        'underlay-padding': 5,
        'underlay-opacity': 0.2,
        'z-index': 15,
        'opacity': 1
      }
    },
    {
      selector: 'node.search-dimmed',
      style: {
        'opacity': 0.1,
        'z-index': 0
      }
    },
    {
      selector: 'edge.search-dimmed',
      style: {
        'opacity': 0.03,
        'z-index': 0
      }
    }
  ];

  // Initialize Cytoscape
  var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: elements,
    style: stylesheet,
    layout: { name: 'preset' }, // We'll run layout manually
    minZoom: 0.15,
    maxZoom: 4,
    wheelSensitivity: 0.3,
    boxSelectionEnabled: false,
    autounselectify: true
  });

  AlchemyBoard.cy = cy;
  return cy;
};

AlchemyBoard.runLayout = function() {
  var cy = AlchemyBoard.cy;
  if (!cy) return;

  var layout = cy.layout(AlchemyBoard.LAYOUT_OPTIONS);
  layout.on('layoutstop', function() {
    AlchemyBoard.layoutDone = true;
    if (AlchemyBoard.onLayoutDone) {
      AlchemyBoard.onLayoutDone();
    }
  });
  layout.run();
};
