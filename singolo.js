import { login, get } from "./remote.js"; //importazione delle funzioni utili da remote.js
const username = document.getElementById("username"); //interrogazione del DOM
const password = document.getElementById("password"); // ""
const b_login = document.getElementById("b_login");     //""
const text = document.getElementById("text");         //"" 
const div_login = document.getElementById("div_login");//""
const token = "9e5c0fd5-063b-46d3-865b-3914ac60f12c";//token
const visualizzazione = document.getElementById("visualizzazione");//""
const params = new URLSearchParams(location.search); //prende la url del sito
const carosello = document.getElementById("carosello");// interrogazione del DOM
const visualizzazione2 = document.getElementById("visualizzazione2");//""
const visualizzazione1 = document.getElementById("visualizzazione1")
let lista_POI = [];

function callback2(content) {
  //callback lista POI
  lista_POI = JSON.parse(content.result); //aggiunta dati nella lista
  let id = params.get("id"); //prende dalla url il parametro "id"
  lista_POI.forEach((element) => {
    //iterazione lista
    if (element.id === parseFloat(id)) {
      //controllo dell'id 
      console.log(element)
      render_dettagli(element) //render pagina di dettaglio
    }
  })
}

div_login.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    login(callback, token, username.value, password.value);
  }
});

function callback(content) {
  //controllo del login
  content = JSON.parse(content.result);
  if (content === true) {
    div_login.classList.remove("d-block");
    div_login.classList.add("d-none");
    visualizzazione.classList.remove("d-none");
    visualizzazione.classList.add("d-block");
    get(token, callback2) //fetch da remote.js
  } else {
    text.classList.remove("d-none");
    text.classList.add("border-danger");
    text.innerText = "Credenziali errate";
  }
}

b_login.onclick = () => {
  //alla pressione del pulsante invio richiama la funzione login da remote.js
  login(callback, token, username.value, password.value);
  console.log(password.value)
}

function render_dettagli(POI) {
  //creazione del singolo POI 
  let html = ``
  let html1 = `<h3>Descrizione:</h3> <br> ${POI.descrizione}`;
  let html2 = `
  <div class="carousel-item %active">
  <img src="%image" class="d-block w-100"></div>`
  POI.url.forEach((element, i) => {
    if (i === 0) {
      html += html2.replace("%active", "active");
    } else {
      html += html2.replace("%active", "");
    }
    html = html.replace("%image", element);
  })
  visualizzazione1.innerHTML = `<h2>${POI.nome}</h2>`
  visualizzazione2.innerHTML = html1; //visualizzazione del POI
  carosello.innerHTML = html; //visualizzazione del carosello
}