let userscore=0;
let compscore=0;


const choices=document.querySelectorAll(".choice");
const msg=document.querySelector("#msg");
const userscorepara=document.querySelector("#user-score");
const compscorepara=document.querySelector("#comp-score");

const gencomputerchoice=()=>{
    //rock,paper,scissors
    const options=["rock","paper","scissor"];
    const rndmidx=Math.floor(Math.random()*3);
    return options[rndmidx];
}

const drawgame=()=>{
   
    msg.innerText="Game Draw. Play Again."
    msg.style.backgroundColor="#99B2B7"

}
const showwinner=(userwin,userchoice,compchoice)=>{

    if(userwin)
    {
        userscore++;
        userscorepara.innerText=userscore;
        msg.innerText=`You Win! Your ${userchoice} beats ${compchoice}`;
        msg.style.backgroundColor="green";
    }

    else
    {
        compscore++;
        compscorepara.innerText=compscore;
        msg.innerText=`You Loss! ${compchoice} beats  your ${userchoice}`;
        msg.style.backgroundColor="red";
    }
}
const playgame=(userchoice)=>{

    console.log("userchoice",userchoice);

    //generate comp choice;
    const compchoice=gencomputerchoice();
    if(userchoice===compchoice)
    {
        drawgame();
    }
    else
    {
        let userwin=true;
        if(userchoice==="rock")
        {
            userwin=compchoice=="paper"?false:true;

        }
        else if(userchoice==="paper")
        {
            userwin=compchoice=="scissor"?false:true;

        }
        else
        {
            userwin=compchoice=="rock"?false:true;
        }
        showwinner(userwin,userchoice,compchoice);
    }

};



choices.forEach((choice)=>{
    choice.addEventListener("click",()=>
    {
        const userchoice=choice.getAttribute("id");
        playgame(userchoice);
    })
})