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

APP.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/areas',
			description: 'List all available areas.',
			parameters: [
				{
					name: "countryCode",
					endpoint: "/areas/:countryCode",
					description: "List one area given by her country code."
				}
			]
		},
		{
			endpoint: '/competitions',
			description: 'List all available competitions.',
			parameters: [
				{
					name: "id",
					endpoint: "/competitions/:id/standings",
					description: "List the current league standings for a league."
				}
			]
		},
		{
			version: '0.15a',
			message: 'Created with ❤️ by Miguel Zafra.'
		}
	]);
})

APP.get('/areas', (ctx) => {
	return ctx.json(areas);
});

APP.get('/areas/:countryCode', (ctx) => {
	const countryCode = ctx.req.param("countryCode").toUpperCase();
	const found = areas.find((area) => area.countryCode === countryCode)
	return found ? ctx.json(found) : ctx.json({ message: 'Area not found' }, 404)
});

APP.get('/competitions', (ctx) => {
	return ctx.json(competitions);
});

APP.get('/competitions/:id', (ctx) => {
	return ctx.json({ message: 'PENDING' }, 404)
});

APP.get('/competitions/:id/standings', (ctx) => {
	return ctx.json({ message: 'PENDING' }, 404)
});

APP.get('/standingsLaLiga', (ctx) => {
	return ctx.json(standingsLaLiga);
});

APP.get('/standingsLigue1', (ctx) => {
	return ctx.json(standingsLigue1);
});

APP.get('/standingsSerieA', (ctx) => {
	return ctx.json(standingsSerieA);
});

APP.get('/standingsBundesliga', (ctx) => {
	return ctx.json(standingsBundesliga);
});

APP.get('/standingsPremierLeague', (ctx) => {
	return ctx.json(standingsPremierLeague);
});

APP.get('/standingsLaLiga/2021', (ctx) => {
	return ctx.json(standingsLaLiga2021);
});

export default APP;