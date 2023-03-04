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
            TMP.area = {};
            switch (TMP.player.nationality) {
                case "England":
                    TMP.area.id = "ENG";
                    TMP.area.name = "England";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/j9N9ZNFA.svg";
                    break;
                case "Spain":
                    TMP.area.id = "ESP";
                    TMP.area.name = "Spain";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/bLyo6mco.svg";
                    break;
                case "Germany":
                    TMP.area.id = "GER";
                    TMP.area.name = "Germany";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/ptQide1O.svg";
                    break;
                case "Italy":
                    TMP.area.id = "ITA";
                    TMP.area.name = "Italy";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/hlKvieGH.svg";
                    break;
                case "France":
                    TMP.area.id = "FRA";
                    TMP.area.name = "France";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/QkGeVG1n.svg";
                    break;
                case "Argentina":
                    TMP.area.id = "ARG";
                    TMP.area.name = "Argentina";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/f9OppQjp.svg";
                    break;
                case "Uruguay":
                    TMP.area.id = "URU";
                    TMP.area.name = "Uruguay";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/xMk44orG.svg";
                    break;
                case "Portugal":
                    TMP.area.id = "POR";
                    TMP.area.name = "Portugal";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/WvJrjFVN.svg";
                    break;
                case "Wales":
                    TMP.area.id = "WAL";
                    TMP.area.name = "Wales";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/YcUP0Nqp.svg";
                    break;
                case "Croatia":
                    TMP.area.id = "CRO";
                    TMP.area.name = "Croatia";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/K8aznggo.svg";
                    break;
                case "Morocco":
                    TMP.area.id = "MOR";
                    TMP.area.name = "Morocco";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/IDKYO3R8.svg";
                    break;
                case "Sweden":
                    TMP.area.id = "SWE";
                    TMP.area.name = "Sweden";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/OQyqbHWB.svg";
                    break;
                case "Brazil":
                    TMP.area.id = "BRA";
                    TMP.area.name = "Brazil";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/I9l9aqLq.svg";
                    break;
                case "Turkey":
                    TMP.area.id = "TUR";
                    TMP.area.name = "Turkey";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/QeijuHo5.svg";
                    break;
                case "Netherlands":
                    TMP.area.id = "NTH";
                    TMP.area.name = "Netherlands";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/WYintcWb.svg";
                    break;
                case "Poland":
                    TMP.area.id = "POL";
                    TMP.area.name = "Poland";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/2HzmcynI.svg";
                    break;
                case "Kosovo":
                    TMP.area.id = "KOS";
                    TMP.area.name = "Kosovo";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/v1DTPQwI.svg";
                    break;
                case "Norway":
                    TMP.area.id = "NOR";
                    TMP.area.name = "Norway";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/8rP6JO0H.svg";
                    break;
                case "Canada":
                    TMP.area.id = "CAN";
                    TMP.area.name = "Canada";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/x4toKORL.svg";
                    break;
                case "Nigeria":
                    TMP.area.id = "NIG";
                    TMP.area.name = "Nigeria";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/EBE2Xb3l.svg";
                    break;
                case "Senegal":
                    TMP.area.id = "SEN";
                    TMP.area.name = "Senegal";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/hOIsJLJr.svg";
                    break;
                case "Switzerland":
                    TMP.area.id = "SWI";
                    TMP.area.name = "Switzerland";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/rHJ2vy1B.svg";
                    break;
                case "Senegal":
                    TMP.area.id = "SEN";
                    TMP.area.name = "Senegal";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/hOIsJLJr.svg";
                    break;
                case "Colombia":
                    TMP.area.id = "COL";
                    TMP.area.name = "Colombia";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/G02s4PCS.svg";
                    break;
                case "Benin":
                    TMP.area.id = "BEN";
                    TMP.area.name = "Benin";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/tKuIoRxU.svg";
                    break;
                case "Dominican Republic":
                    TMP.area.id = "DRE";
                    TMP.area.name = "Dominican Republic";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/nB5iYoh5.svg";
                    break;
                case "Cameroon":
                    TMP.area.id = "CAM";
                    TMP.area.name = "Cameroon";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/zk1uVG2D.svg";
                    break;
                case "Ivory Coast":
                    TMP.area.id = "IVC";
                    TMP.area.name = "Ivory Coast";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/SrdijyIE.svg";
                    break;
                case "Algeria":
                    TMP.area.id = "ALG";
                    TMP.area.name = "Algeria";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/nc87N1BR.svg";
                    break;
                case "Tunisia":
                    TMP.area.id = "TUN";
                    TMP.area.name = "Tunisia";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/QqZVYk95.svg";
                    break;
                case "Denmark":
                    TMP.area.id = "DEN";
                    TMP.area.name = "Denmark";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/0KUdxQVi.svg";
                    break;
                case "Gabon":
                    TMP.area.id = "GAB";
                    TMP.area.name = "Gabon";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/YJL8W78U.svg";
                    break;
                case "Guinea":
                    TMP.area.id = "GUI";
                    TMP.area.name = "Guinea";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/lGDZlkOb.svg";
                    break;
                case "Angola":
                    TMP.area.id = "ANG";
                    TMP.area.name = "Angola";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/rTRqsooo.svg";
                    break;
                case "Georgia":
                    TMP.area.id = "GEO";
                    TMP.area.name = "Georgia";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/YVovjspA.svg";
                    break;
                case "Guinea":
                    TMP.area.id = "GUI";
                    TMP.area.name = "Guinea";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/lGDZlkOb.svg";
                    break;
                case "Egypt":
                    TMP.area.id = "EGY";
                    TMP.area.name = "Egypt";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/bejDn7NN.svg";
                    break;
                case "Slovenia":
                    TMP.area.id = "SLN";
                    TMP.area.name = "Slovenia";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/tfMf3PoO.svg";
                    break;
                case "Belgium":
                    TMP.area.id = "BLG";
                    TMP.area.name = "Belgium";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/GbB957na.svg";
                    break;
                case "Bosnia and Herzegovina":
                    TMP.area.id = "BOH";
                    TMP.area.name = "Bosnia and Herzegovina";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/fqe7WYTr.svg";
                    break;
                case "Serbia":
                    TMP.area.id = "SER";
                    TMP.area.name = "Serbia";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/8Kl6iq0i.svg";
                    break;
                case "Austria":
                    TMP.area.id = "AST";
                    TMP.area.name = "Austria";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/naHiWdnt.svg";
                    break;
                case "Paraguay":
                    TMP.area.id = "PAR";
                    TMP.area.name = "Paraguay";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/YaNlqp6j.svg";
                    break;
                case "Chile":
                    TMP.area.id = "CHL";
                    TMP.area.name = "Chile";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/KUCG35cM.svg";
                    break;
                case "Mexico":
                    TMP.area.id = "MEX";
                    TMP.area.name = "Mexico";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/O6iHcNkd.svg";
                    break;
                case "South Korea":
                    TMP.area.id = "SOK";
                    TMP.area.name = "South Korea";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/K6Gs7P6G.svg";
                    break;
                case "Peru":
                    TMP.area.id = "PER";
                    TMP.area.name = "Peru";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/Uend67D3.svg";
                    break;
                case "Iceland":
                    TMP.area.id = "ICE";
                    TMP.area.name = "Iceland";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/6TsAIrGN.svg";
                    break;
                case "DR Congo":
                    TMP.area.id = "DRC";
                    TMP.area.name = "Democratic Republic Congo";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/phn9mm8H.svg";
                    break;
                case "Czech Republic":
                    TMP.area.id = "CZR";
                    TMP.area.name = "Czech Republic";
                    TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/6LHwBDGU.svg";
                    break;

                default:
                    TMP.area.id = "-";
                    TMP.area.name = "-";
                    TMP.area.flag = "-";
                    break;
            }
            dumpString = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            dumpStringArraySecondary = dumpStringArray[2].split('-');
            var teamName = dumpStringArraySecondary[0];
            TMP.team.id = dumpStringArray[3];
            if (teamName == undefined) {
                TMP.team.name = "-";
            }
            TMP.team.name = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > a').innerText;
            TMP.team.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.team.id + ".svg";

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


// MIRAR PORQUE HAY JUGADORES COMO FRENKIE DE JONG QUE TIENEN 2 APELLIDOS!!!!s