import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import routes from './routes';
import RouteWithSubRoutes from './components/routeWithSubRoutes';
import Menu from './components/menu';
import { connect } from 'react-redux'
import { actFetchDataRequest } from './actions/appAction';
import HomeSpinner from './components/homeSpinner';

class App extends React.Component {
  state = {
    isLoading: false,
    error: ''
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({ isLoading: true });
    this.props.fetchData(user.infor.id)
      .then(res => this.setState({ isLoading: false, error: '' }))
      .catch(err => {
        console.error(err);
        this.setState({ isLoading: false, error: 'Some errors have occurred' });
      });
  }

  render () {
    const { isLoading } = this.state;
    return (
      <Router>
        {
          isLoading ? <HomeSpinner /> :
          <Router>
            <Menu />
            {this.onRenderPages(routes)}
          </Router>
        }
      </Router>
    );
  }

  onRenderPages = routes => {
    let pages = null;
    if(routes) {
      pages = routes.map((route, index) => 
        <RouteWithSubRoutes key={index} {...route}/>
      );
    }  
    return <Switch>{pages}</Switch>;
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchData: id => dispatch(actFetchDataRequest(id))
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
