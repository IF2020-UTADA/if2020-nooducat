document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#webOne').onclick = function(){window.open(websites[0].url)};
    document.querySelector('#webTwo').onclick = function(){window.open(websites[1].url)};
    document.querySelector('#webThree').onclick = function(){window.open(websites[2].url)};
    document.querySelector('#webFour').onclick = function(){window.open(websites[3].url)};
    document.querySelector('#webFive').onclick = function(){window.open(websites[4].url)};
    document.querySelector('#webSix').onclick = function(){window.open(websites[5].url)};
    document.querySelector('#webSOne').onclick = function(){window.open(websites[0].url)};
    document.querySelector('#webSTwo').onclick = function(){window.open(websites[1].url)};
    document.querySelector('#webSThree').onclick = function(){window.open(websites[2].url)};
    document.querySelector('#webSFour').onclick = function(){window.open(websites[3].url)};
    document.querySelector('#webSFive').onclick = function(){window.open(websites[4].url)};
    document.querySelector('#webSSix').onclick = function(){window.open(websites[5].url)};
})

document.addEventListener('DOMContentLoaded', function() {

})
let websites = [{
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
}
]