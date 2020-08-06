const web = Handlebars.compile(
    document.querySelector('#webLinkTemplate').innerHTML
);

const pop = Handlebars.compile(
    document.querySelector('#popTemplate').innerHTML
);

const news = Handlebars.compile(
    document.querySelector('#newsTemplate').innerHTML
);

const suggestion = Handlebars.compile(
    document.querySelector('#suggestionTemplate').innerHTML
);


const dayTime = 7;
const nightTime = 19;
let activityTrack = ["morning", -1];

document.addEventListener("DOMContentLoaded", () => {
    // get local webs
    

    // get time
    const time = new Date();

    // get weather
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=15a9adb8e010731c682b06cf232df34c&units=metric')
        .then(response => response.json())
        .then(data => {
            let type = data.weather[0].main;
            if (type === "Thunderstorm") type = "Thunder";
            let temp = parseInt(data.main.temp);
            let icon, color;
            if (weatherList[type]) {
                icon = weatherList[type].icon;
                color = weatherList[type].color;
            } else {
                icon = "🏙";
                color = "#DFDFDF";
            }

            document.querySelector('#weatherTemp').innerHTML = temp;
            document.querySelector('#weatherIconA').innerHTML = icon;
            document.querySelector('#weatherType').innerHTML = type;
            document.querySelector('#weatherCard').style.backgroundColor = color;
        });

    // get local note
    if (localStorage['note']) {
        document.querySelector('#note').value = localStorage['note'];
    }

    // get activities
    let h = time.getHours();
    if (h >= 24 || h <= 4) {
        // night
        getActivity('night');
    } else if (h >= 5 && h <= dayTime) {
        // wakeup
        getActivity('wakeup');
    } else if (h <= 11) {
        // morning (random)
        getActivity('morning');
    } else if (h === 12) {
        // lunch
        getActivity('lunch');
    } else if (h <= 17) {
        // afternoon (random)
        getActivity('afternoon');
    } else if (h <= nightTime) {
        // dinner
        getActivity('dinner');
    } else if (h <= 23) {
        // evening (random)
        getActivity('evening');
    }

    // get emoCalendar
    if (!localStorage['emoCalendar']){
        localStorage['emoCalendar'] = "{}";
    }
    // setEmotion(time.getDate());
    initializeEmotion(time.getDate());
    

    // get tips
    getTrytips(activityTrack);
    getLocaltips();

    // get news
    const random = Math.floor(Math.random() * newsLinks.length);
    document.querySelector('#newsContainer').innerHTML = news({
        links: newsLinks[random].link,
        news: newsLinks[random].news
    })
    // get suggestion

    // add web links
    if (!localStorage["webLinks"]) {
        localStorage["webLinks"] = JSON.stringify(defaultWebLinks);
    }

    updateWebLinks();

    // add suggestion
    for (let s of suggestionLinks) {
        document.querySelector('#suggestColSec').innerHTML += suggestion({

            title: s.title,
            link: s.link,
            pic: s.pic,
        });
    }
    // set mode
    if (time.getHours() >= nightTime || time.getHours() <= dayTime) {
        setDarkMode();
    }

})

function saveLinks(){
    let webs = [];
    let colors = [];
    document.querySelectorAll('.pop-red').forEach(n => {
        colors.push(n.style.backgroundColor);
    });
    let names = [];
    let icons = [];
    document.querySelectorAll('.pop-name').forEach(n => {
        names.push(n.value);
        icons.push(n.value.charAt(0))
    });
    let links = [];
    document.querySelectorAll('.pop-link').forEach(n => {
        links.push(n.value);
    });


    for(let i = 0; i < names.length; i++){
        webs.push({name: names[i], link: links[i], icon: icons[i], bg: colors[i]});
    }

    localStorage["webLinks"] = JSON.stringify(webs);
    updateWebLinks();
    popHide();
}

function updateWebLinks(){
    let weblinks = JSON.parse(localStorage["webLinks"]);
    document.querySelector('#webContainer').innerHTML = "";
    for (let w of weblinks) {
        document.querySelector('#webContainer').innerHTML += web({
            name: w.name,
            link: w.link,
            icon: w.icon,
            bg: w.bg,
        });
    }
}


