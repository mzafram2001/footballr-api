// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define URLs object.
const URLs = {
    spain: "https://www.flashscore.com/football/spain/laliga/standings/",
};

// Define the properties of standingsURLs.
const standingsURLs = {
    SPAIN: URLs.spain,
};

// Create the base object.
const footballRAPIObject = {
    "competitions": []
};

// Define the properties of teamsData.
const teamsData = {
    "Atl. Madrid": { short: "ATM", name: "Atlético Madrid", color: "#CB3524" },
    "Betis": { short: "BET", name: "Real Betis", color: "#25961D" },
    "Ath Bilbao": { short: "BIL", name: "Athletic Bilbao", color: "#DEDEDE" },
    "Real Madrid": { short: "RMA", name: "Real Madrid", color: "#FCF7F7" },
    "Girona": { short: "GIR", name: "Girona", color: "#CD2534" },
    "Barcelona": { short: "BAR", name: "Barcelona", color: "#A50044" },
    "Real Sociedad": { short: "RSO", name: "Real Sociedad", color: "#1610DE" },
    "Valencia": { short: "VAL", name: "Valencia", color: "#FF8308" },
    "Villarreal": { short: "VIL", name: "Villarreal", color: "#FFE667" },
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

    // Click consent cookies banner.
    await page.waitForSelector('#onetrust-accept-btn-handler', { visible: true, timeout: 3000 });
    await page.click('#onetrust-accept-btn-handler');

    // Evaluate the page to extract the necessary data.
    const result = await page.evaluate((teamsData) => {
        const json = {};
        const leagues = {
            "LaLiga": { id: "LAL", area: { id: "bLyo6mco", name: "Spain", short: "ESP", color: "#AA151B" }, description: "LaLiga standings table, with detailed information." },
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
            tmp.position = parseInt(element.querySelector('.tableCellRank').innerText.trim()).toString();
            tmp.team = {};

            const href = element.querySelector('.tableCellParticipant__image').getAttribute('href');
            tmp.team.id = href.split('/')[3];
            tmp.team.name = element.querySelector('.tableCellParticipant__name').innerText.trim();
            const teamData = teamsData[tmp.team.name] || { short: tmp.team.short, name: tmp.team.name, color: "#000000" };
            tmp.team.short = teamData.short;
            tmp.team.name = teamData.name;
            tmp.team.color = teamData.color;
            tmp.playedGames = element.querySelector('.table__cell--value').innerText.trim();
            tmp.wins = element.querySelector(`.ui-table__body > div:nth-child(${index + 1}) > span:nth-child(4)`).innerText.trim();
            tmp.draws = element.querySelector(`.ui-table__body > div:nth-child(${index + 1}) > span:nth-child(5)`).innerText.trim();
            tmp.losses = element.querySelector(`.ui-table__body > div:nth-child(${index + 1}) > span:nth-child(6)`).innerText.trim();
            const score = element.querySelector('.table__cell--score').innerText.trim();
            const scoreArray = score.split(':');
            tmp.goalsFor = scoreArray[0];
            tmp.goalsAgainst = scoreArray[1];
            tmp.goalsDifference = (tmp.goalsFor - tmp.goalsAgainst).toString();
            tmp.points = element.querySelector('.table__cell--points').innerText.trim() || 0;
            const formElements = element.querySelectorAll('.tableCellFormIcon > button');
            tmp.form = Array.from(formElements)
                .filter(btn => btn.innerText !== '?')
                .map(btn => btn.innerText)
                .join(',') || "-";
            json.standings.push(tmp);
        });

        return json;
    }, teamsData);

    // Push to the original object.
    footballRAPIObject.competitions.push(result);

    let leagueNameTrim = result.name.replace(/ /g, "");

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/${result.yearStart}/standings/standings${leagueNameTrim}${result.yearStart}.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, JSON.stringify({ standings: result.standings }), 'utf8', (err) => {
        if (err) {
            console.log(`[LaLiga (Standings) | 2024] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[LaLiga (Standings) | 2024] - JSON file has been saved.`);
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
getStandings(standingsURLs.SPAIN, teamsData, cloneBaseObject(footballRAPIObject));