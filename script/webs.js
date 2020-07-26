document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#webOne').onclick = window.open(websites[0][2])
    document.querySelector('#webTwo').onclick = window.open(websites[1][2])
    document.querySelector('#webThree').onclick = window.open(websites[2][2])
    document.querySelector('#webFour').onclick = window.open(websites[3][2])
    document.querySelector('#webFive').onclick = window.open(websites[4][2])
    document.querySelector('#webSix').onclick = window.open(websites[5][2])
})


websites = [{
    name: "Google",
    abbreviation: "G",
    url: "https://www.google.com/"
},
{
    name: "Acorn",
    abbreviation: "A",
    url: "https://www.acorn.utoronto.ca/"
},
{
    name: "Quercus",
    abbreviation: "Q",
    url: "https://q.utoronto.ca/"
},
{
    name: "Outlook",
    abbreviation: "O",
    url: "https://outlook.live.com/owa/"
},
{
    name: "Youtube",
    abbreviation: "Y",
    url: "https://www.youtube.com/"
},
{
    name: "Github",
    abbreviation: "G",
    url: "https://github.com/"
},
]