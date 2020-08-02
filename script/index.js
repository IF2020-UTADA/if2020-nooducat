const web = Handlebars.compile(
    document.querySelector('#webLinkTemplate').innerHTML
);

var webLinks = [
    {
        name: "Google",
        link: "www.google.com",
        bg: "#FF5C5C",
    }, 
    {
        name: "Acorn",
        link: "www.google.com",
        bg: "#5A63DB",
    }, 
    {
        name: "Quercus",
        link: "www.google.com",
        bg: "#FF5B81",
    }, 
    {
        name: "Outlook",
        link: "www.google.com",
        bg: "#58B1FF",
    }, 
    {
        name: "Youtube",
        link: "www.google.com",
        bg: "#FF2525",
    }, 
    {
        name: "Github",
        link: "www.google.com",
        bg: "#1C1C1C",
    }, 
]


document.addEventListener("DOMContentLoaded", () => {
    // get local webs
    if (localStorage["webLinks"]){
        webLinks = localStorage["webLinks"];
    }

    // get local note
    if(localStorage['note']){
        document.querySelector('#note').value = localStorage['note'];
    }

    
    // add web links
    for (let w of webLinks) {
        document.querySelector('#webContainer').innerHTML += web({
            name: w.name,
            link: w.link,
            icon: w.name.charAt(0),
            bg: w.bg,
        });
    }
})



function updateNote(){
    localStorage['note'] = document.querySelector('#note').value;
}