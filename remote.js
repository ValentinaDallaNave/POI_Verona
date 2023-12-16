export function registrazione(token, username, password) {
  fetch(
    "https://ws.progettimolinari.it/credential/register",
    {
      method: "POST",
      headers:
      {
        "content-type": "application/json",
        key: token
      },
      body: JSON.stringify(
        {
          username: username,
          password: password
        })
    }
  ).then(response => {
    response.json().then(console.log("ok"));
  })
};


export function login(callback, token, username, password) {
  fetch("https://ws.progettimolinari.it/credential/login",
    {
      method: "POST",
      headers:
      {
        "content-type": "application/json",
        key: token
      },
      body: JSON.stringify(
        {
          username: username,
          password: password
        })
    }).then((response) => {
      response.json().then(callback).catch(err => (console.log(err)))
    })
};

export function get(token, callback) {
  fetch("https://ws.progettimolinari.it/cache/get", {
    method: "POST",
    headers:
    {
      "content-type": "application/json",
      key: token
    },
    body: JSON.stringify({ key: "POI" })
  }).then((response) => {
    response.json().then(callback).catch(err => (console.log(err)))
  })
}

export function set(token, dati) {
  fetch("https://ws.progettimolinari.it/cache/set",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        key: token
      },
      body: JSON.stringify({
        key: "POI",
        value: JSON.stringify(dati)
      })
    }).then((response) => {
      response.json().then(console.log("ok"));
    })
}
