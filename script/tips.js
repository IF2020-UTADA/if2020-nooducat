let btns =  [document.getElementById("switchButton-1"), document.getElementById("switchButton-2"), document.getElementById("switchButton-3")];
let tipsTexts = [document.getElementById("card-texts-1"), document.getElementById("card-texts-2"), document.getElementById("card-texts-3")];

let version = [1, 1, 1];
for (let i=0; i<3; i++){
btns[i].addEventListener('click', () => {
    let oldBtn = btns[i].innerHTML;
    btns[i].innerHTML = 'Switching...';

    setTimeout(()=>{
        if (version[i] == 1 ){
            btns[i].innerHTML = oldBtn;
            btns[i].childNodes[0] = 'Switch!';
            tipsTexts[i].innerHTML = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci, minus asperiores quisquam et officiis iure alias ex doloremque tempore veniam ad in praesentium pariatur laborum a ea optio, repudiandae voluptates.";
            version[i] = 2;
        } else{
            btns[i].innerHTML = oldBtn;
            btns[i].childNodes[0] = 'Switch!';
            tipsTexts[i].innerHTML = "This card has supporting text below as a natural lead-in to additional content.";
            version[i] = 1;
        }
    }, 500
    )

})}
