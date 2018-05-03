import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify'


class App extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        searchResults: [],
        playlistTracks: [],
        playlistName: 'New Playlist'
  };

  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this);
  this.search = this.search.bind(this);
}


// add track if the track is not already in the playlist tracks
addTrack(track) {
  let tracks = this.state.playlistTracks;
  let results = this.state.searchResults;
  if (tracks.find(savedTrack => savedTrack.id === track.id)) {
    return;
  }
  tracks.push(track);
  this.setState({playlistTracks: tracks});

  //Remove the track from the search results when added in the playlist tracks
  for(var i = results.length-1; i--;){
    if (results[i].id === track.id){
      results.splice(i, 1);
      } 
  }

 }

 


//remove track by using filter() to be true
removeTrack(track){
  let tracks = this.state.playlistTracks;
  tracks = tracks.filter(preferedSong => preferedSong.id !==track.id);
  this.setState({
      playlistTracks: tracks});
  }

// search if the term parameter 'exists', then get the access Token and search the tracks
search(term){
  if (term.length > 0) {
    Spotify.search(term).then(
      searchTracks => (this.setState(
        {
          searchResults: searchTracks
        }
    ))
  )
}
}

//Set the new state of PlaylistName
updatePlaylistName(name){
  this.setState({
    playlistName : name
  })
}

//save the playlist to your account by sending the trackURIsArray
savePlaylist(){
  let playlistName = this.state.playlistName;
  let tracks = this.state.playlistTracks;
  const trackURIsArray = tracks.map(track => track.uri);
  Spotify.savePlaylist(playlistName, trackURIsArray);
     this.setState({
      playlistName: 'New Playlist',
      playlistTracks : []
    })
}



render() {
    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar 
        onSearch={this.search}
        loggedIn={this.state.loggedIn}
        />
        <div className="App-playlist">
          <SearchResults 
          SearchResults={this.state.searchResults}
          onAdd={this.addTrack}
          />
          
          <Playlist 
          playlistName={this.state.playlistName} 
          playlistTracks={this.state.playlistTracks}
          onRemove={this.removeTrack}
          onNameChange={this.updatePlaylistName}
          onSave={this.savePlaylist}
          />
          
        </div>
      </div>
    </div>
    );
  }
}

export default App;
