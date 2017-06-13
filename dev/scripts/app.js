import React from 'react';
import ReactDOM from 'react-dom';
import films from './config.js';
import PickFilm from './pickfilm.js';
import Videogame from './videogame.js';
import Instructions from './instructions.js';

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

//Sections/Components
//1. Landing page
	//1a. Login 
		//i. set up authentication in firebase
		//ii. create login button in App
		//iii. link user auth with login button
//2. Home page
	//2a. Header v.1
	//2b. Instructions
	//2c. Pick list of films
//3. Video page
	//3a. Header v.2
	//3b. Video w/ player functions
	//3c. Form with input to Firebase DB - DONE
//4. List view
	//4a. Header v.3
	//4b. List by User [route to film] - DONE
	//4c. List by Film [route to user]

	//right now every1 only has one list
	//in fb, the whole app is an object; key that is userid; add film as sepa
	/*
		userId {
			name: 'Garrett'
			email: 'garrett@garrett.garrett'
			movieId1: ['pencil', 'eraser', 'twizzler'],
			movieId2: ['guns']
		}
	*/ 

//Header nav w/ 3 different views [Component with Objects]
	// v.1 "Clock Out"
	// v.2 "Clock Out" | "🏠" | "List"
	// v.3 "Clock Out" | "🏠" | "Video"

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
			console.log("you are logged in")
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
			console.log("you are logged out")
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
						console.log('key', key);
						console.log('film items', dbFilmItems[key]);
						let descriptions = [];
						for (let description in dbFilmItems[key]) {
							descriptions.push(dbFilmItems[key][description])
						}
						newListFilmItems.push({
							key: key,
							descriptions: descriptions,
						})
					}
					console.log(newListFilmItems)
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
