let boxes=document.querySelectorAll(".box");
let resetBtn=document.querySelector("#reset-btn");
let newgamebtn=document.querySelector("#new-btn");
let msgcontainer=document.querySelector(".msg-container");
let msg=document.querySelector("#msg");
let player1 = "";
let player2 = "";
let startBtn = document.querySelector("#start-btn");
let startScreen = document.querySelector("#start-screen");
let gameMain = document.querySelector("main");
let count=0;
let win=false;

//playerO and playerX
let turnO=true;

const winPatterns=[
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

const resetgame=()=>
{
    turnO = true;
    count = 0;  // ADD THIS
    win = false; // ADD THIS

    enableboxes();

    msgcontainer.classList.add("hide"); // Hide winner
    startScreen.classList.remove("hide"); // Show welcome page
    gameMain.classList.add("hide"); // Hide game

}
const disableboxes=()=>
{
    for(let box of boxes)
    {
        box.disabled=true;
    }
}
const enableboxes=()=>
{
    for(let box of boxes)
    {
        box.disabled=false;
        box.innerText="";
    }
}
const showWinner = (winner) => {

    let name = winner === "O" ? player1 : player2;
    win=true;

    msg.innerHTML = `Winner is ${name} (${winner})`;

    gameMain.classList.add("hide");      // Hide game
    msgcontainer.classList.remove("hide"); // Show winner

    disableboxes();
};
const showtie=()=>
{
    msg.innerText="Noone is winner";
    gameMain.classList.add("hide");      // Hide game
    msgcontainer.classList.remove("hide"); // Show winner

    disableboxes();
}


boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        count++;
        if(turnO)
        {
            box.innerText="O";
            turnO=false;
        }
        else
        {
            box.innerText="X";
            turnO=true;
        }
        box.disabled=true;

        checkWinner();
    })
})

const checkWinner=()=>{
    for(let pattern of winPatterns)
    {
        let pos1val=boxes[pattern[0]].innerText;
        let pos2val=boxes[pattern[1]].innerText;
        let pos3val= boxes[pattern[2]].innerText;
            if(pos1val!="" && pos2val!="" && pos3val!="")
            {
                if(pos1val==pos2val && pos2val==pos3val)
                {
            
                    showWinner(pos1val);
                    return;

                }
            }
                

    }
    if(count==9 && win==false)
            {
                showtie();
            }
}

newgamebtn.addEventListener("click",resetgame);
resetBtn.addEventListener("click",resetgame);


startBtn.addEventListener("click", () => {

    player1 = document.querySelector("#player1").value || "Player 1";
    player2 = document.querySelector("#player2").value || "Player 2";

    startScreen.classList.add("hide");   // Hide welcome
    msgcontainer.classList.add("hide");  // Make sure winner is hidden
    gameMain.classList.remove("hide");   // Show game
});