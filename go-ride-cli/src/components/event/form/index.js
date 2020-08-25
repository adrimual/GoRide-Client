import React, {Component} from 'react'
import { Link } from 'react-router-dom'

import EventService from '../../../services/EventService'

//Bootstrap
import {Container, Form, Button} from 'react-bootstrap/'

class EventForm extends Component {
    constructor (props){
        super (props)
        this.state = {
            owner: this.props.loggedInUser._id,
            name: '',
            description: '',
            date: "",
            city: "",
            participants: [this.props.loggedInUser._id],
            previousLoggedUser: undefined,
            startTime: "",
            endTime: ""
        }
        this.eventService = new EventService()
    }
    componentDidMount = () => {
        const id = this.props.match.params.eventId
        if (id) {
            this.eventService
                .getOneEvent(id)
                .then(response => this.updateEventState(response.data))
                .catch(err => console.log(err))
        }
    }
    formatDate = date => {
        const newDate = new Date(date);
        const hh = String(newDate.getHours()).padStart(2, '0');
        const min = String(newDate.getMinutes()).padStart(2, '0');
        let dd = String(newDate.getDate()).padStart(2, '0');
        let mm = String(newDate.getMonth() + 1).padStart(2, '0');
        let yyyy = newDate.getFullYear();
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`
    }
    updateEventState = data => {
        this.setState({
            name: data.name || "",
            description: data.description || "",
            startTime: this.formatDate(data.startTime) || "",
            endTime: this.formatDate(data.endTime) || "",
            city: data.city || "",
        })
    }
    enterUsernameStateValue = user => this.setState({ username: user.username })

    handleInputChange = event => event.target.type !== "checkbox" ? this.setState({ [event.target.name]: event.target.value })
        : this.handleCheckbox(event.target)

    handleCheckbox = (target) => {
        const stateToChange = [...this.state[target.name]]
        const index = stateToChange.indexOf(target.value)
        index === -1 ? stateToChange.push(target.value) : stateToChange.splice(index, 1)
        this.setState({ [target.name]: stateToChange })
    }
    handleFormSubmit = event => {
           event.preventDefault()
           const id = this.props.match.params.eventId
           this.props.location.pathname.includes("edit") ? this.editEvent(id, this.state) : this.createEvent()
       }
        setErrorMessage = errorMsg => this.setState({ errorMsg })
       createEvent = () => {
           this.eventService
               .createEvent(this.state)
                .then(() => {
                    this.props.handleModal ? this.props.handleModal() :
                    this.props.history.push(`/profile/${this.props.loggedInUser._id}`)
                })
               .catch(err => this.setErrorMessage(err.response.data.message))
       }
       editEvent = (id, newEvent) => {
           this.eventService
                .editEvent(id, newEvent)
                    .then(response => {
                        this.updateEventState(response.data)
                        this.props.history.push(`/profile/${this.props.loggedInUser._id}`)
                    })
                    .catch(err => console.log(err))
       }
    render () {
        return (
            <>
                {this.state.name == undefined ? <h2>Loading</h2> :
                    <Container as='main'>
                        <Form onSubmit={this.handleFormSubmit}>
                            {this.props.location.pathname.includes("edit") ? <h1>Edit Event</h1> :<h1>Create Event</h1>}
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control onChange={this.handleInputChange} value={this.state.name} name="name" type="text" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control onChange={this.handleInputChange} value={this.state.description} name="description" type="textarea" />
                                <Form.Text className="text-muted">No more than 500 characters</Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start time</Form.Label>
                                <Form.Control onChange={this.handleInputChange} type="datetime-local" name="startTime" value={this.state.startTime} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>End time</Form.Label>
                                <Form.Control onChange={this.handleInputChange} type="datetime-local" name="endTime" value={this.state.endTime} min={this.state.startTime} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>City</Form.Label>
                                <Form.Control onChange={this.handleInputChange} value={this.state.city} name="city" type="text" />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label><h2>Type of local</h2></Form.Label>
                                <Form.Group>
                                    <label>Restaurant</label>
                                    <input onChange={this.handleInputChange} checked={this.state.typeOfLocal === "restaurant"} value="restaurant" name="typeOfLocal" type="radio" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Gym</Form.Label>
                                    <input onChange={this.handleInputChange} checked={this.state.typeOfLocal === "gym"} value="gym" name="typeOfLocal" type="radio" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Hotel</Form.Label>
                                    <input onChange={this.handleInputChange} checked={this.state.typeOfLocal === "hotel"} value="hotel" name="typeOfLocal" type="radio" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Other</Form.Label>
                                    <input onChange={this.handleInputChange} checked={this.state.typeOfLocal === "other"} value="other" name="typeOfLocal" type="radio" />
                                </Form.Group>
                            </Form.Group>
                            {this.state.errorMsg && <p className="errorMsg">{this.state.errorMsg}</p>}
                            <Button variant="dark" type="submit">Submit</Button>
                        </Form>
                    </Container>
                }
            </>
        )
    }
}

export default EventForm