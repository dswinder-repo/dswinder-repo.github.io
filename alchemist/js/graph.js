/* === THE ALCHEMIST BOARD — Graph Initialization === */

window.AlchemyBoard = window.AlchemyBoard || {};

AlchemyBoard.initGraph = function() {
  var hash = AlchemyBoard.simpleHash;
  var CATS = AlchemyBoard.CATEGORIES;
  var SIZES = AlchemyBoard.NODE_SIZES;

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
          image: n.image || ''
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
        'label': 'data(label)',
        'font-family': '"Caveat", cursive',
        'font-size': 11,
        'font-weight': 700,
        'color': '#2C1810',
        'text-valign': 'bottom',
        'text-margin-y': 7,
        'text-outline-color': 'rgba(245, 240, 232, 0.9)',
        'text-outline-width': 2,
        'text-max-width': '95px',
        'text-wrap': 'wrap',
        'text-overflow-wrap': 'anywhere',
        'ghost': 'yes',
        'ghost-offset-x': 2,
        'ghost-offset-y': 2,
        'ghost-opacity': 0.12,
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
        'border-color': '#4A90D9',
        'text-valign': 'bottom'
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
        'font-size': 9,
        'text-max-width': '80px'
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
