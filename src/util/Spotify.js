const client_id = '24d94142aa494994bf5bb50e38e80187';
const redirect_uri = 'http://localhost:3000';
let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    //check expiration of the token
    this.tokenIsValid();
		if(accessToken) {
			return accessToken;
    } 
    else 
    if (!accessToken && localStorage.getItem('accessToken')) {
      accessToken = localStorage.getItem('accessToken');
    } 
    else 
    if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      this.parseToken();
		} else {
			let url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token
			&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
			window.location = url;
		}
  },

  //set the accessToken and the expiration of the token on local, that way we don't have to login each time with the refresh
  parseToken() { 
    accessToken = window.location.href.match(/access_token=([^&]*)/)[0].slice(13);
    expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].slice(11);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenExpiration', Date.now() + (expiresIn * 1000));
    window.history.pushState('Access Token', null, '/');
  },
  // if the token get to expiration the local elements are removed and the accessToken emptied
  tokenIsValid() {
    if (Date.now() > localStorage.getItem('tokenExpiration')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      accessToken = '';
    } 
  },

async search(term) {
  try {
    this.getAccessToken();
    let response = await fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }});
  if (response.ok) {
    let jsonResponse = await response.json();
    return jsonResponse.tracks.items.map(track => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        previewUrl: track.preview_url,
        duration: track.duration_ms,
        albumImg: track.album.images[0].url
      }
    })
  }
  throw new Error ('Request Failed!');
} catch(error) {
  console.log(error);
}
},

savePlaylist(playListName, trackURIsArray){
  if (playListName !== '' && playListName !== 'New Playlist' && trackURIsArray !== []){
    let accessToken = this.getAccessToken();
    let headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userId = '';
        return fetch('https://api.spotify.com/v1/me', {
          headers: headers}).then(response =>
          response.json()
      ).then(jsonResponse => {userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
              headers: headers,
              method: 'POST',
              body: JSON.stringify({name: playListName})}).then(response =>
                response.json()
              ).then(jsonResponse => {const playlistId = jsonResponse.id;
              return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIsArray})
                  });
              });
            });
      }
      return;
    }
  }

 


export default Spotify;
