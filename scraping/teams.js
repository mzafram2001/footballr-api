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

        "PSG": "Pari Saint-Germain",

        "Manchester Utd": "Manchester United",
        "Sheffield Utd": "Sheffield United",
    };

    const TEAM_COLOR = {
        "Inter": "#010E80",
        "Milan": "#B52E2B",
        "Juventus": "#000000",
        "Bologna": "#9F1F33",
        "Atalanta": "#2D5CAE",
        "Roma": "#FBBA00",
        "Lazio": "#85D8F8",
        "Napoli": "#12A0D7",
        "Fiorentina": "#502D7F",
        "Torino": "#881F19",
        "Monza": "#E4022E",
        "Genoa": "#AE1919",
        "Lecce": "#005B81",
        "Verona": "#002F6C",
        "Cagliari": "#B01028",
        "Frosinone": "#004393",
        "Empoli": "#4280C2",
        "Udinese": "#7F7F7F",
        "Sassuolo": "#0FA653",
        "Salernitana": "#681A12",

        "Bayer Leverkusen": "#E22726",
        "Bayern Munich": "#DC052D",
        "Stuttgart": "#D40723",
        "Leipzig": "#DD0741",
        "Dortmund": "#FDE100",
        "Eintracht Frankfurt": "#E00914",
        "Freiburg": "#5b5b5b",
        "Hoffenheim": "#1961B5",
        "Augsburg": "#BA3733",
        "Heidenheim": "#003B79",
        "Werder Bremen": "#009655",
        "Wolfsburg": "#65B32E",
        "Monchengladbach": "#000000",
        "Bochum": "#005BA4",
        "Union Berlin": "#EB1923",
        "Mainz": "#C3141E",
        "Koln": "#000000",
        "Darmstadt": "#004C99",

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

        "Paris Saint-Germain": "#004170",
        "Monaco": "#E63031",
        "Brest": "#ED1C24",
        "Lille": "#24216A",
        "Nice": "#B59A54",
        "Lens": "#FFF200",
        "Lyon": "#1112AA",
        "Rennes": "#E13327",
        "Marseille": "#2FAEE0",
        "Montpellier": "#344575",
        "Toulouse": "#3E2C56",
        "Reims": "#EE2223",
        "Strasbourg": "#009FE3",
        "Nantes": "#FCD405",
        "Le Havre": "#003259",
        "Metz": "#6E0F12",
        "Lorient": "#F58113",
        "Clermont": "#C50C46",

        "Arsenal": "#EF0107",
        "Manchester City": "#6CABDD",
        "Liverpool": "#C8102E",
        "Aston Villa": "#95BFE5",
        "Tottenham": "#132257",
        "Newcastle": "#241F20",
        "Chelsea": "#034694",
        "Manchester United": "#DA291C",
        "West Ham": "#7A263A",
        "Bournemouth": "#DA291C",
        "Brighton": "#0057B8",
        "Wolves": "#FDB913",
        "Fulham": "#000000",
        "Crystal Palace": "#1B458F",
        "Everton": "#003399",
        "Brentford": "#D20000",
        "Nottingham": "#DD0000",
        "Luton": "#F78F1E",
        "Burnley": "#6C1D45",
        "Sheffield United": "#EE2737",
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

            // Assign team color
            const teamColor = TEAM_COLOR[resultTeam.name];
            if (teamColor) {
                teamToUpdate.color = teamColor;
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