import { Hono } from 'hono';
import { cors } from 'hono/cors'

import STANDINGS_PREMIER_LEAGUE_2023 from "../db/2023/standings/standingsPremierLeague2023Flashcore.json";
import STANDINGS_LA_LIGA_2023 from "../db/2023/standings/standingsLaLiga2023Flashcore.json";
import STANDINGS_LIGUE_ONE_2023 from "../db/2023/standings/standingsLigue12023Flashcore.json";
import STANDINGS_SERIE_A_2023 from "../db/2023/standings/standingsSerieA2023Flashcore.json";
import STANDINGS_BUNDESLIGA_2023 from "../db/2023/standings/standingsBundesliga2023Flashcore.json";

import SCORERS_PREMIER_LEAGUE_2023 from "../db/2023/scorers/scorersPremierLeague2023Flashcore.json";
import SCORERS_LA_LIGA_2023 from "../db/2023/scorers/scorersLaLiga2023Flashcore.json";
import SCORERS_LIGUE_ONE_2023 from "../db/2023/scorers/scorersLigue12023Flashcore.json";
import SCORERS_SERIE_A_2023 from "../db/2023/scorers/scorersSerieA2023Flashcore.json";
import SCORERS_BUNDESLIGA_2023 from "../db/2023/scorers/scorersBundesliga2023Flashcore.json";

import MATCHES_PREMIER_LEAGUE_2023 from "../db/2023/matches/matchesPremierLeague2023Flashcore.json";
import MATCHES_LA_LIGA_2023 from "../db/2023/matches/matchesLaLiga2023Flashcore.json";
import MATCHES_LIGUE_ONE_2023 from "../db/2023/matches/matchesLigue12023Flashcore.json";
import MATCHES_SERIE_A_2023 from "../db/2023/matches/matchesSerieA2023Flashcore.json";
import MATCHES_BUNDESLIGA_2023 from "../db/2023/matches/matchesBundesliga2023Flashcore.json";

import SCHEDULES_PREMIER_LEAGUE_2023 from "../db/2023/schedules/schedulesPremierLeague2023Flashcore.json";
import SCHEDULES_LA_LIGA_2023 from "../db/2023/schedules/schedulesLaLiga2023Flashcore.json";
import SCHEDULES_LIGUE_ONE_2023 from "../db/2023/schedules/schedulesLigue12023Flashcore.json";
import SCHEDULES_SERIE_A_2023 from "../db/2023/schedules/schedulesSerieA2023Flashcore.json";
import SCHEDULES_BUNDESLIGA_2023 from "../db/2023/schedules/schedulesBundesliga2023Flashcore.json";

import AREAS from "../db/areas.json";
import COMPETITIONS from "../db/competitions.json";
import TEAMS from "../db/teams.json";
import PLAYERS from "../db/players.json";

const APP = new Hono();
const BASE_URL = "https://api.footballr.workers.dev";
const API_VERSION = "v30052024";
APP.use('/*', cors());

function formatDate(API_VERSION) {
	const DAY = API_VERSION.substring(1, 3);
	const MONTH = API_VERSION.substring(3, 5);
	const YEAR = API_VERSION.substring(5);
	return `${DAY}.${MONTH}.${YEAR}`;
}

function generateParameters(name, endpoint, description, example, status) {
	return {
		name,
		endpoint,
		description,
		example,
		status
	};
}

const AREAS_ENDPOINT = {
	endpoint: '/areas',
	description: 'List all available areas 🌍.',
	example: `${BASE_URL}/areas`,
	status: "Available 🟢.",
	parameters: [
		generateParameters("id", "/areas/:id", "List one area given by id 🔍.", `${BASE_URL}/areas/ITA`, "Available 🟢.")
	]
};

const COMPETITIONS_ENDPOINT = {
	endpoint: '/competitions',
	description: 'List all available competitions 🏆.',
	example: `${BASE_URL}/competitions`,
	status: "Available 🟢.",
	parameters: [
		generateParameters("id", "/competitions/:id", "List one competition given by id 🔍.", `${BASE_URL}/competitions/LAL`, "Available 🟢."),
		generateParameters("standings", "/competitions/:id/standings", "List the current standings for a league 🔝.", `${BASE_URL}/competitions/LAL/standings`, "Available 🟢."),
		generateParameters("scorers", "/competitions/:id/scorers/", "List the current scorers for a league ⚽.", `${BASE_URL}/competitions/LI1/scorers`, "Available 🟢."),
		generateParameters("matches", "/competitions/:id/matches/", "List the current matches results for a league 🆚.", `${BASE_URL}/competitions/PRL/matches`, "Available 🟢."),
		generateParameters("schedules", "/competitions/:id/schedules/", "List the next scheduled matches for a league 🔜.", `${BASE_URL}/competitions/BUN/schedules`, "Available 🟢."),
		generateParameters("round", "/competitions/:id/matches/:round", "List of matches, filtered by a completed matchday 🔍.", `${BASE_URL}/competitions/SEA/matches/1`, "Available 🟢."),
		generateParameters("idMatch", "/competitions/:id/matches/:round/:idMatch", "List 1 match, given by round and id of the match 🔍.", `${BASE_URL}/competitions/PRL/matches/1/EkT4QbqS`, "Available 🟢.")
	]
};

const TEAMS_ENDPOINT = {
	endpoint: '/teams',
	description: 'List all available teams 🛡️.',
	example: `${BASE_URL}/teams`,
	status: "Available 🟢.",
	parameters: [
		generateParameters("id", "/teams/:id", "List one team given by id 🔍.", `${BASE_URL}/teams/W8mj7MDD`, "Available 🟢.")
	]
};

