/* Fixture data, transcribed from the mockups.
   Fictional brand, player-run game, no school affiliation — every name, team
   and roster here is placeholder, exactly as the design brief states. */

window.S = window.S || {};
window.S.screens = window.S.screens || {};

window.S.data = {
  game: {
    name: "Westside Soak '26",
    phase: 3,
    quota: 3,
    playersIn: 41,
    playersOut: 19,
    entryFee: 25,
    pot: 820
  },

  colors: {
    Undertow: '#E8332A',
    Riptide: '#12A66B',
    Kraken: '#7C3AED',
    Tide: '#1F79F5',
    Sandbar: '#F0A500'
  },

  // Home · top teams, and the source for Standings
  teams: [
    { name: 'Undertow', color: '#E8332A', alive: 5, hits: 14, phase: '3/3 THIS PHASE' },
    { name: 'Riptide',  color: '#12A66B', alive: 3, hits: 12, phase: '2/3 THIS PHASE', mine: true },
    { name: 'Kraken',   color: '#7C3AED', alive: 3, hits: 9,  phase: '2/3 THIS PHASE' },
    { name: 'Tide',     color: '#1F79F5', alive: 2, hits: 7,  phase: '0/3 — AT RISK' },
    { name: 'Sandbar',  color: '#F0A500', alive: 2, hits: 3,  phase: '1/3 THIS PHASE' }
  ],

  // Leaderboard · players.
  // `phase3` are this-phase eliminations only; they sum to each team's
  // "n/3 THIS PHASE" count in the standings (8 across the game).
  leaders: [
    { name: 'Maya Okonkwo',   color: '#12A66B', team: 'Riptide',  meta: 'RIPTIDE · CAPTAIN', elims: 5, phase3: 1, days: 12 },
    { name: 'Priya Raman',    color: '#7C3AED', team: 'Kraken',   meta: 'KRAKEN',            elims: 4, phase3: 2, days: 12 },
    { name: 'Deshawn Pierce', color: '#12A66B', team: 'Riptide',  meta: 'RIPTIDE',           elims: 4, phase3: 1, days: 12 },
    { name: 'Jonah Fields',   color: '#1F79F5', team: 'Tide',     meta: 'TIDE',              elims: 3, phase3: 0, days: 12 },
    { name: 'Eli Marchetti',  color: '#F0A500', team: 'Sandbar',  meta: 'SANDBAR',           elims: 3, phase3: 1, days: 12 },
    { name: 'Ty Brennan',     color: '#E8332A', team: 'Undertow', meta: 'UNDERTOW',          elims: 3, phase3: 1, days: 9, out: true },
    { name: 'You',            color: '#12A66B', team: 'Riptide',  meta: 'RIPTIDE',           elims: 3, phase3: 0, days: 12, mine: true },
    { name: 'Sofia Alvarez',  color: '#E8332A', team: 'Undertow', meta: 'UNDERTOW',          elims: 2, phase3: 2, days: 12 }
  ],

  // Approved clips behind the Hits grid. The first four are the ones drawn in
  // the mockup; the rest extend the set so the filters have something to cut.
  hits: [
    { actor: 'Maya',    target: 'Ty',      place: 'parking lot ambush', team: 'Riptide',  phase: 3, time: '0:11', h: 150 },
    { actor: 'Eli',     target: 'Priya',   place: 'bike rack',          team: 'Sandbar',  phase: 3, time: '0:07', h: 110 },
    { actor: 'Deshawn', target: 'Ana',     place: 'front porch',        team: 'Riptide',  phase: 3, time: '0:22', h: 110 },
    { actor: 'Jonah',   target: 'Chris',   place: 'bus stop',           team: 'Tide',     phase: 2, time: '0:09', h: 150 },
    { actor: 'Priya',   target: 'Jonah',   place: 'driveway',           team: 'Kraken',   phase: 3, time: '0:12', h: 120 },
    { actor: 'Sofia',   target: 'Eli',     place: 'gym doors',          team: 'Undertow', phase: 2, time: '0:15', h: 130 },
    { actor: 'Maya',    target: 'Jonah',   place: 'track lot',          team: 'Riptide',  phase: 2, time: '0:08', h: 125 },
    { actor: 'Ty',      target: 'Sofia',   place: 'corner store',       team: 'Undertow', phase: 1, time: '0:18', h: 140 }
  ],

  // Participants · everyone, alive first
  participants: [
    { name: 'Maya Okonkwo',   color: '#12A66B', meta: 'RIPTIDE · 5 ELIMS · 12 DAYS IN' },
    { name: 'Priya Raman',    color: '#7C3AED', meta: 'KRAKEN · 4 ELIMS · 12 DAYS IN' },
    { name: 'Deshawn Pierce', color: '#12A66B', meta: 'RIPTIDE · 4 ELIMS · 12 DAYS IN' },
    { name: 'Jonah Fields',   color: '#1F79F5', meta: 'TIDE · 3 ELIMS · 12 DAYS IN' },
    { name: 'Ty Brennan',     color: '#E8332A', meta: 'UNDERTOW · 3 ELIMS · OUT PHASE 3', out: true },
    { name: 'Ana Ruiz',       color: '#12A66B', meta: 'RIPTIDE · 1 ELIM · OUT PHASE 3',   out: true },
    { name: 'Chris Vaughn',   color: '#12A66B', meta: 'RIPTIDE · 0 ELIMS · OUT PHASE 2',  out: true }
  ],

  // Teams with open slots (Pick your team)
  openTeams: [
    { name: 'Tide',    color: '#1F79F5', meta: '3 OF 5 FILLED · 7 HITS · CAPTAIN JONAH F.', pick: true },
    { name: 'Kraken',  color: '#7C3AED', meta: '4 OF 5 FILLED · 9 HITS · CAPTAIN PRIYA R.' },
    { name: 'Sandbar', color: '#F0A500', meta: '2 OF 5 FILLED · 3 HITS · CAPTAIN ELI M.' }
  ],

  // Riptide roster (Team detail)
  roster: [
    { name: 'Maya Okonkwo',   meta: '5 HITS · ALIVE', captain: true },
    { name: 'You',            meta: '3 HITS · ALIVE', dot: true },
    { name: 'Deshawn Pierce', meta: '4 HITS · ALIVE', dot: true },
    { name: 'Ana Ruiz',       meta: 'OUT · SOAKED BY DESHAWN P.', out: true },
    { name: 'Chris Vaughn',   meta: 'OUT · PHASE 2', out: true }
  ],

  // Tag step · who you can and can't pick
  targets: [
    { name: 'Ty Brennan',   color: '#E8332A', meta: 'UNDERTOW · ALIVE', picked: true },
    { name: 'Priya Raman',  color: '#7C3AED', meta: 'KRAKEN · ALIVE' },
    { name: 'Jonah Fields', color: '#1F79F5', meta: 'TIDE · ALIVE' },
    { name: 'Maya Okonkwo', blocked: 'Your own team — not a valid target this phase' },
    { name: 'Ana Ruiz',     blocked: 'Immune for 3h 12m after being hit' }
  ]
};
