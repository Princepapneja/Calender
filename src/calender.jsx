/* eslint-disable react/prop-types */
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Calendar, DateLocalizer, Views } from 'react-big-calendar'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import MainModal from './components/MainModal';
import useData from './components/contexts/useData';
import FourDays from './components/views/fourdays';
import { doc, updateDoc } from 'firebase/firestore';
const DragAndDropCalendar = withDragAndDrop(Calendar)





export default function DnDResource() {
    const { myEvents, setMyEvents, setIsOpen, view, localizer, fireStore, setView, setSelectedEvent, locations } = useData()



    const onView = useCallback((newView) => setView(newView), [setView])
    const moveEvent = async ({
        event,
        start,
        end,
        resourceId,
        isAllDay: droppedOnAllDaySlot = false,
    }) => {
        const { allDay } = event;

        if (!allDay && droppedOnAllDaySlot) {
            event.allDay = true;
        }

        if (Array.isArray(event.locationId)) {
            event.locationId.push(resourceId);
        } else {
            event.locationId = resourceId || event.locationId
        }

        event.start = start;
        event.end = end;
        event.allDay = allDay;

        try {
            const eventDocRef = doc(fireStore, 'events', event.id);
            await updateDoc(eventDocRef, {
                start: start,
                end: end,
                allDay: allDay,
                locationId: event.locationId,
            });

            setMyEvents((prev) => {
                const index = prev.findIndex((e) => e.id === event.id);
                if (index !== -1) {
                    const updatedEvents = [...prev];
                    updatedEvents[index] = { ...event };
                    return updatedEvents;
                }
                return prev;
            });
        } catch (error) {
            console.error('Error updating event on Firestore:', error);
        }
    };




    const handleSelectEvent = (event) => {
        console.log("Event clicked:", event);

        setIsOpen(true)
        setSelectedEvent({ ...event, type: "event" })

    };
    const handleSelectSlot = ((event) => {
        console.log("Event clicked:", event);
        setSelectedEvent({ ...event, type: "add" })
        setIsOpen(true)
    });
    const resizeEvent = async ({ event, start, end }) => {
        try {
            const eventDocRef = doc(fireStore, 'events', event.id);
            await updateDoc(eventDocRef, {
                start: start,
                end: end,
            });

            setMyEvents((prev) => {
                const existingIndex = prev.findIndex((ev) => ev.id === event.id);
                if (existingIndex !== -1) {
                    const updatedEvent = { ...prev[existingIndex], start, end };
                    const updatedEvents = [...prev.slice(0, existingIndex), updatedEvent, ...prev.slice(existingIndex + 1)];
                    return updatedEvents;
                }
                return prev;
            });
        } catch (error) {
            console.error('Error updating event on Firestore:', error);
        }
    }



    const { defaultDate, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(),
            scrollToTime: localizer.startOf(new Date(), "day"),
        }),
        []
    )


    const customViews = {
        month: true,
        week: true,
        FourDays: FourDays,
        agenda: true,
        day: true,
    };
    // const components = {
    //     eventContainerWrapper: (a) => {
    //         console.log(a.
    //             slotMetrics.nextSlot()
    //             );

    //         return <div className='prince' onClick={(e) => {
    //             e.preventDefault();
    //             e.stopPropagation()
    //             console.log(e,"event");
    //         }}
    //         >
    //             {a.children}
    //         </div>


    //     }
    // }

    return (
        <Fragment>

            <div className="h-[800px]">
                <DragAndDropCalendar
                    defaultDate={defaultDate}
                    onSelectEvent={handleSelectEvent}
                    // defaultView={Views.DAY}
                    events={myEvents}
                    localizer={localizer}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                    resizable
                    resources={view === "day" && locations}
                    resourceAccessor="locationId"
                    resourceIdAccessor="id"
                    resourceTitleAccessor="name"
                    scrollToTime={scrollToTime}
                    selectable={true}
                    startAccessor="start"
                    endAccessor="end"
                    length={1}
                    // components={components}
                    showMultiDayTimes={true}
                    step={15}
                    onSelectSlot={handleSelectSlot}
                    views={customViews}
                    // longPressThreshold={5}
                    // onSelecting={handleSelectSlot}
                    // popup
                    onView={onView}
                    eventPropGetter={
                        (event, start, end, isSelected) => {
                            return {
                                style:{background:event.color}
                            }
                        }
                    }
                    // timeslots={60}
                    messages={{
                        FourDays: "4 days",
                        day: "Location"
                    }}
                />


            </div>

            <MainModal />

        </Fragment>
    )
}
DnDResource.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}