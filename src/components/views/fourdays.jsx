/* eslint-disable react/prop-types */
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import { Navigate } from 'react-big-calendar'
import * as dates from 'date-arithmetic'
import { useMemo } from 'react'
import useData from '../contexts/useData'

export default function FourDays({
    date,
    localizer,
    max = localizer.endOf(new Date(), 'day'),
    min = localizer.startOf(new Date(), 'day'),
    scrollToTime = localizer.startOf(new Date(), 'day'),
    ...props
}) {
    console.log(date);
    console.log(props);
    const currRange = useMemo(
        () => FourDays.range(date, { localizer }),
        [date, localizer]
    )
    console.log(currRange);
    return (
        <TimeGrid
            date={date}
            eventOffset={15}
            localizer={localizer}
            max={max}
            selectable
            min={min}
            range={currRange}
            scrollToTime={scrollToTime}
            {...props}
            resizable
            resources={false}
        />
    ) 
}

FourDays.range = (date, { localizer }) => {
    const start = new Date(date)
    start.setDate(start.getDate() - 1); 
    const end = localizer.add(start, 3, 'day'); 

    let current = start;
    const range = [];

    while (localizer.lte(current, end, 'day')) {
        range.push(current);
        current = localizer.add(current, 1, 'day');
    }

    return range;
}



FourDays.navigate = (date, action, { localizer }) => {
    switch (action) {
        case Navigate.PREVIOUS:
            return localizer.add(date, -4, 'day')

        case Navigate.NEXT:
            return localizer.add(date, 4, 'day')

        default:
            return date
    }
}
FourDays.title = (date) => {
    return ` ${date.toLocaleDateString()}`
}