function popUp() {
    document.getElementById("popUp").style.visibility = "visible";
    console.log(1);
    // add edit section
    document.querySelector('#popContainer').innerHTML = "";
    for (let w of JSON.parse(localStorage["webLinks"])) {
        document.querySelector('#popContainer').innerHTML += pop({
            name: w.name,
            link: w.link,
            bg: w.bg,
        });
    }
    if (time.getHours() >= nightTime || time.getHours() <= dayTime) {
        setDarkMode();
    }
}

function popHide() {
    document.getElementById("popUp").style.visibility = "hidden";
}

function updateNote() {
    localStorage['note'] = document.querySelector('#note').value;
}


// function setEmotion(emo){
//     console.log(emo);
//     if(!localStorage['emoList']){
//         localStorage['emoList'] = "";
//     }
//     localStorage['emoList'] = emo + localStorage['emoList'];
//     if(localStorage['emoList'].length >= 50){
//         localStorage['emoList'] = localStorage['emoList'].substring(0, 50);
//     } 
//     console.log(localStorage['emoList']);
// }

function initializeEmotion(d){
    const t = new Date();
    const year = t.getFullYear();
    const month = t.getMonth() + 1;
    const date = t.getDate();
    const day = t.getDay();
    let emoCalendar = JSON.parse(localStorage['emoCalendar']);
    if (!emoCalendar){
        emoCalendar = {}
    }
    if (!emoCalendar[year]){
        emoCalendar[year] = {};
    }
    if (!emoCalendar[year][month]){
        emoCalendar[year][month] = {};
    }
    if (!emoCalendar[year][month][date]){
        emoCalendar[year][month][date] = {};
        setEmotion(date);
        document.querySelector('#emoBtn').value = "😄";
    } else {
        document.querySelector('#emoBtn').value = emoCalendar[year][month][date].emo;
    }
}

function setEmotion(emo){
    const t = new Date();
    const year = t.getFullYear();
    const month = t.getMonth() + 1;
    const date = t.getDate();
    const day = t.getDay();
    updateEmotion(year, month, date, day, emo);
}


function updateEmotion(year, month, date, day, emo){
    let emoCalendar = JSON.parse(localStorage['emoCalendar']);
    // if (!emoCalendar){
    //     emoCalendar = {}
    // }
    // if (!emoCalendar[year]){
    //     emoCalendar[year] = {};
    // }
    // if (!emoCalendar[year][month]){
    //     emoCalendar[year][month] = {};
    // }
    // if (!emoCalendar[year][month][date]){
    //     emoCalendar[year][month][date] = {};
    // }

    emoCalendar[year][month][date]['day'] = day;
    emoCalendar[year][month][date]['emo'] = emo;
    localStorage["emoCalendar"] = JSON.stringify(emoCalendar);
}


function getActivity(type) {
    if (type !== "morning" && type !== "afternoon" && type !== "evening"){
        document.querySelector('#activityTitle').textContent = activities[type].text;
        document.querySelector('#activityImage').src = activities[type].image;
        document.querySelector('.activity').style.backgroundColor = activities[type].color;
        activityTrack = [type, -1];
    } else {
        // random
        const rand = Math.floor(Math.random() * activities[type].length);
        document.querySelector('#activityTitle').textContent = activities[type][rand].text;
        document.querySelector('#activityImage').src = activities[type][rand].image;
        document.querySelector('.activity').style.backgroundColor = activities[type][rand].color;
        activityTrack = [type, rand];
    }
}


function getTrytips(type){
    if (type[1] === -1){
        const rand = Math.floor(Math.random() * tryTips[type[0]].choices.length);
        document.querySelector('.name').textContent = tryTips[type[0]].choices[rand].text;
        document.querySelector('.bottom-line').textContent = tryTips[type[0]].choices[rand].supplement;        
        document.querySelector('#foodImg').src = tryTips[type[0]].choices[rand].image;
    } else {
        let tryActivity = tryTips[type[0]][type[1]]
        const rand = Math.floor(Math.random() * tryActivity.choices.length);
        document.querySelector('#foodName').textContent = tryActivity.choices[rand].text;
        document.querySelector('.bottom-line').textContent = tryActivity.choices[rand].supplement;        
        document.querySelector('#foodImg').src = tryActivity.choices[rand].image;
    }
}




