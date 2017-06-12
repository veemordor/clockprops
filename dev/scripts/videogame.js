import React from 'react';
import ReactDOM from 'react-dom';
import Video from './video.js'
import films from './config';
import PickFilm from './pickfilm.js';


export default class Videogame extends React.Component {
	constructor() {
		super();
		this.state = {
			filmItems: '',
			filmTitle: '',
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e) {
		e.preventDefault();
			// console.log("submitted");
		const userFilmTitle = this.props.filmTitle;
			console.log("film title is...", userFilmTitle);
		// going into user and retrieving the id
		const userId = this.props.user.uid;
			console.log("you are user ID #", userId)
		const userRef = firebase.database().ref(`${userId}/${userFilmTitle}`);
		// //pushing up to firebase as object
		userRef.push(this.state.filmItems);
		//clearing the input field
		this.setState({
			filmItems: ''
		});

	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	render() {
		return (
			<div>
				<Video filmChoice={this.props.filmChoice}/>
				<section className="inputForm">
					<form onSubmit={this.handleSubmit} >
						<input 
						name="filmItems" 
						type="text" 
						placeholder="What Prop do you see?"
						className="rotateOutUpLeft"
						onChange={this.handleChange} 
						value={this.state.filmItems}  />
					</form>
				</section>
			</div>
		)
	}
}

