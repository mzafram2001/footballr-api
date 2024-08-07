// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

// Define URLs object.
const URLs = {
    spain: "https://www.flashscore.com/football/spain/laliga/standings/#/dINOZk9Q/table/overall",
};

// Define the properties of teamsEloURLs.
const teamsEloURLs = {
    SPAIN: URLs.spain,
};

// Create the base object.
const footballRAPIObject = {
    "updated": new Date().toISOString().slice(0, 10),
    "teams": []
};

// Define the properties of teamsData.
const teamsData = {
    "Atl. Madrid": { id: "jaarqpLQ", short: "ATM", name: "Atlético Madrid", color: "#FA0000" },
    "Betis": { id: "vJbTeCGP", short: "BET", name: "Real Betis", color: "#25961D" },
    "Ath Bilbao": { id: "IP5zl0cJ", short: "BIL", name: "Athletic Bilbao", color: "#FF0A0A" },
    "Real Madrid": { id: "W8mj7MDD", short: "RMA", name: "Real Madrid", color: "#DEDEDE" },
    "Girona": { id: "nNNpcUSL", short: "GIR", name: "Girona", color: "#CD2534" },
    "Barcelona": { id: "SKbpVP5K", short: "BAR", name: "Barcelona", color: "#BF0000" },
    "Real Sociedad": { id: "jNvak2f3", short: "RSO", name: "Real Sociedad", color: "#1610DE" },
    "Valencia": { id: "CQeaytrD", short: "VAL", name: "Valencia", color: "#FF8308" },
    "Villarreal": { id: "lUatW5jE", short: "VIL", name: "Villarreal", color: "#FFF01C" },
    "Getafe": { id: "dboeiWOt", short: "GET", name: "Getafe", color: "#1611A8" },
    "Alaves": { id: "hxt57t2q", short: "ALA", name: "Alavés", color: "#0761AF" },
    "Sevilla": { id: "h8oAv4Ts", short: "SEV", name: "Sevilla", color: "#FAFAFA" },
    "Osasuna": { id: "ETdxjU8a", short: "OSA", name: "Osasuna", color: "#AB0505" },
    "Las Palmas": { id: "IyRQC2vM", short: "PAL", name: "Las Palmas", color: "#FFE400" },
    "Celta Vigo": { id: "8pvUZFhf", short: "CEL", name: "Celta Vigo", color: "#8ABDFF" },
    "Rayo Vallecano": { id: "8bcjFy6O", short: "RAY", name: "Rayo Vallecano", color: "#F20202" },
    "Mallorca": { id: "4jDQxrbf", short: "MAL", name: "Mallorca", color: "#A10505" },
    "Valladolid": { id: "zkpajjvm", short: "VLL", name: "Valladolid", color: "#3D1169" },
    "Leganes": { id: "Mi0rXQg7", short: "LEG", name: "Leganés", color: "#0C1F6E" },
    "Espanyol": { id: "QFfPdh1J", short: "ESP", name: "Espanyol", color: "#007FC8" }
};

function parseCurrencyString(str) {
    console.log('Entrada original:', str);

    // Eliminar el símbolo de euro y espacios
    str = str.replace(/€|\s/g, '');
    console.log('Después de quitar € y espacios:', str);

    // Reemplazar la coma por un punto para el manejo decimal
    str = str.replace(',', '.');
    console.log('Después de reemplazar , por .:', str);

    let multiplier = 1;

    // Manejar "mil mill." y "mill."
    if (str.includes('milmill.')) {
        multiplier = 1e9;
        str = str.replace('milmill.', '');
        console.log('Caso mil mill., multiplier:', multiplier);
    } else if (str.includes('mill.')) {
        multiplier = 1e6;
        str = str.replace('mill.', '');
        console.log('Caso mill., multiplier:', multiplier);
    }

    console.log('Antes de parseFloat:', str);
    const number = parseFloat(str);
    console.log('Después de parseFloat:', number);

    if (isNaN(number)) {
        throw new Error('No se pudo convertir la cadena a un número válido');
    }

    const result = number * multiplier;
    console.log('Resultado final:', result);
    return result;
}

