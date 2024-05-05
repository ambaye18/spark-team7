import React, { useEffect, useState } from 'react';
import { IEvent } from '../../common/interfaces';
import { Spin, Image } from 'antd';
import { API_URL } from "@/common/constants";

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) {
          throw new Error("Could not fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
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
        <div key={event.event_id}>
          {event.photos && (
            <div>
              {event.photos.map((photo) => (
                <Image
                  key={photo.id}
                  src={`data:image/png;base64,${photo.photo}`}
                  alt="Event Thumbnail"
                  width={100}
                  onError={(error) => {
                    console.error('Failed to load image:', error);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventsList;
