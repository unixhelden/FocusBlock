import React, { Component } from 'react';
import './styles.css';

class AddBlockButton extends Component {
	constructor(props) {
		super(props);

		this.state = {
			didClick: false
		};
	}

	//-- Helpers -- //
	addBlock = () => {
		if (this.props.blockCount !== 0) {
			// Set didClick state //
			this.setState({
				didClick: true
			});

			// Trigger addBlock event //
			this.props.addBlockTrigger();

			// Set State back after animation //
			setTimeout(() => {
				this.setState({
					didClick: false
				});
			}, 100);
		}
	};

	addClasses = () => {
		let classString = 'action-add';
		if (this.props.blockCount === 0) {
			classString += ' disabled';
		}

		if (this.state.didClick && this.props.blockCount > 0) {
			classString += ' scale';
		}

		return classString;
	};

	render() {
		return (
			<img
				className={this.addClasses()}
				onClick={this.addBlock}
				//-- MAD PROPS Tendencydriven --//
				src={require('../../../Assets/cmjio-button@2x.png')}
				alt="Add Focus Block Button"
			/>
		);
	}
}

export default AddBlockButton;
