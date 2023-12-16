import { login, get, set } from "./remote.js"; //import delle funzioni utili per utilizzare la cache remota
const token = "9e5c0fd5-063b-46d3-865b-3914ac60f12c";
const username = document.getElementById("username") //input
const password = document.getElementById("password") //input
const div_login = document.getElementById("div_login") //div
const button_login = document.getElementById("b_login");  //button
const text = document.getElementById("text"); //div
const visualizzazione = document.getElementById("visualizzazione"); //div
const visualizzazione2 = document.getElementById("visualizzazione2"); //div
const invio = document.getElementById("invio"); //button
const nome_POI = document.getElementById("nome_POI"); //input
const numero_POI = document.getElementById("num"); //input
const lat = document.getElementById("lat"); //input
const lon = document.getElementById("long"); //input
const desc = document.getElementById("desc"); //input
const div_POI = document.getElementById("div_POI"); //div
const salva = document.getElementById("salva");  //button
const div_s = document.getElementById("div_s"); //div
const chiudi1 = document.getElementById("chiudi"); //button
const chiudi2 = document.getElementById("chiudi2");//button
let lista_POI = []; // lista

//ciao amore ti amo tanto <3
function callback2(content) { //funzione per ottenere la lista dei POI
  console.log(content);
  lista_POI = JSON.parse(content.result); //lista_POI
  render();
}

function callback(content) { //funzione per controllare le credeziali del login
  content = JSON.parse(content.result);
  if (content === true) {
    get(token, callback2);
    div_login.classList.remove("d-block"); //nasconde la div login
    div_login.classList.add("d-none");     // ""    
    visualizzazione.classList.remove("d-none"); //appare il div "visualizzazione"
    visualizzazione.classList.add("d-block"); //""
  }
  else {
    text.classList.remove("d-none"); //appare il div "text"
    text.classList.add("border-danger");
    text.innerText = "Credenziali errate"; //appare il testo "credenziali errate"
  }
}

button_login.onclick = () => {
  login(callback, token, username.value, password.value); //richiamo la funzione login da remote.js
}

function controllo_coordinate(latitudine, longitudine) {
  if (latitudine <= 46 && latitudine >= 44 && longitudine >= 9 && longitudine <= 11) {
    //controllo della latitudine e della longitudine: se sono a Verona
    div_s.classList.remove("d-bolck");
    div_s.classList.add("d-none");
    lat.classList.add("border-success");
    lon.classList.add("border-success");
  }
  else {
    div_s.classList.remove("d-none");
    div_s.classList.add("d-block");
    lat.classList.add("border-danger");
    lon.classList.add("border-danger");
    div_s.innerText = "le coordinate inserite non sono a Verona";
  }
}

function controllo_inputurl(numUrls, html, id) {
  if (numUrls >= 3) { //controllo che le url inserite siano maggiori o uguali a 3
    for (let i = 0; i < numUrls; i++) {
      //appaiono i textbox per inserire le url
      div_POI.classList.remove("alert-danger")
      html += `<br><label for="url" class="form-label">Inserisci URL:</label>
    <input type="text" class="form_control _elimina" id=${id + i} name="url"><br>`
    }
    div_POI.innerHTML = html; //appare il template
    div_POI.classList.remove("d-none");
  } else {
    div_POI.classList.remove("d-none");
    div_POI.classList.add("d-block");
    div_POI.classList.add("alert-danger");
    div_POI.innerText = "Il numero minimo di URL è 3";
  }
}

invio.onclick = () => { //pressione del pulsante invio
  let nome = nome_POI.value;
  let latitudine = lat.value;
  let longitudine = lon.value;
  let descrizione = desc.value;
  let num = numero_POI.value;
  console.log(descrizione);
  let html = ``;
  let url = [];
  let id = "url";
  controllo_coordinate(latitudine, longitudine);
  const numUrls = parseInt(num);
  controllo_inputurl(numUrls, html, id)
  for (let i = 0; i < numUrls; i++) {
    let inputURL = document.getElementById(id + i);
    // controllo che tutti i campi siano riempiti per fare apparire il taste "salva" con l'evento "onchange"
    inputURL.addEventListener("change", function controllo() {
      let u = inputURL.value
      if (u.length > 0) {
        url.push(u); //lista delle url per ogni POI
      }
      if (url.length === parseFloat(num) && nome !== "" && latitudine !== "" && longitudine !== "" && descrizione !== "") {
        salva.classList.remove("d-none"); //appare il tasto salva
        salva.classList.add("d-block");   // ""
        let id = lista_POI.length
        lista_POI.push({ id: id, nome: nome, lat: parseFloat(latitudine), lon: parseFloat(longitudine), descrizione: descrizione, url: url }); //aggiunta del POI nella lista
        console.log(lista_POI)
      }
    })
  }
}

function render() {
  let html = ``;
  let template = `
  <div class="card border-success mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="%url" class="img-fluid rounded-start " style="height:100% ;width:100%"> 
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h3 class="card-title">%nome</h3>
        <br>
        <br>
        <button type="button" id="elimina" class="elimina btn btn-success">Elimina</button>
      </div>
    </div> 
  </div>
  </div>`; //template card di ogni POI
  lista_POI.forEach((element, index) => {
    // sostituzione dei dati nel template
    html += template.replace("%nome", element.nome).replace("%url", element.url[0]).replace("elimina", "elimina" + index)
  })
  visualizzazione2.innerHTML = html;
  const elimina = document.querySelectorAll(".elimina") //gestione elimina
  console.log(elimina)
  elimina.forEach((element) => {
    element.onclick = () => {
      let index = parseInt(element.id.replace("elimina", ""), 10);
      lista_POI.splice(index, 1) //POI eliminato dalla lista
      render();
    }
    console.log(lista_POI);
  })
  salva_dati()
}

function salva_dati() {
  //richiamo la funzione set che invia i dati alla cache remota
  set(token, lista_POI);
}

function chiudi() {
  nome_POI.value = "";
  lat.value = "";
  lon.value = "";
  desc.value = "";
  numero_POI.value = 0;
  div_POI.classList.remove("d-block");
  div_POI.classList.add("d-none")
}

salva.onclick = () => { //alla prssione del tasto salva vengono salvati i dati e viene visualizzato il POI tramite la render
  salva.classList.remove("d-block");
  salva.classList.add("d-none");
  chiudi()
  render()
  salva_dati()
}

chiudi1.onclick = () => {
  chiudi()
}
chiudi2.onclick = () => {
  chiudi()
}