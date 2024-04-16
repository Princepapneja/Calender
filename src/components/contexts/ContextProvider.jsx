import { useEffect, useState } from 'react'
import Context from './context'
import { Views, momentLocalizer } from 'react-big-calendar';;
import moment from "moment"
import { fireStore } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const resourceMap = [
    { resourceId: 1, resourceTitle: 'Board room' },
    { resourceId: 2, resourceTitle: 'Training room' },
    { resourceId: 3, resourceTitle: 'Meeting room 1' },
    { resourceId: 4, resourceTitle: 'Meeting room 2' },
]
const localizer = momentLocalizer(moment)

const ContextProvider = ({ children }) => {
    const [myEvents, setMyEvents] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState(Views.MONTH)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [render, setRender] = useState(false)
    const [locations, setLocations] = useState([])
    useEffect(() => {
        fetchEvents()
    }, [render])
    const fetchEvents = async () => {
        const eventsCollectionRef = collection(fireStore, 'events');
        const locationsCollectionRef = collection(fireStore, 'locations');
    
        try {
            const querySnapshot = await getDocs(eventsCollectionRef);
            const eventsData = [];
    
            querySnapshot.forEach((doc) => {
                const eventData = { id: doc.id, ...doc.data() };
                eventData.start = moment(eventData.start.toDate()).toDate();
                eventData.end = moment(eventData.end.toDate()).toDate();
                eventsData.push(eventData);
            });
    
            setMyEvents(eventsData);
    
            const locationsQuerySnapshot = await getDocs(locationsCollectionRef);
            const locationsData = [];
    
            locationsQuerySnapshot.forEach((doc) => {
                
                const locationData = { id: doc.id, ...doc.data() };
                locationsData.push(locationData);
            });
    
            setLocations(locationsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    
    

    return (
        <>
            <Context.Provider value={{render, locations, setLocations,setRender, fireStore, localizer, myEvents, resourceMap, setMyEvents, isOpen, setIsOpen, view, setView, selectedEvent, setSelectedEvent }}>
                {children}
            </Context.Provider>

        </>
    )
}

export default ContextProvider