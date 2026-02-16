/* === THE ALCHEMIST BOARD — Configuration === */

window.AlchemyBoard = window.AlchemyBoard || {};

// Category definitions
AlchemyBoard.CATEGORIES = {
  person: {
    label: 'People',
    color: '#4A90D9',
    icon: '\u{1F464}',
    subcategories: ['experiencer', 'whistleblower', 'scientist', 'military', 'politician', 'journalist', 'researcher', 'intelligence', 'host', 'public-figure', 'filmmaker', 'investor', 'academic', 'medical', 'advisor']
  },
  event: {
    label: 'Events',
    color: '#D94A4A',
    icon: '\u{26A1}',
    subcategories: ['sighting', 'crash', 'encounter', 'hearing', 'conference', 'leak', 'incident', 'historical', 'policy', 'symposium']
  },
  craft: {
    label: 'Craft',
    color: '#8B8B8B',
    icon: '\u{1F6F8}',
    subcategories: ['tic-tac', 'triangle', 'orb', 'disc', 'sphere', 'octagon', 'egg', 'cigar', 'unknown']
  },
  alien: {
    label: 'NHI Types',
    color: '#4AD94A',
    icon: '\u{1F47D}',
    subcategories: ['grey', 'mantis', 'nordic', 'reptilian', 'tall-white', 'insectoid', 'interdimensional', 'unknown']
  },
  program: {
    label: 'Programs',
    color: '#D9C84A',
    icon: '\u{1F4C1}',
    subcategories: ['government', 'military', 'intelligence', 'corporate', 'academic']
  },
  organization: {
    label: 'Organizations',
    color: '#D9854A',
    icon: '\u{1F3DB}',
    subcategories: ['government', 'military', 'corporate', 'research', 'media', 'intelligence', 'academic', 'advisory', 'venture-capital']
  },
  episode: {
    label: 'Episodes',
    color: '#9B59B6',
    icon: '\u{1F3AC}',
    subcategories: ['interview', 'documentary', 'investigation', 'analysis', 'commentary']
  },
  concept: {
    label: 'Topics',
    color: '#95A5A6',
    icon: '\u{1F4A1}',
    subcategories: ['physics', 'biology', 'consciousness', 'disclosure', 'disinformation', 'technology', 'ancient', 'paranormal', 'economics', 'phenomenology']
  },
  location: {
    label: 'Locations',
    color: '#1ABC9C',
    icon: '\u{1F4CD}',
    subcategories: ['military-base', 'research-facility', 'encounter-site', 'country', 'landmark']
  }
};

// Edge relationship types
AlchemyBoard.RELATIONSHIPS = {
  led:           { label: 'led' },
  directed:      { label: 'directed' },
  witnessed:     { label: 'witnessed' },
  investigated:  { label: 'investigated' },
  appeared_in:   { label: 'appeared in' },
  associated:    { label: 'associated with' },
  reported_on:   { label: 'reported on' },
  connected_to:  { label: 'connected to' },
  occurred_at:   { label: 'occurred at' },
  worked_at:     { label: 'worked at' },
  funded:        { label: 'funded' },
  studied:       { label: 'studied' },
  described:     { label: 'described' },
  experienced:   { label: 'experienced' },
  disclosed:     { label: 'disclosed' },
  corroborates:  { label: 'corroborates' },
  debriefed:     { label: 'debriefed' },
  created:       { label: 'created' },
  covers:        { label: 'covers' },
  features:      { label: 'features' },
  involves:      { label: 'involves' },
  type_of:       { label: 'type of' },
  sighted_at:    { label: 'sighted at' },
  suppressed:    { label: 'suppressed' },
  member_of:     { label: 'member of' },
  invested_in:   { label: 'invested in' },
  employs:       { label: 'employs' },
  co_authored:   { label: 'co-authored' },
  advised:       { label: 'advised' },
  briefed:       { label: 'briefed' },
  performed_surgery: { label: 'performed surgery on' },
  autopsied:     { label: 'autopsied' },
  alias_of:      { label: 'alias of' },
  uses_protocol: { label: 'uses protocol' },
  influenced:    { label: 'influenced' },
  theorized:     { label: 'theorized' },
  owns_stake:    { label: 'owns stake in' },
  policy_influence: { label: 'influenced policy' },
  son_of:        { label: 'son of' },
  interviewed:   { label: 'interviewed' },
  documented:    { label: 'documented' }
};

// Simple deterministic hash for edge curve offsets
AlchemyBoard.simpleHash = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Layout configuration
AlchemyBoard.LAYOUT_OPTIONS = {
  name: 'fcose',
  quality: 'proof',
  randomize: true,
  animate: true,
  animationDuration: 1200,
  animationEasing: 'ease-out-cubic',
  nodeDimensionsIncludeLabels: true,
  nodeRepulsion: 7000,
  idealEdgeLength: 130,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.3,
  gravityRange: 3.8,
  numIter: 2500,
  tile: true,
  tilingPaddingVertical: 40,
  tilingPaddingHorizontal: 40,
  fit: true,
  padding: 60
};

// Default node sizes per category
AlchemyBoard.NODE_SIZES = {
  person:       { w: 72, h: 88 },
  event:        { w: 88, h: 52 },
  craft:        { w: 58, h: 58 },
  alien:        { w: 62, h: 62 },
  program:      { w: 82, h: 48 },
  organization: { w: 78, h: 48 },
  episode:      { w: 68, h: 44 },
  concept:      { w: 76, h: 34 },
  location:     { w: 68, h: 48 }
};
