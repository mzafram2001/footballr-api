import { Hono } from 'hono';
import standingsLaLiga from "../db/standingsLaLigaFlashcore.json";

const APP = new Hono();

APP.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/standingsLaLiga',
			message: 'Returns LaLiga standings.'
		}
	]);
})

APP.get('/standingsLaLiga', (ctx) => {
	return ctx.json(standingsLaLiga);
})

export default APP;