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

// 2021
import standingsPremierLeague2021 from "../db/2021/standings/standingsPremierLeague2021Flashcore.json";
import standingsLaLiga2021 from "../db/2021/standings/standingsLaLiga2021Flashcore.json";
import standingsLigue12021 from "../db/2021/standings/standingsLigue12021Flashcore.json";
import standingsSerieA2021 from "../db/2021/standings/standingsSerieA2021Flashcore.json";
import standingsBundesliga2021 from "../db/2021/standings/standingsBundesliga2021Flashcore.json";

import scorersPremierLeague2021 from "../db/2021/scorers/scorersPremierLeague2021Flashcore.json";
import scorersLaLiga2021 from "../db/2021/scorers/scorersLaLiga2021Flashcore.json";
import scorersLigue12021 from "../db/2021/scorers/scorersLigue12021Flashcore.json";
import scorersSerieA2021 from "../db/2021/scorers/scorersSerieA2021Flashcore.json";
import scorersBundesliga2021 from "../db/2021/scorers/scorersBundesliga2021Flashcore.json";

import matchesPremierLeague2021 from "../db/2021/matches/matchesPremierLeague2021Flashcore.json";
import matchesLaLiga2021 from "../db/2021/matches/matchesLaLiga2021Flashcore.json";
import matchesLigue12021 from "../db/2021/matches/matchesLigue12021Flashcore.json";
import matchesSerieA2021 from "../db/2021/matches/matchesSerieA2021Flashcore.json";
import matchesBundesliga2021 from "../db/2021/matches/matchesBundesliga2021Flashcore.json";

// 2020
import standingsPremierLeague2020 from "../db/2020/standings/standingsPremierLeague2020Flashcore.json";
import standingsLaLiga2020 from "../db/2020/standings/standingsLaLiga2020Flashcore.json";
import standingsLigue12020 from "../db/2020/standings/standingsLigue12020Flashcore.json";
import standingsSerieA2020 from "../db/2020/standings/standingsSerieA2020Flashcore.json";
import standingsBundesliga2020 from "../db/2020/standings/standingsBundesliga2020Flashcore.json";

import scorersPremierLeague2020 from "../db/2020/scorers/scorersPremierLeague2020Flashcore.json";
import scorersLaLiga2020 from "../db/2020/scorers/scorersLaLiga2020Flashcore.json";
import scorersLigue12020 from "../db/2020/scorers/scorersLigue12020Flashcore.json";
import scorersSerieA2020 from "../db/2020/scorers/scorersSerieA2020Flashcore.json";
import scorersBundesliga2020 from "../db/2020/scorers/scorersBundesliga2020Flashcore.json";

import matchesPremierLeague2020 from "../db/2020/matches/matchesPremierLeague2020Flashcore.json";
import matchesLaLiga2020 from "../db/2020/matches/matchesLaLiga2020Flashcore.json";
import matchesLigue12020 from "../db/2020/matches/matchesLigue12020Flashcore.json";
import matchesSerieA2020 from "../db/2020/matches/matchesSerieA2020Flashcore.json";
import matchesBundesliga2020 from "../db/2020/matches/matchesBundesliga2020Flashcore.json";

import areas from "../db/areas.json";
import competitions from "../db/competitions.json";

const APP = new Hono();

