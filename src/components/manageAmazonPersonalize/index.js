import React from 'react';
import Title from '../title';
import { Button } from 'react-bootstrap';
import callAPI from '../../api/api';
import { Spinner } from 'react-bootstrap';

class ManageAmazonePersonalize extends React.Component {
	state = {
		status: '',
		timeUpdate: null,
		loading: false
	}

	ACTIVE = 'ACTIVE'
	UNACTIVE = 'UNACTIVE'

	activeAmazonePersonalize = () => {
		return new Promise((resolve, reject) => {
			callAPI('admin/aws', 'PUT', null)
				.then(res => resolve(res))
				.catch(err => reject(err));
		})
	}

	handleActiveAmazonePersonalize = async () => {
		this.setState({ loading: true });
		try {
			const data = await this.activeAmazonePersonalize();
			if(data) {
				const { data : data2 } = data;
				console.log(data, data2);
				this.setState({
					timeUpdate: data2.timeUpdate,
					status: data2.status,
					loading: false
				});
			}
		}
		catch(error) {
			console.error(error);
			this.setState({ loading: false });
		}
	}

	// async componentDidMount() {
	// 	this.setState({ loading: true });
	// 	try {
	// 		const data = await this.activeAmazonePersonalize();
	// 		if(data) {
	// 			console.log(data);
	// 			this.setState({
	// 				timeUpdate: data.timeUpdate,
	// 				status: data.status,
	// 				loading: false
	// 			});
	// 		}
	// 	}
	// 	catch(error) {
	// 		console.error(error);
	// 		this.setState({ loading: false });
	// 	}
	// }

	render() {
		const { loading, status } = this.state;
		const content = status === this.UNACTIVE ? 'Đang training...' : 'Bắt đầu training data';
		return (
			<div>
				<Title title="Personalize" />
				<div style={{
					display: 'flex',
					alignItems: 'center',
					margin: '50px 0'
				}}>
					{
						loading ? <Spinner animation="border" variant="primary" style={{ marginRight: '30px' }}/>
						: null
					}
					{content}
				</div>
				<Button
					onClick={this.handleActiveAmazonePersonalize}
					disabled={loading ? 'disabled' : ''}
				>
					Training data
				</Button>
			</div>
		);
	}
};

export default ManageAmazonePersonalize;