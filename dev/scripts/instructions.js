import React from 'react';
import ReactDOM from 'react-dom';

export default class Instructions extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<section className="description">
				<h2>About Clock Props</h2>
				<p>Props (or theatrical properties) are an essential part of storytelling on screen. Good props are hidden in plain sight, subservient to, or, supporting of action – conveying narrative and symbolic meaning for the characters who wield them: a pack of smokes, a can of coke, a baseball bat, a cell phone, a gun. While bad props destroy the illusion of cinematic realism (think Bradley Cooper’s fake baby in American Sniper) sometimes a prop is so bad it is good.</p>
				<p>Clock Props is a way to log these items as you watch a film. Choose a film from the list. As you watch enter props as they appear on screen. Afterwards, refer to your list and compare it with a friend's. What did you both clock? Discuss.</p>
			</section>
			
			)
	}
}