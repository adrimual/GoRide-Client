import axios from 'axios'

export default class UserService {

    constructor() {

        this.service = axios.create({
            baseURL: 'http://localhost:4000/api/',
            withCredentials: true
        })
    }
    //User
    editUserProfile = (id, updatedUser) => this.service.post(`user/profile/edit/${id}`, updatedUser)
    getUserDetails = id => this.service.get(`user/profile/${id}`)
    //Events
    createEvent = event => this.service.post(`user/event/create`, event)
    getPersonEvents = id => this.service.get(`user/event/${id}`)
    getOneEvent = eventId => this.service.get(`user/event/event/${eventId}`)
    editEvent = (eventId, newEvent) => this.service.post(`user/event/event/${eventId}`, newEvent)
    deleteEvent = (eventId) => this.service.get(`user/event/delete/${eventId}`)
}