const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "https://www.flashscore.com/football/england/premier-league/standings/",
    spain: "https://www.flashscore.com/football/spain/laliga/standings/",
    france: "https://www.flashscore.com/football/france/ligue-1/standings/",
    italy: "https://www.flashscore.com/football/italy/serie-a/standings/",
    germany: "https://www.flashscore.com/football/germany/bundesliga/standings/",
};

const STANDINGS_URLS = {
    ENGLAND: URLS.england,
    SPAIN: URLS.spain,
    FRANCE: URLS.france,
    ITALY: URLS.italy,
    GERMANY: URLS.germany
};

async function getStandings(url) {
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
        JSON.standings = [];
        var numRow = 0;
        var dumpString;
        var dumpStringArray;
        const ROWS = document.querySelectorAll('.ui-table__row  ');
        ROWS.forEach(element => {
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
            numRow++;
            const TMP = {};
            element.querySelectorAll('.table__cell--value   ').innerText;
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
            TMP.team.name = TEAM_NAME[TMP.team.name] || TMP.team.name;
            TMP.team.color = TEAM_COLOR[TMP.team.name];
            TMP.playedGames = parseInt(element.querySelector('.table__cell--value').innerText);
            TMP.wins = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(4)').innerText);
            TMP.draws = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(5)').innerText);
            TMP.loses = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(6)').innerText);
            dumpString = element.querySelector('.table__cell--score').innerText;
            dumpStringArray = dumpString.split(':');
            TMP.goalsFor = parseInt(dumpStringArray[0]);
            TMP.goalsAgainst = parseInt(dumpStringArray[1]);
            TMP.goalDifference = parseInt(TMP.goalsFor) - parseInt(TMP.goalsAgainst);


            try {
                TMP.points = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.table__cell.table__cell--value.table__cell--points').innerText);
            } catch (error) {
                try {
                    TMP.points = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div:nth-child(9) > span').innerText);
                } catch (error) {
                    TMP.points = 0;
                }
            }


            var form = element.querySelectorAll('.tableCellFormIcon > button');
            var dump = 0;
            form.forEach(element => {
                dump++;
                if (dump == 2) {
                    TMP.form = element.innerText;                                
                } else if (dump > 2) {
                    TMP.form = TMP.form.concat(",", element.innerText);
                } else {
                    TMP.form = "-";
                }
            });
            JSON.standings.push(TMP);
        });
        return JSON;
    });
    var leagueName = RESULT.name;
    var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standings/standings" + leagueName.replace(" ", "") + RESULT.yearStart + "Flashcore.json");
    FS.writeFile(fileLocation, JSON.stringify(RESULT), 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await BROWSER.close();
}

getStandings(STANDINGS_URLS.ENGLAND);
getStandings(STANDINGS_URLS.SPAIN);
getStandings(STANDINGS_URLS.FRANCE);
getStandings(STANDINGS_URLS.ITALY);
getStandings(STANDINGS_URLS.GERMANY);