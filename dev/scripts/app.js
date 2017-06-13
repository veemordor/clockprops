import React from 'react';
import ReactDOM from 'react-dom';
import films from './config.js';
import PickFilm from './pickfilm.js';
import Videogame from './videogame.js';

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


class UserPropList extends React.Component {
	constructor(){
		super();
	}
	removeFilmItems(key) {
		const userId = firebase.auth().currentUser.uid;
		const itemRef = firebase.database().ref(`${userId}/${key}`)
		itemRef.remove();
	}
	render() {
		return (
			// const showUniqueList = () => {
			// 	if (films.id === 1) {

			// 	} else {

			// 	}
			// }
			<main>
				<section className="userList">
					<h2>Clocked Props</h2>
					<div>
						{this.props.filmItemList.map((film) => {
							return (
								<div>
								<h3>{film.key}</h3>
								{film.descriptions.map((item, i) => {
									return (
										<ul>
											<li key={i}>{item}</li>
										</ul>
									)})}
								</div>)
							})}
					</div>
				</section>
			</main>
		)
	}
}

class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			user: null,
			listFilmItems: [],
		};
		this.logout = this.logout.bind(this);
	}
	logout() {
		auth.signOut()
		.then((result) => {
			this.setState({
				user: null,
				loggedIn: false,
				listFilmItems: [],
				filmChoice: '',
			})
			console.log("you are logged out")
		})
	}
	render() {
		const listButton = () => {
			if(this.props.showList) {
				return <li><button onClick={this.props.revealVideo}>See Video</button></li>
			}
			else {
				return <li><button onClick={this.props.revealList}>See List</button></li>
			}
		}
		return (
			<nav>
				<ul className="headerMenu">
					<li><button onClick={this.logout}>Clock Out</button></li>
					<li><button>Pick Film</button></li>
					{listButton()}
				</ul>
			</nav>
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
			showList: false,
		};
		this.login = this.login.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.chooseFilm = this.chooseFilm.bind(this);
		this.revealList = this.revealList.bind(this);
		this.revealVideo = this.revealVideo.bind(this);
	}
	login() {
		auth.signInWithPopup(provider)
		.then((result) => {
			const user = result.user;
			this.setState({
				user: user,
				loggedIn: true,
			})
			console.log("you are logged in")
		})
	}
	handleSubmit(title){
		this.setState({
			filmTitle: title,
		})
	}
	// revealPickFilm(){
	// 	this.setState({
			
	// 	})
	// }
	revealList() {
		this.setState({
			showList: true,
		});
	}
	revealVideo() {
		this.setState({
			showList:false,
		})
	}
	chooseFilm(filmUrl){
		this.setState({
			filmChoice: filmUrl
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
					<div>
						<Header 
						revealList={this.revealList} 
						revealVideo={this.revealVideo} 
						showList={this.state.showList} />
						{
							this.state.filmChoice.length > 0 ?
									null
								:
									<PickFilm 
									handleSubmit={this.handleSubmit}
									chooseFilm={this.chooseFilm}/>
						}
						{
							this.state.filmChoice.length === 0 || this.state.showList  ?
								null
							:
								<Videogame
									filmTitle={this.state.filmTitle}
									filmChoice={this.state.filmChoice}
									user={this.state.user}
									submitHandler={this.handleSubmit}
									submitChange={this.handleChange}
								/>
						}
						{
							this.state.showList ?
								<UserPropList filmItemList={this.state.listFilmItems}/>
							:
								null
						}
					</div>
				)
			} else {
				return(
					<section className="loginPage">
						<h1>Clock Props</h1>
						<button onClick={this.login}>Login</button>
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
