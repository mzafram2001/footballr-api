const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "https://www.flashscore.com/football/england/premier-league/standings/#/I3O5jpB2/top_scorers",
    spain: "https://www.flashscore.com/football/spain/laliga/standings/#/SbZJTabs/top_scorers",
    france: "https://www.flashscore.com/football/france/ligue-1/standings/#/Q1sSPOn5/top_scorers",
    italy: "https://www.flashscore.com/football/italy/serie-a/standings/#/GK3TOCxh/top_scorers",
    germany: "https://www.flashscore.com/football/germany/bundesliga/standings/#/OWq2ju22/top_scorers",
}

const SCORERS_URLS = {
    ENGLAND: URLS.england,
    SPAIN: URLS.spain,
    FRANCE: URLS.france,
    ITALY: URLS.italy,
    GERMANY: URLS.germany
};

async function getScorers(url) {
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
        const HEADING = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading');
        JSON.name = HEADING.querySelector('div.heading__title > div.heading__name').innerText;
        JSON.area = LEAGUES[JSON.name];
        const HEADING_INFO = HEADING.querySelector('div.heading__info').innerText;
        JSON.yearStart = parseInt(HEADING_INFO.substring(0, 4));
        JSON.yearEnd = parseInt(HEADING_INFO.substring(5, JSON.yearStart - 1));
        JSON.scorers = [];
        var numRow = 0;
        var dumpString;
        var dumpStringArray;
        var dumpStringArraySecondary;
        var lastName;
        var middleName;
        var firstName;
        const ROWS = document.querySelectorAll('.ui-table__body > .ui-table__row');
        if (ROWS.length >= 10) {
            for (var i = 0; i < 10; i++) {
                const TMP = {};
                lastName = undefined;
                middleName = undefined;
                firstName = undefined;
                numRow++;
                TMP.position = numRow;
                dumpString = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a').getAttribute('href');
                dumpStringArray = dumpString.split('/');
                TMP.player = {};
                TMP.team = {};
                TMP.player.id = dumpStringArray[3];
                dumpStringArraySecondary = dumpStringArray[2].split('-');
                if (dumpStringArraySecondary.length == 2) {
                    lastName = dumpStringArraySecondary[0];
                    firstName = dumpStringArraySecondary[1];
                } else if (dumpStringArraySecondary.length == 3) {
                    lastName = dumpStringArraySecondary[1];
                    middleName = dumpStringArraySecondary[0];
                    firstName = dumpStringArraySecondary[2];
                } else {
                    firstName = dumpStringArraySecondary[0];
                }
                if (firstName == undefined) {
                    TMP.player.name = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                } else if (lastName == undefined) {
                    TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                } else if (middleName == undefined) {
                    TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                } else {
                    TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(middleName).charAt(0).toUpperCase() + String(middleName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                }
                var nationality = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a > span').getAttribute('title');
                TMP.area = {};
                switch (nationality) {
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
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/G2FRjBgn.svg";
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
                    case "Japan":
                        TMP.area.id = "JPN";
                        TMP.area.name = "Japan";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/ULXPdOUj.svg";
                        break;
                    case "Ukraine":
                        TMP.area.id = "UKR";
                        TMP.area.name = "Ukraine";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/j1JtDMwo.svg";
                        break;
                    case "Jordan":
                        TMP.area.id = "JOR";
                        TMP.area.name = "Jordan";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/vNcmJoU2.svg";
                        break;
                    case "Ecuador":
                        TMP.area.id = "ECU";
                        TMP.area.name = "Ecuador";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/8tbm8Tri.svg";
                        break;
                    case "Ireland":
                        TMP.area.id = "IRE";
                        TMP.area.name = "Ireland";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/Gfyqk1aG.svg";
                        break;
                    case "Malta":
                        TMP.area.id = "MTA";
                        TMP.area.name = "Malta";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/YHpMYsVG.svg";
                        break;
                    case "USA":
                        TMP.area.id = "USA";
                        TMP.area.name = "United States of America";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/fuitL4CF.svg";
                        break;
                    case "Ghana":
                        TMP.area.id = "GHA";
                        TMP.area.name = "Ghana";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/nNBjHale.svg";
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
                switch (TMP.team.name) {
                    case "Napoli": TMP.team.name = "Calcio Napoli";
                        break;
                    case "Inter": TMP.team.name = "Inter Milan";
                        break;
                    case "AC Milan": TMP.team.name = "Calcio Milan";
                        break;
                    case "AS Roma": TMP.team.name = "Roma";
                        break;
                    case "Atalanta": TMP.team.name = "Calcio Atalanta";
                        break;
                    case "Udinese": TMP.team.name = "Calcio Udinese";
                        break;
                    case "Fiorentina": TMP.team.name = "Calcio Fiorentina";
                        break;
                    case "Sassuolo": TMP.team.name = "Calcio Sassuolo";
                        break;
                    case "Monza": TMP.team.name = "Calcio Monza";
                        break;
                    case "Spezia": TMP.team.name = "Calcio Spezia";
                        break;
                    case "Verona": TMP.team.name = "Hellas Verona";
                        break;
                    case "Sampdoria": TMP.team.name = "Calcio Cagliari";
                        break;
                    case "Cagliari": TMP.team.name = "Calcio Cagliari";
                        break;
                    case "Benevento": TMP.team.name = "Calcio Benevento";
                        break;
                    case "Parma": TMP.team.name = "Calcio Parma";
                        break;
                    case "Dortmund": TMP.team.name = "Borussia Dortmund";
                        break;
                    case "RB Leipzig": TMP.team.name = "RasenBallsport Leipzig";
                        break;
                    case "B. Monchengladbach": TMP.team.name = "Borussia Mönchengladbach";
                        break;
                    case "FC Koln": TMP.team.name = "Köln";
                        break;
                    case "Greuther Furth": TMP.team.name = "Greuther Fürth";
                        break;
                    case "Atl. Madrid": TMP.team.name = "Atlético Madrid";
                        break;
                    case "Betis": TMP.team.name = "Real Betis";
                        break;
                    case "Granada CF": TMP.team.name = "Granada";
                        break;
                    case "Ath Bilbao": TMP.team.name = "Athletic Bilbao";
                        break;
                    case "Cadiz CF": TMP.team.name = "Cádiz";
                        break;
                    case "Alaves": TMP.team.name = "Deportivo Alavés";
                        break;
                    case "Almeria": TMP.team.name = "Almería";
                        break;
                    case "Paris SG": TMP.team.name = "Paris Saint-Germain";
                        break;
                    case "Marseille": TMP.team.name = "Olympique Marseille";
                        break;
                    case "Lens": TMP.team.name = "Racing Lens";
                        break;
                    case "Rennes": TMP.team.name = "Stade Rennais";
                        break;
                    case "Lille": TMP.team.name = "Olympique Lille";
                        break;
                    case "Nice": TMP.team.name = "Olympique Nice";
                        break;
                    case "Reims": TMP.team.name = "Stade Reims";
                        break;
                    case "Lyon": TMP.team.name = "Olympique Lyonnais";
                        break;
                    case "Strasbourg": TMP.team.name = "Racing Strasbourg";
                        break;
                    case "Brest": TMP.team.name = "Stade Brestois";
                        break;
                    case "AC Ajaccio": TMP.team.name = "Athletic Ajaccien";
                        break;
                    case "Angers": TMP.team.name = "Sporting Angers";
                        break;
                    case "St Etienne": TMP.team.name = "Saint-Étienne Loire";
                        break;
                    case "Bordeaux": TMP.team.name = "Girondins Bordeaux";
                        break;
                    case "Nimes": TMP.team.name = "Olympique Nîmes";
                        break;
                    case "Manchester Utd": TMP.team.name = "Manchester United";
                        break;
                    case "Tottenham": TMP.team.name = "Tottenham Hotspur";
                        break;
                    case "Newcastle": TMP.team.name = "Newcastle United";
                        break;
                    case "Wolves": TMP.team.name = "Wolverhampton Wanderers";
                        break;
                    case "Leeds": TMP.team.name = "Leeds United";
                        break;
                    case "Nottingham": TMP.team.name = "Nottingham Forest";
                        break;
                    case "Leicester": TMP.team.name = "Leicester City";
                        break;
                    case "West Ham": TMP.team.name = "West Ham United";
                        break;
                    case "Bournemouth": TMP.team.name = "Athletic Bournemouth";
                        break;
                    case "West Brom": TMP.team.name = "West Bromwich";
                        break;
                    case "Sheffield Utd": TMP.team.name = "Sheffield United";
                        break;
                    case "Norwich": TMP.team.name = "Norwich City";
                        break;
                }


                TMP.team.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.team.id + ".svg";

                TMP.goals = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--goals.topScorers__cell').innerText);
                TMP.assists = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--gray.topScorers__cell').innerText);
                JSON.scorers.push(TMP);
            }
        } else if (ROWS.length < 10) {
            for (var i = 0; i < ROWS.length; i++) {
                const TMP = {};
                lastName = undefined;
                middleName = undefined;
                firstName = undefined;
                numRow++;
                TMP.position = numRow;
                dumpString = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a').getAttribute('href');
                dumpStringArray = dumpString.split('/');
                TMP.player = {};
                TMP.team = {};
                TMP.player.id = dumpStringArray[3];
                dumpStringArraySecondary = dumpStringArray[2].split('-');
                if (dumpStringArraySecondary.length == 2) {
                    lastName = dumpStringArraySecondary[0];
                    firstName = dumpStringArraySecondary[1];
                } else if (dumpStringArraySecondary.length == 3) {
                    lastName = dumpStringArraySecondary[1];
                    middleName = dumpStringArraySecondary[0];
                    firstName = dumpStringArraySecondary[2];
                } else {
                    firstName = dumpStringArraySecondary[0];
                }
                if (firstName == undefined) {
                    TMP.player.name = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                } else if (lastName == undefined) {
                    TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                } else if (middleName == undefined) {
                    TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                } else {
                    TMP.player.name = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(middleName).charAt(0).toUpperCase() + String(middleName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                }
                var nationality = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a > span').getAttribute('title');
                TMP.area = {};
                switch (nationality) {
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
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/G2FRjBgn.svg";
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
                    case "Japan":
                        TMP.area.id = "JPN";
                        TMP.area.name = "Japan";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/ULXPdOUj.svg";
                        break;
                    case "Ukraine":
                        TMP.area.id = "UKR";
                        TMP.area.name = "Ukraine";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/j1JtDMwo.svg";
                        break;
                    case "Jordan":
                        TMP.area.id = "JOR";
                        TMP.area.name = "Jordan";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/vNcmJoU2.svg";
                        break;
                    case "Ecuador":
                        TMP.area.id = "ECU";
                        TMP.area.name = "Ecuador";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/8tbm8Tri.svg";
                        break;
                    case "Ireland":
                        TMP.area.id = "IRE";
                        TMP.area.name = "Ireland";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/Gfyqk1aG.svg";
                        break;
                    case "Malta":
                        TMP.area.id = "MTA";
                        TMP.area.name = "Malta";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/YHpMYsVG.svg";
                        break;
                    case "USA":
                        TMP.area.id = "USA";
                        TMP.area.name = "United States of America";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/fuitL4CF.svg";
                        break;
                    case "Ghana":
                        TMP.area.id = "GHA";
                        TMP.area.name = "Ghana";
                        TMP.area.flag = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/flags/nNBjHale.svg";
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
                switch (TMP.team.name) {
                    case "Napoli": TMP.team.name = "Calcio Napoli";
                        break;
                    case "Inter": TMP.team.name = "Inter Milan";
                        break;
                    case "AC Milan": TMP.team.name = "Calcio Milan";
                        break;
                    case "AS Roma": TMP.team.name = "Roma";
                        break;
                    case "Atalanta": TMP.team.name = "Calcio Atalanta";
                        break;
                    case "Udinese": TMP.team.name = "Calcio Udinese";
                        break;
                    case "Fiorentina": TMP.team.name = "Calcio Fiorentina";
                        break;
                    case "Sassuolo": TMP.team.name = "Calcio Sassuolo";
                        break;
                    case "Monza": TMP.team.name = "Calcio Monza";
                        break;
                    case "Spezia": TMP.team.name = "Calcio Spezia";
                        break;
                    case "Verona": TMP.team.name = "Hellas Verona";
                        break;
                    case "Sampdoria": TMP.team.name = "Calcio Cagliari";
                        break;
                    case "Cagliari": TMP.team.name = "Calcio Cagliari";
                        break;
                    case "Benevento": TMP.team.name = "Calcio Benevento";
                        break;
                    case "Parma": TMP.team.name = "Calcio Parma";
                        break;
                    case "Dortmund": TMP.team.name = "Borussia Dortmund";
                        break;
                    case "RB Leipzig": TMP.team.name = "RasenBallsport Leipzig";
                        break;
                    case "B. Monchengladbach": TMP.team.name = "Borussia Mönchengladbach";
                        break;
                    case "FC Koln": TMP.team.name = "Köln";
                        break;
                    case "Greuther Furth": TMP.team.name = "Greuther Fürth";
                        break;
                    case "Atl. Madrid": TMP.team.name = "Atlético Madrid";
                        break;
                    case "Betis": TMP.team.name = "Real Betis";
                        break;
                    case "Granada CF": TMP.team.name = "Granada";
                        break;
                    case "Ath Bilbao": TMP.team.name = "Athletic Bilbao";
                        break;
                    case "Cadiz CF": TMP.team.name = "Cádiz";
                        break;
                    case "Alaves": TMP.team.name = "Deportivo Alavés";
                        break;
                    case "Almeria": TMP.team.name = "Almería";
                        break;
                    case "Paris SG": TMP.team.name = "Paris Saint-Germain";
                        break;
                    case "Marseille": TMP.team.name = "Olympique Marseille";
                        break;
                    case "Lens": TMP.team.name = "Racing Lens";
                        break;
                    case "Rennes": TMP.team.name = "Stade Rennais";
                        break;
                    case "Lille": TMP.team.name = "Olympique Lille";
                        break;
                    case "Nice": TMP.team.name = "Olympique Nice";
                        break;
                    case "Reims": TMP.team.name = "Stade Reims";
                        break;
                    case "Lyon": TMP.team.name = "Olympique Lyonnais";
                        break;
                    case "Strasbourg": TMP.team.name = "Racing Strasbourg";
                        break;
                    case "Brest": TMP.team.name = "Stade Brestois";
                        break;
                    case "AC Ajaccio": TMP.team.name = "Athletic Ajaccien";
                        break;
                    case "Angers": TMP.team.name = "Sporting Angers";
                        break;
                    case "St Etienne": TMP.team.name = "Saint-Étienne Loire";
                        break;
                    case "Bordeaux": TMP.team.name = "Girondins Bordeaux";
                        break;
                    case "Nimes": TMP.team.name = "Olympique Nîmes";
                        break;
                    case "Manchester Utd": TMP.team.name = "Manchester United";
                        break;
                    case "Tottenham": TMP.team.name = "Tottenham Hotspur";
                        break;
                    case "Newcastle": TMP.team.name = "Newcastle United";
                        break;
                    case "Wolves": TMP.team.name = "Wolverhampton Wanderers";
                        break;
                    case "Leeds": TMP.team.name = "Leeds United";
                        break;
                    case "Nottingham": TMP.team.name = "Nottingham Forest";
                        break;
                    case "Leicester": TMP.team.name = "Leicester City";
                        break;
                    case "West Ham": TMP.team.name = "West Ham United";
                        break;
                    case "Bournemouth": TMP.team.name = "Athletic Bournemouth";
                        break;
                    case "West Brom": TMP.team.name = "West Bromwich";
                        break;
                    case "Sheffield Utd": TMP.team.name = "Sheffield United";
                        break;
                    case "Norwich": TMP.team.name = "Norwich City";
                        break;
                }


                TMP.team.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.team.id + ".svg";

                TMP.goals = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--goals.topScorers__cell').innerText);
                TMP.assists = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--gray.topScorers__cell').innerText);
                JSON.scorers.push(TMP);
            }
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

getScorers(SCORERS_URLS.ENGLAND);
getScorers(SCORERS_URLS.SPAIN);
getScorers(SCORERS_URLS.FRANCE);
getScorers(SCORERS_URLS.ITALY);
getScorers(SCORERS_URLS.GERMANY);