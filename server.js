const express = require("express");
const request = require("request");
const fetch = require("node-fetch");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8888;
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:8888/callback";

app.listen(port, function () {
  console.log(`Server Started: ${port}`);
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function (length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let stateKey = "spotify_auth_state";

app
  .use(cookieParser())
  .use(express.static(__dirname + "/static"))
  .use(cors());

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  let scope = "user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token,
          refresh_token = body.refresh_token;

        // Get user profile
        let options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };
        fetch(options.url, { headers: options.headers })
          .then((res) => res.json())
          .catch((err) => console.log(err));
        res.redirect(
          "/user?" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            })
        );

      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.get("/?:access_token", function (req, res) {
  let access_token = req.query.access_token,
    refresh_token = req.query.refresh_token;
  // Get top tracks
  let options = {
    url: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50&offset=0",
    headers: { Authorization: "Bearer " + access_token },
    json: true,
  };
  fetch(options.url, { headers: options.headers })
    .then((res) => res.json())
    .then((res) => data = res)
    .catch((err) => console.log(err));
  res.render("main", { tracks: data });
});
