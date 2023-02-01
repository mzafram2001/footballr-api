const pupet = require('puppeteer');
const fs = require('fs');
const { clickCmp } = require("puppeteer-cmp-clicker");

// TODO: 
// - Reorganizar esquema de JSON como MiduDev (y repo y todo)
// - Tocar los "form"
// - Organizar código

(async () => {
    const URLS = {
        england: "https://www.flashscore.com/football/england/premier-league/standings/",
        spain: "https://www.flashscore.com/football/spain/laliga/standings/",
        france: "https://www.flashscore.com/football/france/ligue-1/standings/",
        italy: "https://www.flashscore.com/football/italy/serie-a/standings/",
        germany: "https://www.flashscore.com/football/germany/bundesliga/standings/"
    }
    const browser = await pupet.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.goto(URLS.spain, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('.ui-table__body', { visible: true });

    // CREATE A FUNCTION
    const result = await page.evaluate(() => {
        const json = {};
        json.name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
        json.yearStart = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText
        json.yearStart = parseInt(json.yearStart.substring(0, 4));
        json.yearEnd = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText
        json.yearEnd = parseInt(json.yearEnd.substring(5, json.yearStart - 1));
        json.standings = [];
        var numRow = 0;

        const rows = document.querySelectorAll('.ui-table__row  ');
        console.log(rows);

        rows.forEach(element => {
            numRow++;
            const tmp = {};
            element.querySelectorAll('.table__cell--value').innerText;
            if (numRow < 10) {
                tmp.position = parseInt(element.querySelector('.tableCellRank').innerText.substring(0, 1));
            } else {
                tmp.position = parseInt(element.querySelector('.tableCellRank').innerText.substring(0, 2));
            }
            tmp.team = element.querySelector('.tableCellParticipant__name').innerText;
            tmp.playedGames = parseInt(element.querySelector('.table__cell--value').innerText);
            tmp.wins = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(4)').innerText);
            tmp.draws = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(5)').innerText);
            tmp.loses = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(6)').innerText);
            tmp.goalsFor = parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 2));
            tmp.goalsAgainst = parseInt(element.querySelector('.table__cell--score').innerText.substring(3, 5));
            tmp.goalsDifference = parseInt(tmp.goalsFor) - parseInt(tmp.goalsAgainst);
            tmp.points = parseInt(element.querySelector('.table__cell--points').innerText);
            tmp.form = [];
            for (var i = 2; i < 7; i++) {
                const tmp2 = {};
                tmp2.form = element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + i + ') > div').innerText;
                tmp.form.push(tmp2);
            }
            json.standings.push(tmp);
        });

        return json;
    });

    switch (result.name) {
        case "LaLiga": var fileLocation = "standingsLaLigaFlashcore.json";
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

    fs.writeFile(fileLocation, JSON.stringify(result), 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await browser.close();
})();