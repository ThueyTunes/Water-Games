/* Game data.
 *
 * These arrays are EMPTY on purpose. Every screen renders an empty state when
 * its list has nothing in it, so the app ships with no invented players, teams
 * or clips. The shapes below are the contract — drop real records in (or point
 * these at an API response) and every screen fills in with no other changes.
 */

window.S = window.S || {};
window.S.screens = window.S.screens || {};

window.S.data = {
  // Set once the player joins a game. { code, phase, quota, playersIn, playersOut,
  // entryFee, pot, teamFee }
  game: null,

  // Games open for registration on the Join screen.
  // { name, code, status, joined, fee }
  openGames: [],

  // Teams in the current game.
  // { name, color, alive, roster, hits, phaseHits, phase, mine }
  teams: [],

  // Players ranked for the leaderboard.
  // { name, color, team, meta, elims, phase3, days, out, mine }
  leaders: [],

  // Everyone in the game, for the Participants tab.
  // { name, color, meta, out }
  participants: [],

  // Approved clips behind the Hits grid.
  // { actor, target, place, team, phase, time, h }
  hits: [],

  // Teams with open slots on the Pick-your-team screen.
  // { name, color, meta, filled, roster, captain }
  openTeams: [],

  // Roster of the player's own team, for the Team screen.
  // { name, meta, captain, out, mine }
  roster: [],

  // Who the player may tag, for step 2 of the capture flow.
  // { name, color, meta, blocked }
  targets: [],

  // Team colors. Any color already claimed in the game goes in `taken`.
  palette: [
    { c: '#12A66B', name: 'Green' },
    { c: '#E8332A', name: 'Red' },
    { c: '#7C3AED', name: 'Purple' },
    { c: '#1F79F5', name: 'Blue' },
    { c: '#F0A500', name: 'Amber' },
    { c: '#16256B', name: 'Navy' }
  ],
  taken: [],

  // Saved payment methods. { key, name, note }
  paymentMethods: []
};
