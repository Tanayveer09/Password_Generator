var password="";
var passLength=10;
var checkCount=0;
const symb="!@#$%^&*()-_+=':<>,{}[].?/";

handeSlider();

//set indicator color
setIndicator("#ccc")

function handeSlider(){
    sliderLength=document.querySelector("#lengthSlider");
    sliderLength.value=passLength;
    lenDisplay=document.querySelector("[data-lengthDisplay]");
    lenDisplay.innerHTML=passLength;
    
}

function setIndicator(color){
    var indicator=document.querySelector("[data-indicator]");
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
    
}

function getRandomNumber(){
    return getRandomInteger(0,9);
}

function getRandomUpperCase(){
    // console.log(getRandomInteger(65,91));
    return String.fromCharCode(getRandomInteger(65,91));
}

function getRandomLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateRandomSymbols(){
    idx=getRandomInteger(0,symb.length);
    return symb.charAt(idx);
}

//strength calculation
function calculateStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbols=false;

    if(document.querySelector("#upperCase").checked){
        hasUpper=true;
    }
    if(document.querySelector("#lowerCase").checked){
        hasLower=true;
    }
    if(document.querySelector("#numbers").checked){
        hasNumber=true;
    }
    if(document.querySelector("#symbols").checked){
        hasSymbols=true;
    }

    if(hasUpper && hasLower && (hasNumber || hasSymbols) && passLength>=8){
        setIndicator("#0f0");
        console.log("green")
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbols) && 
        passLength>=6
    ){
        setIndicator("#ff0");
        console.log("yellow")
    }
    else{
        setIndicator("#ff0000");
        console.log("red")
    }
}

//for copy button 
async function copyContent(){
    if(password!=""){
        try{
            await navigator.clipboard.writeText(document.querySelector("[data-passwordDisplay]").value);
            document.querySelector("[data-copyMsg]").innerHTML="Copied";
        }
        catch(e){
            document.querySelector("[data-copyMsg]").innerHTML="failed";
        }
        //to make copy span visible
        document.querySelector("[data-copyMsg]").classList.add("active");
        //to make copy span invisible
        setTimeout(() => {
            document.querySelector("[data-copyMsg]").classList.remove("active");
        },2000);
    }
    else{
        alert('Password not generated');
    }

}

//adding event listener on slider jisse use aage piche karne se lengthDisplay ki value change ho
sliderLength.addEventListener('input',(e) => {
    passLength=e.target.value;
    handeSlider();
})

//handling changes made in chackboxes
const allCheckBox=document.querySelectorAll("input[type=checkbox]");//isse mere paas ek array aya jisme sab checkboxes hai
allCheckBox.forEach(checkBox =>{
    checkBox.addEventListener('change',handleChange);//uss checkBox mei agar koi change ho to uss change ko handle karo
})
//handling that change
function handleChange(){
    checkCount=0;
    allCheckBox.forEach(checkBox =>{
        if(checkBox.checked==true){
            checkCount++;
        }
    })
    if(passLength<checkCount){
        passLength=checkCount;
        handeSlider();
    }
}

genBtn=document.querySelector("#generate");
genBtn.addEventListener("click",() =>{
    password="";
    if(checkCount==0){
        return;
    }
    if(passLength<checkCount){
        passLength=checkCount;
        handeSlider();
    }
    //ab main kaam karna hai
    funArr=[];
    if(document.querySelector("#upperCase").checked){
        funArr.push(getRandomUpperCase);
    }
    if(document.querySelector("#lowerCase").checked){
        funArr.push(getRandomLowerCase);
    }
    if(document.querySelector("#symbols").checked){
        funArr.push(generateRandomSymbols);
    }
    if(document.querySelector("#numbers").checked){
        funArr.push(getRandomNumber);
    }
    //compulsory addition
    for(let i=0; i<funArr.length; i++){
        password+=funArr[i]();
    }
    
    //remaining wala add karo
    for(let i=0; i<passLength-funArr.length; i++){
        randomNum=getRandomInteger(0,funArr.length);
        password+=funArr[randomNum]();
    }
    

    //password shuffle karna hai
    password=shufflePass(Array.from(password));//paasword jo ek string hai use array mei convert karke function ko de rahe hai
    
    //password display karana hai
    document.querySelector("[data-passwordDisplay]").value=password;

    //strength
    calculateStrength();

})

//function to shuffle the password
function shufflePass(array){
    //Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        //finding random j using Math.random function
        const j=Math.floor(Math.random()*(i+1));
        //swap
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    //array ko vaps se string mei convert
    let str="";
    array.forEach((el) => (str+=el));
    return str;
}

