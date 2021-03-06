import axios from 'axios'

export default class EventService {

    constructor() {
        this.service = axios.create({
            baseURL: `${process.env.REACT_APP_API_URL}/user/event`,
            withCredentials: true
        })
    }

    //events
    getAllEventsUser = userId => this.service.get(`/${userId}/all}`)
    getAllFutureUserEvents = userId => this.service.get(`/${userId}/all/future`)
    createEvent = (event, id) => this.service.post(`/create/${id}`, event)
    getOwnedEvents = userId => this.service.get(`/${userId}/owned`)
    getParticipantEvents = userId => this.service.get(`/${userId}/participant`)
    getOneEvent = eventId => this.service.get(`/event/${eventId}`)
    getEventByName = eventName => this.service.get(`/event/name/${eventName}`)
    editEvent = (eventId, newEvent, id) => this.service.put(`/event/${id}`, newEvent)
    deleteEvent = (eventId, id) => this.service.delete(`/delete/${id}`)
    getAllEvents = () => this.service.get('/getAllEvents')
    getAllFutureEvents = () => this.service.get('/getAllFutureEvents')
    getEventOwner = eventId => this.service.get(`/getOwner/${eventId}`)
    joinEvent = (eventId, userId) => this.service.put(`/join/${eventId}/${userId}`)
    leaveEvent = (eventId, id) => this.service.put(`/leave/${eventId}/${id}`)
}