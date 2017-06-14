import React from 'react';
import ReactDOM from 'react-dom';
import films from './config.js';
import PickFilm from './pickfilm.js';
import Videogame from './videogame.js';
import Instructions from './instructions.js';

//Sections/Components - Map
//1. Login (app.js - App Component)
//2. Home page 
	//2b. Instructions (instructions.js)
	//2c. Pick list of films (pickfilm.js)
//3. Video page (videogame.js)
	//3b. Video w/ player functions (video.js)
	//3c. Form with input to Firebase DB 
//4. List page (app.js - UserPickFilm Component)

//initialize Firebase
var config = {
    apiKey: "AIzaSyApJIP7dai3tvvHs1nzuSefEaw9K3Sh0BU",
    authDomain: "clockprops-e2216.firebaseapp.com",
    databaseURL: "https://clockprops-e2216.firebaseio.com",
    projectId: "clockprops-e2216",
    storageBucket: "clockprops-e2216.appspot.com",
    messagingSenderId: "284337646478"
  };
  firebase.initializeApp(config);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const userRef = firebase.database().ref('/');

//Header nav w/ 3 different views [Component with Objects]
class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			user: null,
			listFilmItems: [],
			filmChoice: '',
			showPicker:false,
		};
	}
	render() {
		const listButton = () => {
			if (this.props.showList && this.state.filmChoice.length === 0) {
				return <li><button className="disabledButton">See Video</button></li>
			} else if (this.props.showList) {
				return <li><button onClick={this.props.revealVideo}>See Video</button></li>
			}
			else {
				return <li><button onClick={this.props.revealList}>See List</button></li>
			} 
		}
		return (
			<nav>
				<ul className="headerMenu">
					<li><button onClick={this.props.logout}>Clock Out</button></li>
					<li><button onClick={this.props.revealPicker}>Pick Film</button></li>
					{listButton()}
				</ul>
			</nav>
		)
	}
}
//List by User
class UserPropList extends React.Component {
	constructor(){
		super();
	}
	render() {
		return (
			<div>
				<section className="userList">
					<h2>Clocked Props</h2>
					<div>
						{this.props.filmItemList.map((film) => {
							return (
								<div className="listContainer">
								<h3>{film.key}</h3>
								{film.descriptions.map((item, i) => {
									return (
										<ul className="propLists">
											<li key={i}>{item}</li>
										</ul>
									)})}
								</div>)
							})}
					</div>
				</section>
			</div>
		)
	}
}
//Main App
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			user: null,
			listFilmItems: [],
			filmChoice: '',
			showDescription:true,
			showPicker: false,
			showList: false,
			showVideo:false,
		};
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.chooseFilm = this.chooseFilm.bind(this);
		this.revealList = this.revealList.bind(this);
		this.revealVideo = this.revealVideo.bind(this);
		this.revealPicker = this.revealPicker.bind(this);
		this.revealVideo = this.revealVideo.bind(this);
	}
	login() {
		auth.signInWithPopup(provider)
		.then((result) => {
			const user = result.user;
			this.setState({
				user: user,
				loggedIn: true,
				showDescription: true,
			})
		})
	}
	logout() {
		auth.signOut()
		.then((result) => {
			this.setState({
				user: null,
				loggedIn: false,
				listFilmItems: [],
				filmChoice: '',
				showPicker: false,
				showList: false,
				showVideo:false,
			})
		})
	}
	handleSubmit(title){
		this.setState({
			filmTitle: title,
		})
	}
	revealPicker(){
		this.setState({
			showPicker:true,
			showList: false,
			showVideo:false,
			showDescription: false,
		})
	}
	revealList() {
		this.setState({
			showList: true,
			showPicker:false,
			showVideo:false,
			showDescription: false,
		});
	}
	revealVideo() {
		this.setState({
			showVideo:true,
			showList:false,
			showPicker:false,
			showDescription: false,
		});
	}
	chooseFilm(filmUrl){
		this.setState({
			filmChoice: filmUrl,
			showVideo:true,
			showPicker:false,
			showList:false,
			showDescription: false,
		});
	}
	componentDidMount() {
		//authorization
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					user: user,
					loggedIn: true,
				})
				//getting user ID 
				const userId = this.state.user.uid;
				const userRef = firebase.database().ref(userId);

				userRef.on("value", (snapshot) => {
					const dbFilmItems = snapshot.val();
					const newListFilmItems = [];

					for (let key in dbFilmItems) {
						let descriptions = [];
						for (let description in dbFilmItems[key]) {
							descriptions.push(dbFilmItems[key][description])
						}
						newListFilmItems.push({
							key: key,
							descriptions: descriptions,
						})
					}				
					this.setState({
						listFilmItems: newListFilmItems,
					});
				});
			} else {
				this.setState({
					user: null,
					loggedIn: false,
				});
			}
		});
	}
	render() {
		const showVideoInput = () => {
			if (this.state.loggedIn === true) {
				return(
					<main className="wrapper">
						<Header 
						logout={this.logout}
						revealList={this.revealList} 
						revealVideo={this.revealVideo} 
						revealPicker={this.revealPicker}
						showList={this.state.showList} />
						{
							this.state.showDescription ?
								<Instructions />
							:
								null
						}
						{
							this.state.showPicker ?
									<PickFilm 
									handleSubmit={this.handleSubmit}
									chooseFilm={this.chooseFilm}/>
								:
									null
						}
						{
							this.state.showVideo ?
								<Videogame
									filmTitle={this.state.filmTitle}
									filmChoice={this.state.filmChoice}
									user={this.state.user}
									submitHandler={this.handleSubmit}
									submitChange={this.handleChange}
								/>
							:
								null
						}
						{
							this.state.showList ?
								<UserPropList filmItemList={this.state.listFilmItems}/>
							:
								null
						}
					</main>
				)
			} else {
			{/* Landing page w/ Login */}
				return(
					<section className="loginPage">
						<h1>Clock Props</h1>
						<button className="loginButton" onClick={this.login}>Login</button>
					</section>
				)
			}
		} 
		return(
			<div>
				{showVideoInput()}
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
