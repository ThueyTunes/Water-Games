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

  // Leaderboard · players
  leaders: [
    { name: 'Maya Okonkwo',   color: '#12A66B', meta: 'RIPTIDE · CAPTAIN', elims: 5 },
    { name: 'Priya Raman',    color: '#7C3AED', meta: 'KRAKEN',            elims: 4 },
    { name: 'Deshawn Pierce', color: '#12A66B', meta: 'RIPTIDE',           elims: 4 },
    { name: 'Jonah Fields',   color: '#1F79F5', meta: 'TIDE',              elims: 3 },
    { name: 'Eli Marchetti',  color: '#F0A500', meta: 'SANDBAR',           elims: 3 },
    { name: 'Ty Brennan',     color: '#E8332A', meta: 'UNDERTOW',          elims: 3, out: true },
    { name: 'You',            color: '#12A66B', meta: 'RIPTIDE',           elims: 3, mine: true },
    { name: 'Sofia Alvarez',  color: '#E8332A', meta: 'UNDERTOW',          elims: 2 }
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
