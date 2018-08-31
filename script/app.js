(function () {
    "use strict";

    function get(url){
        let promise = new Promise(function(ok, nok){
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url);
            xmlHttp.onload = () => {
                let json = JSON.parse(xmlHttp.responseText);
                ok(json);
            };
            xmlHttp.onerror = () => {
                nok("Something's wrong");
            };

            xmlHttp.send(null);
        });
        return promise;
    }
    window.http = {
        get: get
    };

})();

function Country(short, full, group){
    this.ShortName = short;
    this.FullName = full;
    this.Group = group;
}

(function(){
    document.addEventListener("DOMContentLoaded", init);
    function init(){
        var checkBox = document.getElementById("euCounties");
        checkBox.addEventListener( 'change', function() {
            if(this.checked) {
                getCountries(true);
            } else {
                getCountries(false);
            }
        });

        renderClickEvent();
    }

    function getCountries(EUcheck){
        http.get('https://worldcup.sfg.io/teams/').then(function(response){
            let coutries = [];
            var EuCountry = ["Belgium","Croatia","Denmark","England","France","Germany","Iceland", "Spain","Sweden","Switzerland","Portugal","Poland", "Russia","serbia"]
            console.log(response);
            for(let i = 0, l = response.length; i<l; i++){
                let c = new Country(
                    response[i].fifa_code,
                    response[i].country,
                    response[i].group_letter
                );
                if(EUcheck == true){
                    if(EuCountry.indexOf(c.FullName) > 0){
                        coutries.push(c);
                    }
                } else {
                    coutries.push(c);
                }
            }
            coutries.sort(function(a, b){
                var x = a.FullName.toLowerCase();
                var y = b.FullName.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
            });
            renderHtml(coutries);
        });
    }
  

    /* async function euToggle */
    async function renderHtml(EuCountry){
        let bobTheHTMLBuiler = ``;
        for(let i = 0, l = EuCountry.length; i<l; i++){

            bobTheHTMLBuiler += `
                <div class="hp-dropdown__option">
                    <img src="https://api.fifa.com/api/v1/picture/flags-fwc2018-5/${EuCountry[i].ShortName}" />
                    <span data-value="${EuCountry[i].ShortName}">${EuCountry[i].FullName}</span>
                </div>
            `;
        }
        document.querySelector("#listCountries").innerHTML = bobTheHTMLBuiler;
    }
/*async function all contries */
    async function renderHtml(coutries){
        let bobTheHTMLBuiler = ``;
        for(let i = 0, l = coutries.length; i<l; i++){

            bobTheHTMLBuiler += `
                <div class="hp-dropdown__option">
                    <img src="https://api.fifa.com/api/v1/picture/flags-fwc2018-5/${coutries[i].ShortName}" />
                    <span data-value="${coutries[i].ShortName}">${coutries[i].FullName}</span>
                </div>
            `;
        }
        document.querySelector("#listCountries").innerHTML = bobTheHTMLBuiler;
    }

})();

function Match(stadium, Date, THome, THomeL, TAway, TAwayL, HGoals, AGoals, HFull, AFull){
    this.Location = stadium;
    this.Date = Date;
    this.HomeTeam = THome;
    this.HomeTeamLogo = THomeL;
    this.AwayTeam = TAway;
    this.AwayTeamLogo = TAwayL;
    this.HomeGoals = HGoals;
    this.AwayGoals = AGoals;
    this.HomeTeamFull = HFull;
    this.AwayTeamFull = AFull;
}



function getDataByCountry(fifa_code){
    http.get('https://worldcup.sfg.io/matches/country?fifa_code='+fifa_code).then(function(response){
        let elements = [];
        console.log(response);
        for(let i = 0, l = response.length; i<l; i++){
            let c = new Match(
                response[i].location + ", " + response[i].venue ,
                new Date(response[i].datetime),
                response[i].home_team.country,
                response[i].home_team.code,
                response[i].away_team.country,
                response[i].away_team.code,
                response[i].home_team.goals,
                response[i].away_team.goals,
                response[i].home_team_statistics.starting_eleven,
                response[i].away_team_statistics.starting_eleven,
            );
            console.log(c);
            elements.push(c);
        }
        renderHtmlByCounty(elements);
    });
}

async function renderHtmlByCounty(elements){
    let bobTheHTMLBuiler = ``;
    for(let i = 0, l = elements.length; i<l; i++){

        if (elements[i].Date.getHours() < 10){
            var uren = "0" + elements[i].Date.getHours();
        } else {
            var uren = elements[i].Date.getHours();
        }

        if (elements[i].Date.getMinutes() < 10){
            var minuten = "0" + elements[i].Date.getMinutes();
        } else {
            var minuten = elements[i].Date.getMinutes();
        }

            var datum = elements[i].Date.getDate() + "/" + elements[i].Date.getMonth() + "/" +elements[i].Date.getFullYear() + " - " + uren + ":" + minuten;

        bobTheHTMLBuiler += `
        <div class="extra_info">
            <span class="date">${datum}</span>
            <span class="location">${elements[i].Location}</span>
        </div>
        <div class="card_match">
            <div class="card_match_collapsible">
                <div class="card_match_home">
                    <img class="card_match_flag home" src="https://api.fifa.com/api/v1/picture/flags-fwc2018-5/${elements[i].HomeTeamLogo}">
                    <span>${elements[i].HomeTeam}</span>
                </div>
                <div class="card_match_game center">
                    <span class="score">${elements[i].HomeGoals} - ${elements[i].AwayGoals}</span>
                </div>
                <div class="card_match_away">
                    <img class="card_match_flag away"  src="https://api.fifa.com/api/v1/picture/flags-fwc2018-5/${elements[i].AwayTeamLogo}">
                    <span class="away">${elements[i].AwayTeam}</span>
                </div>
            </div>
            <div class="card_match_content">
                <div class="card_match_Phome home">`;


            for(let p = 0, l = elements[i].HomeTeamFull.length; p<l; p++){
                if (elements[i].HomeTeamFull[p]["captain"] == true){
                    bobTheHTMLBuiler += `
                        <div><span class="playername">${elements[i].HomeTeamFull[p]["name"]}</span> <span class="captainL">C</span></div>`;
                } else {
                    bobTheHTMLBuiler += `
                        <span class="playername">${elements[i].HomeTeamFull[p]["name"]}</span>`;
                }
            }


            bobTheHTMLBuiler += `
                </div>

                <div class="card_match_Paway away">`;


            for(let p = 0, l = elements[i].AwayTeamFull.length; p<l; p++){
                if (elements[i].AwayTeamFull[p]["captain"] == true){
                    bobTheHTMLBuiler += `
                        <div><span class="captainR">C</span> <span class="playernameA">${elements[i].AwayTeamFull[p]["name"]}</span></div>`;
                } else {
                    bobTheHTMLBuiler += `
                        <span class="playernameA">${elements[i].AwayTeamFull[p]["name"]}</span>`;
                }
            }


            bobTheHTMLBuiler += `
                </div>
            </div>
        </div>
            `;
    }
    document.querySelector(".main").innerHTML = bobTheHTMLBuiler;
    renderClickEvent();
}

function renderClickEvent() {
    var coll = document.getElementsByClassName("card_match");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            // var content = this.nextElementSibling;
            var content = this.querySelector(".card_match_content");
            console.log(content);
            if (content.style.display === "flex") {
                content.style.display = "none";
            } else {
                content.style.display = "flex";
            }
        });
    }
}
