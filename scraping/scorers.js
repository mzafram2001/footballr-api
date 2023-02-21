const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    spain_scorers_2015: "",
    spain_scorers_2016: "",
    spain_scorers_2017: "",
    spain_scorers_2018: "",
    spain_scorers_2019: "",
    spain_scorers_2020: "",
    spain_scorers_2021: "",
    spain_scorers_2022: "https://www.flashscore.com/football/spain/laliga/standings/#/COQ6iu30/top_scorers",


    france_scorers_2022: "https://www.flashscore.com/football/france/ligue-1/standings/#/zmkW5aIi/top_scorers",
    england_scorers_2022: "https://www.flashscore.com/football/england/premier-league/standings/#/nunhS7Vn/top_scorers",
    germany_scorers_2022: "https://www.flashscore.com/football/germany/bundesliga/standings/#/OIbxfZZI/top_scorers",
    italy_scorers_2022: "https://www.flashscore.com/football/italy/serie-a/standings/#/UcnjEEGS/top_scorers",
}

// // // // // // // // // // CODE SCORERS // // // // // // // // // //
async function getScorers(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });

    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        JSON.name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
        switch (JSON.name) {
            case "LaLiga": JSON.area = "ESP";
                break;
            case "Primera Division":
                JSON.name = "LaLiga";
                JSON.area = "ESP";
                break;
            case "Bundesliga": JSON.area = "GER";
                break;
            case "Serie A": JSON.area = "ITA";
                break;
            case "Ligue 1": JSON.area = "FRA";
                break;
            case "Premier League": JSON.area = "ENG";
                break;
        };
        JSON.yearStart = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearStart = parseInt(JSON.yearStart.substring(0, 4));
        JSON.yearEnd = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearEnd = parseInt(JSON.yearEnd.substring(5, JSON.yearStart - 1));
        JSON.scorers = [];
        var numRow = 0;
        var dumpString;
        var dumpStringArray;
        var dumpStringArraySecondary;
        const ROWS = document.querySelectorAll('.ui-table__row .topScorers__row ');
        for (var i = 0; i < 10; i++) {
            const TMP = {};
            numRow++;
            TMP.position = numRow;
            dumpString = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.playerid = dumpStringArray[3];
            dumpStringArraySecondary = dumpStringArray[2].split('-');
            var lastName = dumpStringArraySecondary[0];
            var firstName = dumpStringArraySecondary[1];
            if (firstName == undefined) {
                TMP.name = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
            } else if (lastName == undefined) {
                TMP.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
            } else {
                TMP.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
            }
            TMP.nationality = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a > span').getAttribute('title');
            dumpString = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            dumpStringArraySecondary = dumpStringArray[2].split('-');
            var teamName = dumpStringArraySecondary[0];
            if (teamName == undefined) {
                TMP.team = "-";
            }
            TMP.team = String(teamName).charAt(0).toUpperCase() + String(teamName).slice(1);
            TMP.goals = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--goals.topScorers__cell').innerText);
            TMP.assists = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--gray.topScorers__cell').innerText);
            JSON.scorers.push(TMP);
        }
        return JSON;
    });

    switch (RESULT.name) {
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/scorers/scorersLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/scorers/scorersLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/scorers/scorersBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/scorers/scorersSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/scorers/scorersLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/scorers/scorersPremierLeague" + RESULT.yearStart + "Flashcore.json");
            break;
    }

    FS.writeFile(fileLocation, JSON.stringify(RESULT), 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await BROWSER.close();
}

// // // // // // // // // // DELAY STANDINGS // // // // // // // // // //
async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

// // // // // // // // // // FUNCTION CALL // // // // // // // // // //
getScorers(URLS.spain_scorers_2022);
getScorers(URLS.france_scorers_2022);
getScorers(URLS.england_scorers_2022);
getScorers(URLS.germany_scorers_2022);
getScorers(URLS.italy_scorers_2022);