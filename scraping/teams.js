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
    } else if (str.includes('mil')) {
        multiplier = 1e3;
        str = str.replace('mil', '');
        console.log('Caso mil, multiplier:', multiplier);
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

// Función para convertir la fecha en formato "dd/mm/yyyy (edad)" a "yyyy-mm-dd"
function convertDate(input) {
    const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
        const day = match[1];
        const month = match[2];
        const year = match[3];
        return `${year}-${month}-${day}`;
    }
    return null; // Si no hay coincidencia, devuelve null o algún valor predeterminado
}

// Get detailed info for each team.
async function getTeamsDetailedInfo(page, teams, teamsData) {
    await page.goto('https://www.transfermarkt.es/laliga/startseite/wettbewerb/ES1', { waitUntil: 'networkidle0' });

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

    const matchedTeams = [];

    for (const element of clubs) {
        try {
            await page.goto(element.url, { waitUntil: 'networkidle0', timeout: 60000 });

            // Wait for the content to load
            await page.waitForSelector('.data-header__club', { timeout: 10000 });

            const additionalInfo = await page.evaluate(() => {
                const foundedElement = document.querySelector('span[itemprop="foundingDate"]');
                const stadiumElement = document.querySelector('#tm-main > header > div.data-header__info-box > div > ul:nth-child(2) > li:nth-child(2) > span > a');
                const countryImageElement = document.querySelector('#tm-main > header > div.data-header__box--big > div > span.data-header__label > span > a > img');
                const upsElement = document.querySelector('.transfer-record__total.transfer-record__total--positive');
                const downsElement = document.querySelector('.transfer-record__total.transfer-record__total--negative');
                const squadElements = document.querySelectorAll('#yw1 > table > tbody > tr');

                // Crear un array para almacenar los jugadores
                const players = [];

                squadElements.forEach((row) => {
                    const nameElement = row.querySelector('td.hauptlink > a');
                    // const positionElement = row.querySelector('td:nth-child(2)');
                    const ageElement = row.querySelector('td:nth-child(3)');
                    // const nationalityElement = row.querySelector('td:nth-child(4) > img');
                    const marketValueElement = row.querySelector('td:nth-child(5)');

                    players.push({
                        name: nameElement ? nameElement.innerText.trim() : null,
                        // position: positionElement ? positionElement.innerText.trim() : null,
                        age: ageElement ? ageElement.innerText.trim() : null,
                        // nationality: nationalityElement ? nationalityElement.getAttribute('title').trim() : null,
                        marketValue: marketValueElement ? marketValueElement.innerText.trim() : null,
                    });
                });

                return {
                    founded: foundedElement ? foundedElement.innerText.trim() : null,
                    stadium: stadiumElement ? stadiumElement.innerText.trim() : null,
                    country: countryImageElement ? countryImageElement.getAttribute('title').trim() : null,
                    ups: upsElement ? upsElement.innerText.trim() : null,
                    downs: downsElement ? downsElement.innerText.trim() : null,
                    players: players, // Incluir el array de jugadores en el objeto retornado
                };
            });

            let dateParts = additionalInfo.founded.split('/');
            let correctFoundedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            element.founded = correctFoundedDate;
            element.stadium = additionalInfo.stadium;
            element.ups = additionalInfo.ups;
            element.downs = additionalInfo.downs;
            element.squad = additionalInfo.players;

            // Aplicar parseCurrencyString a cada jugador
            element.squad = additionalInfo.players.map(player => ({
                ...player,
                age: player.age ? convertDate(player.age) : null,
                marketValue: player.marketValue ? parseCurrencyString(player.marketValue).toString() : null
            }));

            const countryMap = {
                'Spain': 'ES',
                'España': 'ES',
                'Germany': 'DE',
                'Alemania': 'DE',
                'England': 'GB',
                'Inglaterra': 'GB',
                // Añade más países según sea necesario
            };

            let countryCode = countryMap[additionalInfo.country] || 'Unknown';

            element.country = {
                id: countryCode,
                name: additionalInfo.country
            };

            console.log(`Scraped data for ${element.name}:`, additionalInfo);

            // Find the matching team in teamsData
            const teamKey = Object.keys(teamsData).find(key =>
                stringSimilarity.compareTwoStrings(teamsData[key].name, element.name) > 0.5
            );

            if (teamKey) {
                const team = teamsData[teamKey];
                matchedTeams.push({
                    id: team.id,
                    name: team.name,
                    short: team.short,
                    color: team.color,
                    founded: element.founded,
                    stadium: element.stadium,
                    country: element.country,
                    ratings: {
                        elo: "1000",
                        eloBest: "1000",
                    },
                    market: {
                        value: parseCurrencyString(element.marketValue).toString(),
                        ups: parseCurrencyString(element.ups).toString(),
                        downs: parseCurrencyString(element.downs).toString()
                    },
                    trophies: {

                    },
                    squad: element.squad
                });
            }

            // Add a delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error(`Error processing ${element.name}:`, error.message);
        }
    }

    console.log('Matched teams:', matchedTeams);
    return matchedTeams;
}

