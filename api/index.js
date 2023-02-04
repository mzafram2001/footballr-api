import { Hono } from 'hono';
import standingsLaLiga from "../db/standingsLaLigaFlashcore.json";
import standingsLigue1 from "../db/standingsLigue1Flashcore.json";
import standingsSerieA from "../db/standingsSerieAFlashcore.json";
import standingsBundesliga from "../db/standingsBundesligaFlashcore.json";
import standingsPremierLeague from "../db/standingsPremierLeagueFlashcore.json";

const APP = new Hono();

APP.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/standingsLaLiga',
			message: 'Returns LaLiga standings.'
		},
		{
			endpoint: '/standingsLigue1',
			message: 'Returns Ligue1 standings.'
		},
		{
			endpoint: '/standingsSerieA',
			message: 'Returns SerieA standings.'
		},
		{
			endpoint: '/standingsBundesliga',
			message: 'Returns Bundesliga standings.'
		},
		{
			endpoint: '/standingsPremierLeague',
			message: 'Returns PremierLeague standings.'
		}
	]);
})

APP.get('/standingsLaLiga', (ctx) => {
	return ctx.json(standingsLaLiga);
})

APP.get('/standingsLigue1', (ctx) => {
	return ctx.json(standingsLigue1);
})

APP.get('/standingsSerieA', (ctx) => {
	return ctx.json(standingsSerieA);
})

APP.get('/standingsBundesliga', (ctx) => {
	return ctx.json(standingsBundesliga);
})

APP.get('/standingsPremierLeague', (ctx) => {
	return ctx.json(standingsPremierLeague);
})

export default APP;