const MIN_YEAR = 2020;
const MAX_YEAR = 2022;

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
					name: "year",
					endpoint: "/competitions/:id/XXXXX/:year",
					description: "List the standings, matches or scorers for a league, given by start year (2020 - 2022) 🔍.",
					example: [
						"https://zeus-api.olympus.workers.dev/competitions/LAL/standings/2020",
						"https://zeus-api.olympus.workers.dev/competitions/LAL/matches/2020",
						"https://zeus-api.olympus.workers.dev/competitions/LAL/scorers/2020",
					],
					status: "Available 🟢."
				},
				{
					name: "round",
					endpoint: "/competitions/:id/matches/:year/:round",
					description: "List of matches, filtered by a completed matchday 🔍.",
					example: "https://zeus-api.olympus.workers.dev/competitions/SEA/matches/2021/24",
					status: "Available 🟢."
				},
				{
					name: "idMatch",
					endpoint: "/competitions/:id/matches/:year/:round/:idMatch",
					description: "List 1 match, given by year, round and id of the match 🔍.",
					example: "https://zeus-api.olympus.workers.dev/competitions/SEA/matches/2021/24/QauKTRb6",
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
		/*
		{
			endpoint: '/teams',
			description: 'List all available teams 🛡️.',
			example: "https://zeus-api.olympus.workers.dev/teams",
			status: "Not available 🔴.",
			parameters: [

			]
		},
		{
			endpoint: '/players',
			description: 'List all available players 🏃.',
			example: "https://zeus-api.olympus.workers.dev/players",
			status: "Not available 🔴.",
			parameters: [

			]
		},*/
		{
			endpoint: '/simulation',
			description: 'Simulates a football match 🔀.',
			example: "https://zeus-api.olympus.workers.dev/simulation",
			status: "Available 🟢.",
			parameters: [
				{
					name: "teams",
					endpoint: "/simulation/:homeTeamId/:awayTeamId",
					description: "Returns a simulated match between two teams, given by id's 🌲.",
					example: "https://zeus-api.olympus.workers.dev/simulation/W8mj7MDD/SKbpVP5K",
					status: "Not available 🔴."
				},
				{
					name: "year",
					endpoint: "/simulation/:homeTeamId/:awayTeamId/:year",
					description: "Returns a simulated match between two teams, given by id's and start year (2020 - 2021) 🌳.",
					example: "https://zeus-api.olympus.workers.dev/simulation/W8mj7MDD/SKbpVP5K",
					status: "Not available 🔴."
				}
			]
		},
		{
			name: "Zeus API ⚡",
			version: 'v1.02',
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

APP.get('/competitions/:id/standings/:year', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const year = ctx.req.param("year");
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(standingsPremierLeague2020);
					case "2021": return ctx.json(standingsPremierLeague2021);
					case "2022": return ctx.json(standingsPremierLeague2022);
				}
			};
				break;
			case "LAL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(standingsLaLiga2020);
					case "2021": return ctx.json(standingsLaLiga2021);
					case "2022": return ctx.json(standingsLaLiga2022);
				}
			};
				break;
			case "LI1": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(standingsLigue12020);
					case "2021": return ctx.json(standingsLigue12021);
					case "2022": return ctx.json(standingsLigue12022);
				}
			};
				break;
			case "SEA": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(standingsSerieA2020);
					case "2021": return ctx.json(standingsSerieA2021);
					case "2022": return ctx.json(standingsSerieA2022);
				}
			};
				break;
			case "BUN": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(standingsBundesliga2020);
					case "2021": return ctx.json(standingsBundesliga2021);
					case "2022": return ctx.json(standingsBundesliga2022);
				}
			};
				break;
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

APP.get('/competitions/:id/matches/:year', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const year = ctx.req.param("year");
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(matchesPremierLeague2020);
					case "2021": return ctx.json(matchesPremierLeague2021);
					case "2022": return ctx.json(matchesPremierLeague2022);
				}
			};
				break;
			case "LAL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(matchesLaLiga2020);
					case "2021": return ctx.json(matchesLaLiga2021);
					case "2022": return ctx.json(matchesLaLiga2022);
				}
			};
				break;
			case "LI1": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(matchesLigue12020);
					case "2021": return ctx.json(matchesLigue12021);
					case "2022": return ctx.json(matchesLigue12022);
				}
			};
				break;
			case "SEA": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(matchesSerieA2020);
					case "2021": return ctx.json(matchesSerieA2021);
					case "2022": return ctx.json(matchesSerieA2022);
				}
			};
				break;
			case "BUN": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(matchesBundesliga2020);
					case "2021": return ctx.json(matchesBundesliga2021);
					case "2022": return ctx.json(matchesBundesliga2022);
				}
			};
				break;
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/matches/:year/:round', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const year = ctx.req.param("year");
	const round = parseInt(ctx.req.param("round"));
	var foundRound;
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesPremierLeague2020.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2021":
						foundRound = matchesPremierLeague2021.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2022":
						foundRound = matchesPremierLeague2022.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
			};
				break;
			case "LAL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesLaLiga2020.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2021":
						foundRound = matchesLaLiga2021.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2022":
						foundRound = matchesLaLiga2022.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
			};
				break;
			case "LI1": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesLigue12020.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2021":
						foundRound = matchesLigue12021.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2022":
						foundRound = matchesLigue12022.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
			};
				break;
			case "SEA": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesSerieA2020.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2021":
						foundRound = matchesSerieA2021.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2022":
						foundRound = matchesSerieA2022.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
			};
				break;
			case "BUN": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesBundesliga2020.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2021":
						foundRound = matchesBundesliga2021.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
					case "2022":
						foundRound = matchesBundesliga2022.season.find((match) => match.round === round);
						return foundRound ? ctx.json(foundRound) : ctx.json({ message: 'Not Found. 😔' }, 404);
				}
			};
				break;
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/matches/:year/:round/:idMatch', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const year = ctx.req.param("year");
	const round = parseInt(ctx.req.param("round"));
	const idMatch = ctx.req.param("idMatch");
	var foundRound;
	var foundMatch;
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesPremierLeague2020.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2021":
						foundRound = matchesPremierLeague2021.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2022":
						foundRound = matchesPremierLeague2022.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
				}
			};
				break;
			case "LAL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesLaLiga2020.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2021":
						foundRound = matchesLaLiga2021.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2022":
						foundRound = matchesLaLiga2022.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
				}
			};
				break;
			case "LI1": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesLigue12020.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2021":
						foundRound = matchesLigue12021.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2022":
						foundRound = matchesLigue12022.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
				}
			};
				break;
			case "SEA": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesSerieA2020.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2021":
						foundRound = matchesSerieA2021.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2022":
						foundRound = matchesSerieA2022.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
				}
			};
				break;
			case "BUN": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020":
						foundRound = matchesBundesliga2020.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2021":
						foundRound = matchesBundesliga2021.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
					case "2022":
						foundRound = matchesBundesliga2022.season.find((match) => match.round === round);
						if (foundRound) {
							foundMatch = foundRound.matches.find((match => match.id === idMatch));
							return foundMatch ? ctx.json(foundMatch) : ctx.json({ message: 'Not Found. 😔' }, 404);
						}
				}
			};
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

