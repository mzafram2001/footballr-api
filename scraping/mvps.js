const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    spain: "https://www.whoscored.com/Regions/206/Tournaments/4/Seasons/9682/Stages/22176/PlayerStatistics/Spain-LaLiga-2023-2024",
};

const STANDINGS_URLS = {
    SPAIN: URLS.spain,
};

async function getMvps(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        const LEAGUES = {
            "LaLiga": "ESP",
            "Bundesliga": "GER",
            "Serie A": "ITA",
            "Ligue 1": "FRA",
            "Premier League": "ENG"
        };
        JSON.name = document.querySelector('.tournament-header').innerText;
        JSON.area = LEAGUES[JSON.name];
        JSON.yearStart = 2023;
        JSON.yearEnd = 2024;
        JSON.mvps = [];
        var numRow = 0;
        var dumpString;
        var dumpStringArray;
        // const ROWS = document.querySelectorAll('#player-table-statistics-body');
        ROWS.forEach(element => {
            const TMP = {};
            numRow++;
            if (numRow <= 10) {
                //TMP.position = document.querySelector('#player-table-statistics-body > tr:nth-child(1) > td.col12-lg-2.col12-m-3.col12-s-4.col12-xs-5.grid-abs.overflow-text > a.player-link > div').innerText;
            }
        });
    });

    var leagueName = RESULT.name;
    var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/mvps/mvps" + leagueName.replace(" ", "") + RESULT.yearStart + "Flashcore.json");
    FS.writeFile(fileLocation, JSON.stringify(RESULT), 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await BROWSER.close();
}


getMvps(STANDINGS_URLS.SPAIN);