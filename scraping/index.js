const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

// TODO: 
// - Organizar código

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    england_2015: "https://www.flashscore.com/football/england/premier-league-2015-2016/standings/",
    england_2016: "https://www.flashscore.com/football/england/premier-league-2016-2017/standings/",
    england_2017: "https://www.flashscore.com/football/england/premier-league-2017-2018/standings/",
    england_2018: "https://www.flashscore.com/football/england/premier-league-2018-2019/standings/",
    england_2019: "https://www.flashscore.com/football/england/premier-league-2019-2020/standings/",
    england_2020: "https://www.flashscore.com/football/england/premier-league-2020-2021/standings/",
    england_2021: "https://www.flashscore.com/football/england/premier-league-2021-2022/standings/",
    england_2022: "https://www.flashscore.com/football/england/premier-league/standings/",

    spain_2015: "https://www.flashscore.com/football/spain/laliga-2015-2016/standings",
    spain_2016: "https://www.flashscore.com/football/spain/laliga-2016-2017/standings",
    spain_2017: "https://www.flashscore.com/football/spain/laliga-2017-2018/standings",
    spain_2018: "https://www.flashscore.com/football/spain/laliga-2018-2019/standings",
    spain_2019: "https://www.flashscore.com/football/spain/laliga-2019-2020/standings",
    spain_2020: "https://www.flashscore.com/football/spain/laliga-2020-2021/standings",
    spain_2021: "https://www.flashscore.com/football/spain/laliga-2021-2022/standings",
    spain_2022: "https://www.flashscore.com/football/spain/laliga/standings/",

    france_2015: "https://www.flashscore.com/football/france/ligue-1-2015-2016/standings",
    france_2016: "https://www.flashscore.com/football/france/ligue-1-2016-2017/standings",
    france_2017: "https://www.flashscore.com/football/france/ligue-1-2017-2018/standings",
    france_2018: "https://www.flashscore.com/football/france/ligue-1-2018-2019/standings",
    france_2019: "https://www.flashscore.com/football/france/ligue-1-2019-2020/standings",
    france_2020: "https://www.flashscore.com/football/france/ligue-1-2020-2021/standings",
    france_2021: "https://www.flashscore.com/football/france/ligue-1-2021-2022/standings",
    france_2022: "https://www.flashscore.com/football/france/ligue-1/standings/",

    italy_2015: "https://www.flashscore.com/football/italy/serie-a-2015-2016/standings",
    italy_2016: "https://www.flashscore.com/football/italy/serie-a-2016-2017/standings",
    italy_2017: "https://www.flashscore.com/football/italy/serie-a-2017-2018/standings",
    italy_2018: "https://www.flashscore.com/football/italy/serie-a-2018-2019/standings",
    italy_2019: "https://www.flashscore.com/football/italy/serie-a-2019-2020/standings",
    italy_2020: "https://www.flashscore.com/football/italy/serie-a-2020-2021/standings",
    italy_2021: "https://www.flashscore.com/football/italy/serie-a-2021-2022/standings",
    italy_2022: "https://www.flashscore.com/football/italy/serie-a/standings/",

    germany_2015: "https://www.flashscore.com/football/germany/bundesliga-2015-2016/standings",
    germany_2016: "https://www.flashscore.com/football/germany/bundesliga-2016-2017/standings",
    germany_2017: "https://www.flashscore.com/football/germany/bundesliga-2017-2018/standings",
    germany_2018: "https://www.flashscore.com/football/germany/bundesliga-2018-2019/standings",
    germany_2019: "https://www.flashscore.com/football/germany/bundesliga-2019-2020/standings",
    germany_2020: "https://www.flashscore.com/football/germany/bundesliga-2020-2021/standings",
    germany_2021: "https://www.flashscore.com/football/germany/bundesliga-2021-2022/standings",
    germany: "https://www.flashscore.com/football/germany/bundesliga/standings/"
};

// // // // // // // // // // CODE // // // // // // // // // //
async function getStandings(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(```${url}```, { waitUntil: "domcontentloaded" });
    await PAGE.waitForSelector('.ui-table__body', { visible: true });
    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        JSON.name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
        switch (JSON.name) {
            case "LaLiga": JSON.area = "ESP";
                break;
            case "Bundesliga": JSON.area = "GER";
                break;
            case "Serie A": JSON.area = "ITA";
                break;
            case "Ligue 1": JSON.area = "FRA";
                break;
            case "Premier League": JSON.area = "ENG";
                break;
        }
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
            TMP.team.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/logos/" + TMP.team.id + "_logo.png";
            TMP.team.kit = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/kits/" + TMP.team.id + "_kit.png";
            TMP.playedGames = parseInt(element.querySelector('.table__cell--value').innerText);
            TMP.wins = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(4)').innerText);
            TMP.draws = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(5)').innerText);
            TMP.loses = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(6)').innerText);
            if(parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 3)) >= 100) {
                TMP.goalsFor = parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 3));
                TMP.goalsAgainst = parseInt(element.querySelector('.table__cell--score').innerText.substring(4, 6));
            } else {
                TMP.goalsFor = parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 2));
                TMP.goalsAgainst = parseInt(element.querySelector('.table__cell--score').innerText.substring(3, 5));
            }
            TMP.goalDifference = parseInt(TMP.goalsFor) - parseInt(TMP.goalsAgainst);
            TMP.points = parseInt(element.querySelector('.table__cell--points').innerText);
            for (var i = 1; i < 6; i++) {
                if (i == 1) {
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
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsPremierLeague" + RESULT.yearStart + "Flashcore.json");
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
getStandings(URLS.england);
getStandings(URLS.italy);
getStandings(URLS.france);
getStandings(URLS.germany);

/*getStandings(URLS.italy_2015);
getStandings(URLS.italy_2016);
getStandings(URLS.italy_2017);
getStandings(URLS.italy_2018);
getStandings(URLS.italy_2019);
getStandings(URLS.italy_2020);
getStandings(URLS.italy_2021);*/
