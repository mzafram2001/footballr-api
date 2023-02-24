import { Hono } from 'hono';

// 2022
import standingsPremierLeague2022 from "../db/2022/standings/standingsPremierLeague2022Flashcore.json";
import standingsLaLiga2022 from "../db/2022/standings/standingsLaLiga2022Flashcore.json";
import standingsLigue12022 from "../db/2022/standings/standingsLigue12022Flashcore.json";
import standingsSerieA2022 from "../db/2022/standings/standingsSerieA2022Flashcore.json";
import standingsBundesliga2022 from "../db/2022/standings/standingsBundesliga2022Flashcore.json";

// 2021
import standingsPremierLeague2021 from "../db/2021/standings/standingsPremierLeague2021Flashcore.json";
import standingsLaLiga2021 from "../db/2021/standings/standingsLaLiga2021Flashcore.json";
import standingsLigue12021 from "../db/2021/standings/standingsLigue12021Flashcore.json";
import standingsSerieA2021 from "../db/2021/standings/standingsSerieA2021Flashcore.json";
import standingsBundesliga2021 from "../db/2021/standings/standingsBundesliga2021Flashcore.json";

// 2020
import standingsPremierLeague2020 from "../db/2020/standings/standingsPremierLeague2020Flashcore.json";
import standingsLaLiga2020 from "../db/2020/standings/standingsLaLiga2020Flashcore.json";
import standingsLigue12020 from "../db/2020/standings/standingsLigue12020Flashcore.json";
import standingsSerieA2020 from "../db/2020/standings/standingsSerieA2020Flashcore.json";
import standingsBundesliga2020 from "../db/2020/standings/standingsBundesliga2020Flashcore.json";

// 2019
import standingsPremierLeague2019 from "../db/2019/standings/standingsPremierLeague2019Flashcore.json";
import standingsLaLiga2019 from "../db/2019/standings/standingsLaLiga2019Flashcore.json";
import standingsLigue12019 from "../db/2019/standings/standingsLigue12019Flashcore.json";
import standingsSerieA2019 from "../db/2019/standings/standingsSerieA2019Flashcore.json";
import standingsBundesliga2019 from "../db/2019/standings/standingsBundesliga2019Flashcore.json";

// 2018
import standingsPremierLeague2018 from "../db/2018/standings/standingsPremierLeague2018Flashcore.json";
import standingsLaLiga2018 from "../db/2018/standings/standingsLaLiga2018Flashcore.json";
import standingsLigue12018 from "../db/2018/standings/standingsLigue12018Flashcore.json";
import standingsSerieA2018 from "../db/2018/standings/standingsSerieA2018Flashcore.json";
import standingsBundesliga2018 from "../db/2018/standings/standingsBundesliga2018Flashcore.json";

// 2017
import standingsPremierLeague2017 from "../db/2017/standings/standingsPremierLeague2017Flashcore.json";
import standingsLaLiga2017 from "../db/2017/standings/standingsLaLiga2017Flashcore.json";
import standingsLigue12017 from "../db/2017/standings/standingsLigue12017Flashcore.json";
import standingsSerieA2017 from "../db/2017/standings/standingsSerieA2017Flashcore.json";
import standingsBundesliga2017 from "../db/2017/standings/standingsBundesliga2017Flashcore.json";

// 2016
import standingsPremierLeague2016 from "../db/2016/standings/standingsPremierLeague2016Flashcore.json";
import standingsLaLiga2016 from "../db/2016/standings/standingsLaLiga2016Flashcore.json";
import standingsLigue12016 from "../db/2016/standings/standingsLigue12016Flashcore.json";
import standingsSerieA2016 from "../db/2016/standings/standingsSerieA2016Flashcore.json";
import standingsBundesliga2016 from "../db/2016/standings/standingsBundesliga2016Flashcore.json";

// 2015
import standingsPremierLeague2015 from "../db/2015/standings/standingsPremierLeague2015Flashcore.json";
import standingsLaLiga2015 from "../db/2015/standings/standingsLaLiga2015Flashcore.json";
import standingsLigue12015 from "../db/2015/standings/standingsLigue12015Flashcore.json";
import standingsSerieA2015 from "../db/2015/standings/standingsSerieA2015Flashcore.json";
import standingsBundesliga2015 from "../db/2015/standings/standingsBundesliga2015Flashcore.json";

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
			example: "https://zeus-api.olympus.workers.dev/areas",
			status: "Available. 🟢",
			parameters: [
				{
					name: "id",
					endpoint: "/areas/:id",
					description: "List one area given by id. 🔍",
					example: "https://zeus-api.olympus.workers.dev/areas/ITA",
					status: "Available. 🟢"
				}
			]
		},
		{
			endpoint: '/competitions',
			description: 'List all available competitions. 🏆',
			example: "https://zeus-api.olympus.workers.dev/competitions",
			status: "Available. 🟢",
			parameters: [
				{
					name: "id",
					endpoint: "/competitions/:id",
					description: "List one competition given by id. 🔍",
					example: "https://zeus-api.olympus.workers.dev/competitions/LAL",
					status: "Available. 🟢"
				},
				{
					name: "standings",
					endpoint: "/competitions/:id/standings",
					description: "List the current standings for a league. 🔍",
					example: "https://zeus-api.olympus.workers.dev/competitions/LAL/standings",
					status: "Available. 🟢"
				},
				{
					name: "year",
					endpoint: "/competitions/:id/standings/:year",
					description: "List the standings, matches or scorers for a league, given by start year (2015 - 2021). 🔍",
					example: "https://zeus-api.olympus.workers.dev/competitions/LAL/standings/2016",
					status: "Available. 🟢"
				},
				{
					name: "matches",
					endpoint: '/competitions/:id/matches/:year',
					description: 'List all available matches. 🆚',
					example: "https://zeus-api.olympus.workers.dev/competitions/LAL/matches/2017",
					status: "Not available. 🔴",
				},
				{
					name: "scorers",
					endpoint: '/competitions/:id/scorers/:year',
					description: 'List all available scorers. ⚽',
					example: "https://zeus-api.olympus.workers.dev/competitions/LAL/scorers/2019",
					status: "Not available. 🔴",
				}
			]
		},
		{
			name: "Zeus API ⚡",
			version: '0.45a',
			message: 'Created with 💙 by Miguel Zafra.'
		}
	]);
})

APP.get('/areas', (ctx) => {
	return ctx.json(areas);
});

APP.get('/areas/:id', (ctx) => {
	const id = ctx.req.param("id").toUpperCase();
	const found = areas.areas.find((area) =>  area.id === id);
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