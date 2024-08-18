// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Define URLs object.
const URLS = {
    spain: "https://www.flashscore.com/football/spain/laliga/results/",
}

// Define the properties of standingsURLs.
const RESULTS_URLS = {
    SPAIN: URLS.spain,
};

// Create the base object.
const footballRAPIObject = {
    "updated": new Date().toISOString().slice(0, 10),
    "results": []
};

// Define the properties of teamsData.
const teamsData = {
    "Atl. Madrid": { short: "ATM", name: "Atlético Madrid", color: "#FA0000" },
    "Betis": { short: "BET", name: "Real Betis", color: "#25961D" },
    "Ath Bilbao": { short: "BIL", name: "Athletic Bilbao", color: "#FF0A0A" },
    "Real Madrid": { short: "RMA", name: "Real Madrid", color: "#DEDEDE" },
    "Girona": { short: "GIR", name: "Girona", color: "#CD2534" },
    "Barcelona": { short: "BAR", name: "Barcelona", color: "#BF0000" },
    "Real Sociedad": { short: "RSO", name: "Real Sociedad", color: "#1610DE" },
    "Valencia": { short: "VAL", name: "Valencia", color: "#FF8308" },
    "Villarreal": { short: "VIL", name: "Villarreal", color: "#FFF01C" },
    "Getafe": { short: "GET", name: "Getafe", color: "#1611A8" },
    "Alaves": { short: "ALA", name: "Alavés", color: "#0761AF" },
    "Sevilla": { short: "SEV", name: "Sevilla", color: "#FAFAFA" },
    "Osasuna": { short: "OSA", name: "Osasuna", color: "#AB0505" },
    "Las Palmas": { short: "PAL", name: "Las Palmas", color: "#FFE400" },
    "Celta Vigo": { short: "CEL", name: "Celta Vigo", color: "#8ABDFF" },
    "Rayo Vallecano": { short: "RAY", name: "Rayo Vallecano", color: "#F20202" },
    "Mallorca": { short: "MAL", name: "Mallorca", color: "#A10505" },
    "Valladolid": { short: "VLL", name: "Valladolid", color: "#3D1169" },
    "Leganes": { short: "LEG", name: "Leganés", color: "#0C1F6E" },
    "Espanyol": { short: "ESP", name: "Espanyol", color: "#007FC8" },
};

