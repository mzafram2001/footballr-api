const PUPPETER = require('puppeteer');
const FS = require('fs');
// const CLICKCMP = require("puppeteer-cmp-clicker");

// TODO: 
// - Reorganizar esquema de JSON como MiduDev (y repo y todo)
// - Organizar código

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    england: "https://www.flashscore.com/football/england/premier-league/standings/",
    spain: "https://www.flashscore.com/football/spain/laliga/standings/",
    france: "https://www.flashscore.com/football/france/ligue-1/standings/",
    italy: "https://www.flashscore.com/football/italy/serie-a/standings/",
    germany: "https://www.flashscore.com/football/germany/bundesliga/standings/"
};

// // // // // // // // // // CODE // // // // // // // // // //
async function getStandings(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "domcontentloaded" });
    await PAGE.waitForSelector('.ui-table__body', { visible: true });
    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        JSON.name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
        JSON.yearStart = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearStart = parseInt(JSON.yearStart.substring(0, 4));
        JSON.yearEnd = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearEnd = parseInt(JSON.yearEnd.substring(5, JSON.yearStart - 1));
        JSON.standings = [];
        var numRow = 0;
        var dumpString;
        var dumpStringArray;
        const ROWS = document.querySelectorAll('.ui-table__row  ');
        console.log(ROWS);
        ROWS.forEach(element => {
            numRow++;
            const TMP = {};
            element.querySelectorAll('.table__cell--value').innerText;
            if (numRow < 10) {
                TMP.position = parseInt(element.querySelector('.tableCellRank').innerText.substring(0, 1));
            } else {
                TMP.position = parseInt(element.querySelector('.tableCellRank').innerText.substring(0, 2));
            }
            TMP.team = {};
            dumpString = element.querySelector('.tableCellParticipant__image').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.team.id = dumpStringArray[3];
            TMP.team.name = element.querySelector('.tableCellParticipant__name').innerText;
            TMP.team.crest = TMP.team.id + ".png";
            TMP.playedGames = parseInt(element.querySelector('.table__cell--value').innerText);
            TMP.wins = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(4)').innerText);
            TMP.draws = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(5)').innerText);
            TMP.loses = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(6)').innerText);
            TMP.goalsFor = parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 2));
            TMP.goalsAgainst = parseInt(element.querySelector('.table__cell--score').innerText.substring(3, 5));
            TMP.goalDifference = parseInt(TMP.goalsFor) - parseInt(TMP.goalsAgainst);
            TMP.points = parseInt(element.querySelector('.table__cell--points').innerText);
            for (var i = 2; i < 7; i++) {
                if(i == 2) {
                    TMP.form = element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + i + ') > div').innerText;
                } else {
                    TMP.form = TMP.form.concat(",", element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + i + ') > div').innerText);
                }
            }
            JSON.standings.push(TMP);
        });
        return JSON;
    });
    switch (RESULT.name) {
        case "LaLiga": var fileLocation = "./results/standingsLaLigaFlashcore.json";
            break;
        case "Bundesliga": var fileLocation = "./results/standings/standingsBundesligaFlashcore.json";
            break;
        case "Serie A": var fileLocation = "./results/standings/standingsSerieAFlashcore.json";
            break;
        case "Ligue 1": var fileLocation = "./results/standings/standingsLigue1Flashcore.json";
            break;
        case "Premier League": var fileLocation = "./results/standings/standingsPremierLeagueFlashcore.json";
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

// // // // // // // // // // FUNCTION CALL // // // // // // // // // //
getStandings(URLS.spain);