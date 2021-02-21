import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import { actLoginWithFacebook } from '../../actions';
import { actSyncCartToServer } from '../../actions/cartAction';
import style from './style.module.css';

class Facebook extends React.Component {
  state = {
    submitting: false
  }

  responseFacebook = response => {
    const fbUser = {
      userID: response.userID,
      name: response.name,
      email: response.email,
    };
    
    this.setState({ submitting: true });
    this.props.login(fbUser)
      .then(res => {
          const { user, cart, syncCartToServer } = this.props;
          syncCartToServer(user, cart);
          this.setState({ submitting: false });

          let url = '/';
          const { payment } = this.props.location;
          if (payment) {
              url = '/delivery-address';
          }
          this.props.history.push(url);
      })
      .catch(error => {
          console.error(error);
          this.setState({ submitting: false });
      });
  };

  render() {
    const { submitting } = this.state;
    return (
      <div disabled={submitting} className={style.disableBtn}>
        <FacebookLogin
          appId="228288261815624"
          autoLoad={false}
          fields="name,email,picture"
          callback={this.responseFacebook}
          cssClass={style.container}
          textButton="Đăng nhập bằng Facebook"
          icon="fa-facebook"
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      user: state.user,
      cart: state.cart.cart
  }
};

const mapDispatchToProps = dispatch => ({
  login: (username, password) =>
      dispatch(actLoginWithFacebook(username, password)),
  syncCartToServer: (user, cart) => dispatch(actSyncCartToServer(user, cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(Facebook);