const FOOTBALLR_ENDPOINT = {
	name: "FootballR Api ⚽",
	version: API_VERSION,
	updated: formatDate(API_VERSION),
	message: 'Created with 💙 by Miguel Zafra.'
};

APP.get('/', (ctx) => {
	const DATA = [AREAS_ENDPOINT, COMPETITIONS_ENDPOINT, TEAMS_ENDPOINT, FOOTBALLR_ENDPOINT];
	return ctx.json(DATA);
});

APP.get('/areas', (ctx) => {
	return ctx.json(AREAS);
});

APP.get('/areas/:id', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let found = AREAS.areas.find((area) => area.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

APP.get('/competitions', (ctx) => {
	return ctx.json(COMPETITIONS);
});

APP.get('/competitions/:id', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

APP.get('/competitions/:id/standings', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(STANDINGS_PREMIER_LEAGUE_2023);
			case "LAL": return ctx.json(STANDINGS_LA_LIGA_2023);
			case "LI1": return ctx.json(STANDINGS_LIGUE_ONE_2023);
			case "SEA": return ctx.json(STANDINGS_SERIE_A_2023);
			case "BUN": return ctx.json(STANDINGS_BUNDESLIGA_2023);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/matches', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(MATCHES_PREMIER_LEAGUE_2023);
			case "LAL": return ctx.json(MATCHES_LA_LIGA_2023);
			case "LI1": return ctx.json(MATCHES_LIGUE_ONE_2023);
			case "SEA": return ctx.json(MATCHES_SERIE_A_2023);
			case "BUN": return ctx.json(MATCHES_BUNDESLIGA_2023);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/matches/:round', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let round = parseInt(ctx.req.param("round"));
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	let foundRound;
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL":
				foundRound = MATCHES_PREMIER_LEAGUE_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LAL":
				foundRound = MATCHES_LA_LIGA_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LI1":
				foundRound = MATCHES_LIGUE_ONE_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "SEA":
				foundRound = MATCHES_SERIE_A_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "BUN":
				foundRound = MATCHES_BUNDESLIGA_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		};
	}
});

APP.get('/competitions/:id/matches/:round/:idMatch', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let round = parseInt(ctx.req.param("round"));
	let idMatch = ctx.req.param("idMatch")
	let foundRound;
	let foundMatch;
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	if (!found) {
		return ctx.json({ message: 'Not Found. 😔' }, 404);
	}
	switch (id) {
		case "PRL":
			foundRound = MATCHES_PREMIER_LEAGUE_2023.season.find((match) => match.round === round);
			break;
		case "LAL":
			foundRound = MATCHES_LA_LIGA_2023.season.find((match) => match.round === round);
			break;
		case "LI1":
			foundRound = MATCHES_LIGUE_ONE_2023.season.find((match) => match.round === round);
			break;
		case "SEA":
			foundRound = MATCHES_SERIE_A_2023.season.find((match) => match.round === round);
			break;
		case "BUN":
			foundRound = MATCHES_BUNDESLIGA_2023.season.find((match) => match.round === round);
			break;
		default:
			return ctx.json({ message: 'Not Found. 😔' }, 404);
	}
	if (foundRound) {
		foundMatch = foundRound.matches.find((match) => match.id === idMatch);
		if (foundMatch) {
			return ctx.json(foundMatch);
		} else {
			return ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		return ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/scorers', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(SCORERS_PREMIER_LEAGUE_2023);
			case "LAL": return ctx.json(SCORERS_LA_LIGA_2023);
			case "LI1": return ctx.json(SCORERS_LIGUE_ONE_2023);
			case "SEA": return ctx.json(SCORERS_SERIE_A_2023);
			case "BUN": return ctx.json(SCORERS_BUNDESLIGA_2023);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/schedules', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(SCHEDULES_PREMIER_LEAGUE_2023);
			case "LAL": return ctx.json(SCHEDULES_LA_LIGA_2023);
			case "LI1": return ctx.json(SCHEDULES_LIGUE_ONE_2023);
			case "SEA": return ctx.json(SCHEDULES_SERIE_A_2023);
			case "BUN": return ctx.json(SCHEDULES_BUNDESLIGA_2023);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/schedules/:round', (ctx) => {
	let id = ctx.req.param("id").toUpperCase();
	let round = parseInt(ctx.req.param("round"));
	let foundRound;
	let found = COMPETITIONS.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL":
				foundRound = SCHEDULES_PREMIER_LEAGUE_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LAL":
				foundRound = SCHEDULES_LA_LIGA_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LI1":
				foundRound = SCHEDULES_LIGUE_ONE_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "SEA":
				foundRound = SCHEDULES_SERIE_A_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "BUN":
				foundRound = SCHEDULES_BUNDESLIGA_2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		};
	}
});

APP.get('/teams', (ctx) => {
	return ctx.json(TEAMS);
});

APP.get('/teams/:id', (ctx) => {
	let id = ctx.req.param("id");
	let found = TEAMS.teams.find((team) => team.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

APP.get('/players', (ctx) => {
	return ctx.json(PLAYERS);
});

APP.get('/players/:id', (ctx) => {
	let id = ctx.req.param("id");
	let found = PLAYERS.players.find((player) => player.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

APP.notFound((ctx) => {
	const { PATH_NAME } = new URL(ctx.req.url);
	if (ctx.req.url.at(-1) === '/') {
		return ctx.redirect(PATH_NAME.slice(0, -1));
	}
	return ctx.json({ message: 'Not Found. 😔' }, 404);
})

export default APP;