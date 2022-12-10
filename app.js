const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".container input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section ul.cities");

localStorage.setItem("weathertokenkey","2+0P/X00wKZtPzc74h9+uvzw9imdPH8quG6ZksO/y7ecz3nAbinOuasldY4HTEq9");
// localStorage.setItem("weathertokenKeyEncrypted", EncryptStringAES("4ad96a46bd402948d93a7a6ce07ab182"));

form.addEventListener("submit", (event) =>{
    event.preventDefault();
    getWeatherDataFromApi();
});
const getWeatherDataFromApi= async ()=>{
    // alert("http request is gone!");
    const tokenKey = DecryptStringAES(localStorage.getItem("weathertokenkey"));
    // alert(tokenKey);
    const inputValue = input.value;
    const lang ="tr";
    const units="metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;


    try{
    const response = await fetch(url).then(response => response.json());
    
    const { main, sys , weather, name } = response;

    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    const cityNameSpans =list.querySelectorAll(".city span");
    const cityNameSpansArray = Array.from(cityNameSpans);
    if(cityNameSpansArray.length>0){
        const filteredArray =cityNameSpansArray.filter(span=>span.innerText == name);
        if(filteredArray.length > 0){
            msg.innerText = `You already know the weather for ${name}, Please search for another city.`;
            setTimeout(()=>{
                msg.innerText="";
            },5000);
            form.reset();
            return;
        }
    }
    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    createdLi.innerHTML = `
    <h2 class="city-name" data-name="${name}, ${sys.country}"><span>${name}</span><sup>${sys.country}</sup></h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${iconUrl}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>`;
    list.prepend(createdLi);
    
} catch(error){
    console.log(error);
    msg.innerText = `404 (City Not Found)`;
    setTimeout(() => {
      msg.innerText = "";
    }, 5000);
  }
  form.reset();
};