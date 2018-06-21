import React, { Component } from 'react';
import './styles.css';

class BlockForm extends Component {
	//-- Helpers --//
	// MAD PROPS: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523 //
	uuid() {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(
				c ^
				(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
			).toString(16)
		);
	}

	state = {
		focusBlock: {
			id: '',
			title: '',
			timer: 15,
			customTimer: 15,
			friendlyTimer: '',
			contact: '',
			contactShown: false,
			blockStarted: false,
			timerRef: null,
			currentProgress: '',
			isEdit: false,
			inputErrors: { contact: 'valid' },
			triggers: {}
		},
		formErrors: { title: '', timer: 'valid', contact: '' },
		formValid: false
	};

	componentDidMount() {
		if (this.props.isEdit) {
			this.setState({
				focusBlock: {
					//-- MAD PROPS kipvanderzee --//
					...this.props.focusBlock.state
				},
				formErrors: { title: 'valid', timer: 'valid', contact: 'valid' },
				formValid: true
			});

			// this.setTimeSelect(this.state.focusBlock.timer);
		} else {
			// Creates a new focusBlock //
			let blockClone = this.state.focusBlock;
			blockClone.id = this.uuid();
			blockClone.triggers = this.props.triggers;
			this.setState({ focusBlock: blockClone });
		}
	}

	handleChange = event => {
		this.validateField(event);
		let blockClone = { ...this.state.focusBlock };
		blockClone[event.target.name] = event.target.value;

		this.setState({
			focusBlock: blockClone
		});
	};

	blockEvent = event => {
		if (this.props.isEdit) {
			console.log('Updating block...');
			this.state.focusBlock.triggers.update(this.state.focusBlock);

			let blockClone = this.state.focusBlock;
			blockClone.isEdit = false;
			this.props.focusBlock.setState({
				...blockClone
			});
		} else {
			console.log('Creating block...');
			this.state.focusBlock.triggers.create(this.state.focusBlock);
		}

		event.preventDefault();

		/* let form = document.getElementById('blockForm');

		// Add event listener //
		form.addEventListener('transitionend', event => {
			form.style.display = 'none';
		});

		// Set transition //
		Object.assign(form.style, {
			transform: 'translateX(-150%)',
			transition: 'all 2s'
		}); */
	};
	//-- Helpers --//
	validateField = event => {
		let titleValid = this.state.formErrors.title;
		let timerValid = this.state.formErrors.timer;
		let contactValid = this.state.formErrors.contact;

		switch (event.target.name) {
			case 'title':
				let titleLen = event.target.value.length;
				titleValid = titleLen > 0 ? 'valid' : 'Title cannot be empty';
				break;
			case 'timer':
				if (event.target.value === 'custom') {
					timerValid = 'valid';
				} else {
					let timerLen = event.target.value.length;
					timerValid = timerLen > 0 ? 'valid' : 'Please select a time';
				}

				break;
			case 'contact':
				let validContact = event.target.value.match(
					/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
				);

				contactValid = validContact
					? 'valid'
					: 'This is not an email, please try again.';
				break;
			default:
				break;
		}

		this.formValid(titleValid, timerValid, contactValid);
	};

	formValid = (title, timer, contact) => {
		let isFormValid = false;
		if (title === 'valid' && timer === 'valid' && contact === 'valid') {
			isFormValid = true;
		}

		this.setState({
			formErrors: {
				title: title,
				timer: timer,
				contact: contact
			},
			formValid: isFormValid
		});
	};

	// TODO: Fix this up with refs, the proper way //
	/* setTimeSelect = currentTimeVal => {
		// Create array of options to loop through //
		let selectOptions = document.getElementById('timer').options;

		console.log(selectOptions);

		// Check for the value in the array //
		for (let i in selectOptions) {
			if (currentTimeVal === parseInt(selectOptions[i].value, 10)) {
				console.log(selectOptions[i].value);
			}
		}

		// If not in the array, set to custom //
	}; */

	render() {
		return (
			<form id="blockForm" onSubmit={this.blockEvent}>
				<label>What are you focusing on?</label>
				<input
					name="title"
					placeholder="Title"
					type="text"
					value={this.state.focusBlock.title}
					onChange={this.handleChange}
				/>
				{this.state.formErrors.title !== 'valid' ? (
					<div className="error-label">{this.state.formErrors.title}</div>
				) : (
					''
				)}
				<label>How long do you need to focus?</label>
				<select
					id="timer"
					name="timer"
					// ref={ref => (this.timerNode = ref)}
					onChange={this.handleChange}
				>
					<option value="15">15m</option>
					<option value="30">30m</option>
					<option value="45">45m</option>
					<option value="60">1h</option>
					<option value="custom">Custom</option>
				</select>
				{this.state.focusBlock.timer === 'custom' ? (
					<input
						name="customTimer"
						placeholder="Time in mins"
						type="number"
						value={this.state.focusBlock.customTimer}
						onChange={this.handleChange}
					/>
				) : (
					''
				)}
				{this.state.formErrors.timer !== 'valid' ? (
					<div className="error-label">{this.state.formErrors.timer}</div>
				) : (
					''
				)}
				<label>Who should be contacted when time is up?</label>
				<input
					name="contact"
					placeholder="Email"
					type="text"
					value={this.state.focusBlock.contact}
					onChange={this.handleChange}
				/>
				{this.state.formErrors.contact !== 'valid' ? (
					<div className="error-label">{this.state.formErrors.contact}</div>
				) : (
					''
				)}
				<button disabled={!this.state.formValid} type="submit">
					{this.props.isEdit ? 'Update' : 'Create'}
				</button>
			</form>
		);
	}
}

export default BlockForm;