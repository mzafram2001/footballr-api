// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define URLs object.
const URLs = {
    germany: "https://www.flashscore.com/football/germany/bundesliga/standings",
    france: "https://www.flashscore.com/football/france/ligue-1/standings/#/Q1sSPOn5/",
    spain: "https://www.flashscore.com/football/spain/laliga/standings/",
    england: "https://www.flashscore.com/football/england/premier-league/standings",
    italy: "https://www.flashscore.com/football/italy/serie-a/standings/",
};

// Define the properties of standingsURLs.
const standingsURLs = {
    GERMANY: URLs.germany,
    FRANCE: URLs.france,
    SPAIN: URLs.spain,
    ENGLAND: URLs.england,
    ITALY: URLs.italy,
};

// Create the base object.
const footballRAPIObject = {
    "name": "FootballR API",
    "description": "Advanced API designed to provide accurate, real-time data on the world of football.",
    "repoUrl": "https://github.com/mzafram2001/footballr-api",
    "version": "v14072024",
    "updated": "07.07.2024",
    "message": "Created with love by Miguel Zafra.",
    "competitions": []
};

// Define the properties of teamsData.
const teamsData = {
    // Current
    "Atl. Madrid": { short: "ATM", name: "Atlético Madrid", color: "#CE3524" },
    "Betis": { short: "BET", name: "Real Betis", color: "#00954C" },
    "Ath Bilbao": { short: "BIL", name: "Athletic Bilbao", color: "#EE2523" },
    "Real Madrid": { short: "RMA", name: "Real Madrid", color: "#E2E2E2" },
    "Girona": { short: "GIR", name: "Girona", color: "#CD2534" },
    "Barcelona": { short: "BAR", name: "Barcelona", color: "#A50044" },
    "Real Sociedad": { short: "RSO", name: "Real Sociedad", color: "#143C8B" },
    "Valencia": { short: "VAL", name: "Valencia", color: "#EE3524" },
    "Villarreal": { short: "VIL", name: "Villarreal", color: "#FFE667" },
    "Getafe": { short: "GET", name: "Getafe", color: "#005999" },
    "Alaves": { short: "ALA", name: "Alavés", color: "#009AD7" },
    "Sevilla": { short: "SEV", name: "Sevilla", color: "#F43333" },
    "Osasuna": { short: "OSA", name: "Osasuna", color: "#D91A21" },
    "Las Palmas": { short: "PAL", name: "Las Palmas", color: "#FFE400" },
    "Celta Vigo": { short: "CEL", name: "Celta Vigo", color: "#8AC3EE" },
    "Rayo Vallecano": { short: "RAY", name: "Rayo Vallecano", color: "#E53027" },
    "Mallorca": { short: "MAL", name: "Mallorca", color: "#E20613" },
    "Valladolid": { short: "VLL", name: "Valladolid", color: "#921B88" },
    "Leganes": { short: "LEG", name: "Leganés", color: "#0C1F6E" },
    "Espanyol": { short: "ESP", name: "Espanyol", color: "#007FC8" },

    /*"Arsenal": { short: "ARS", name: "Arsenal", color: "#DB0007" },
    "Aston Villa": { short: "AST", name: "Aston Villa", color: "#95BFE5" },
    "Chelsea": { short: "CHE", name: "Chelsea", color: "#034694" },
    "Everton": { short: "EVE", name: "Everton", color: "#003399" },
    "Fulham": { short: "FUL", name: "Fulham", color: "#000000" },
    "Liverpool": { short: "LIV", name: "Liverpool", color: "#C8102E" },
    "Manchester City": { short: "MCI", name: "Manchester City", color: "#6CABDD" },
    "Manchester Utd": { short: "MNU", name: "Manchester United", color: "#DA291C" },
    "Newcastle": { short: "NEW", name: "Newcastle", color: "#241F20" },
    "Tottenham": { short: "TOT", name: "Tottenham", color: "#132257" },
    "West Ham": { short: "WHU", name: "West Ham", color: "#7A263A" },
    "Crystal Palace": { short: "CRY", name: "Crystal Palace", color: "#1B458F" },
    "Wolves": { short: "WOL", name: "Wolves", color: "#FDB913" },
    "Bournemouth": { short: "BOU", name: "Bournemouth", color: "#DA291C" },
    "Brighton": { short: "BHA", name: "Brighton", color: "#0057B8" },
    "Nottingham": { short: "NOT", name: "Nottingham", color: "#DD0000" },
    "Brentford": { short: "BRE", name: "Brentford", color: "#D20000" },

    "Luton": { short: "LUT", name: "Luton", color: "#F78F1E" },
    "Ipswich": { short: "IPS", name: "Ipswich", color: "#DE2C37" },
    "Leicester": { short: "LEI", name: "Leicester", color: "#003090" },
    "Southampton": { short: "SOU", name: "Southampton", color: "#D71920" },*/

    // PENDIENTE.....
};

