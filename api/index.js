import { Hono } from 'hono';
import standingsLaLiga from "../db/standingsLaLigaFlashcore.json";
import standingsLaLiga2021 from "../db/standingsLaLiga2021Flashcore.json";
import standingsLigue1 from "../db/standingsLigue1Flashcore.json";
import standingsSerieA from "../db/standingsSerieAFlashcore.json";
import standingsBundesliga from "../db/standingsBundesligaFlashcore.json";
import standingsPremierLeague from "../db/standingsPremierLeagueFlashcore.json";

const APP = new Hono();

APP.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/standingsLaLiga',
			message: 'Returns LaLiga 2022 standings.'
		},
		{
			endpoint: '/standingsLaLiga/2021',
			message: 'Returns LaLiga 2021 standings.'
		},
		{
			endpoint: '/standingsLigue1',
			message: 'Returns Ligue1 2022 standings.'
		},
		{
			endpoint: '/standingsSerieA',
			message: 'Returns SerieA 2022 standings.'
		},
		{
			endpoint: '/standingsBundesliga',
			message: 'Returns Bundesliga 2022 standings.'
		},
		{
			endpoint: '/standingsPremierLeague',
			message: 'Returns PremierLeague 2022 standings.'
		}
	]);
})

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