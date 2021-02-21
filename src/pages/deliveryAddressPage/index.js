import React from 'react';
import * as msg from '../../constants';
import Title from '../../components/title';
import Orders from '../../components/orders';
import HomeSpinner from '../../components/homeSpinner';
import callAPI from '../../api/api';
import style from './style.module.css';
import { connect } from 'react-redux';
import { actSaveDeliveryAddress } from '../../actions/deliveryAddressAction';
import { Alert, Form, Button } from 'react-bootstrap';

class DeliveryAddressPage extends React.Component{
	state = {
		fullname: '',
		phoneNumber: '',
		districts: [],
		wards: [],
		selectedProvince: {},
		selectedDistrict: {},
		selectedWard: {},
		address: '',
		error: '',
		loading: false
	}

	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value, error: '' });
	}

	handleChangeProvice = async e => {
		const { value } = e.target;

		const selectedProvince = JSON.parse(value); // value is string
		let districts, wards = [];
		let selectedDistrict, selectedWard = {};

		try {
			if(Object.keys(selectedProvince).length) {
				const data = await this.handleGetDistrictsData(selectedProvince.id);
				districts = Array.isArray(data.districts) ? data.districts : [];
	
				if(districts.length) {
					selectedDistrict = districts[0];
					const data2 = await this.handleGetWardsData(selectedDistrict.id);
					wards = Array.isArray(data2.wards) ? data2.wards : [];
					selectedWard = wards.length ? wards[0] : {};
				}
			}
		}
		catch(err) {
			throw err;
		}

		this.setState({
			districts,
			wards,
			selectedProvince,
			selectedDistrict,
			selectedWard
		});
	}

	handleChangeDictrict = async e => {
		const { value } = e.target;
		const selectedDistrict = JSON.parse(value); // value is string
		let wards = [];
		let selectedWard = {};

		try {
			if(Object.keys(selectedDistrict).length) {
				const data = await this.handleGetWardsData(selectedDistrict.id);
				wards = Array.isArray(data.wards) ? data.wards : [];
				selectedWard = wards.length ? wards[0] : {};
			}
		}
		catch(err) {
			throw err;
		}

		this.setState({
			wards,
			selectedDistrict,
			selectedWard
		});
	}

	handleChangeWard = async e => {
		const { value } = e.target;
		const selectedWard = JSON.parse(value); // value is string

		this.setState({ selectedWard });
	}

	handleSubmit = e => {
		e.preventDefault();
		
		if(this.isFormValid()) {
			this.props.saveDeliveryAddress(this.state);
			this.props.history.push('/payment');
		}
	}

	isFormValid = () => {
		let valid = true;
		let error = '';
		if(this.isFormEmpty(this.state)) {
			valid = false;
			error = 'Thông tin không được để trống';
		}
		else if (!this.isPhoneNumberValid(this.state)) {
			valid = false;
			error = 'Số điện thoại không hợp lệ';
		}
		if(error.length) this.setState({ error });
		return valid;
	}

	isFormEmpty = ({ fullname, phoneNumber, address }) => {
		return !fullname.length || !phoneNumber.length || !address.length;
	}

	isPhoneNumberValid = ({ phoneNumber }) => {
		const regexp = /^\d{9,12}$/;
		const checkingResult = regexp.exec(phoneNumber);
		if (checkingResult !== null
			&& phoneNumber.length > 8
			&& phoneNumber.length < 13) {
			return true;
		}
		else {
			return false;
		}
	}

	handleGetDistrictsData = proviceId => {
		return new Promise((resolve, reject) => {
			callAPI(`delivery?provinceid=${proviceId}&districtid=null`, null, null)
				.then(res => {
					resolve(res.data);
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		})
	}

	handleGetWardsData = districtId => {
		return new Promise((resolve, reject) => {
			callAPI(`delivery?provinceid=null&districtid=${districtId}`, null, null)
				.then(res => {
					resolve(res.data);
				})
				.catch(err => {
					console.error(err);
					reject(err);
				});
		})
	}

	async componentDidMount() {
		const { deliveryAddress } = this.props;
		if(Object.keys(deliveryAddress).length) {
			this.setState({...deliveryAddress});
		}
		else {
			this.setState({ loading: true });
			const { fullName: name, phoneNumber: phone } = this.props.user.infor;
			const { provinces } = this.props;

			const defaultName = name && name.length ? name : '';
			const defaultPhone = phone && phone.length ? phone : '';
			const selectedProvince = provinces.length ? provinces[0] : {};
			let districts, wards = [];
			let selectedDistrict, selectedWard = {};

			try {
				if(Object.keys(selectedProvince).length) {
					const data = await this.handleGetDistrictsData(selectedProvince.id);
					districts = Array.isArray(data.districts) ? data.districts : [];
		
					if(districts.length) {
						selectedDistrict = districts[0];
						const data2 = await this.handleGetWardsData(selectedDistrict.id);
						wards = Array.isArray(data2.wards) ? data2.wards : [];
						selectedWard = wards.length ? wards[0] : {};
					}
				}
			}
			catch(err) {
				throw err;
			}

			this.setState({
				fullname: defaultName,
				phoneNumber: defaultPhone,
				districts,
				wards,
				selectedProvince,
				selectedDistrict,
				selectedWard,
				loading: false
			});
		}
	}

	render() {
		const loggedIn = this.props.user.infor.id === -1 ? false : true;
		const title = loggedIn ? msg.DELIVERY_ADDRESS : msg.YOU_HAVE_NOT_LOGGED_IN;
		const { fullname, phoneNumber, districts, wards, error, loading,
			selectedProvince, selectedDistrict, selectedWard, address,  } = this.state;
		const { cart, provinces } = this.props;

		return (
			<div>
				<Title title={title}/>
				{!loggedIn || !cart.length ? null
				 : loading ?  <HomeSpinner />
				 : <div className={style.container}>
					<div className={style.addressContainer}>
						<Alert variant='primary'>Xác nhận thông tin</Alert>
						<Form>
							<Form.Group>
								<Form.Label>Họ và tên</Form.Label>
								<Form.Control type="text" placeholder="vd: Nguyễn A"
									value={fullname} name='fullname' size="sm"
									onChange={this.handleChange}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>Số điện thoại</Form.Label>
								<Form.Control type="tel" placeholder="vd: 0909090909"
									value={phoneNumber} name='phoneNumber' size="sm"
									onChange={this.handleChange}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>Tỉnh / Thành phố</Form.Label>
								<Form.Control as="select" size="sm"
									name='selectedProvince'
									value={JSON.stringify(selectedProvince)}
									onChange={this.handleChangeProvice}
								>
									{this.onRenderProvinces(provinces)}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Quận / Huyện</Form.Label>
								<Form.Control as="select" size="sm"
									value={JSON.stringify(selectedDistrict)}
									name='selectedDistrict'
									onChange={this.handleChangeDictrict}
								>
									{this.onRenderDistricts(districts)}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Phường / Xã</Form.Label>
								<Form.Control as="select" size="sm"
									value={JSON.stringify(selectedWard)}
									name='selectedWard'
									onChange={this.handleChangeWard}
								>
									{this.onRenderWards(wards)}
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Địa chỉ</Form.Label>
								<Form.Control as="textarea" rows="2" size="sm"
									placeholder="vd: 32 Quang Trung" value={address}
									name='address' onChange={this.handleChange}/>
							</Form.Group>
							{
								error.length ? <Alert variant='danger'>{error}</Alert> : null
							}
							<Button variant="info" onClick={this.handleSubmit}>
								Giao đến địa chỉ này
							</Button>
						</Form>
					</div>
					<div className={style.infoContainer}>
						<Orders cart={cart}/>
					</div>
				   </div>
				}
			</div>
		);
	}

	onRenderProvinces = provinces => {
		let result = null;
		if(Array.isArray(provinces) && provinces.length) {
			result = provinces.map((province, i) =>
				<option key={i} value={JSON.stringify(province)}>{province.name}</option>
			)
		}
		return result;
	}

	onRenderDistricts = districts => {
		let result = null;
		if(Array.isArray(districts) && districts.length) {
			result = districts.map((district, i) =>
				<option key={i} value={JSON.stringify(district)}>{district.name}</option>
			)
		}
		return result;
	}

	onRenderWards = wards => {
		let result = null;
		if(Array.isArray(wards) && wards.length) {
			result = wards.map((ward, i) =>
				<option key={i} value={JSON.stringify(ward)}>{ward.name}</option>
			)
		}
		return result;
	}
};

const mapStateToProps = state => ({
	user: state.user,
	cart: state.cart.cart,
	provinces: state.app.provinces,
	deliveryAddress: state.deliveryAddress
});

const mapDispatchToProps = dispatch => ({
	saveDeliveryAddress: (obj) => dispatch(actSaveDeliveryAddress(obj))
})

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryAddressPage);