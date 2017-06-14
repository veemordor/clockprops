import React from 'react';
import ReactDOM from 'react-dom';
import films, { filmUrls } from './config.js';

class PickFilm extends React.Component {
	constructor(){
		super();
		this.state = {
			filmChoice: films[0].url,
			filmTitle: films[0].title,
			showVideo: false,
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(e) {
		e.preventDefault();
		this.setState({
			filmTitle: e.target.value,
			filmChoice: filmUrls[e.target.value],
		});
	}
	handleSubmit(e) {
		e.preventDefault();
		this.props.chooseFilm(this.state.filmChoice);
		this.props.handleSubmit(this.state.filmTitle);
	}
	render(){
		return(
			<section className="pickFilm">
					<form className="pickList" onSubmit={this.handleSubmit}>
						<label>Pick Your Film</label>
						<select
							name="filmChoice"
							value={this.state.filmTite}
							onChange={this.handleChange}
						>
						{films.map(film => {
							return <option key={film.title} value={film.title}>{film.title}</option>
						})}
							
							
						</select>
						<input type="submit" value="Submit" />
					</form>
				</section>
		)
	}
}

export default PickFilm;