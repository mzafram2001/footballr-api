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

// Define the properties of teamsData.
const teamsData = {
    "Atl. Madrid": { short: "ATM", name: "Atlético Madrid", color: "#CE3524" },
    "Betis": { short: "BET", name: "Real Betis", color: "#00954C" },
    "Granada CF": { short: "GRA", name: "Granada", color: "#C31632" },
    "Ath Bilbao": { short: "ATH", name: "Athletic Bilbao", color: "#EE2523" },
    "Cadiz CF": { short: "CAD", name: "Cádiz", color: "#F2A40C" },
    "Almeria": { short: "ALM", name: "Almería", color: "#EE1119" },
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
    "Las Palmas": { short: "LPA", name: "Las Palmas", color: "#FFE400" },
    "Celta Vigo": { short: "CEL", name: "Celta Vigo", color: "#8AC3EE" },
    "Rayo Vallecano": { short: "RAY", name: "Rayo Vallecano", color: "#E53027" },
    "Mallorca": { short: "MLL", name: "Mallorca", color: "#E20613" },
};

// Main function.
async function getStandings(url, teamsData) {
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
            "LaLiga": "ESP",
        };

        const heading = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading');
        json.name = heading.querySelector('div.heading__title > div.heading__name').innerText;
        json.area = leagues[json.name];

        const headingInfo = heading.querySelector('div.heading__info').innerText;
        json.yearStart = parseInt(headingInfo.substring(0, 4));
        json.yearEnd = parseInt(headingInfo.substring(5, json.yearStart - 1));

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

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/${result.yearStart}/standings/standings${result.name}${result.yearStart}Flashscore.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, JSON.stringify(result), 'utf8', (err) => {
        if (err) {
            console.log(`[${result.name}] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[${result.name}] - JSON file has been saved.`);
        }
    });

    // Close the browser.
    await browser.close();
}

// Fetch standings for the specified URL and teams data.
getStandings(standingsURLs.SPAIN, teamsData);