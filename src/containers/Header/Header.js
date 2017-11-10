/*HEADER COMPONENT WITH LOGIN AND REGISTER*/
/*HEADER COMPONENT WITH LOGIN AND REGISTER*/
/*HEADER COMPONENT WITH LOGIN AND REGISTER*/

import React, { Component } from 'react';
import { connect } from 'react-redux';

import logo from '../App/logo.svg';
import '../App/App.css';
import { loginUser, logoutUser } from '../../actions/users';

import LoginUser from '../Login';
import NewUser from '../Register';
import Logout from '../../components/Logout';

class Header extends Component {


  constructor(props) {
    super(props);

    this.state = {
      showLogin : false,
      showRegister : false
    };
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logoutUser();
    this.setState({
      showLogin: false
    })
  }

  showLogin() {
    if(this.state.showLogin === true){
      this.setState({
        showLogin: false
      })
    }else{
      this.setState({
      showRegister : false,
      showLogin : true
      });
    }
  }

  showRegister() {
    if(this.state.showRegister === true){
      this.setState({
        showRegister: false
      })
    }else{
      this.setState({
        showLogin : false,
        showRegister : true
      });
    }
  }

  handleXClick(event) {

  }

  render() {

    return (
      <div className="App-header">
        <div className="Login-reg">
          <ul>
            <li className="Login-reg-first"><a href="#">FAQ</a></li>
            <li><a href="#">Blog</a></li>

            {this.props.user.logged_in === false || localStorage.getItem('logged_in') === 'false' ?
            <div>
            <li><a href="#" onClick={this.showRegister.bind(this)}>Register</a></li>
            {this.state.showRegister === true ?
            <NewUser />
            : null}

            <li><a href="#" onClick={this.showLogin.bind(this)}>Login</a></li>
            {this.state.showLogin === true ?
            <LoginUser />
            : null}
            </div>
            : null}


            {this.props.user.logged_in === true || localStorage.getItem('logged_in') === 'true' ?
            <li><Logout handler={this.handleLogout.bind(this)}/> </li>
            : null }

          </ul>
        </div>


        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Consume More Stuff</h1>
      </div>
    );

  }

}


const mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: () => {
      dispatch(loginUser());
    },
    logoutUser: () => {
      dispatch(logoutUser());
    },
    loginUser: () => {
      dispatch(loginUser());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);


