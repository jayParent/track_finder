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
var generateRandomString = function (length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

app
  .use(cookieParser())
  .use(express.static(__dirname + "/static"))
  .use(cors());

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = "user-read-private user-read-email";
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
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
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
        getUserInfo(body, res);
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
function getUserInfo(body, res) {
    var access_token = body.access_token, refresh_token = body.refresh_token;
    var options = {
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: "Bearer " + access_token },
        json: true,
    };
    fetch(options.url, { headers: options.headers })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    res.redirect("/#" +
        querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
        }));
}