// Main function.
async function getTeamsIndex(url, teamsData, footballRAPIObject) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

        // Click consent cookies banner
        try {
            await page.waitForSelector('#onetrust-accept-btn-handler', { visible: true, timeout: 5000 });
            await page.click('#onetrust-accept-btn-handler');
        } catch (error) {
            console.log('Cookie consent banner not found or not clickable');
        }

        const teams = [];
        const addedTeams = new Set();

        await page.waitForSelector('.ui-table__body');
        const teamUrls = await page.evaluate(() => {
            const links = document.querySelectorAll('.ui-table__body a');
            return Array.from(links).map(link => link.href);
        });

        for (const url of teamUrls) {
            let retries = 3;
            while (retries > 0) {
                try {
                    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
                    await page.waitForSelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name', { timeout: 10000 });

                    const teamData = await page.evaluate(() => {
                        const urlParts = window.location.href.split('/');
                        const id = urlParts[urlParts.length - 2];
                        const name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
                        return { id, name };
                    });

                    if (!addedTeams.has(teamData.id)) {
                        const teamInfo = teamsData[teamData.name];
                        if (teamInfo) {
                            teams.push({
                                id: teamData.id,
                                name: teamInfo.name,
                                short: teamInfo.short,
                                color: teamInfo.color
                            });
                            addedTeams.add(teamData.id);
                        } else {
                            console.log(`Team info not found for ${teamData.name}`);
                        }
                    }
                    break;
                } catch (error) {
                    console.error(`Error processing ${url}, retries left: ${retries}`, error.message);
                    retries--;
                    if (retries === 0) {
                        console.error(`Failed to process ${url} after 3 attempts`);
                    } else {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }
            }
        }

        let correctTeams = await getTeamsDetailedInfo(page, teamsData, teams);

        footballRAPIObject.teams.push(correctTeams);

        const fileLocation = path.join(__dirname, `../db/teams.json`);

        fs.writeFile(fileLocation, JSON.stringify({ updated: footballRAPIObject.updated, teams: correctTeams }), 'utf8', (err) => {
            if (err) {
                console.log(`[Teams | 2024] - An error occurred while writing JSON object to file.`);
                console.log(err);
            } else {
                console.log(`[Teams | 2024] - JSON file has been saved.`);
            }
        });

    } catch (error) {
        console.error('An error occurred during scraping:', error);
    } finally {
        await browser.close();
    }
}

// Clone the base object for each function call.
function cloneBaseObject(baseObject) {
    return JSON.parse(JSON.stringify(baseObject));
}

// Fetch teams for the specified URL and teams data.
getTeamsIndex(teamsEloURLs.SPAIN, teamsData, cloneBaseObject(footballRAPIObject));