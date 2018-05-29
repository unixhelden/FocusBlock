import React, { Component } from 'react';
import Email from '../../Containers/SmtpContainer';

// Styles //
import './styles.css';

class TimeBlock extends Component {
	state = {
		id: this.uuid(),
		title: '',
		timer: 0,
		customTimer: 0,
		friendlyTimer: '',
		contact: '',
		contactShown: false,
		blockStarted: false,
		timerRef: null
	};

	constructor(props) {
		super(props);

		// Timer logic //
		let friendlyTimer = this.getFriendlyTime(this.props.block);

		this.state = {
			title: this.props.block.title,
			timer: this.props.block.timer,
			// MAD PROPS DigitalData (found the un-findable bug) //
			customTimer: this.props.block.customTimer,
			friendlyTimer: friendlyTimer,
			contact: this.props.block.contact,
			contactShown: false
		};
	}

	//-- Helpers --//
	getFriendlyTime = block => {
		let friendlyTimer = '';
		let timerVal;

		if (block.timer === 'custom') {
			timerVal = block.customTimer;
		} else {
			timerVal = block.timer;
		}

		if (timerVal < 60) {
			friendlyTimer = `${timerVal}m`;
		} else {
			friendlyTimer = `${timerVal / 60}h`;
		}

		return friendlyTimer;
	};

	// MAD PROPS: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523 //
	uuid() {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(
				c ^
				(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
			).toString(16)
		);
	}

	startBlock = () => {
		this.setState({
			blockStarted: !this.state.blockStarted
		});

		// Start timer //
		this.toggleTimer();
	};

	sendEmail = () => {
		// Send out email //
		let mailer = new Email();
		let sender = 'support@pixelogocapps.com';
		let subject = 'Requesting Help!';
		//TODO: Figure out how to get username/name/title/etx
		let body = `FooBar is requesting your help with ${this.state.title}!`;
		let server = 'smtp.sendgrid.net';

		mailer.send(
			sender,
			this.state.contact,
			subject,
			body,
			server,
			process.env.REACT_APP_SMTP_USERNAME,
			process.env.REACT_APP_SMTP_PW
		);
	};

	toggleTimer = () => {
		if (this.state.blockStarted) {
			clearInterval(this.state.timerRef);
		} else {
			// Grab the current block minutes //
			let timerVal;

			if (this.state.timer === 'custom') {
				timerVal = this.state.customTimer;
			} else {
				timerVal = this.state.timer;
			}

			let blockTime = timerVal * 60,
				minutes,
				seconds;

			// Setup a timer on comp to count down //
			this.setState({
				timerRef: setInterval(() => {
					// MAD PROPS https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer //
					minutes = parseInt(blockTime / 60, 10);
					seconds = parseInt(blockTime % 60, 10);
					let friendlyTimer = '';

					minutes = minutes < 10 ? '0' + minutes : minutes;
					seconds = seconds < 10 ? '0' + seconds : seconds;
					friendlyTimer = minutes + ':' + seconds;

					this.setState({
						friendlyTimer: friendlyTimer
					});

					if (--blockTime < 0) {
						this.setState({
							friendlyTimer: 'Times up!'
						});

						this.sendEmail();
						clearInterval(this.state.timerRef);
					}
				}, 1000)
			});
		}
	};

	showHideContact = () => {
		// Check to see if contact is shown //
		this.setState({
			contactShown: !this.state.contactShown
		});
	};

	render() {
		return (
			<div className="block">
				<div className="content">
					<div className="block-title">{this.state.title}</div>
					<div className="block-time">{this.state.friendlyTimer}</div>
					<div className="block-contact" onClick={this.showHideContact}>
						{this.state.contactShown ? (
							<span>{this.state.contact}</span>
						) : (
							<span>Click to show contact.</span>
						)}
					</div>
					<div className="focus-button">
						<button className="block-start" onClick={this.startBlock}>
							{this.state.blockStarted ? (
								<span>Stop Focusing</span>
							) : (
								<span>Get Focused</span>
							)}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default TimeBlock;
