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
const nightTime = 20;
let activityTrack = ["morning", -1];

document.addEventListener("DOMContentLoaded", () => {
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
        // getActivity('morning');
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
    let suggList = [];
    while (suggList.length < 2){
        const num = Math.floor(Math.random() * suggestionLinks.length);
        if (! suggList.includes(num)){
            suggList.push(num);
        }
    }
    
    for (let rand of suggList){
        document.querySelector('#suggestColSec').innerHTML += suggestion({
            title: suggestionLinks[rand].title,
            links: suggestionLinks[rand].link,
            pic: suggestionLinks[rand].pic, 
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

    let time = new Date();
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
        localStorage["emoCalendar"] = JSON.stringify(emoCalendar);
        setEmotion(date);
        document.querySelector('#emoBtn').value = "😄";
    } else {
        document.querySelector('#emoBtn').value = emoCalendar[year][month][date]["emo"];
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
                supplement:"for coffee?",
                image: "./images/Vegan-Pumpkin-Spice-Latte.jpg",
            },
            {
                text:"Light Cinnamon Roll Mocha",
                supplement:"for coffee?",
                image: "./images/healthy-cinnamon-roll-mocha.jpg"
            },
            {
                text:"Lavender Honey Lattes",
                supplement:"for coffee?",
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
                text: "Green Smoothie",
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
        choices: [{
        text: "Taco",
        supplement:"for lunch?",
        image: "./images/taco.jpg",    
    }]
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
        choices: [{
        text: "Spaghetti",
        supplement:"for dinner?",
        image: "./images/spaghetti.jpg",
    }] 
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
                text: "Harry Potter",
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
        title: "What to do after Stage 3 of Reopening",
        link: "https://www.ontario.ca/page/reopening-ontario",
        pic: "https://torontostoreys.com/wp-content/uploads/2020/04/afterlife_photography_92990455_825895884580923_5293583967685592644_n.jpg",
    },
    {
        title: "What to expect during the NBA’s return",
        link: "https://www.sbnation.com/nba/2020/7/29/21335877/nba-preview-orlando-restart-check-in",
        pic: " https://www.nbcsports.com/philadelphia/sites/csnphilly/files/styles/article_hero_image/public/2020/06/04/nba_return_thumbnail.jpg?itok=K6gnNXs_",
    },
    {
        title: "A Total War Saga: Troy—everything we know",
        link: "https://www.pcgamer.com/everything-we-know-about-a-total-war-saga-troy/",
        pic: "https://cdn.cloudflare.steamstatic.com/steam/apps/1099410/ss_16ee38bc88ec0db58b534343c88eefb8b8c31880.1920x1080.jpg?t=1591115637",
    },
    {
        title: "SNH48 7th general election",
        link: "https://snh48g.fandom.com/wiki/7th_General_Election",
        pic: "https://snh48.today/wp-content/uploads/2020/07/a04b2a1dgy1gggi3zmnd3j21z59kxx6z1.jpg",
    },
    {
        title: "Lee Byung-hun’s ‘Man Standing Next’ Secures 2020 Asia Theatrical Releases",
        link: "https://variety.com/2019/film/asia/lee-byung-hun-man-standing-next-asian-releases-1203426914/", 
        pic: "https://pmcvariety.files.wordpress.com/2019/12/msn_re-showbox.jpg?w=1024&h=734",
    },
    {
        title: "Is The Rise of Phoenixes based on a true story?", 
        link: "https://www.thecinemaholic.com/the-rise-of-the-phoenixes-netflix/",
        pic: "https://i.pinimg.com/originals/4c/71/ab/4c71abffb63730dde81d97adf29a89a8.jpg",
    },
    {
        title: "Album Review: Land Of Talk – Indistinct Conversations", 
        link: "https://newnoisemagazine.com/album-review-land-of-talk-indistinct-conversations/",
        pic: "https://newnoisemagazine.com/wp-content/uploads/2020/07/Land-of-Talk-Indistinct-Conversations-e1595875945855.jpg",
    },
    {
        title: "UNIQLO: Doraemon's 50th anniversary UT",
        link: "https://www.uniqlo.com/jp/en/contents/feature/ut-magazine/s37/",
        pic: "https://www.uniqlo.com/jp/ja/contents/feature/ut-magazine/img/s37/contents-4.jpg",
    },
    {
        title: "Introduction to Dislike: an atypical time management tool",
        link: "https://sspai.com/post/61390",
        pic: "https://cdn.sspai.com/2020/07/11/98b2f3afd5f0ffe284ca78e75209a9ba.jpg?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1",
    },
    {
        title: "Rise of Toronto's modern franchise",
        link: "https://ottawacitizen.com/life/food/rise-of-ottawas-modern-franchise-whats-behind-ottawas-changing-food-scene",
        pic: "http://news.superlife.ca/wp-content/blogs.dir/2/files/images/2016/06/211627a1Y.jpg",
    },
    {
        title: "Do you really understand true wireless headphones?",
        link: "https://sspai.com/post/61753",
        pic: "https://cdn.sspai.com/2020/07/28/58c3f860469bab6f7f1eb8e5dc0e5abe.jpg?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1",
    },
]

