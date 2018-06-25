import React, { Component, Fragment } from 'react';
import FocusBlock from '../FocusBlock/FocusBlock';
import BlockForm from '../BlockForm/BlockForm';
import ServiceContainer from '../../Containers/ServiceContainer';

class Dashboard extends Component {
	state = {
		user: {
			_id: '',
			name: '',
			url: '',
			focusBlocks: []
		},
		service: new ServiceContainer()
	};

	componentDidMount() {
		// Check for user //
		let userId = this.getUserId(window.location.pathname);
		if (userId) {
			this.state.service
				.getUser(userId)
				.then(result => {
					this.setState({ user: result });
					console.log('User dashboard set.');
				})
				.catch(error => {
					console.log(error);
				});
		} else {
			this.state.service
				.createUser()
				.then(result => {
					this.setState({ user: result });
					console.log('User created & dashboard set.');
				})
				.catch(error => {
					console.log(error);
				});
		}
	}

	//-- Helpers --//
	getUserId = path => {
		// Split path and check for id //
		let idSplit = path.split('/');
		return idSplit[1] !== '' ? idSplit[1] : null;
	};

	createBlock = focusBlock => {
		let currentBlocks = this.state.user.focusBlocks;
		currentBlocks.push(focusBlock);
		this.setState({ focusBlocks: currentBlocks });

		// Remove contact to not store in DB //
		let clonedBlocks = this.blockCloner(currentBlocks);

		// Update DB //
		this.state.service
			.updateUser(this.state.user._id, clonedBlocks)
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});
	};

	updateBlock = focusBlock => {
		// Search for FocusBlock by ID //
		let blockIndex = this.state.user.focusBlocks
			.map(block => {
				return block.id;
			})
			.indexOf(focusBlock.id);

		// Replace Block with updated one //
		let blocksCopy = this.state.user.focusBlocks;
		blocksCopy[blockIndex] = focusBlock;

		// Set state //
		this.setState({
			user: {
				focusBlocks: blocksCopy
			}
		});

		// Update db
		this.state.service
			.updateUser(this.state.user._id, blocksCopy)
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});
	};

	blockCloner = blocks => {
		let cloneArray = [];

		blocks.forEach(block => {
			let cloneBlock = {
				...block
			};

			// Remove contact //
			cloneBlock.contact = '';
			cloneArray.push(cloneBlock);
		});

		return cloneArray;
	};

	render() {
		let triggerObj = {
			create: this.createBlock,
			update: this.updateBlock
		};

		return (
			<Fragment>
				<h2>Don’t get stuck on a task! Create a FocusBlock now.</h2>
				{this.state.user.focusBlocks.length === 0 ? (
					<BlockForm triggers={triggerObj} />
				) : (
					<div className="blocks">
						{this.state.user.focusBlocks.map((block, i) => (
							<FocusBlock events={triggerObj} block={block} key={i} />
						))}
					</div>
				)}
				<div className="custom-url">
					<h3>
						Use this URL to come back to your saved FocusBlocks:{' '}
						<a target="_blank" href={this.state.user.url}>
							{this.state.user.url}
						</a>
					</h3>
				</div>
			</Fragment>
		);
	}
}

export default Dashboard;