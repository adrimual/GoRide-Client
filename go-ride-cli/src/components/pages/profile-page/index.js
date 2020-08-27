import React, {Component} from 'react';
import PersonProfile from "./personProfile";
import UserService from '../../../services/UserService';
import "./profile.css"
//Impor bootstrap
import Container from 'react-bootstrap/esm/Container';
import SpinnerContainer from "../../ui/Spinner"
class ProfilePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userDetails: undefined
        }
        this.UserService = new UserService()
    }
    componentDidMount = () => this.updateUserDetails(this.props.match.params.userId)
    updateUserDetails = id => {
        this.UserService
            .getUserDetails(id)
            .then((response) => this.setState({ userDetails: response.data }))
            .catch(err => err.response && this.props.handleToast(true, err.response.data.message)) 
    }
    getProfile = () => {
        if (this.state.userDetails) {
            return  <PersonProfile handleToast={this.props.handleToast} userDetails={this.state.userDetails} {...this.props} loggedInUser={this.props.loggedInUser} paramId={this.props.match.params.userId} />
        }
    }
    render() {
        const detailedProfile = this.getProfile()
        return (
            <>
                {!this.state.userDetails ? <SpinnerContainer/> :
                    <main className="main-bg">
                        <Container className="profile-container">
                            <h1 className="big-title">@{this.state.userDetails.username} profile </h1>
                           <div className="sub-profile-container">
                                <small className="subtitle">{this.state.userDetails.personDetails ? "Future-Rider" : "Rider"}</small>
                                <div className="image-container">
                                    <img className="profile-image" alt={this.state.userDetails.username} src={this.state.userDetails.avatar} />
                                </div>
                            </div>
                            {this.getProfile()}
                        </Container>
                </main>
                }
            </>
        )
    }
}
export default ProfilePage