function getLocaltips(){
    const rand = Math.floor(Math.random() * localTips["doThis"].length);
    document.querySelector('#localTopline').textContent = localTips["doThis"][rand].textOne;
    document.querySelector('#localName').textContent = localTips["doThis"][rand].textTwo;        
    document.querySelector('#ActivityImg').src = localTips["doThis"][rand].image;
}



function setDarkMode() {
    document.querySelectorAll('.light').forEach(i => {
        i.classList.add('dark');
        i.classList.remove('light');
    });

    document.querySelectorAll('.light-accent').forEach(i => {
        i.classList.add('dark-accent');
        i.classList.remove('light-accent');
    });

    document.querySelectorAll('.light-accent-gradient').forEach(i => {
        i.classList.add('dark-accent-gradient');
        i.classList.remove('light-accent-gradient');
    });

    document.querySelectorAll('.light-text').forEach(i => {
        i.classList.add('dark-text');
        i.classList.remove('light-text');
    });

    document.querySelectorAll('.light-accent-text').forEach(i => {
        i.classList.add('dark-accent-text');
        i.classList.remove('light-accent-text');
    });

    document.querySelectorAll('.light-paper').forEach(i => {
        i.classList.add('dark-paper');
        i.classList.remove('light-paper');
    });

    document.querySelector('#weatherCard').style.filter = "brightness(85%)";

    document.querySelectorAll('.web-icon').forEach(i => {
        i.style.filter = "brightness(80%)";
    });
}



var defaultWebLinks = [
    {
        name: "Google",
        link: "https://www.google.com",
        icon: 'G',
        bg: "#FF5C5C",
    },
    {
        name: "Acorn",
        link: "https://acorn.utoronto.ca/",
        icon: 'A',
        bg: "#5A63DB",
    },
    {
        name: "Quercus",
        link: "https://q.utoronto.ca/",
        icon: 'Q',
        bg: "#FF5B81",
    },
    {
        name: "Outlook",
        link: "https://www.outlook.com",
        icon: 'O',
        bg: "#58B1FF",
    },
    {
        name: "Youtube",
        link: "https://www.youtube.com/",
        icon: 'Y',
        bg: "#FF2525",
    },
    {
        name: "Github",
        link: "https://github.com/",
        icon: 'G',
        bg: "#1C1C1C",
    },
]


var weatherList = {
    "Clear": {
        icon: "🌞",
        color: "#F2FFA1",
    },
    "Thunder": {
        icon: "⛈",
        color: "#D8BAFE",
    },
    "Drizzle": {
        icon: "☔",
        color: "#CCE0EE",
    },
    "Rain": {
        icon: "🌧",
        color: "#9BD1F5",
    },
    "Snow": {
        icon: "🌨",
        color: "#FFFFFF",
    },
    "Clouds": {
        icon: "☁",
        color: "#DADADA",
    },
    "Fog": {
        icon: "🌫",
        color: "#AFEFDE",
    },
}


var activities = {
    wakeup: {
        text: "Good morning 🌄",
        image: "./images/morning.svg",
        color: "#B9CAFC",
    },
    breakfast: {
        text: "Morning energy! 🍳",
        image: "./images/breakfast.svg",
        color: "#FFE8C5",
    },
    morning: [
        {
            text: "Morning coffee ☕",
            image: "./images/coffee.svg",
            color: "#BBB2A7",
        },
        {
            text: "Stretch yourself 💪",
            image: "./images/stretch.svg",
            color: "#B9E9CA",
        },
        {
            text: "Talk to friends 😆",
            image: "./images/talk.svg",
            color: "#B6DEF2",
        },
    ],
    lunch: {
        text: "Lunch break 🍜",
        image: "./images/lunch.svg",
        color: "#E6E9B9",
    },
    afternoon: [
        {
            text: "Rest your eyes 🥽",
            image: "./images/eyes.svg",
            color: "#BFE9B9",
        },
        {
            text: "Go for a walk 🚶‍♀️",
            image: "./images/walk.svg",
            color: "#A3E3CE",
        },
    ],
    dinner: {
        text: "Dinner time 🍽",
        image: "./images/dinner.svg",
        color: "#FFC8C1",
    },
    evening: [
        {
            text: "Read a book 📔",
            image: "./images/read.svg",
            color: "#5B4404",
        },
        {
            text: "Watch a movie? 🍿",
            image: "./images/movie.svg",
            color: "#4C415A",
        },
        {
            text: "Do some sport 🛹",
            image: "./images/sport.svg",
            color: "#BB0000",
        },
        {
            text: "A hot bath 🛀",
            image: "./images/bath.svg",
            color: "#324C6D",
        },
    ],
    night: {
        text: "Good night 🌉",
        image: "./images/sleep.svg",
        color: "#001939",
    }
}


