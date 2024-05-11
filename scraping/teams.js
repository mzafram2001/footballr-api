const PUPPETEER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "http://clubelo.com/ENG",
    spain: "http://clubelo.com/ESP",
    france: "http://clubelo.com/FRA",
    italy: "http://clubelo.com/ITA",
    germany: "http://clubelo.com/GER",
};

const TEAMS_URLS = {
    ENGLAND: URLS.england,
    SPAIN: URLS.spain,
    FRANCE: URLS.france,
    ITALY: URLS.italy,
    GERMANY: URLS.germany
};

async function getElos(url, startIndex, endIndex) {
    const BROWSER = await PUPPETEER.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    await PAGE.waitForSelector('.liste tbody');
    const RESULT = await PAGE.evaluate((startIndex, endIndex) => {
        const teamRows = document.querySelectorAll('.liste tbody tr');
        const teams = [];
        for (let i = startIndex - 1; i < endIndex; i++) {
            const row = teamRows[i];
            const nameElement = row.querySelector('.l > a');
            const eloElement = row.querySelector('.r');
            if (nameElement && eloElement) {
                const name = nameElement.innerText.trim();
                const elo = eloElement.innerText.trim();
                teams.push({ name, elo });
            }
        }
        return teams;
    }, startIndex, endIndex);

    await BROWSER.close();

    return RESULT;
}

async function updateTeamsData() {
    const fileLocation = PATH.join(process.cwd(), './db/teams.json');
    const original = require(fileLocation);

    const resultsEngland = await getElos(TEAMS_URLS.ENGLAND, 10, 29);
    const resultsSpain = await getElos(TEAMS_URLS.SPAIN, 16, 35);
    const resultsFrance = await getElos(TEAMS_URLS.FRANCE, 22, 39);
    const resultsItaly = await getElos(TEAMS_URLS.ITALY, 19, 38);
    const resultsGermany = await getElos(TEAMS_URLS.GERMANY, 13, 30);

    // Combine the results from all countries

    const allResults = resultsEngland.concat(
        resultsSpain,
        resultsFrance,
        resultsItaly,
        resultsGermany
    );

    // Update the teams data and calculate lastPosition
    const TEAM_NAME = {
        "AC Milan": "Milan",
        "AS Roma": "Roma",

        "RB Leipzig": "Leipzig",
        "B. Monchengladbach": "Monchengladbach",
        "FC Koln": "Koln",

        "Atl. Madrid": "Atletico Madrid",
        "Betis": "Real Betis",
        "Granada CF": "Granada",
        "Ath Bilbao": "Athletic Bilbao",
        "Cadiz CF": "Cadiz",
        "Almeria": "Almeria",

        "PSG": "Paris Saint-Germain",
        
        "Manchester Utd": "Manchester United",
        "Sheffield Utd": "Sheffield United",
    };

    allResults.forEach((resultTeam) => {
        // Your code to update teams as needed
        const updatedName = TEAM_NAME[resultTeam.name];
        if (updatedName) {
            resultTeam.name = updatedName;
        }
    
        // Find the corresponding team in the original data
        const teamToUpdate = original.teams.find((team) => team.name === resultTeam.name);
        if (teamToUpdate) {
            const newElo = parseInt(resultTeam.elo);
            if (newElo !== teamToUpdate.currentElo) {
                teamToUpdate.lastElo = teamToUpdate.currentElo;
                teamToUpdate.lastPosition = teamToUpdate.currentPosition;
                teamToUpdate.currentElo = newElo;
            }
            if (typeof teamToUpdate.bestElo === 'undefined' || newElo > teamToUpdate.bestElo) {
                teamToUpdate.bestElo = newElo;
            }
        }
    });

    // Sort and update positions

    original.teams.sort((a, b) => b.currentElo - a.currentElo);

    original.teams.forEach((team, index) => {
        team.currentPosition = index + 1;

        // Actualizar la mejor posición si es menor que la posición actual
        if (typeof team.bestPosition === 'undefined' || team.currentPosition < team.bestPosition) {
            team.bestPosition = team.currentPosition;
        }
    });

    // Write the updated data back to the file

    FS.writeFile(fileLocation, JSON.stringify(original), (err) => {
        if (err) {
            console.error('Error al guardar el archivo teams.json:', err);
        } else {
            console.log('Archivo teams.json actualizado con éxito.');
        }
    });
}

// Call the function to update the data
updateTeamsData();