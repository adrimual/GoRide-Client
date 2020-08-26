import React, {Component} from 'react'
import Container from 'react-bootstrap/Container'
import Calendar from "./calendar"
import EventService from "../../../services/EventService"

class CalendarPage extends Component {
    constructor (props){
        super (props)
        this.state = {
            events: []
        }
        this.eventService = new EventService()
    }
    componentDidMount = () => this.updateEvents()
    updateEvents = () => this.getAllUserEvents(this.props.match.params.userId);
    getAllUserEvents = id => {
        this.eventService.getAllEventsUser(id)
            .then(response => {
                this.setState({ events: response.data })
            })
            .catch(err => err.response && this.props.handleToast(true, err.response.data.message))
    }
    render() {
        return (
            <>
                { this.state.events.length > 0 &&
                    <Container as="main">
                        <Calendar events={this.state.events} handleToast={this.props.handleToast} updateEvents={this.updateEvents} {...this.props}/>
                    </Container>
                }
            </> 
        )
    }
}

export default CalendarPage 