// Main function.
async function getStandings(url, teamsData, footballRAPIObject) {
    // Launch the Puppeteer browser in headless mode.
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Open a new page.
    const page = await browser.newPage();

    // Navigate to the specified URL and wait until the network is idle.
    await page.goto(url, { waitUntil: "networkidle0" });

    // Evaluate the page to extract the necessary data.
    const result = await page.evaluate((teamsData) => {
        const json = {};
        const leagues = {
            "Bundesliga": { id: "BUN", area: { id: "ptQide1O", name: "Germany", short: "GER", color: "#FACC34" }, description: "Bundesliga standings table, with detailed information." },
            "Ligue 1": { id: "LI1", area: { id: "8A4vPr2B", name: "France", short: "FRA", color: "#0055A4" }, description: "Ligue 1 standings table, with detailed information." },
            "LaLiga": { id: "LAL", area: { id: "bLyo6mco", name: "Spain", short: "ESP", color: "#AA151B" }, description: "LaLiga standings table, with detailed information." },
            "Premier League": { id: "PRL", area: { id: "j9N9ZNFA", name: "England", short: "ENG", color: "#DBDBDB" }, description: "Premier League standings table, with detailed information." },
            "Serie A": { id: "SEA", area: { id: "GK3TOCxh", name: "Italy", short: "ITA", color: "#008C45" }, description: "Serie A standings table, with detailed information." },
        };

        let leagueName;
        const heading = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading');
        leagueName = heading.querySelector('div.heading__title > div.heading__name').innerText;
        json.id = leagues[leagueName].id;
        json.name = leagueName;
        json.description = leagues[leagueName].description;

        const headingInfo = heading.querySelector('div.heading__info').innerText;
        json.yearStart = parseInt(headingInfo.substring(0, 4));
        json.yearEnd = parseInt(headingInfo.substring(5, json.yearStart - 1));

        json.area = { ...leagues[leagueName].area };

        json.standings = [];
        const rows = document.querySelectorAll('.ui-table__row');

        rows.forEach((element, index) => {
            const tmp = {};
            tmp.position = parseInt(element.querySelector('.tableCellRank').innerText.trim());
            tmp.team = {};

            const href = element.querySelector('.tableCellParticipant__image').getAttribute('href');
            tmp.team.id = href.split('/')[3];
            tmp.team.name = element.querySelector('.tableCellParticipant__name').innerText.trim();
            const teamData = teamsData[tmp.team.name] || { short: tmp.team.short, name: tmp.team.name, color: "#000000" };
            tmp.team.short = teamData.short;
            tmp.team.name = teamData.name;
            tmp.team.color = teamData.color;
            tmp.playedGames = parseInt(element.querySelector('.table__cell--value').innerText.trim());
            tmp.wins = parseInt(element.querySelector(`.ui-table__body > div:nth-child(${index + 1}) > span:nth-child(4)`).innerText.trim());
            tmp.draws = parseInt(element.querySelector(`.ui-table__body > div:nth-child(${index + 1}) > span:nth-child(5)`).innerText.trim());
            tmp.loses = parseInt(element.querySelector(`.ui-table__body > div:nth-child(${index + 1}) > span:nth-child(6)`).innerText.trim());
            const score = element.querySelector('.table__cell--score').innerText.trim();
            const scoreArray = score.split(':');
            tmp.goalsFor = parseInt(scoreArray[0]);
            tmp.goalsAgainst = parseInt(scoreArray[1]);
            tmp.goalDifference = tmp.goalsFor - tmp.goalsAgainst;
            tmp.points = parseInt(element.querySelector('.table__cell--points').innerText.trim()) || 0;

            const formElements = element.querySelectorAll('.tableCellFormIcon > button');
            tmp.form = Array.from(formElements).map(btn => btn.innerText).join(',') || "-";
            json.standings.push(tmp);
        });

        return json;
    }, teamsData);

    // Push to the original object.
    footballRAPIObject.competitions.push(result);

    let leagueNameTrim = result.name.replace(/ /g, "");

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/${result.yearStart}/standings/standings${leagueNameTrim}${result.yearStart}Flashscore.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, JSON.stringify(footballRAPIObject), 'utf8', (err) => {
        if (err) {
            console.log(`[${result.name} | ${result.yearStart}] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[${result.name} | ${result.yearStart}] - JSON file has been saved.`);
        }
    });

    // Close the browser.
    await browser.close();
}

// Clone the base object for each function call.
function cloneBaseObject(baseObject) {
    return JSON.parse(JSON.stringify(baseObject));
}

// Fetch standings for the specified URL and teams data.
// getStandings(standingsURLs.GERMANY, teamsData, cloneBaseObject(footballRAPIObject));
// getStandings(standingsURLs.FRANCE, teamsData, cloneBaseObject(footballRAPIObject));
getStandings(standingsURLs.SPAIN, teamsData, cloneBaseObject(footballRAPIObject));
// getStandings(standingsURLs.ENGLAND, teamsData, cloneBaseObject(footballRAPIObject));
// getStandings(standingsURLs.ITALY, teamsData, cloneBaseObject(footballRAPIObject));