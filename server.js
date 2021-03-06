const express = require('express');
const path = require('path');
const request = require('request');
const fetch = require('node-fetch');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8888;
const app = express();
require('dotenv').config();
app.set('view engine', 'ejs');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'https://www.analyse-aud.io/callback';
// https://www.analyse-aud.io/callback
// http://localhost:8888/callback

app.listen(port, function () {
  console.log(`Server Started: ${port}`);
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function (length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let stateKey = 'spotify_auth_state';

app
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'static')))
  .use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
  .use('/css', express.static(__dirname + '/node_modules/mdbootstrap/css'))
  .use(cors());

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/login', function (req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  let scope = 'user-top-read playlist-modify-public user-library-modify';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get('/callback', function (req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token,
          refresh_token = body.refresh_token;

        // Get user profile
        let options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        };
        fetch(options.url, { headers: options.headers })
          .then((res) => res.json())
          .catch((err) => console.log(err));
        res.redirect(
          '/user?' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
});

app.get('/?:access_token', function (req, res) {
  let access_token = req.query.access_token,
    refresh_token = req.query.refresh_token;
  // Get top tracks
  let options = {
    url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50&offset=0',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };
  fetch(options.url, { headers: options.headers })
    .then((res) => res.json())
    .then((res) => (long_tracks = res))
    .then(function () {
      let options = {
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50&offset=0',
        headers: { Authorization: 'Bearer ' + access_token },
        json: true,
      };
      fetch(options.url, { headers: options.headers })
        .then((res) => res.json())
        .then((res) => (short_tracks = res))
        .then(function () {
          // Get user profile
          let options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { Authorization: 'Bearer ' + access_token },
            json: true,
          };
          fetch(options.url, { headers: options.headers })
            .then((res) => res.json())
            .then((res) => (profile = res))
            .then(function () {
              // Get user playlists
              let options = {
                url: 'https://api.spotify.com/v1/me/playlists',
                headers: { Authorization: 'Bearer ' + access_token },
                json: true,
              };
              fetch(options.url, { headers: options.headers })
                .then((res) => res.json())
                .then((res) => (playlists = res))
                .then(function () {
                  res.render('main', {
                    long_tracks: long_tracks,
                    short_tracks: short_tracks,
                    access_token: access_token,
                    profile: profile,
                    playlists: playlists,
                  });
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

app.get('/features/:access_token/:trackIds', function (req, res) {
  // Get audio features for picked tracks
  let access_token = req.params.access_token,
    refresh_token = req.query.refresh_token;
  let trackIds = req.params.trackIds;
  let options = {
    url: 'https://api.spotify.com/v1/audio-features/?ids=' + trackIds,
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };
  fetch(options.url, { headers: options.headers })
    .then((res) => res.json())
    .then((res) => (data = res))
    .then(function () {
      // Get track titles
      let options = {
        url: 'https://api.spotify.com/v1/tracks/?ids=' + trackIds,
        headers: { Authorization: 'Bearer ' + access_token },
        json: true,
      };
      fetch(options.url, { headers: options.headers })
        .then((res) => res.json())
        .then((res) => (titles = res))
        .then(function () {
          let trackCount = trackIds.split(',').length;
          res.render('features', {
            tracks: data,
            titles: titles,
            access_token: access_token,
            trackIds: trackIds,
            trackCount: trackCount,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

app.get('/recommendations/:access_token/:queryString/:featuresList/:trackIds', function (req, res) {
  let access_token = req.params.access_token,
    refresh_token = req.query.refresh_token,
    queryString = req.params.queryString,
    featuresList = req.params.featuresList,
    trackIds = req.params.trackIds;

  let options = {
    url: 'https://api.spotify.com/v1/recommendations?' + queryString,
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };

  fetch(options.url, { headers: options.headers })
    .then((res) => res.json())
    .then((res) => (data = res))
    .then(function () {
      let recommendationIds = '';
      data.tracks.forEach(function (track) {
        recommendationIds = recommendationIds + track.id + ',';
      });
      recommendationIds = recommendationIds.slice(0, -1);

      let options = {
        url: 'https://api.spotify.com/v1/audio-features/?ids=' + recommendationIds,
        headers: { Authorization: 'Bearer ' + access_token },
        json: true,
      };
      fetch(options.url, { headers: options.headers })
        .then((res) => res.json())
        .then((res) => (featuresData = res))
        .then(function () {
          res.render('recommendations', {
            recommendations: data,
            featuresList: featuresList,
            features: featuresData,
            featuresParams: queryString,
            access_token: access_token,
          });
        });
    })
    .catch((err) => console.log(err));
});

// Create playlist with recommendations"
app.get('/create_playlist/:access_token/:trackUris/:featuresList', function (req, res) {
  let trackUris = req.params.trackUris,
    access_token = req.params.access_token,
    featuresList = req.params.featuresList;

  let options = {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
    json: true,
  };

  fetch(options.url, {
    headers: options.headers,
  })
    .then((res) => res.json())
    .then((res) => (userInfo = res))
    .then(function () {
      let options = {
        url: 'https://api.spotify.com/v1/users/' + userInfo.id + '/playlists',
        headers: { Authorization: 'Bearer ' + access_token },
        body: {
          name: 'Analyse-aud.io Recommendations',
          description: 'Based on the tracks you picked, trying to match the following audio features: ' + featuresList,
          public: true,
        },
        json: true,
      };

      request.post(options, function (error, response, body) {
        let playlistId = body.id;

        let options = {
          url: 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks?uris=' + trackUris,
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
          json: true,
        };
        request.post(options, function (error, response, body) {
          res.status(204).send();
        });
      });
    })
    .catch((err) => console.error(err));
});

// Save a track to "Liked Songs"
app.get('/save/:trackId/:access_token', function (req, res) {
  let trackId = req.params.trackId,
    access_token = req.params.access_token;

  let options = {
    url: 'https://api.spotify.com/v1/me/tracks?ids=' + trackId,
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
    json: true,
  };
  request.put(options, function (error, response, body) {
    res.status(204).send();
  });
});

app.get('*', function (req, res) {
  res.redirect('/');
});
