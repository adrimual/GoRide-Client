import React, { Component } from 'react'
import "./main-page-event.css"
import EventService from '../../../services/EventService'
import {Container, Row, Col} from 'react-bootstrap'
import EventList from "./event-list/"
import Map from './map';
import SpinnerContainer from "../../ui/Spinner"
import "./main-page-event.css"
import SearchBar from "./event-searchbar"
class EventPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: undefined,
            currentLatLng: {
                lat: undefined,
                lng: undefined
            },
            filteredEvents: undefined
        }
        this.myRef = React.createRef()
        this.eventService = new EventService()
    }

    componentDidMount = () => {
        window.scrollTo(0, 0)
        this.updateEventList()
        this.getGeoLocation()
    }
    filterEvents = filters => {
        console.log(filters)
        let eventsCopy = [...this.state.events]
        eventsCopy = filters.name ? eventsCopy.filter(event => event.name.toLowerCase().includes(filters.name.toLowerCase())) : eventsCopy
        eventsCopy = filters.minParticipants ? eventsCopy.filter(event => event.participants.length >= filters.minParticipants) : eventsCopy
        eventsCopy = filters.maxParticipants ? eventsCopy.filter(event => event.participants.length <= filters.maxParticipants) : eventsCopy
        eventsCopy = filters.owner ? eventsCopy.filter(event => event.owner.username.toLowerCase().includes(filters.owner.toLowerCase())) : eventsCopy
        eventsCopy = filters.minDay && filters.maxDay ? eventsCopy.filter(event =>
            this.obtainDateInFormat(event.startTime) >= this.obtainDateInFormat(filters.minDay) &&
            this.obtainDateInFormat(event.startTime) <= this.obtainDateInFormat(filters.maxDay)
        ) : eventsCopy
        eventsCopy = filters.distanceFromLocation && filters.distanceFromLocation !== "allDistance" ? eventsCopy.filter(event => this.getKilometers(
            this.state.currentLatLng.lat,
            this.state.currentLatLng.lng,
        ) <= parseInt(filters.distanceFromLocation)) : eventsCopy
        this.setState({ filteredEvents: eventsCopy })
    }
    obtainDateInFormat = date => {
        const newDate = new Date(date)
        let dd = String(newDate.getDate()).padStart(2, '0')
        let mm = String(newDate.getMonth() + 1).padStart(2, '0')
        let yyyy = newDate.getFullYear()
        return `${yyyy}-${mm}-${dd}`
    }

    updateEventList = () => this.getAllFutureEvents()

    getAllFutureEvents = () => {
        this.eventService
            .getAllFutureEvents()
            .then(response => this.setState({ events : response.data, filteredEvents : response.data}))
            .catch(err => err.response && this.props.handleToast(true, err.response.data.message))
    }

   getGeoLocation = () => {
        navigator.geolocation.getCurrentPosition(
                position => 
                    this.setState(prevState => ({
                        currentLatLng: {
                            ...prevState.currentLatLng,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude        
                        }
                    }))
         )
    }

    getKilometers = (lat1, lon1, lat2, lon2) => {
        const rad = (deg) => deg * (Math.PI / 180)
        const R = 6378.137; //Radio de la tierra en km
        const dLat = rad(lat2 - lat1);
        const dLong = rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d //distance in km
    }
    render() {
        console.log('response', this.state.filteredEvents)
        return (
            <>
                {
                    !this.state.filteredEvents ? < SpinnerContainer /> :
                        <main className="main-bg"  style={{ height: this.state.height }}>
                        <SearchBar filterEvents={this.filterEvents} />
                            <Container className = 'event-page-container' >
                                <div>
                                <EventList events={this.state.events} updateEventList={this.updateEventList} loggedInUser={this.props.loggedInUser} handleToast={this.props.handleToast}/>
                                </div>
                                <div>
                                    <Row className="maps">
                                        <Col className="map-container">
                                            <center>
                                                <Map currentLocation ={this.state.currentLatLng} markers={this.state.confirmedEvents}/>
                                            </center>
                                        </Col>
                                    </Row>
                                </div>
                            </Container>
                        </main>
                }
            </>

        )
    }
}

export default EventPage 