// Main function.
async function getLast10Matches(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "networkidle0" });
        await page.click('#onetrust-accept-btn-handler');

        const fileLocation = path.join(process.cwd(), "./db/2024/results/resultsLaLiga2024.json");
        let original;
        try {
            const fileContent = await fs.readFile(fileLocation, 'utf8');
            original = JSON.parse(fileContent);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, inicializamos con un objeto vacío
                original = { results: [] };
            } else {
                throw error;
            }
        }

        const RESULT = await page.evaluate(() => {
            const JSON = {};
            JSON.season = [];
            JSON.matchesIteration = [];
            const ROUNDS_SELECTOR = document.querySelectorAll('.event__round');
            const RESULTS_SELECTOR = document.querySelectorAll('.event__match');
            var round = 0;
            var ok = Array.prototype.slice.call(RESULTS_SELECTOR);
            const LAST_10 = ok.slice(0, 10);
            ok = Array.prototype.slice.call(ROUNDS_SELECTOR);
            const ROUNDS_ARRAY = ok;
            for (var i = LAST_10.length - 1; i >= 0; i--) {
                const TMP = {};
                TMP.id = LAST_10[i].id.substring(4);
                TMP.link = "https://www.flashscore.com/match/" + TMP.id;
                JSON.matchesIteration.push(TMP);
            }
            for (var i = ROUNDS_ARRAY.length - 1; i >= 0; i--) {
                const TMP = {};
                var found = false;
                TMP.round = parseInt(ROUNDS_ARRAY[i].innerText.substring(6));
                round = parseInt(TMP.round);
                TMP.results = [];
                for (index in JSON.season) {
                    if (JSON.season[index].round == TMP.round) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    JSON.season.push(TMP);
                }
            }
            return JSON;
        });

        for (let match of RESULT.matchesIteration) {
            await page.goto(match.link, { 'waitUntil': 'networkidle0' });
            const MATCH = await page.evaluate(() => {
                const TMP = {};
                var dumpString;
                var dumpStringArray;
                var title = document.evaluate("/html/head/title", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                TMP.homeTeam = {};
                dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
                dumpStringArray = dumpString.split('/');
                TMP.homeTeam.id = dumpStringArray[3];
                TMP.homeTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
                const TEAM_NAME = {
                    "Atl. Madrid": "Atletico Madrid",
                    "Betis": "Real Betis",
                    "Granada CF": "Granada",
                    "Ath Bilbao": "Athletic Bilbao",
                    "Cadiz CF": "Cadiz",
                    "Almeria": "Almeria",
                }
                const TEAM_COLOR = {
                    "Real Madrid": "#E2E2E2",
                    "Girona": "#CD2534",
                    "Barcelona": "#A50044",
                    "Atletico Madrid": "#CE3524",
                    "Athletic Bilbao": "#EE2523",
                    "Real Sociedad": "#143C8B",
                    "Real Betis": "#00954C",
                    "Valencia": "#EE3524",
                    "Villarreal": "#FFE667",
                    "Getafe": "#005999",
                    "Alaves": "#009AD7",
                    "Sevilla": "#F43333",
                    "Osasuna": "#D91A21",
                    "Las Palmas": "#FFE400",
                    "Celta Vigo": "#8AC3EE",
                    "Rayo Vallecano": "#E53027",
                    "Mallorca": "#E20613",
                    "Cadiz": "#F2A40C",
                    "Granada": "#C31632",
                    "Almeria": "#EE1119",
                }
                TMP.homeTeam.name = TEAM_NAME[TMP.homeTeam.name] || TMP.homeTeam.name;
                TMP.homeTeam.shorthand = title.innerText.substring(0, 3);
                TMP.homeTeam.color = TEAM_COLOR[TMP.homeTeam.name];
                TMP.awayTeam = {};
                dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
                dumpStringArray = dumpString.split('/');
                TMP.awayTeam.id = dumpStringArray[3];
                TMP.awayTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
                TMP.awayTeam.name = TEAM_NAME[TMP.awayTeam.name] || TMP.awayTeam.name;
                TMP.awayTeam.shorthand = title.innerText.substring(8, 11);
                TMP.awayTeam.color = TEAM_COLOR[TMP.awayTeam.name];
                dumpString = document.querySelector('#detail > div.tournamentHeader.tournamentHeaderDescription > div > span.tournamentHeader__country > a').innerText;
                dumpStringArray = dumpString.split(" ");
                TMP.round = parseInt(dumpStringArray[dumpStringArray.length - 1]);
                if (TMP.round == null) {
                    TMP.round = "Relegation Play-Offs";
                }
                TMP.date = document.querySelector('.duelParticipant__startTime').innerText.substring(0, 10);
                TMP.hour = document.querySelector('.duelParticipant__startTime').innerText.substring(11);
                TMP.home = document.querySelector('.duelParticipant__home').innerText;
                TMP.away = document.querySelector('.duelParticipant__away').innerText;
                TMP.homeGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(1)').innerText);
                TMP.awayGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(3)').innerText);
                TMP.status = document.querySelector('.fixedHeaderDuel__detailStatus').innerText;
                return TMP;
            });
            Object.assign(match, MATCH);
            delete match.link;
        }

        original.updated = new Date().toISOString().slice(0, 10);

        for (let match of RESULT.matchesIteration) {
            const roundIndex = original.results.findIndex(r => r.round === match.round);
            if (roundIndex !== -1) {
                const existingMatchIndex = original.results[roundIndex].matches.findIndex(m => m.id === match.id);
                if (existingMatchIndex !== -1) {
                    original.results[roundIndex].matches[existingMatchIndex] = match;
                } else {
                    original.results[roundIndex].matches.push(match);
                }
            } else {
                original.results.push({
                    round: match.round,
                    matches: [match]
                });
            }
        }

        // Ordenar las rondas de menor a mayor
        original.results.sort((a, b) => a.round - b.round);

        await fs.writeFile(fileLocation, JSON.stringify(original, null, 2));
        console.log('JSON file has been saved.');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

getLast10Matches(RESULTS_URLS.SPAIN);