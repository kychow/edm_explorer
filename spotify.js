var SpotifyWebApi = require('spotify-web-api-node');

// Set the credentials for the Spotify API
// Regenerate using https://developer.spotify.com/console/get-track/?id=&market=
const spotifyApi = new SpotifyWebApi({
  clientId: 'd4ec591eb9cd4f4bb6ab6622e17d25dd',
  clientSecret: '',
  redirectUri: '',
  accessToken: ''
});

// TODO generate access token each time someone uses spotify service
// // Retrieve an access token using your credentials
// spotifyApi.clientCredentialsGrant()
//   .then(data => {
//     // Save the access token to the Spotify API client
//     spotifyApi.setAccessToken(data.body['access_token']);
//     console.log('Access token set');
//   })
//   .catch(error => {
//     console.error('Error retrieving access token:', error);
//   });

async function main() {
  const edmArtists = ['Avicii', 'Illenium', 'Odesza', 'Martin Garrix'];

  try {
    const artistIds = await getArtistIds(edmArtists);
    console.log(artistIds);
    const topArtistIDs = await getTopArtistIds();
    console.log(topArtistIDs);
  } catch (error) {
    console.error('Error getting artist IDs:', error);
  }

  try {
    const artistIds = await getArtistIds(edmArtists);
    console.log('Artist IDs:', artistIds);

    const audioFeatures = await getAudioFeatures(artistIds);
    console.log('Audio Features:', audioFeatures);

    const similarityMatrix = computeArtistSimilarity(audioFeatures);
    
    console.log('Similarity Matrix:', similarityMatrix);
  } catch (error) {
    console.error('Error:', error);
  }

//   // Example usage
//   const artistIds = ['3TVXtAsR1Inumwj472S9r4', '6M2wZ9GZgrQXHCFfjv46we', '4gzpq5DPGxSnKTe4SA8HAU'];
//   computeArtistSimilarity(artistIds)
//     .then(similarityMatrix => console.log(similarityMatrix))
//     .catch(err => console.log(err));
}

async function getTopArtistIds() {
  const artists = await spotifyApi.searchArtists('genre:edm', { limit: 50 });
  return artists.body.artists.items.map((artist) => artist.id);
}

// A function that computes the cosine similarity between two vectors
function computeCosineSimilarity(v1, v2) {
  const dotProduct = v1.reduce((acc, cur, i) => acc + cur * v2[i], 0);
  const magnitude1 = Math.sqrt(v1.reduce((acc, cur) => acc + cur ** 2, 0));
  const magnitude2 = Math.sqrt(v2.reduce((acc, cur) => acc + cur ** 2, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

// A function that takes an array of Spotify artist IDs and computes the similarity between them
async function computeArtistSimilarity(artistIds) {
  const relatedArtists = await Promise.all(artistIds.map(async (id) => {
    const data = await spotifyApi.getArtistRelatedArtists(id);
    return data.body.artists.map(artist => artist.id);
  }));

  const numArtists = relatedArtists.length;
  const similarityMatrix = new Array(numArtists).fill(0).map(() => new Array(numArtists).fill(0));
  for (let i = 0; i < numArtists; i++) {
    for (let j = i + 1; j < numArtists; j++) {
      const similarity = computeCosineSimilarity(relatedArtists[i], relatedArtists[j]);
      similarityMatrix[i][j] = similarity;
      similarityMatrix[j][i] = similarity;
    }
  }
  return similarityMatrix;
}

// Illenium = 45eNHdiiabvmbp4erw26rg
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

async function getAudioFeatures(artistIds) {
  // Create an empty object to hold the audio features
  const audioFeatures = {};

  // Loop through each artist ID and get their top tracks
  for (let i = 0; i < artistIds.length; i++) {
    const artistId = artistIds[i];
    try {
      const data = await spotifyApi.getArtistTopTracks(artistId, 'US');
      // Retrieve the first 10 tracks from the artist's top tracks
      const tracks = data.body.tracks.slice(0, 10);
      // Create an array to hold the audio features for the tracks
      const features = [];
      // Loop through each track and get its audio features
      for (let j = 0; j < tracks.length; j++) {
        const trackId = tracks[j].id;
        const data = await spotifyApi.getAudioFeaturesForTrack(trackId);
        features.push(data.body);
      }
      // Save the audio features to the audioFeatures object using the artist ID as the key
      audioFeatures[artistId] = features;
    } catch (error) {
      console.error(`Error getting top tracks for artist ${artistId}:`, error);
    }
  }

  return audioFeatures;
}


async function calculateArtistSimilarity(artistIds) {
  try {
    // Create an array to hold the similarity scores
    const similarityScores = [];

    // Loop through the artist IDs and calculate the similarity between each pair of artists
    for (let i = 0; i < artistIds.length; i++) {
      for (let j = i + 1; j < artistIds.length; j++) {
        // Call the getArtistRelatedArtists method to get the related artists for each artist
        const relatedArtists1 = await spotifyApi.getArtistRelatedArtists(artistIds[i]);
        const relatedArtists2 = await spotifyApi.getArtistRelatedArtists(artistIds[j]);

        // Convert the related artists to arrays of artist IDs
        const relatedArtistIds1 = relatedArtists1.body.artists.map(artist => artist.id);
        const relatedArtistIds2 = relatedArtists2.body.artists.map(artist => artist.id);

        // Calculate the Jaccard similarity score between the two arrays of related artist IDs
        const intersection = relatedArtistIds1.filter(id => relatedArtistIds2.includes(id));
        const union = [...new Set([...relatedArtistIds1, ...relatedArtistIds2])];
        const similarity = intersection.length / union.length;

        // Add the similarity score to the array of similarity scores
        similarityScores.push({
          artist1: artistIds[i],
          artist2: artistIds[j],
          similarity: similarity
        });
      }
    }

    // Sort the similarity scores in descending order by similarity score
    similarityScores.sort((a, b) => b.similarity - a.similarity);

    // Return the similarity scores
    return similarityScores;
  } catch (error) {
    console.log(`Error calculating artist similarity: ${error}`);
  }
}

main();