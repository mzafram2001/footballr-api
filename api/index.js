import { Hono } from 'hono';
import standingsLaLiga from "../db/standingsLaLigaFlashcore.json";
import standingsLaLiga2021 from "../db/standingsLaLiga2021Flashcore.json";
import standingsLigue1 from "../db/standingsLigue1Flashcore.json";
import standingsSerieA from "../db/standingsSerieAFlashcore.json";
import standingsBundesliga from "../db/standingsBundesligaFlashcore.json";
import standingsPremierLeague from "../db/standingsPremierLeagueFlashcore.json";
import areas from "../db/areas.json";
import competitions from "../db/competitions.json";

const APP = new Hono();

const MIN_YEAR = 2015;
const MAX_YEAR = 2022;

APP.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/areas',
			description: 'List all available areas. 🌍',
			parameters: [
				{
					name: "id",
					endpoint: "/areas/:id",
					description: "List one area given by id. 🔍"
				}
			]
		},
		{
			endpoint: '/competitions',
			description: 'List all available competitions. 🏆',
			parameters: [
				{
					name: "id",
					endpoint: "/competitions/:id",
					description: "List one competition given by id. 🔍"
				},
				{
					name: "standings",
					endpoint: "/competitions/:id/standings",
					description: "List the current standings for a league. 🔍"
				},
				{
					name: "year",
					endpoint: "/competitions/:id/standings/:year",
					description: "List the standings for a league, given by start year. 🔍"
				}
			]
		},
		{
			version: '0.2a',
			message: 'Created with ❤️ by Miguel Zafra.'
		}
	]);
})

APP.get('/areas', (ctx) => {
	return ctx.json(areas);
});

APP.get('/areas/:id', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = areas.find((area) => area.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

APP.get('/competitions', (ctx) => {
	return ctx.json(competitions);
});

APP.get('/competitions/:id', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = competitions.find((competition) => competition.id === id);
	return found ? ctx.json(found) : ctx.json({ message: 'Not Found. 😔' }, 404);
});

APP.get('/competitions/:id/standings', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = competitions.find((competition) => competition.id === id);
	if (found) {
		switch (id) {
			case "PRL": return ctx.json(standingsPremierLeague);
			case "LAL": return ctx.json(standingsLaLiga);
			case "LI1": return ctx.json(standingsLigue1);
			case "SEA": return ctx.json(standingsSerieA);
			case "BUN": return ctx.json(standingsBundesliga);
		}
	} if (!found) {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/competitions/:id/standings/:year', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const year = ctx.req.param("year");
	const found = competitions.find((competition) => competition.id === id);
	if (!found) return ctx.json({ message: 'Not Found. 😔' }, 404);
	if (found) {
		switch (id) {
			case "PRL": ;
				break;
			case "LAL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				return ctx.json(standingsLaLiga + year);
			};
				break;
			case "LI1": ;
				break;
			case "SEA": ;
				break;
			case "BUN": ;
				break;
		}
	} if (!found) {
		ctx.json({ message: 'Not Found. 😔' }, 404);
	}
});

APP.get('/standingsLaLiga/2021', (ctx) => {
	return ctx.json(standingsLaLiga2021);
});

APP.notFound((ctx) => {
	const { pathname } = new URL(ctx.req.url);
	if (ctx.req.url.at(-1) === '/') {
		return ctx.redirect(pathname.slice(0, -1));
	}
	return ctx.json({ message: 'Not Found. 😔' }, 404);
})

export default APP;