var tryTips = {
    wakeup: {
        choices:[{
            text: "A Cup of Water",
            supplement:"when wake up?",
            image: "./images/water cup.jpg",
        }]
    },
    breakfast: {
        choices:[{
            text: "Chocolate Cake",
            supplement:"for breakfast?",
            image: "./images/cake.jpg",
        }]
    },
    morning: [
        {
            
            choices:[{
                text: "Vegan Pumpkin Spice Latte",
                supplement:"for coffe?",
                image: "./images/Vegan-Pumpkin-Spice-Latte.jpg",
            },
            {
                text:"Light Cinnamon Roll Mocha",
                supplement:"for coffe?",
                image: "./images/healthy-cinnamon-roll-mocha.jpg"
            },
            {
                text:"Refreshing Lavender Honey Iced Lattes",
                supplement:"for coffe?",
                image: "./images/Refreshing Lavender Honey Iced Lattes.jpg"
            }]
            
        },
        {
            choices:[{
                text: "Training Arm Muscles",
                supplement:"recommand: Pushups + Biceps Curl",
                image: "./images/arm-muscles.jpg",               
            },
            {
                text: "Pre-workout Green Smoothie",
                supplement:"and do some exercises?",
                image: "./images/pre-workout-smoothie.jpg",
            }]
        },
        {
            choices:[{
                text: "Mango Green Tea",
                supplement:"while chatting?",
                image: "./images/mango-greentea.jpg",               
            }]
        },
    ],
    lunch: {
        text: "Taco",
        supplement:"for lunch?",
        image: "./images/taco.jpg",    
    },
    afternoon: [
        {
            choices:[{
            text: "Crepe",
            supplement:"for afternoon-tea?",
            image: "./images/crepe.jpg",    
            }]
        },
        {
            choices:[{
                text: "Jazz Music",
                supplement:"while walking?",
                image: "./images/jazz.jpeg",    
            }]

        },
    ],
    dinner: {
        text: "Spaghetti",
        supplement:"for dinner?",
        image: "./images/spaghetti.jpg", 
    },
    evening: [
        {
            choices:[
            {
                text: "Hamlet",
                supplement:"to read?",
                image: "./images/hamlet.jpg",    
            },    
            {
                text: "Harry Potter And The Order Of The Phoenix",
                supplement:"to read?",
                image: "./images/harrypotter.jpg",    

            }]
        },
        {
            choices:[{
                text: "Sonic The Hedgehog",
                supplement:"for movie?",
                image: "./images/sonic.jpg",    
            },
            {
                text: "Detective Pikachu",
                supplement:"for movie?",
                image: "./images/pokemon.jpg",                   
            }]
        },
        {
            choices:[{
                text: "Training Arm Muscles",
                supplement:"Pushups + Biceps Curl",
                image: "./images/arm-muscles.jpg",               
            }]
        },
        {
            choices:[{
                text: "Mint Lemonade",
                supplement:"while taking the bath?",
                image: "./images/lemonade.jpg",               
            }]
        },
    ],
    night: {
        choices:[{
            text: "Richard Clayderman's Piano Music",
            supplement:"to sleep better?",
            image: "./images/richard.jpg",               
        },
        {
            text: "Some Hot Milk",
            supplement:"to sleep better?",
            image: "./images/milk.jpg"
        }
        ]
    }
}

