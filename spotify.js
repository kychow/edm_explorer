/** 
 *  Handles spotify API requests and access token management.
 */

 const SpotifyWebApi = require('spotify-web-api-node');
 require('dotenv').config(); 

// Set the credentials for the Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    const accessToken = data.body.access_token;
    spotifyApi.setAccessToken(accessToken);
    console.log('The access token expires in ' + data.body['expires_in']);
  } catch (err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
}

async function main() {
  const edmArtists = ['Avicii', 'Illenium', 'Odesza', 'Martin Garrix'];

  try {
    await getAccessToken();
    const artistIds = await getArtistIds(edmArtists);
    console.log(artistIds);
  } catch (error) {
    console.error('Error getting artist IDs:', error);
  }
}

async function getArtistIds(edmArtists) {
  const artistIds = [];

  // Map each artist name to a Promise that searches for them on Spotify
  const artistPromises = edmArtists.map(artistName => {
    return spotifyApi.searchArtists(artistName)
      .then(data => {
        // Retrieve the first artist result from the search
        const artist = data.body.artists.items[0];
        if (artist) {
          // Save the artist ID to the artistIds array
          artistIds.push(artist.id);
        } else {
          console.error(`Error finding artist ${artistName}`);
        }
      })
      .catch(error => {
        console.error(`Error searching for artist ${artistName}:`, error);
      });
  });

  await Promise.all(artistPromises);
  return artistIds;
}

main();