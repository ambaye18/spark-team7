import React, { useEffect, useState } from 'react';
import { IEvent } from '../../common/interfaces';
import { Spin } from 'antd';

const EventsList: React.FC = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);

            try {
                const response = await fetch('http://localhost:5005/api/events');
                if (!response.ok) {
                    throw new Error('Could not fetch events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            {isLoading && <Spin />}
            {!isLoading && events.length === 0 && <p>No events found</p>}

            {!isLoading && events.map((event) => (
                <div key={event.event_id}> </div>
            ))}
        </div>
    );
};

export default EventsList;