var localTips = {
    doThis:[
        {
            textOne: "Go to ...",
            textTwo:"Toronto International Film Festival",
            image: "./images/tiff.jpg",
        },
        {
            textOne:"A walk to ...",
            textTwo:"Canada Day Parade",
            image: "./images/parade.jpg"
        },
        {
            textOne:"Join the ...",
            textTwo:"UofT Frosh Week",
            image: "./images/frosh.jpg"
        },
        {
            textOne:"Go to ...",
            textTwo:"Blue Jay vs Red Sox",
            image: "./images/bluejay.jpg"
        },
        {
            textOne:"Join the ...",
            textTwo:"Innovation Fair 2020 Presentation",
            image: "./images/if.jpg"
        },
        {
            textOne:"Go see the ...",
            textTwo:"perseid meteor",
            image: "./images/perseid meteor.jpg"
        },
        {
            textOne:"Go to the ...",
            textTwo:"Picasso: Painting the Blue Period",
            image: "./images/picasso.jpg"
        },
        {
            textOne:"Go to the ...",
            textTwo:" Imagine Dragon at Casa Loma",
            image: "./images/casaloma.jpg"
        },              
    ]
}


var newsLinks = [
    {
        link: "https://globalnews.ca/news/7251612/ontario-coronavirus-cases-august-5-covid19/",
        news: "Ontario reports 86 new coronavirus cases, 3rd day in a row with fewer than 100 cases"
    },
    {
        link:"https://www.cbc.ca/news/world/trump-lebanon-explosion-1.5675120",
        news: "U.S. defence officials contradict Trump's claim of Beirut 'attack'"
    },
    {
        link: "https://www.cbc.ca/news/politics/vaccine-procurement-anand-bains-1.5674820",
        news: "Feds sign agreements with Pfizer, Moderna for millions of doses of COVID-19 vaccines"
    },
    {
        link: "https://techcrunch.com/2020/08/05/twitter-android-bug-direct-messages/?guccounter=1&guce_referrer=aHR0cHM6Ly9uZXdzLmdvb2dsZS5jb20v&guce_referrer_sig=AQAAAI7YmF0zQ-g-6X49hEg4h_49mxnHc0tdxHLsSXKrBYKIKm4k04S9UA3SBX_Y-pxfLbNkrYtR7ceugMvyRUp5lexzp4rLM-2iyLUWKylASybaRKVn4lTuu8BT3Raz3t4TgnvKDwsqamvU3BJcBq9bSb-xn1N3O5b7dQSc-hnVeirK",
        news: "Twitter says Android security bug gave access to direct messages"
    },
    {
        link: "https://www.businessinsider.com/dinosaur-diagnosed-with-cancer-first-case-2020-8",
        news: "A dinosaur has been diagnosed with cancer for the first time. Here's how the scientists did it."
    },
    {
        link: "https://www.aljazeera.com/ajimpact/trump-demand-cut-tiktok-microsoft-deal-lacks-precedent-200804191413499.html",
        news: "Trump's demand for cut of TikTok-Microsoft deal lacks precedent"
    }
]

var suggestionLinks = [
    {
        title: "Reopening Ontario: Entering Stage 3",
        link: "https://www.ontario.ca/page/reopening-ontario",
        pic: "https://files.ontario.ca/stage1plan-image1-en.jpg",
    },
    {
        title: "What to expect during the NBA’s return",
        link: "https://www.sbnation.com/nba/2020/7/29/21335877/nba-preview-orlando-restart-check-in",
        pic: "https://cdn.vox-cdn.com/thumbor/Qa8HVyp6xVSxfil3cpCoR7h4byY=/1400x1050/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/20668996/NBA.png",
    },
    {
        title: "League of Legends Global Power Rankings",
        link: "https://www.espn.com/esports/story/_/id/29590341/league-legends-global-power-rankings-august-3",
        pic: "https://a3.espncdn.com/combiner/i?img=%2Fphoto%2F2018%2F1013%2Fr446321_1296x729_16%2D9.jpg",
    },
    {
        title: "SNH48 7th general election",
        link: "https://snh48g.fandom.com/wiki/7th_General_Election",
        pic: "https://snh48.today/wp-content/uploads/2020/07/a04b2a1dgy1gggi3zmnd3j21z59kxx6z1.jpg",
    },
]

