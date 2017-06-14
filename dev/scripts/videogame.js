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
		const userFilmTitle = this.props.filmTitle;
		// going into user and retrieving the id
		const userId = this.props.user.uid;
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
			<section className="videoGame">
				<Video filmChoice={this.props.filmChoice}/>
				<section className="inputForm">
					<form onSubmit={this.handleSubmit} >
						<input 
						className="animated pulse"
						name="filmItems" 
						type="text" 
						placeholder="Type what props you see"
						onChange={this.handleChange} 
						value={this.state.filmItems}  />
					</form>
				</section>
			</section>
		)
	}
}

