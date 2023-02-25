const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    spain_scorers_2015: "https://www.flashscore.com/football/spain/laliga-2015-2016/standings/#/IclHToOB/top_scorers",
    spain_scorers_2016: "https://www.flashscore.com/football/spain/laliga-2016-2017/standings/#/rH7SFawI/top_scorers",
    spain_scorers_2017: "https://www.flashscore.com/football/spain/laliga-2017-2018/standings/#/8COD1Gpp/top_scorers",
    spain_scorers_2018: "https://www.flashscore.com/football/spain/laliga-2018-2019/standings/#/IVm2O3QA/top_scorers",
    spain_scorers_2019: "https://www.flashscore.com/football/spain/laliga-2019-2020/standings/#/MNGIgau5/top_scorers",
    spain_scorers_2020: "https://www.flashscore.com/football/spain/laliga-2020-2021/standings/#/I58n6IRP/top_scorers",
    spain_scorers_2021: "https://www.flashscore.com/football/spain/laliga-2021-2022/standings/#/MPV5cuep/top_scorers",
    spain_scorers_2022: "https://www.flashscore.com/football/spain/laliga/standings/#/COQ6iu30/top_scorers",

    france_scorers_2015: "https://www.flashscore.com/football/france/ligue-1-2015-2016/standings/#/OIZw1WG1/top_scorers",
    france_scorers_2016: "https://www.flashscore.com/football/france/ligue-1-2016-2017/standings/#/pSvKVQK1/top_scorers",
    france_scorers_2017: "https://www.flashscore.com/football/france/ligue-1-2017-2018/standings/#/M5Lr4AbP/top_scorers",
    france_scorers_2018: "https://www.flashscore.com/football/france/ligue-1-2018-2019/standings/#/8h0R5CTo/top_scorers",
    france_scorers_2019: "https://www.flashscore.com/football/france/ligue-1-2019-2020/standings/#/2oEAASks/top_scorers",
    france_scorers_2020: "https://www.flashscore.com/football/france/ligue-1-2020-2021/standings/#/6upiPpqU/top_scorers",
    france_scorers_2021: "https://www.flashscore.com/football/france/ligue-1-2021-2022/standings/#/0W4LIGb1/top_scorers",
    france_scorers_2022: "https://www.flashscore.com/football/france/ligue-1/standings/#/zmkW5aIi/top_scorers",

    england_scorers_2015: "https://www.flashscore.com/football/england/premier-league-2015-2016/standings/#/faBBhyuM/top_scorers",
    england_scorers_2016: "https://www.flashscore.com/football/england/premier-league-2016-2017/standings/#/fZHsKRg9/top_scorers",
    england_scorers_2017: "https://www.flashscore.com/football/england/premier-league-2017-2018/standings/#/WOO1nDO2/top_scorers",
    england_scorers_2018: "https://www.flashscore.com/football/england/premier-league-2018-2019/standings/#/v1t6uXL7/top_scorers",
    england_scorers_2019: "https://www.flashscore.com/football/england/premier-league-2019-2020/standings/#/CxZEqxa7/top_scorers",
    england_scorers_2020: "https://www.flashscore.com/football/england/premier-league-2020-2021/standings/#/zTRyeuJg/top_scorers",
    england_scorers_2021: "https://www.flashscore.com/football/england/premier-league-2021-2022/standings/#/6kJqdMr2/top_scorers",
    england_scorers_2022: "https://www.flashscore.com/football/england/premier-league/standings/#/nunhS7Vn/top_scorers",

    germany_scorers_2015: "https://www.flashscore.com/football/germany/bundesliga-2015-2016/standings/#/zcgMPDzF/top_scorers",
    germany_scorers_2016: "https://www.flashscore.com/football/germany/bundesliga-2016-2017/standings/#/ljIBgFCg/top_scorers",
    germany_scorers_2017: "https://www.flashscore.com/football/germany/bundesliga-2017-2018/standings/#/U5NfqEkf/top_scorers",
    germany_scorers_2018: "https://www.flashscore.com/football/germany/bundesliga-2018-2019/standings/#/8Qib5JJC/top_scorers",
    germany_scorers_2019: "https://www.flashscore.com/football/germany/bundesliga-2019-2020/standings/#/dAfCUJq0/top_scorers",
    germany_scorers_2020: "https://www.flashscore.com/football/germany/bundesliga-2020-2021/standings/#/bk1Zgnfk/top_scorers",
    germany_scorers_2021: "https://www.flashscore.com/football/germany/bundesliga-2021-2022/standings/#/jFKYts6j/top_scorers",
    germany_scorers_2022: "https://www.flashscore.com/football/germany/bundesliga/standings/#/OIbxfZZI/top_scorers",

    italy_scorers_2015: "https://www.flashscore.com/football/italy/serie-a-2015-2016/standings/#/tU4tmZrf/top_scorers",
    italy_scorers_2016: "https://www.flashscore.com/football/italy/serie-a-2016-2017/standings/#/vcYBi9B8/top_scorers",
    italy_scorers_2017: "https://www.flashscore.com/football/italy/serie-a-2017-2018/standings/#/zZpeJHDG/top_scorers",
    italy_scorers_2018: "https://www.flashscore.com/football/italy/serie-a-2018-2019/standings/#/Gfk7JcX4/top_scorers",
    italy_scorers_2019: "https://www.flashscore.com/football/italy/serie-a-2019-2020/standings/#/pImv7QRb/top_scorers",
    italy_scorers_2020: "https://www.flashscore.com/football/italy/serie-a-2020-2021/standings/#/hKAgCv6t/top_scorers",
    italy_scorers_2021: "https://www.flashscore.com/football/italy/serie-a-2021-2022/standings/#/YHxmuFsJ/top_scorers",
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
            TMP.player = {};
            TMP.team = {};
            TMP.player.id = dumpStringArray[3];
            dumpStringArraySecondary = dumpStringArray[2].split('-');
            var lastName = dumpStringArraySecondary[0];
            var firstName = dumpStringArraySecondary[1];
            if (firstName == undefined) {
                TMP.player.name = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
            } else if (lastName == undefined) {
                TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
            } else {
                TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
            }
            TMP.player.nationality = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a > span').getAttribute('title');
            dumpString = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            dumpStringArraySecondary = dumpStringArray[2].split('-');
            var teamName = dumpStringArraySecondary[0];
            TMP.team.id = dumpStringArray[3];
            if (teamName == undefined) {
                TMP.team.name = "-";
            }
            TMP.team.name = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > a').innerText;
            TMP.team.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/logos/"+TMP.team.id+"_logo.png";
            TMP.team.kit = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/kits/"+TMP.team.id+"_kit.png";
            
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