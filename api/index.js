import { Hono } from 'hono';
import { cors } from 'hono/cors'

import standingsPremierLeague2023 from "../db/2023/standings/standingsPremierLeague2023Flashcore.json";
import standingsLaLiga2023 from "../db/2023/standings/standingsLaLiga2023Flashcore.json";
import standingsLigue12023 from "../db/2023/standings/standingsLigue12023Flashcore.json";
import standingsSerieA2023 from "../db/2023/standings/standingsSerieA2023Flashcore.json";
import standingsBundesliga2023 from "../db/2023/standings/standingsBundesliga2023Flashcore.json";

import scorersPremierLeague2023 from "../db/2023/scorers/scorersPremierLeague2023Flashcore.json";
import scorersLaLiga2023 from "../db/2023/scorers/scorersLaLiga2023Flashcore.json";
import scorersLigue12023 from "../db/2023/scorers/scorersLigue12023Flashcore.json";
import scorersSerieA2023 from "../db/2023/scorers/scorersSerieA2023Flashcore.json";
import scorersBundesliga2023 from "../db/2023/scorers/scorersBundesliga2023Flashcore.json";

import matchesPremierLeague2023 from "../db/2023/matches/matchesPremierLeague2023Flashcore.json";
import matchesLaLiga2023 from "../db/2023/matches/matchesLaLiga2023Flashcore.json";
import matchesLigue12023 from "../db/2023/matches/matchesLigue12023Flashcore.json";
import matchesSerieA2023 from "../db/2023/matches/matchesSerieA2023Flashcore.json";
import matchesBundesliga2023 from "../db/2023/matches/matchesBundesliga2023Flashcore.json";

import areas from "../db/areas.json";
import competitions from "../db/competitions.json";
import teams from "../db/teams.json";

const APP = new Hono();

APP.use('/*', cors());

APP.get('/', (ctx) => {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, '0');

	const areasEndpoint = {
		endpoint: '/areas',
		description: 'List all available areas 🌍.',
		example: "https://zeus-api.olympus.workers.dev/areas",
		status: "Available 🟢.",
		parameters: [
			{
				name: "id",
				endpoint: "/areas/:id",
				description: "List one area given by id 🔍.",
				example: "https://zeus-api.olympus.workers.dev/areas/ITA",
				status: "Available 🟢."
			}
		]
	};

	const competitionsEndpoint = {
		endpoint: '/competitions',
		description: 'List all available competitions 🏆.',
		example: "https://zeus-api.olympus.workers.dev/competitions",
		status: "Available 🟢.",
		parameters: [
			{
				name: "id",
				endpoint: "/competitions/:id",
				description: "List one competition given by id 🔍.",
				example: "https://zeus-api.olympus.workers.dev/competitions/LAL",
				status: "Available 🟢."
			},
			{
				name: "standings",
				endpoint: "/competitions/:id/standings",
				description: "List the current standings for a league 🔝.",
				example: "https://zeus-api.olympus.workers.dev/competitions/LAL/standings",
				status: "Available 🟢."
			},
			{
				name: "scorers",
				endpoint: '/competitions/:id/scorers/',
				description: 'List the current scorers for a league ⚽.',
				example: "https://zeus-api.olympus.workers.dev/competitions/LI1/scorers",
				status: "Available 🟢.",
			},
			{
				name: "matches",
				endpoint: '/competitions/:id/matches/',
				description: 'List the current matches for a league 🆚.',
				example: "https://zeus-api.olympus.workers.dev/competitions/PRL/matches",
				status: "Available 🟢.",
			},
			{
				name: "round",
				endpoint: "/competitions/:id/matches/:round",
				description: "List of matches, filtered by a completed matchday 🔍.",
				example: "https://zeus-api.olympus.workers.dev/competitions/SEA/matches/24",
				status: "Available 🟢."
			},
			{
				name: "idMatch",
				endpoint: "/competitions/:id/matches/:round/:idMatch",
				description: "List 1 match, given by round and id of the match 🔍.",
				example: "https://zeus-api.olympus.workers.dev/competitions/BUN/matches/24/vyLD5nYN",
				status: "Available 🟢."
			}
		]
	};

	const zeusAPI = {
		name: "Zeus API ⚡",
		version: 'v1.14',
		updated: `${day}.${month}.${year} ${hours}:${minutes}`,
		message: 'Created with 💙 by Miguel Zafra.'
	};

	const data = [areasEndpoint, competitionsEndpoint, zeusAPI];

	return ctx.json(data);
})

APP.get('/areas', (ctx) => {
	return ctx.json(areas);
});

APP.get('/areas/:id', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = areas.areas.find((area) => area.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

/*APP.get('/teams', (ctx) => {
	return ctx.json(teams);
});

APP.get('/teams/:id', (ctx) => {
	const id = ctx.req.param("id");
	const found = teams.teams.find((team) => team.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});*/

APP.get('/competitions', (ctx) => {
	return ctx.json(competitions);
});

APP.get('/competitions/:id', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = competitions.competitions.find((competition) => competition.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

APP.get('/competitions/:id/standings', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(standingsPremierLeague2023);
			case "LAL": return ctx.json(standingsLaLiga2023);
			case "LI1": return ctx.json(standingsLigue12023);
			case "SEA": return ctx.json(standingsSerieA2023);
			case "BUN": return ctx.json(standingsBundesliga2023);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

// matches
APP.get('/competitions/:id/matches', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(matchesPremierLeague2023);
			case "LAL": return ctx.json(matchesLaLiga2023);
			case "LI1": return ctx.json(matchesLigue12023);
			case "SEA": return ctx.json(matchesSerieA2023);
			case "BUN": return ctx.json(matchesBundesliga2023);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/matches/:round', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const round = parseInt(ctx.req.param("round"));
	var foundRound;
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL":
				foundRound = matchesPremierLeague2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LAL":
				foundRound = matchesLaLiga2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LI1":
				foundRound = matchesLigue12023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "SEA":
				foundRound = matchesSerieA2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "BUN":
				foundRound = matchesBundesliga2023.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		};
	}
});

APP.get('/competitions/:id/matches/:round/:idMatch', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const round = parseInt(ctx.req.param("round"));
	const idMatch = ctx.req.param("idMatch")
	let foundRound;
	let foundMatch;
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) {
		return ctx.json({ message: 'Not Found. 😔' }, 404);
	}
	switch (id) {
		case "PRL":
			foundRound = matchesPremierLeague2023.season.find((match) => match.round === round);
			break;
		case "LAL":
			foundRound = matchesLaLiga2023.season.find((match) => match.round === round);
			break;
		case "LI1":
			foundRound = matchesLigue12023.season.find((match) => match.round === round);
			break;
		case "SEA":
			foundRound = matchesSerieA2023.season.find((match) => match.round === round);
			break;
		case "BUN":
			foundRound = matchesBundesliga2023.season.find((match) => match.round === round);
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

// scorers
APP.get('/competitions/:id/scorers', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(scorersPremierLeague2023);
			case "LAL": return ctx.json(scorersLaLiga2023);
			case "LI1": return ctx.json(scorersLigue12023);
			case "SEA": return ctx.json(scorersSerieA2023);
			case "BUN": return ctx.json(scorersBundesliga2023);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.notFound((ctx) => {
	const { pathname } = new URL(ctx.req.url);
	if (ctx.req.url.at(-1) === '/') {
		return ctx.redirect(pathname.slice(0, -1));
	}
	return ctx.json({ message: 'Not Found. 😔' }, 404);
})

export default APP;