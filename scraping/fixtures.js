// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define URLs object.
const URLs = {
    spain: "https://www.flashscore.com/football/spain/laliga/fixtures",
}

// Define the properties of fixturesURLs.
const fixturesURLs = {
    SPAIN: URLs.spain,
};

// Create the base object.
const footballRAPIObject = {
    "updated": new Date().toISOString().slice(0, 10),
    "competitions": []
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
async function getSchedules(url) {
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

    // While expand button is visible, click it.
    while (await page.$('.event__more') !== null) {
        await page.waitForSelector('.event__more', { visible: true, timeout: 3000 });
        await page.click('.event__more');
        await delay(1000);
    }

    // Evaluate the page to extract the necessary data.
    const result = await page.evaluate((teamsData) => {
        const json = {};
        const leagues = {
            "LaLiga": { id: "LAL", area: { id: "bLyo6mco", name: "Spain", short: "ESP", color: "#AA151B" }, description: "View LaLiga scheduled matches, with detailed information." },
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

        json.season = [];
        json.matchesIteration = [];

        const roundsSelector = document.querySelectorAll('.event__round');
        const matchesSelector = document.querySelectorAll('.event__match');

        const reverseRoundsSelector = Array.prototype.slice.call(roundsSelector).reverse();
        let reverseMatchesSelector = Array.prototype.slice.call(matchesSelector).reverse();
        let round = 0;
        for (let i = reverseMatchesSelector.length - 1; i >= 0; i--) {
            const temp2 = {};
            temp2.id = reverseMatchesSelector[i].id.substring(4);
            temp2.link = "https://www.flashscore.com/match/" + temp2.id;
            json.matchesIteration.push(temp2);
        }
        for (let i = reverseRoundsSelector.length - 1; i >= 0; i--) {
            const temp = {};
            let found = false;
            temp.round = parseInt(reverseRoundsSelector[i].innerText.substring(6));
            round = parseInt(temp.round);
            temp.matches = [];
            for (index in json.season) {
                if (json.season[index].round == temp.round) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                json.season.push(temp);
            }
        }
        return json;
    });

    for (let match of result.matchesIteration) {
        await page.goto(match.link, { waitUntil: 'networkidle0' });
        console.log(match.link);
        const matchInfo = await page.evaluate((teamsData) => {
            const temp = {};
            let title = document.evaluate("/html/head/title", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            temp.homeTeam = {};
            let homeTeamName = document.querySelector('#detail .duelParticipant__home .participant__overflow').innerText;
            let homeTeamData = teamsData[homeTeamName] || {};
            temp.homeTeam.id = document.querySelector('#detail .duelParticipant__home a').getAttribute('href').split('/')[3];
            temp.homeTeam.name = homeTeamData.name || homeTeamName;
            temp.homeTeam.shorthand = homeTeamData.short || title.innerText.substring(0, 3);
            temp.homeTeam.color = homeTeamData.color;

            temp.awayTeam = {};
            let awayTeamName = document.querySelector('#detail .duelParticipant__away .participant__overflow').innerText;
            let awayTeamData = teamsData[awayTeamName] || {};
            temp.awayTeam.id = document.querySelector('#detail .duelParticipant__away a').getAttribute('href').split('/')[3];
            temp.awayTeam.name = awayTeamData.name || awayTeamName;
            temp.awayTeam.shorthand = awayTeamData.short || title.innerText.substring(6, 9);
            temp.awayTeam.color = awayTeamData.color;

            temp.round = parseInt(document.querySelector('.tournamentHeader__country a').innerText.split(" ").pop()) || "Relegation Play-Offs";
            temp.date = document.querySelector('.duelParticipant__startTime').innerText.substring(0, 10);
            temp.hour = document.querySelector('.duelParticipant__startTime').innerText.substring(11);
            temp.home = document.querySelector('.duelParticipant__home').innerText;
            temp.away = document.querySelector('.duelParticipant__away').innerText;
            return temp;
        }, teamsData);

        match.round = matchInfo.round;
        match.date = matchInfo.date;
        match.hour = matchInfo.hour;
        match.homeTeam = matchInfo.homeTeam;
        match.awayTeam = matchInfo.awayTeam;
        match.status = "SCHEDULED";
    }

    for (let i = 0; i <= result.matchesIteration.length - 1; i++) {
        let pushIt = false;
        let j = 0;
        while (j <= result.season.length - 1 && pushIt == false) {
            if (result.matchesIteration[i].round == result.season[j].round) {
                result.season[j].matches.push(result.matchesIteration[i]);
                delete result.matchesIteration[i].link;
                pushIt = true;
            }
            j++;
        }
    }

    // Delete matchesIteration object.
    delete result.matchesIteration;

    let leagueNameTrim = result.name.replace(/ /g, "");

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/${result.yearStart}/fixtures/fixtures${leagueNameTrim}${result.yearStart}.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, JSON.stringify({ updated: footballRAPIObject.updated, fixtures: result.season }), 'utf8', (err) => {
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

async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

getSchedules(fixturesURLs.SPAIN, teamsData);