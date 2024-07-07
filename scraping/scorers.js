// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define URLs object.
const URLs = {
    spain: "https://www.flashscore.com/football/spain/laliga/standings/#/SbZJTabs/top_scorers",
};

// Define the properties of scorersURLs.
const scorersURLs = {
    SPAIN: URLs.spain,
};

// Create the base object.
const footballRAPIObject = {
    "name": "FootballR API",
    "description": "Advanced API designed to provide accurate, real-time data on the world of football.",
    "repoUrl": "https://github.com/mzafram2001/footballr-api",
    "version": "v07072024",
    "updated": "07.07.2024",
    "message": "Created with love by Miguel Zafra.",
    "competitions": []
};

// Define the properties of teamsData.
const teamsData = {
    "Atl. Madrid": { short: "ATM", name: "Atlético Madrid", color: "#CE3524" },
    "Betis": { short: "BET", name: "Real Betis", color: "#00954C" },
    "Granada CF": { short: "GRA", name: "Granada", color: "#C31632" },
    "Ath Bilbao": { short: "ATH", name: "Athletic Bilbao", color: "#EE2523" },
    "Cadiz CF": { short: "CAD", name: "Cádiz", color: "#F2A40C" },
    "Almeria": { short: "ALM", name: "Almería", color: "#EE1119" },
    "Real Madrid": { short: "RMA", name: "Real Madrid", color: "#E2E2E2" },
    "Girona": { short: "GIR", name: "Girona", color: "#CD2534" },
    "Barcelona": { short: "BAR", name: "Barcelona", color: "#A50044" },
    "Real Sociedad": { short: "RSO", name: "Real Sociedad", color: "#143C8B" },
    "Valencia": { short: "VAL", name: "Valencia", color: "#EE3524" },
    "Villarreal": { short: "VIL", name: "Villarreal", color: "#FFE667" },
    "Getafe": { short: "GET", name: "Getafe", color: "#005999" },
    "Alaves": { short: "ALA", name: "Alavés", color: "#009AD7" },
    "Sevilla": { short: "SEV", name: "Sevilla", color: "#F43333" },
    "Osasuna": { short: "OSA", name: "Osasuna", color: "#D91A21" },
    "Las Palmas": { short: "LPA", name: "Las Palmas", color: "#FFE400" },
    "Celta Vigo": { short: "CEL", name: "Celta Vigo", color: "#8AC3EE" },
    "Rayo Vallecano": { short: "RAY", name: "Rayo Vallecano", color: "#E53027" },
    "Mallorca": { short: "MLL", name: "Mallorca", color: "#E20613" },
};

