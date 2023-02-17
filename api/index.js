import { Hono } from 'hono';

// 2022
import standingsPremierLeague2022 from "../db/2022/standingsPremierLeague2022Flashcore.json";
import standingsLaLiga2022 from "../db/2022/standingsLaLiga2022Flashcore.json";
import standingsLigue12022 from "../db/2022/standingsLigue12022Flashcore.json";
import standingsSerieA2022 from "../db/2022/standingsSerieA2022Flashcore.json";
import standingsBundesliga2022 from "../db/2022/standingsBundesliga2022Flashcore.json";

// 2021
import standingsPremierLeague2021 from "../db/2021/standingsPremierLeague2021Flashcore.json";
import standingsLaLiga2021 from "../db/2021/standingsLaLiga2021Flashcore.json";
import standingsLigue12021 from "../db/2021/standingsLigue12021Flashcore.json";
import standingsSerieA2021 from "../db/2021/standingsSerieA2021Flashcore.json";
import standingsBundesliga2021 from "../db/2021/standingsBundesliga2021Flashcore.json";

// 2020
import standingsPremierLeague2020 from "../db/2020/standingsPremierLeague2020Flashcore.json";
import standingsLaLiga2020 from "../db/2020/standingsLaLiga2020Flashcore.json";
import standingsLigue12020 from "../db/2020/standingsLigue12020Flashcore.json";
import standingsSerieA2020 from "../db/2020/standingsSerieA2020Flashcore.json";
import standingsBundesliga2020 from "../db/2020/standingsBundesliga2020Flashcore.json";

// 2019
import standingsPremierLeague2019 from "../db/2019/standingsPremierLeague2019Flashcore.json";
import standingsLaLiga2019 from "../db/2019/standingsLaLiga2019Flashcore.json";
import standingsLigue12019 from "../db/2019/standingsLigue12019Flashcore.json";
import standingsSerieA2019 from "../db/2019/standingsSerieA2019Flashcore.json";
import standingsBundesliga2019 from "../db/2019/standingsBundesliga2019Flashcore.json";

// 2018
import standingsPremierLeague2018 from "../db/2018/standingsPremierLeague2018Flashcore.json";
import standingsLaLiga2018 from "../db/2018/standingsLaLiga2018Flashcore.json";
import standingsLigue12018 from "../db/2018/standingsLigue12018Flashcore.json";
import standingsSerieA2018 from "../db/2018/standingsSerieA2018Flashcore.json";
import standingsBundesliga2018 from "../db/2018/standingsBundesliga2018Flashcore.json";

// 2017
import standingsPremierLeague2017 from "../db/2017/standingsPremierLeague2017Flashcore.json";
import standingsLaLiga2017 from "../db/2017/standingsLaLiga2017Flashcore.json";
import standingsLigue12017 from "../db/2017/standingsLigue12017Flashcore.json";
import standingsSerieA2017 from "../db/2017/standingsSerieA2017Flashcore.json";
import standingsBundesliga2017 from "../db/2017/standingsBundesliga2017Flashcore.json";

// 2016
import standingsPremierLeague2016 from "../db/2016/standingsPremierLeague2016Flashcore.json";
import standingsLaLiga2016 from "../db/2016/standingsLaLiga2016Flashcore.json";
import standingsLigue12016 from "../db/2016/standingsLigue12016Flashcore.json";
import standingsSerieA2016 from "../db/2016/standingsSerieA2016Flashcore.json";
import standingsBundesliga2016 from "../db/2016/standingsBundesliga2016Flashcore.json";

// 2015
import standingsPremierLeague2015 from "../db/2015/standingsPremierLeague2015Flashcore.json";
import standingsLaLiga2015 from "../db/2015/standingsLaLiga2015Flashcore.json";
import standingsLigue12015 from "../db/2015/standingsLigue12015Flashcore.json";
import standingsSerieA2015 from "../db/2015/standingsSerieA2015Flashcore.json";
import standingsBundesliga2015 from "../db/2015/standingsBundesliga2015Flashcore.json";

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
					description: "List the standings for a league, given by start year (2015 - 2021). 🔍"
				}
			]
		},
		{
			version: '0.38a',
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
			case "PRL": return ctx.json(standingsPremierLeague2022);
			case "LAL": return ctx.json(standingsLaLiga2022);
			case "LI1": return ctx.json(standingsLigue12022);
			case "SEA": return ctx.json(standingsSerieA2022);
			case "BUN": return ctx.json(standingsBundesliga2022);
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
			case "PRL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2015": return ctx.json(standingsPremierLeague2015);
					case "2016": return ctx.json(standingsPremierLeague2016);
					case "2017": return ctx.json(standingsPremierLeague2017);
					case "2018": return ctx.json(standingsPremierLeague2018);
					case "2019": return ctx.json(standingsPremierLeague2019);
					case "2020": return ctx.json(standingsPremierLeague2020);
					case "2021": return ctx.json(standingsPremierLeague2021);
				}
			};
				break;
			case "LAL": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2015": return ctx.json(standingsLaLiga2015);
					case "2016": return ctx.json(standingsLaLiga2016);
					case "2017": return ctx.json(standingsLaLiga2017);
					case "2018": return ctx.json(standingsLaLiga2018);
					case "2019": return ctx.json(standingsLaLiga2019);
					case "2020": return ctx.json(standingsLaLiga2020);
					case "2021": return ctx.json(standingsLaLiga2021);
				}
			};
				break;
			case "LI1": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2015": return ctx.json(standingsLigue12015);
					case "2016": return ctx.json(standingsLigue12016);
					case "2017": return ctx.json(standingsLigue12017);
					case "2018": return ctx.json(standingsLigue12018);
					case "2019": return ctx.json(standingsLigue12019);
					case "2020": return ctx.json(standingsLigue12020);
					case "2021": return ctx.json(standingsLigue12021);
				}
			};
				break;
			case "SEA": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2015": return ctx.json(standingsSerieA2015);
					case "2016": return ctx.json(standingsSerieA2016);
					case "2017": return ctx.json(standingsSerieA2017);
					case "2018": return ctx.json(standingsSerieA2018);
					case "2019": return ctx.json(standingsSerieA2019);
					case "2020": return ctx.json(standingsSerieA2020);
					case "2021": return ctx.json(standingsSerieA2021);
				}
			};
				break;
			case "BUN": if (year >= MIN_YEAR && year <= MAX_YEAR) {
				switch (year) {
					case "2015": return ctx.json(standingsBundesliga2015);
					case "2016": return ctx.json(standingsBundesliga2016);
					case "2017": return ctx.json(standingsBundesliga2017);
					case "2018": return ctx.json(standingsBundesliga2018);
					case "2019": return ctx.json(standingsBundesliga2019);
					case "2020": return ctx.json(standingsBundesliga2020);
					case "2021": return ctx.json(standingsBundesliga2021);
				}
			};
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