APP.get('/competitions/:id/scorers/:year', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const year = ctx.req.param("year");
	const found = competitions.competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(scorersPremierLeague2020);
					case "2021": return ctx.json(scorersPremierLeague2021);
					case "2022": return ctx.json(scorersPremierLeague2022);
				}
			};
				break;
			case "LAL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(scorersLaLiga2020);
					case "2021": return ctx.json(scorersLaLiga2021);
					case "2022": return ctx.json(scorersLaLiga2022);
				}
			};
				break;
			case "LI1": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(scorersLigue12020);
					case "2021": return ctx.json(scorersLigue12021);
					case "2022": return ctx.json(scorersLigue12022);
				}
			};
				break;
			case "SEA": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(scorersSerieA2020);
					case "2021": return ctx.json(scorersSerieA2021);
					case "2022": return ctx.json(scorersSerieA2022);
				}
			};
				break;
			case "BUN": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2020": return ctx.json(scorersBundesliga2020);
					case "2021": return ctx.json(scorersBundesliga2021);
					case "2022": return ctx.json(scorersBundesliga2022);
				}
			};
				break;
			default: ctx.json({ message: 'Not Found. 😔' }, 404);
		}
	} else {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

// TESTING -> LUEGO PONER ERROR 404 SI NO SE DAN PARAMETROS
APP.get('/simulation', (ctx) => {
	const date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	let hours = date.getHours();
	let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

	// Ejemplo de uso
	const equipo1 = "Real Madrid";
	const jugadoresEquipo1 = ["Courtois", "Carvajal", "Varane", "Ramos", "Marcelo", "Kroos", "Modric", "Casemiro", "Asensio", "Benzema", "Vinicius"];
	const equipo2 = "Barcelona";
	const jugadoresEquipo2 = ["Ter Stegen", "Dest", "Piqué", "Lenglet", "Jordi Alba", "Busquets", "De Jong", "Pedri", "Messi", "Griezmann", "Dembele"];
	const golesEquipo1 = [];
	const golesEquipo2 = [];

	for (let i = 0; i < 90; i++) {
		const minuto = i + 1;

		// Generamos un número aleatorio para determinar si se marca un gol
		const golEquipo1 = Math.random() < 0.015;
		const golEquipo2 = Math.random() < 0.015;

		// Si se marca un gol, elegimos un jugador al azar
		if (golEquipo1) {
			let jugador = jugadoresEquipo1[Math.floor(Math.random() * jugadoresEquipo1.length)];
			while (jugador == jugadoresEquipo1[0]) {
				jugador = jugadoresEquipo1[Math.floor(Math.random() * jugadoresEquipo1.length)];
			}
			golesEquipo1.push({ minuto, jugador });
		}
		if (golEquipo2) {
			let jugador = jugadoresEquipo2[Math.floor(Math.random() * jugadoresEquipo2.length)];
			while (jugador == jugadoresEquipo2[0]) {
				jugador = jugadoresEquipo2[Math.floor(Math.random() * jugadoresEquipo2.length)];
			}
			golesEquipo2.push({ minuto, jugador });
		}
	}

	console.log(`Resultado final: ${equipo1} ${golesEquipo1.length} - ${golesEquipo2.length} ${equipo2}`);

	console.log(`Goles ${equipo1}:`);
	golesEquipo1.forEach(gol => console.log(`${gol.minuto} - ${gol.jugador}`));

	console.log(`Goles ${equipo2}:`);
	golesEquipo2.forEach(gol => console.log(`${gol.minuto} - ${gol.jugador}`));

	return ctx.json({
		date: day + "." + month + "." + year,
		hour: hours + ":" + minutes,
		homeTeam: {
			id: "W8mj7MDD",
			name: equipo1,
			shorthand: "RMA",
			logo: "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/W8mj7MDD.svg"
		},
		awayTeam: {
			id: "SKbpVP5K",
			name: equipo2,
			shorthand: "FCB",
			logo: "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/SKbpVP5K.svg"
		},
		homeGoals: golesEquipo1.length,
		awayGoals: golesEquipo2.length,
		status: "FINISHED",
		message: 'This is not a real match, it is a simulation.'
	});
});

APP.notFound((ctx) => {
	const { pathname } = new URL(ctx.req.url);
	if (ctx.req.url.at(-1) === '/') {
		return ctx.redirect(pathname.slice(0, -1));
	}
	return ctx.json({ message: 'Not Found. 😔' }, 404);
})

export default APP;