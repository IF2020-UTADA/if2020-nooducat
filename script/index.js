const web = Handlebars.compile(
    document.querySelector('#webLinkTemplate').innerHTML
);

const suggestion = Handlebars.compile(
    document.querySelector('#suggestionTemplate').innerHTML
);


document.addEventListener("DOMContentLoaded", () => {
    // get local webs
    if (localStorage["webLinks"]){
        webLinks = localStorage["webLinks"];
    }

    // get time

    // get weather


    // get local note
    if(localStorage['note']){
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
    for (let i = 0; i < 4; i++){
        document.querySelector('#suggestColSec').innerHTML += suggestion({

        });
    }
    // set mode
})


function updateNote(){
    localStorage['note'] = document.querySelector('#note').value;
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