// Get detailed info for each team.
async function getTeamsDetailedInfo(page, teams, teamsData) {
    await page.goto('https://www.transfermarkt.es/laliga/startseite/wettbewerb/ES1');

    // Extraer los datos de los equipos desde la página
    const clubs = await page.evaluate(() => {
        const clubElements = document.querySelectorAll('table.items tbody tr.odd, table.items tbody tr.even');
        return Array.from(clubElements).map(club => {
            const nameElement = club.querySelector('td.hauptlink > a');
            const valueElement = club.querySelector('td:last-child');
            return {
                name: nameElement ? nameElement.innerText.trim() : '',
                url: nameElement ? nameElement.href : '',
                marketValue: valueElement ? valueElement.innerText.trim() : ''
            };
        });
    });

    // Mapear teams con la información de clubs obtenida
    const matchedTeams = Object.keys(teams).map(key => {
        const team = teams[key];
        const bestMatch = stringSimilarity.findBestMatch(team.name, clubs.map(c => c.name));
        if (bestMatch.bestMatch.rating > 0.7) { // Umbral de similitud
            const matchingClub = clubs.find(c => c.name === bestMatch.bestMatch.target);
            return {
                id: team.id,
                name: team.name,
                short: team.short,
                color: team.color,
                marketValue: matchingClub ? parseCurrencyString(matchingClub.marketValue) : null,
            };
        }
        return null;
    }).filter(match => match !== null);

    // Mostrar resultados
    console.log(matchedTeams);

    return matchedTeams;
}

// Main function.
async function getTeamsIndex(url, teamsData, footballRAPIObject) {
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

    // Create teams object.
    const teams = [];
    const addedTeams = new Set();

    // Get all the teams URL.
    await page.waitForSelector('.ui-table__body');
    const teamUrls = await page.evaluate(() => {
        const links = document.querySelectorAll('.ui-table__body a');
        return Array.from(links).map(link => link.href);
    });

    // For each team, go to URL.
    for (const url of teamUrls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Wait until document is loaded.
            await page.waitForSelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name');

            // Get info from team.
            const teamData = await page.evaluate(() => {
                const urlParts = window.location.href.split('/');
                const id = urlParts[urlParts.length - 2];
                const name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
                return { id, name };
            });

            // Check if the team has already been added.
            if (addedTeams.has(teamData.id)) {
                continue; // Skip adding this team.
            }

            // Search team info in teamsData.
            const teamInfo = teamsData[teamData.name];

            // If found is true, then push it into teams object.
            if (teamInfo) {
                teams.push({
                    id: teamData.id,
                    name: teamInfo.name,
                    short: teamInfo.short,
                    color: teamInfo.color
                });
                addedTeams.add(teamData.id); // Mark this team as added.
            } else {
                console.log("Error searching the team.");
            }
        } catch (error) {
            console.error(`Error al procesar la URL ${url}:`, error);
        }
    }

    // Get detailed info by team.
    let correctTeams = await getTeamsDetailedInfo(page, teamsData, teams);

    // Push to the original object.
    footballRAPIObject.teams.push(correctTeams);

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/teams.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, JSON.stringify({ updated: footballRAPIObject.updated, teams: correctTeams }), 'utf8', (err) => {
        if (err) {
            console.log(`[Teams | 2024] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[Teams | 2024] - JSON file has been saved.`);
        }
    });

    browser.close();
}

// Clone the base object for each function call.
function cloneBaseObject(baseObject) {
    return JSON.parse(JSON.stringify(baseObject));
}

// Fetch teams for the specified URL and teams data.
getTeamsIndex(teamsEloURLs.SPAIN, teamsData, cloneBaseObject(footballRAPIObject));
