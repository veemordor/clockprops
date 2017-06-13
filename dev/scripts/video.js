import React from 'react';
import ReactDOM from 'react-dom';
import films from './config.js'
import PickFilm from './pickfilm.js'

export default class Video extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<section className="videoPlayer">
				<video 
				onClick={this.handlePlay} 
				src={this.props.filmChoice} 
				ref={(c) => this.video = c} 
				controls="true"
				preload="auto"
				loop="true"
				muted="true">This video is not supported in your browswer</video>
			</section>
		)
	}
}


