require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/artist-search', (req, res, next) => {
    const artistName = req.query.artist;

    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render('artist-search-results', { data: data.body.artists.items });
            console.log('ARTIST NAME', data.body.artists.items[0].images);
        })


        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistID', (req, res, next) => {

    spotifyApi.getAlbums(['5U4W9E5WsYb2jUQWePT8Xm', '3KyVcddATClQKIdtaap4bV'])
        .then(function (data) {
            console.log('Albums information', data.body);
            res.render('albums', { data: data.body })
        }, function (err) {
            console.error(err);
        });
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
