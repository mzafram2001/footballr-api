// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Define URLs object.
const URLS = {
    spain: "https://www.flashscore.com/football/spain/laliga/results/",
}

// Define the properties of standingsURLs.
const resultsURLs = {
    SPAIN: URLS.spain,
};

// Create the base object.
const footballRAPIObject = {
    "results": [{ "round": 1, "matches": [] }, { "round": 2, "matches": [] }, { "round": 3, "matches": [] }, { "round": 4, "matches": [] }, { "round": 5, "matches": [] }, { "round": 6, "matches": [] }, { "round": 7, "matches": [] }, { "round": 8, "matches": [] }, { "round": 9, "matches": [] }, { "round": 10, "matches": [] }, { "round": 11, "matches": [] }, { "round": 12, "matches": [] }, { "round": 13, "matches": [] }, { "round": 14, "matches": [] }, { "round": 15, "matches": [] }, { "round": 16, "matches": [] }, { "round": 17, "matches": [] }, { "round": 18, "matches": [] }, { "round": 19, "matches": [] }, { "round": 20, "matches": [] }, { "round": 21, "matches": [] }, { "round": 22, "matches": [] }, { "round": 23, "matches": [] }, { "round": 24, "matches": [] }, { "round": 25, "matches": [] }, { "round": 26, "matches": [] }, { "round": 27, "matches": [] }, { "round": 28, "matches": [] }, { "round": 29, "matches": [] }, { "round": 30, "matches": [] }, { "round": 31, "matches": [] }, { "round": 32, "matches": [] }, { "round": 33, "matches": [] }, { "round": 34, "matches": [] }, { "round": 35, "matches": [] }, { "round": 36, "matches": [] }, { "round": 37, "matches": [] }, { "round": 38, "matches": [] }]
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
async function getLast10Matches(url, teamsData, footballRAPIObject) {
    // Launch the Puppeteer browser in headless mode.
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Open a new page.
    const page = await browser.newPage();

    // Navigate to the specified URL and wait until the network is idle.
    await page.goto(url, { waitUntil: "networkidle0" });

    // Click consent cookies banner.
    await page.waitForSelector('#onetrust-accept-btn-handler', { visible: true, timeout: 3000 });
    await page.click('#onetrust-accept-btn-handler');

    // Open the current results file to edit.
    const fileToEdit = path.join(__dirname, '..', 'db', '2024', 'results', 'resultsLaLiga2024.json');
    fs.readFile(fileToEdit, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        try {
            const json = JSON.parse(data);
            console.log('JSON data:', json);
            // Proceed with json data
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });

    const RESULT = await page.evaluate(() => {
        const JSON = {};
        JSON.season = [];
        JSON.matchesIteration = [];
        const ROUNDS_SELECTOR = document.querySelectorAll('.event__round');
        const RESULTS_SELECTOR = document.querySelectorAll('.event__match');
        let round = 0;
        let ok = Array.prototype.slice.call(RESULTS_SELECTOR);
        const LAST_10 = ok.slice(0, 10);
        ok = Array.prototype.slice.call(ROUNDS_SELECTOR);
        const ROUNDS_ARRAY = ok;
        for (let i = LAST_10.length - 1; i >= 0; i--) {
            const TMP = {};
            TMP.id = LAST_10[i].id.substring(4);
            TMP.link = "https://www.flashscore.com/match/" + TMP.id;
            JSON.matchesIteration.push(TMP);
        }
        for (let i = ROUNDS_ARRAY.length - 1; i >= 0; i--) {
            const TMP = {};
            let found = false;
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
        try {
            // Navegar a la página del enlace del partido
            await page.goto(match.link, { waitUntil: 'networkidle0' });

            // Extraer la información del partido
            const MATCH = await page.evaluate((teamsData) => {
                const TMP = {};
                let dumpString;
                let dumpStringArray;

                // Obtener el título de la página
                let titleElement = document.evaluate("/html/head/title", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                let title = titleElement ? titleElement.innerText : "Unknown Title";

                // Información del equipo local
                TMP.homeTeam = {};
                const homeTeamElement = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a');
                if (homeTeamElement) {
                    dumpString = homeTeamElement.getAttribute('href');
                    dumpStringArray = dumpString.split('/');
                    const homeTeamName = homeTeamElement.innerText.trim(); // Obtener el nombre del equipo local
                    TMP.homeTeam.id = dumpStringArray[3];
                    TMP.homeTeam.name = teamsData[homeTeamName]?.name || homeTeamName; // Buscar en teamsData
                    TMP.homeTeam.shorthand = teamsData[homeTeamName]?.short || title.substring(0, 3);
                    TMP.homeTeam.color = teamsData[homeTeamName]?.color || null;
                } else {
                    TMP.homeTeam.id = null;
                    TMP.homeTeam.name = "Unknown";
                    TMP.homeTeam.shorthand = title.substring(0, 3);
                    TMP.homeTeam.color = null;
                }

                // Información del equipo visitante
                TMP.awayTeam = {};
                const awayTeamElement = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a');
                if (awayTeamElement) {
                    dumpString = awayTeamElement.getAttribute('href');
                    dumpStringArray = dumpString.split('/');
                    const awayTeamName = awayTeamElement.innerText.trim(); // Obtener el nombre del equipo visitante
                    TMP.awayTeam.id = dumpStringArray[3];
                    TMP.awayTeam.name = teamsData[awayTeamName]?.name || awayTeamName; // Buscar en teamsData
                    TMP.awayTeam.shorthand = teamsData[awayTeamName]?.short || title.substring(8, 11);
                    TMP.awayTeam.color = teamsData[awayTeamName]?.color || null;
                } else {
                    TMP.awayTeam.id = null;
                    TMP.awayTeam.name = "Unknown";
                    TMP.awayTeam.shorthand = title.substring(8, 11);
                    TMP.awayTeam.color = null;
                }

                // Información del torneo y ronda
                const tournamentHeaderElement = document.querySelector('#detail > div.tournamentHeader.tournamentHeaderDescription > div > span.tournamentHeader__country > a');
                TMP.round = tournamentHeaderElement ? parseInt(tournamentHeaderElement.innerText.split(" ").pop()) : "Relegation Play-Offs";

                // Información del horario
                const startTimeElement = document.querySelector('.duelParticipant__startTime');
                const dateStr = startTimeElement ? startTimeElement.innerText.substring(0, 10) : null;
                if (dateStr) {
                    // Split the date string to convert from DD.MM.YYYY to YYYY-MM-DD
                    const dateParts = dateStr.split('.');
                    TMP.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                } else {
                    TMP.date = null;
                }
                TMP.hour = startTimeElement ? startTimeElement.innerText.substring(11) : null;

                // Información de los equipos y goles
                // TMP.home = document.querySelector('.duelParticipant__home')?.innerText || null;
                // TMP.away = document.querySelector('.duelParticipant__away')?.innerText || null;
                TMP.homeGoals = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(1)')?.innerText || 0;
                TMP.awayGoals = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(3)')?.innerText || 0;
                TMP.status = document.querySelector('.fixedHeaderDuel__detailStatus')?.innerText || null;

                return TMP;
            }, teamsData); // Asegúrate de pasar teamsData correctamente

            // Asignar la información extraída al objeto del partido
            Object.assign(match, MATCH);
            delete match.link; // Eliminar el enlace si ya no es necesario
        } catch (error) {
            console.error(`Error processing match ${match.link}:`, error);
        }
    }

    // Update results
    for (let match of RESULT.matchesIteration) {
        const roundIndex = footballRAPIObject.results.findIndex(r => r.round === match.round);
        if (roundIndex !== -1) {
            const existingMatchIndex = footballRAPIObject.results[roundIndex].matches.findIndex(m => m.id === match.id);
            if (existingMatchIndex !== -1) {
                footballRAPIObject.results[roundIndex].matches[existingMatchIndex] = match;
            } else {
                footballRAPIObject.results[roundIndex].matches.push(match);
            }
        } else {
            footballRAPIObject.results.push({
                round: match.round,
                matches: [match]
            });
        }
    }

    // Sort rounds by number and convert round numbers to strings
    footballRAPIObject.results.sort((a, b) => a.round - b.round).forEach(result => {
        result.round = String(result.round); // Convert round to string

        result.matches.forEach(match => {
            delete match.round; // Remove round field from each match
        });
    });

    // Write the data to a JSON file.
    fs.writeFile(fileToEdit, JSON.stringify(footballRAPIObject), 'utf8', (err) => {
        if (err) {
            console.log(`[LaLiga (Results) | 2024] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[LaLiga (Results) | 2024] - JSON file has been saved.`);
        }
    });

    await browser.close();
}

// Clone the base object for each function call.
function cloneBaseObject(baseObject) {
    return JSON.parse(JSON.stringify(baseObject));
}

getLast10Matches(resultsURLs.SPAIN, teamsData, cloneBaseObject(footballRAPIObject));