import { Hono } from 'hono';
import { cors } from 'hono/cors'

// 2022
import standingsPremierLeague2022 from "../db/2022/standings/standingsPremierLeague2022Flashcore.json";
import standingsLaLiga2022 from "../db/2022/standings/standingsLaLiga2022Flashcore.json";
import standingsLigue12022 from "../db/2022/standings/standingsLigue12022Flashcore.json";
import standingsSerieA2022 from "../db/2022/standings/standingsSerieA2022Flashcore.json";
import standingsBundesliga2022 from "../db/2022/standings/standingsBundesliga2022Flashcore.json";

import scorersPremierLeague2022 from "../db/2022/scorers/scorersPremierLeague2022Flashcore.json";
import scorersLaLiga2022 from "../db/2022/scorers/scorersLaLiga2022Flashcore.json";
import scorersLigue12022 from "../db/2022/scorers/scorersLigue12022Flashcore.json";
import scorersSerieA2022 from "../db/2022/scorers/scorersSerieA2022Flashcore.json";
import scorersBundesliga2022 from "../db/2022/scorers/scorersBundesliga2022Flashcore.json";

import matchesPremierLeague2022 from "../db/2022/matches/matchesPremierLeague2022Flashcore.json";
import matchesLaLiga2022 from "../db/2022/matches/matchesLaLiga2022Flashcore.json";
import matchesLigue12022 from "../db/2022/matches/matchesLigue12022Flashcore.json";
import matchesSerieA2022 from "../db/2022/matches/matchesSerieA2022Flashcore.json";
import matchesBundesliga2022 from "../db/2022/matches/matchesBundesliga2022Flashcore.json";

import areas from "../db/areas.json";
import competitions from "../db/competitions.json";
import teams from "../db/teams.json";

const APP = new Hono();

const CURRENT_YEAR = 2022;

APP.use('/*', cors());

APP.get('/', (ctx) => {
	const date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	let hours = date.getHours();
	let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

	return ctx.json([
		{
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
		},
		{
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
				},
				{
					name: "standings",
					endpoint: "/competitions/:id/standings",
					description: "List the current standings for a league 🔝.",
					example: "https://zeus-api.olympus.workers.dev/competitions/LAL/standings",
					status: "Available 🟢."
				},
				{
					name: "matches",
					endpoint: '/competitions/:id/matches/',
					description: 'List the current matches for a league 🆚.',
					example: "https://zeus-api.olympus.workers.dev/competitions/PRL/matches",
					status: "Available 🟢.",
				},
				{
					name: "scorers",
					endpoint: '/competitions/:id/scorers/',
					description: 'List the current scorers for a league ⚽.',
					example: "https://zeus-api.olympus.workers.dev/competitions/LI1/scorers",
					status: "Available 🟢.",
				}
			]
		},
		{
			name: "Zeus API ⚡",
			version: 'v1.12',
			updated: day + "." + month + "." + year + " " + hours + ":" + minutes,
			message: 'Created with 💙 by Miguel Zafra.'
		}
	]);
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
			case "PRL": return ctx.json(standingsPremierLeague2022);
			case "LAL": return ctx.json(standingsLaLiga2022);
			case "LI1": return ctx.json(standingsLigue12022);
			case "SEA": return ctx.json(standingsSerieA2022);
			case "BUN": return ctx.json(standingsBundesliga2022);
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
			case "PRL": return ctx.json(matchesPremierLeague2022);
			case "LAL": return ctx.json(matchesLaLiga2022);
			case "LI1": return ctx.json(matchesLigue12022);
			case "SEA": return ctx.json(matchesSerieA2022);
			case "BUN": return ctx.json(matchesBundesliga2022);
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
				foundRound = matchesPremierLeague2022.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LAL":
				foundRound = matchesLaLiga2022.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "LI1":
				foundRound = matchesLigue12022.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "SEA":
				foundRound = matchesSerieA2022.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			case "BUN":
				foundRound = matchesBundesliga2022.season.find((match) => match.round === round);
				return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		};
	}
});

APP.get('/competitions/:id/matches/:round/:idMatch', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const round = parseInt(ctx.req.param("round"));
	const idMatch = ctx.req.param("idMatch");
	var foundRound;
	var foundMatch;
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL":
				foundRound = matchesPremierLeague2022.season.find((match) => match.round === round);
				if (foundRound) {
					foundMatch = foundRound.matches.find((match => match.id === idMatch));
					return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
				break;
			case "LAL":
				foundRound = matchesLaLiga2022.season.find((match) => match.round === round);
				if (foundRound) {
					foundMatch = foundRound.matches.find((match => match.id === idMatch));
					return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
				break;
			case "LI1":
				foundRound = matchesLigue12022.season.find((match) => match.round === round);
				if (foundRound) {
					foundMatch = foundRound.matches.find((match => match.id === idMatch));
					return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
				break;
			case "SEA":
				foundRound = matchesSerieA2022.season.find((match) => match.round === round);
				if (foundRound) {
					foundMatch = foundRound.matches.find((match => match.id === idMatch));
					return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
				break;
			case "BUN":
				foundRound = matchesBundesliga2022.season.find((match) => match.round === round);
				if (foundRound) {
					foundMatch = foundRound.matches.find((match => match.id === idMatch));
					return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
				break;
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

// scorers
APP.get('/competitions/:id/scorers', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(scorersPremierLeague2022);
			case "LAL": return ctx.json(scorersLaLiga2022);
			case "LI1": return ctx.json(scorersLigue12022);
			case "SEA": return ctx.json(scorersSerieA2022);
			case "BUN": return ctx.json(scorersBundesliga2022);
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