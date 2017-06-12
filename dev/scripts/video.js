import React from 'react';
import ReactDOM from 'react-dom';
import films from './config.js'
import PickFilm from './pickfilm.js'

export default class Video extends React.Component {
	constructor(props) {
		super(props);
		this.handlePlay = this.handlePlay.bind(this);
	}

	handlePlay() {
		if (this.video.paused) {
			this.video.play();
		} else {
			this.video.pause();
		}
	}

	render() {
		return (
			<video 
			onClick={this.handlePlay} 
			src={this.props.filmChoice} 
			ref={(c) => this.video = c} 
			controls="true"
			preload="auto"
			loop="true"
			muted="true"
			/>
		)
	}
}


