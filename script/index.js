const web = Handlebars.compile(
    document.querySelector('#webLinkTemplate').innerHTML
);

const suggestion = Handlebars.compile(
    document.querySelector('#suggestionTemplate').innerHTML
);


document.addEventListener("DOMContentLoaded", () => {
    // get local webs
    if (localStorage["webLinks"]) {
        webLinks = localStorage["webLinks"];
    }

    // get time
    const time = new Date();

    // get weather
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=15a9adb8e010731c682b06cf232df34c&units=metric')
        .then(response => response.json())
        .then(data => {
            let type = data.weather[0].main;
            if (type === "Thunderstorm") type = "Thunder";
            let temp = data.main.temp;
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

    // get news

    // get tips

    // get suggestion

    // add web links
    for (let w of webLinks) {
        document.querySelector('#webContainer').innerHTML += web({
            name: w.name,
            link: w.link,
            icon: w.name.charAt(0),
            bg: w.bg,
        });
    }

    // add suggestion
    for (let i = 0; i < 4; i++) {
        document.querySelector('#suggestColSec').innerHTML += suggestion({

        });
    }
    // set mode
    if (time.getHours() >= 20 || time.getHours() <= 7) {
        setDarkMode();
    }
})


function updateNote() {
    localStorage['note'] = document.querySelector('#note').value;
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



var webLinks = [
    {
        name: "Google",
        link: "https://www.google.com",
        bg: "#FF5C5C",
    },
    {
        name: "Acorn",
        link: "https://acorn.utoronto.ca/",
        bg: "#5A63DB",
    },
    {
        name: "Quercus",
        link: "https://q.utoronto.ca/",
        bg: "#FF5B81",
    },
    {
        name: "Outlook",
        link: "https://www.outlook.com",
        bg: "#58B1FF",
    },
    {
        name: "Youtube",
        link: "https://www.youtube.com/",
        bg: "#FF2525",
    },
    {
        name: "Github",
        link: "https://github.com/",
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