// Main function.
async function getScorers(url, teamsData, footballRAPIObject) {
    // Launch the Puppeteer browser in headless mode.
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    
    // Open a new page.
    const page = await browser.newPage();

    // Navigate to the specified URL and wait until the network is idle.
    await page.goto(url, { waitUntil: "networkidle0" });

    // Evaluate the page to extract the necessary data.
    const result = await page.evaluate((teamsData) => {
        const json = {};
        const leagues = {
            "LaLiga": { id: "LAL", area: "ESP" },
        };

        let leagueName;
        const heading = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading');
        leagueName = heading.querySelector('div.heading__title > div.heading__name').innerText;
        json.id = leagues[leagueName].id;
        json.name = leagueName;
        json.area = leagues[leagueName].area;

        const headingInfo = heading.querySelector('div.heading__info').innerText;
        json.yearStart = parseInt(headingInfo.substring(0, 4));
        json.yearEnd = parseInt(headingInfo.substring(5, json.yearStart - 1));


        /////// CONTINUAR AQUI
        json.scorers = [];
        let numRow = 0;
        let dumpString;
        let dumpStringArray;
        let dumpStringArraySecondary;
        let lastName;
        let middleName;
        let firstName;
        const ROWS = document.querySelectorAll('.ui-table__body > .ui-table__row');
        if (ROWS.length >= 10) {
            for (let i = 0; i < 10; i++) {
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
                let nationality = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a > span').getAttribute('title');
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
                let teamName = dumpStringArraySecondary[0];
                TMP.team.id = dumpStringArray[3];
                if (teamName == undefined) {
                    TMP.team.name = "-";
                }
                TMP.team.name = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > a').innerText;
                const TEAM_NAME = {
                    "AC Milan": "Milan",
                    "AS Roma": "Roma",
                    "RB Leipzig": "Leipzig",
                    "B. Monchengladbach": "Monchengladbach",
                    "FC Koln": "Koln",
                    "Atl. Madrid": "Atletico Madrid",
                    "Betis": "Real Betis",
                    "Granada CF": "Granada",
                    "Ath Bilbao": "Athletic Bilbao",
                    "Cadiz CF": "Cadiz",
                    "Almeria": "Almeria",
                    "PSG": "Paris Saint-Germain",
                    "Manchester Utd": "Manchester United",
                    "Sheffield Utd": "Sheffield United",
                };

                const TEAM_COLOR = {
                    "Inter": "#010E80",
                    "Milan": "#B52E2B",
                    "Juventus": "#000000",
                    "Bologna": "#9F1F33",
                    "Atalanta": "#2D5CAE",
                    "Roma": "#FBBA00",
                    "Lazio": "#85D8F8",
                    "Napoli": "#12A0D7",
                    "Fiorentina": "#502D7F",
                    "Torino": "#881F19",
                    "Monza": "#E4022E",
                    "Genoa": "#AE1919",
                    "Lecce": "#005B81",
                    "Verona": "#002F6C",
                    "Cagliari": "#B01028",
                    "Frosinone": "#004393",
                    "Empoli": "#4280C2",
                    "Udinese": "#7F7F7F",
                    "Sassuolo": "#0FA653",
                    "Salernitana": "#681A12",

                    "Bayer Leverkusen": "#E22726",
                    "Bayern Munich": "#DC052D",
                    "Stuttgart": "#D40723",
                    "Leipzig": "#DD0741",
                    "Dortmund": "#FDE100",
                    "Eintracht Frankfurt": "#E00914",
                    "Freiburg": "#5b5b5b",
                    "Hoffenheim": "#1961B5",
                    "Augsburg": "#BA3733",
                    "Heidenheim": "#003B79",
                    "Werder Bremen": "#009655",
                    "Wolfsburg": "#65B32E",
                    "Monchengladbach": "#000000",
                    "Bochum": "#005BA4",
                    "Union Berlin": "#EB1923",
                    "Mainz": "#C3141E",
                    "Koln": "#000000",
                    "Darmstadt": "#004C99",

                    "Real Madrid": "#E2E2E2",
                    "Girona": "#CD2534",
                    "Barcelona": "#A50044",
                    "Atletico Madrid": "#CE3524",
                    "Athletic Bilbao": "#EE2523",
                    "Real Sociedad": "#143C8B",
                    "Real Betis": "#00954C",
                    "Valencia": "#EE3524",
                    "Villarreal": "#FFE667",
                    "Getafe": "#005999",
                    "Alaves": "#009AD7",
                    "Sevilla": "#F43333",
                    "Osasuna": "#D91A21",
                    "Las Palmas": "#FFE400",
                    "Celta Vigo": "#8AC3EE",
                    "Rayo Vallecano": "#E53027",
                    "Mallorca": "#E20613",
                    "Cadiz": "#F2A40C",
                    "Granada": "#C31632",
                    "Almeria": "#EE1119",

                    "Paris Saint-Germain": "#004170",
                    "Monaco": "#E63031",
                    "Brest": "#ED1C24",
                    "Lille": "#24216A",
                    "Nice": "#B59A54",
                    "Lens": "#FFF200",
                    "Lyon": "#1112AA",
                    "Rennes": "#E13327",
                    "Marseille": "#2FAEE0",
                    "Montpellier": "#344575",
                    "Toulouse": "#3E2C56",
                    "Reims": "#EE2223",
                    "Strasbourg": "#009FE3",
                    "Nantes": "#FCD405",
                    "Le Havre": "#003259",
                    "Metz": "#6E0F12",
                    "Lorient": "#F58113",
                    "Clermont": "#C50C46",

                    "Arsenal": "#EF0107",
                    "Manchester City": "#6CABDD",
                    "Liverpool": "#C8102E",
                    "Aston Villa": "#95BFE5",
                    "Tottenham": "#132257",
                    "Newcastle": "#241F20",
                    "Chelsea": "#034694",
                    "Manchester United": "#DA291C",
                    "West Ham": "#7A263A",
                    "Bournemouth": "#DA291C",
                    "Brighton": "#0057B8",
                    "Wolves": "#FDB913",
                    "Fulham": "#000000",
                    "Crystal Palace": "#1B458F",
                    "Everton": "#003399",
                    "Brentford": "#D20000",
                    "Nottingham": "#DD0000",
                    "Luton": "#F78F1E",
                    "Burnley": "#6C1D45",
                    "Sheffield United": "#EE2737",
                };

                TMP.team.name = TEAM_NAME[TMP.team.name] || TMP.team.name;

                TMP.team.color = TEAM_COLOR[TMP.team.name];

                TMP.goals = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--goals.topScorers__cell').innerText);
                TMP.assists = parseInt(document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.topScorers__cell.topScorers__cell--gray.topScorers__cell').innerText);
                JSON.scorers.push(TMP);
            }
        } else if (ROWS.length < 10) {
            for (let i = 0; i < ROWS.length; i++) {
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
                let nationality = document.querySelector('#tournament-table-tabs-and-content > div.topScorers__tableWrapper > div > div.ui-table__body > div:nth-child(' + numRow + ') > div > a > span').getAttribute('title');
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
                let teamName = dumpStringArraySecondary[0];
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
                    case "PSG": TMP.team.name = "Paris Saint-Germain";
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

    // Push to the original object.
    footballRAPIObject.competitions.push(result);

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/${result.yearStart}/standings/standings${result.name}${result.yearStart}Flashscore.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, JSON.stringify(footballRAPIObject), 'utf8', (err) => {
        if (err) {
            console.log(`[${result.name}] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[${result.name}] - JSON file has been saved.`);
        }
    });

    // Close the browser.
    await browser.close();
}

// Fetch scorers for the specified URL and teams data.
getScorers(scorersURLs.SPAIN);