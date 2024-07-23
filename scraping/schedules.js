// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define URLs object.
const URLs = {
    spain: "https://www.flashscore.com/football/spain/laliga/fixtures",
}

// Define the properties of schedulesURLs.
const schedulesURLs = {
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
        headless: false,
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

        json.season = [];
        json.matchesIteration = [];

        const roundsSelector = document.querySelectorAll('.event__round');
        const matchesSelector = document.querySelectorAll('.event__match');

        const reverseRoundsSelector = Array.prototype.slice.call(roundsSelector).reverse();
        let reverseMatchesSelector = Array.prototype.slice.call(matchesSelector).reverse();
        let round = 0;
        for (let i = reverseMatchesSelector.length - 1; i >= 0; i--) {
            const TMP2 = {};
            TMP2.id = reverseMatchesSelector[i].id.substring(4);
            TMP2.link = "https://www.flashscore.com/match/" + TMP2.id;
            json.matchesIteration.push(TMP2);
        }
        for (let i = reverseRoundsSelector.length - 1; i >= 0; i--) {
            const TMP = {};
            let found = false;
            TMP.round = parseInt(reverseRoundsSelector[i].innerText.substring(6));
            round = parseInt(TMP.round);
            TMP.matches = [];
            for (index in json.season) {
                if (json.season[index].round == TMP.round) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                json.season.push(TMP);
            }
        }
        return json;
    });

    console.log(result);

    /*for (let match of RESULT.matchesIteration) {
        await PAGE.goto(match.link, { 'waitUntil': 'networkidle0' });
        console.log(match.link);
        const MATCH = await PAGE.evaluate(() => {
            const TMP = {};
            let dumpString;
            let dumpStringArray;
            let title = document.evaluate("/html/head/title", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            TMP.homeTeam = {};
            dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.homeTeam.id = dumpStringArray[3];
            TMP.homeTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
            switch (TMP.homeTeam.name) {
                case "Atl. Madrid": TMP.homeTeam.name = "Atlético Madrid";
                    break;
                case "Betis": TMP.homeTeam.name = "Real Betis";
                    break;
                case "Granada CF": TMP.homeTeam.name = "Granada";
                    break;
                case "Ath Bilbao": TMP.homeTeam.name = "Athletic Bilbao";
                    break;
                case "Cadiz CF": TMP.homeTeam.name = "Cádiz";
                    break;
                case "Alaves": TMP.homeTeam.name = "Deportivo Alavés";
                    break;
                case "Almeria": TMP.homeTeam.name = "Almería";
                    break;
                case "Malaga": TMP.homeTeam.name = "Málaga";
                    break;
                case "Dep. La Coruna": TMP.homeTeam.name = "Deportivo La Coruña";
                    break;
                case "Gijon": TMP.homeTeam.name = "Gijón";
                    break;
                case "Leganes": TMP.homeTeam.name = "Leganés";
                    break;
            }
            TMP.homeTeam.shorthand = title.innerText.substring(0, 3);
            TMP.homeTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.homeTeam.id + ".svg";
            TMP.awayTeam = {};
            dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.awayTeam.id = dumpStringArray[3];
            TMP.awayTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
            switch (TMP.awayTeam.name) {
                case "Atl. Madrid": TMP.awayTeam.name = "Atlético Madrid";
                    break;
                case "Betis": TMP.awayTeam.name = "Real Betis";
                    break;
                case "Granada CF": TMP.awayTeam.name = "Granada";
                    break;
                case "Ath Bilbao": TMP.awayTeam.name = "Athletic Bilbao";
                    break;
                case "Cadiz CF": TMP.awayTeam.name = "Cádiz";
                    break;
                case "Alaves": TMP.awayTeam.name = "Deportivo Alavés";
                    break;
                case "Almeria": TMP.awayTeam.name = "Almería";
                    break;
                case "Malaga": TMP.awayTeam.name = "Málaga";
                    break;
                case "Dep. La Coruna": TMP.awayTeam.name = "Deportivo La Coruña";
                    break;
                case "Gijon": TMP.awayTeam.name = "Gijón";
                    break;
                case "Leganes": TMP.awayTeam.name = "Leganés";
                    break;
            }
            TMP.awayTeam.shorthand = title.innerText.substring(6, 9);
            TMP.awayTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.awayTeam.id + ".svg";
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
            return TMP;
        });
        match.round = MATCH.round;
        match.date = MATCH.date;
        match.hour = MATCH.hour;
        match.homeTeam = MATCH.homeTeam;
        match.awayTeam = MATCH.awayTeam;
        match.status = "SCHEDULED"
    }*/

    /*for (let i = 0; i <= RESULT.matchesIteration.length - 1; i++) {
        let pushIt = false;
        let j = 0;
        while (j <= RESULT.season.length - 1 && pushIt == false) {
            if (RESULT.matchesIteration[i].round == RESULT.season[j].round) {
                RESULT.season[j].matches.push(RESULT.matchesIteration[i]);
                delete RESULT.matchesIteration[i].link;
                pushIt = true;
            }
            j++;
        }
    }

    delete RESULT.matchesIteration;

    switch (RESULT.name) {
        case "LaLiga": let fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": let fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": let fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": let fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": let fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": let fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesPremierLeague" + RESULT.yearStart + "Flashcore.json");
            break;
    }

    let leagueNameTrim = result.name.replace(/ /g, "");

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/${result.yearStart}/schedules/schedules${leagueNameTrim}${result.yearStart}Flashscore.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, result.stringify({ updated: footballRAPIObject.updated, season: result.season }), 'utf8', (err) => {
        if (err) {
            console.log(`[${result.name} | ${result.yearStart}] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[${result.name} | ${result.yearStart}] - JSON file has been saved.`);
        }
    });

    // Close the browser.*/
    await browser.close();
}

async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

getSchedules(schedulesURLs.SPAIN, teamsData);