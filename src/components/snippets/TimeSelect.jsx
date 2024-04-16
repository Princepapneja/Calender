import React from 'react';

function TimeSelect({ label, onChange, value }) {
    const hours = 24;
    const minutesInterval = 15;

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label
                htmlFor={"timeSelect"}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <select 
                id="timeSelect" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleChange}
                value={value}
            >
                {
                    Array.from({ length: hours * (60 / minutesInterval) }, (_, index) => {
                        const hour = Math.floor(index * minutesInterval / 60);
                        const minute = (index * minutesInterval) % 60;
                        const formattedHour = hour.toString().padStart(2, '0');
                        const formattedMinute = minute.toString().padStart(2, '0');
                        const period = hour < 12 ? 'AM' : 'PM';
                        const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
                        return (
                            <option key={index} value={`${formattedHour}:${formattedMinute} ${period}`}>
                                {`${displayHour}:${formattedMinute} ${period}`}
                            </option>
                        );
                    })
                }
            </select>
        </div>
    );
}

export default TimeSelect;
