import React from 'react';
import './Track.css';

class Track extends React.Component {
    constructor(props){
        super(props);

        this.addTrack=this.addTrack.bind(this);
        this.removeTrack=this.removeTrack.bind(this);
    }
    
    addTrack() {
        this.props.onAdd(this.props.track)
    }

    removeTrack()
    {
    this.props.onRemove(this.props.track);
    }

    renderAction(){
        if (this.props.isRemoval) {
        return  (<a className="Track-action" onClick={this.removeTrack}>-</a>);
        } 
        return  (<a className="Track-action" onClick={this.addTrack}>+</a>);    
    }
    
    //if the preview is available set an audio tag
    isPreviewAvailable(){
        if(this.props.track.previewUrl === null){
            return (<p>No preview available</p>);
        }
        return (<audio controls><source src={`${this.props.track.previewUrl}`} type="audio/mpeg"></source></audio>)
    }

    render() {
        return(
            <div className="Track">
                <div className="album-img"> 
                    <img src={`${this.props.track.albumImg}`} alt="album-img"/>
                </div>
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{`${this.props.track.artist} | ${this.props.track.album}`}</p>
                </div>

                <div className="AudioDisplayer">
                    {this.isPreviewAvailable()}
                </div>
            {this.renderAction()}
        </div>
        )
    }
}

export default Track;