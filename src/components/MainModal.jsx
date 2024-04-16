import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './snippets/Modal';
import TextField from './snippets/TextField';
import moment from "moment";

import { Pencil, CopyMinus, ClipboardMinus, Trash } from 'lucide-react';
import useData from './contexts/useData';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import TimeSelect from './snippets/TimeSelect';
import ColorRadioButton from './snippets/colorRadioButton';

const MainModal = () => {
  const { isOpen, render, setRender, setIsOpen, fireStore, selectedEvent, locations, setSelectedEvent, setMyEvents } = useData();
  const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];

    const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    location: '',
    color:"",
    description: '',
    organizer: '',
    startTime: '',
    endTime: ''
  });
  useEffect(() => {
    if (selectedEvent) {
      const { title, start, end, locationId, resourceId, description, organizer,color } = selectedEvent;
      const selectedLocation = locations.find((e) => e.id === (locationId || resourceId));

      setFormData(prevFormData => ({
        ...prevFormData,
        title: title || '',
        start: moment(start).format('YYYY-MM-DD'),
        end: moment(start).format('YYYY-MM-DD'),
        location: selectedLocation ? selectedLocation.name : '',
        description: description || '',
        organizer: organizer || '',
        startTime: moment(start).format('hh:mm A'),
        endTime: moment(end).format('hh:mm A'),
        color
      }));
    }
  }, [selectedEvent, locations]);

  const handleChange = (e) => {
    debugger
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = (value, type) => {
    if (type === 'start') {
      setFormData({ ...formData, startTime: value });
    } else if (type === 'end') {
      setFormData({ ...formData, endTime: value });
    }
  };

  const saveEvent = async () => {
    debugger
    if (!selectedEvent) return;

    const { title, start, end, location, description, organizer, startTime, endTime } = formData;

    let locationId;
    const existingLocation = await getLocationFromFirestore(location);
    if (existingLocation) {
      locationId = existingLocation.id;
    } else {
      const newLocationRef = await addLocationToFirestore(location);
      locationId = newLocationRef.id;
    }

    const formattedStartDate = moment(`${start} ${startTime}`, 'YYYY-MM-DD HH:mm').toDate();
    const formattedEndDate = moment(`${end} ${endTime}`, 'YYYY-MM-DD HH:mm').toDate();

    const newEvent = {
      title,
      start: formattedStartDate,
      end: formattedEndDate,
      locationId,
      description,
      organizer,
      allDay: false
    };

    const eventsCollection = collection(fireStore, 'events');
    await addDoc(eventsCollection, newEvent);

    setRender(!render);
    setIsOpen(false);
  };

  const getLocationFromFirestore = async (locationName) => {
    return locations?.find((e) => e.name === locationName)
  };

  const addLocationToFirestore = async (locationName) => {
    const locationsCollection = collection(fireStore, 'locations');
    const newLocationRef = await addDoc(locationsCollection, { name: locationName });
    return newLocationRef;
  };


  const deleteEvent = async () => {
    if (!selectedEvent) return;

    const eventRef = doc(fireStore, 'events', selectedEvent.id);
    const locationId = selectedEvent?.locationId;
    await deleteDoc(eventRef);
    setMyEvents(prevEvents => prevEvents.filter(e => e.id !== selectedEvent.id));
    const eventsCollection = collection(fireStore, 'events');
    const querySnapshot = await getDocs(query(eventsCollection, where('location', '==', locationId)));

    if (querySnapshot.empty) {
      await deleteLocation(locationId);
    }

    setIsOpen(false);
  };

  const deleteLocation = async (locationId) => {
    await deleteDoc(doc(fireStore, 'locations', locationId));
  };


  const editEvent = () => {
    setFormData({ ...selectedEvent });

    setSelectedEvent((prev) => ({
      ...prev,
      type: "edit"
    }));
  };
  const updateEvent = async () => {
    if (!selectedEvent) return;

    const { title, start, end, description, location, organizer, startTime, endTime,color } = formData;

    const formattedStartDate = moment(`${start} ${startTime}`, 'YYYY-MM-DD HH:mm').toDate();
    const formattedEndDate = moment(`${end} ${endTime}`, 'YYYY-MM-DD HH:mm').toDate();

    let locationId = locations?.find((e) => e.name === location)?.id;
    if (!locationId) {

      const newLocationRef = await addLocationToFirestore(location);
      locationId = newLocationRef.id;

    }

    const updatedEvent = {
      title,
      start: formattedStartDate,
      end: formattedEndDate,
      locationId,
      description,
      organizer,
      color,

    };

    try {
      const eventRef = doc(fireStore, 'events', selectedEvent.id);
      await updateDoc(eventRef, updatedEvent);



      setSelectedEvent({
        type: selectedEvent.type,        ...updatedEvent
      });

      setIsOpen(false);
      setRender(!render);

    } catch (error) {
      console.error('Error updating event:', error);
    }
  };






  const copyEventToNextSameDay = async () => {
    if (!selectedEvent) return;

    try {
      const duration = moment(selectedEvent.end).diff(selectedEvent.start);
      const nextSlotStart = moment(selectedEvent.end);
      const nextSlotEnd = moment(nextSlotStart).add(duration);
      const { id, type, ...rest } = selectedEvent
      const copiedEvent = { ...rest, start: nextSlotStart.toDate(), end: nextSlotEnd.toDate() };

      const newEventRef = await addDoc(collection(fireStore, 'events'), copiedEvent);
      const newEventId = newEventRef.id;

      setMyEvents(prevEvents => [...prevEvents, { ...copiedEvent, id: newEventId }]);
    } catch (error) {
      console.error('Error copying event to the next time slot on the same day and adding to Firestore:', error);
    }
  };


  const copyEventToNextDay = async () => {
    try {
      const nextDayStart = moment(selectedEvent?.start).add(1, 'day').toDate();
      const nextDayEnd = moment(selectedEvent?.end).add(1, 'day').toDate();
      const { id, type, ...rest } = selectedEvent
      const copiedEvent = { ...rest, start: nextDayStart, end: nextDayEnd };

      const newEventRef = await addDoc(collection(fireStore, 'events'), copiedEvent);
      const newEventId = newEventRef.id;

      setMyEvents(prevEvents => [...prevEvents, { ...copiedEvent, id: newEventId }]);
    } catch (error) {
      console.error('Error copying event to next day and adding to Firestore:', error);
    }
  };


  return (

    <Modal title={`${selectedEvent?.type === "add" ? "Add Event" : selectedEvent?.type === "edit" ? "Edit Event" : selectedEvent?.title}`} isOpen={isOpen} onClose={() => { setIsOpen(false); setSelectedEvent(null); setFormData({ title: '', start: '', end: '', location: '', description: '', organizer: '', startTime: '', endTime: '' }) }} actions={selectedEvent?.type === "add" ? <button className='px-2 py-1 bg-blue-500 rounded text-white' onClick={saveEvent}>Save</button> : selectedEvent?.type === "edit" && <button className='px-2 py-1 bg-blue-500 rounded text-white' onClick={updateEvent}>Update</button>} >
{
  selectedEvent?.type!=="event" && <div className='flex justify-between items-center mb-2'>
     <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Color
            </label>
     <div className="flex items-center gap-2">
  {
    colors?.map((color) => {
      return (
        <ColorRadioButton key={color} color={color}
          selectedColor={formData?.color}
          onChange={handleChange} />
      )
    })
  }


</div>
  </div>
}
      {
        selectedEvent?.type !== "event" ? <div className='grid grid-cols-2 gap-4'>
          {
            [{ label: "Event Name", type: "text", id: "title", placeholder: "Enter event name", required: true, value: formData.title },
            { label: " Start Date", type: "date", id: "start", placeholder: "Enter event start date and time", required: true, value: formData.start },
            { label: " End Date", type: "date", id: "end", placeholder: "Enter event end date and time", required: true, value: formData.end },
            { label: "Location", type: "text", id: "location", placeholder: "Enter event location", required: true, value: formData.location },
            { label: "Description", type: "textarea", id: "description", placeholder: "Enter event description", required: false, value: formData.description },
            { label: "Organizer", type: "text", id: "organizer", placeholder: "Enter event organizer", required: false, value: formData.organizer }
            ].map((field, index) => (
              <TextField key={index} {...field} onChange={handleChange} />
            ))
          }
          <div>

            <TimeSelect label="Start Time" onChange={(value) => handleTimeChange(value, 'start')} value={formData.startTime} />
          </div>
          <div>
            <TimeSelect label="End Time" onChange={(value) => handleTimeChange(value, 'end')} value={formData.endTime} />
          </div>
        </div> : <>

          <div className='grid  gap-4 whitespace-nowrap'>
            <div className='flex gap-1'>
              <label className="font-bold">Start Time:</label>
              <span > {moment(selectedEvent?.start).format('MMMM Do YYYY, h:mm:ss a')}</span>
            </div>
            <div className='flex gap-1'>
              <label className="font-bold">End Time:</label>
              <span> {moment(selectedEvent?.end).format('MMMM Do YYYY, h:mm:ss a')}</span>
            </div>
            <div className='flex gap-1'>
              <label className="font-bold">Location:</label>
              <span >{locations?.find(e => e?.id === selectedEvent?.locationId)?.name || 'Location not found'}</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              <button className='px-4 py-1 font-bold flex gap-2 bg-blue-400 text-white rounded' onClick={editEvent}><Pencil className='w-4' />Edit</button>
              <button className='px-4 py-1 font-bold flex gap-2 bg-red-400 text-white rounded' onClick={deleteEvent}><Trash className='w-4' />Delete</button>
              <div className='flex gap-2'>
                <button className='px-4 py-1 font-bold flex gap-2 bg-green-400 text-white rounded' onClick={copyEventToNextSameDay}><CopyMinus className='w-4' />Copy to next slot</button>
                <button className='px-4 py-1 font-bold flex gap-2 bg-green-400 text-white rounded' onClick={copyEventToNextDay}><ClipboardMinus className='w-4' />Copy to next day</button>
              </div>
            </div>
          </div>
        </>
      }
    </Modal>
  )
}

export default MainModal;
