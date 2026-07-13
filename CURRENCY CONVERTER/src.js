const baseURL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns=document.querySelectorAll(".dropdown select");
const btn=document.querySelector("form button");
const fromcurr=document.querySelector(".from select");
const tocurr=document.querySelector(".to select");

window.addEventListener("load",()=>{

    updateexrate();

});

for(let select of dropdowns){

    for(currcode in countryList) {
        let newoption=document.createElement("option");
        newoption.innerText=currcode;
        newoption.value=currcode;
        
        if(select.name==="from" && currcode==="USD")
        {
            newoption.selected="selected";
        }else if(select.name==="to" && currcode==="INR")
        {
            newoption.selected="selected";
        }
        select.append(newoption);
    }
    select.addEventListener("change",(evt)=>{
        updateflag(evt.target);
    })

}
const updateflag=(element)=>{

    let currcode=element.value;
    let countrycode=countryList[currcode];
    let newsrc=`https://flagsapi.com/${countrycode}/flat/64.png`;
    let img=element.parentElement.querySelector("img");
    img.src=newsrc;   

}
btn.addEventListener("click",(evt)=>{
    evt.preventDefault();
    updateexrate();
    
})

const updateexrate =async()=>{

    let amount=document.querySelector(".amount input");
    let amtval=amount.value;
    if(amtval=="" || amtval<1)
    {
        amtval=1;
        amount.value=1;
    }
 
    const URL = `${baseURL}/${fromcurr.value.toLowerCase()}.json`;
   let response=await fetch(URL);
   let data = await response.json();
    let rate = data[fromcurr.value.toLowerCase()][tocurr.value.toLowerCase()];
    let convertedAmount = amtval * rate;
    document.querySelector(".msg").innerText = `${amtval} ${fromcurr.value} = ${convertedAmount.toFixed(2)} ${tocurr.value}`;

}