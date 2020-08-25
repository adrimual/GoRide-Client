import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from "../services/AuthService";
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthForm from "./auth-form";
import NavBar from "./ui/NavBar";
import ProfilePage from "./profile";
import PersonEdit from "./profile/personProfile/person-form";
import EventForm from './event/form'
import EventList from './event/list'
import EventDetails from './event/details';
// import Calendar from "./profile-calendar/calendar";

class App extends Component {
    constructor() {
        super()
        this.state = {
            loggedInUser: null,
        }
        this.AuthService = new AuthService()
    }
    setTheUser = user => {
        this.setState({ loggedInUser: user }, () => this.state)
    }
  isUserAllowed = (currentUserId, userAllowedId) => {
    console.log({ userAllowedId } )
    return currentUserId === userAllowedId
  }
    fetchUser = () => {
        this.AuthService
            .isLoggedIn()
            .then(response => {
                this.state.loggedInUser === null && this.setState({ loggedInUser: response.data })
            })
            .catch(err => console.log({err}))
    }
    render() {
        this.fetchUser()
        return (
            <>
                <NavBar loggedInUser={this.state.loggedInUser} setTheUser={this.setTheUser} />
                <Switch>
                    <Route path="/signup" render={props => <AuthForm setTheUser={this.setTheUser} {...props} />}></Route>
                    <Route path="/login" render={props => <AuthForm setTheUser={this.setTheUser} {...props} />}></Route>
                    <Route exact path="/user/:id/event/create" render={props => this.state.loggedInUser && this.isUserAllowed(this.state.loggedInUser._id, props.match.params.id)? <EventForm loggedInUser={this.state.loggedInUser} {...props} personDetails={this.state.loggedInUser.personDetails} /> : <Redirect to='/login' />} />
                    <Route exact path="/user/:id/event/edit/:eventId" render={props => this.state.loggedInUser ? <EventForm loggedInUser={this.state.loggedInUser} {...props} personDetails={this.state.loggedInUser.personDetails} /> : <Redirect to='/login' />} />
                    <Route exact path="/events" render={props => <EventList loggedInUser={this.state.loggedInUser} {...props} />} />
                    <Route exact path="/events/:eventId"  render={props => <EventDetails loggedInUser={this.state.loggedInUser} {...props}  />} />
                    <Route path="/profile/edit/:userId" render={props => this.state.loggedInUser && this.isUserAllowed(this.state.loggedInUser._id, props.match.params.userId) ? <PersonEdit setTheUser={this.setTheUser} loggedInUser={this.state.loggedInUser} {...props} /> : <Redirect to='/login' />}></Route>
                    {/*<Route path="/profile/:userId/calendar" render={props => <Calendar loggedInUser={this.state.loggedInUser} {...props} /> } />*/}
                    <Route path="/profile/:userId" render={props => this.state.loggedInUser ? <ProfilePage loggedInUser={this.state.loggedInUser} {...props} /> : <h1>{this.state.loggedInUser}</h1>} />
                </Switch>

            </>
        )
    }
}
export default App;