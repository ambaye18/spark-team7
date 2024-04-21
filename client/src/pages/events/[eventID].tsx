import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Spin, Card, Tag } from 'antd';
import { API_URL } from '../../common/constants';

const { Title, Paragraph } = Typography;

interface IEvent {
    event_id: number;
    description: string;
    qty: number;
    exp_time: string;
    tags: { tag_id: number, name: string }[];
    location: { Address: string, floor: string, room: string, loc_note?: string } | null; // Location may be optional
    createdBy: { name: string };
}

const EventDetails: React.FC = () => {
    const router = useRouter();
    const { event_id: stringEventId } = router.query;
    const [eventData, setEventData] = useState<IEvent | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!stringEventId) return;

            setIsLoading(true);

            try {
                const eventId = Number(stringEventId);
                const response = await fetch(`${API_URL}/api/events/${eventId}`);

                if (!response.ok) {
                    throw new Error('Event not found');
                }
                const data = await response.json();
                setEventData(data);
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventDetails();
    }, [stringEventId]);

    if (isLoading) {
        return <Spin />;
    }

    if (!eventData) {
        return <div>Event not found</div>;
    }

    return (
        <div>
            <Title level={2}>{eventData.description}</Title>

            <Card style={{ marginTop: 16 }}>
                <Typography.Paragraph>
                    Quantity Available: {eventData.qty}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Expires:
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Tags:
                    {eventData.tags.map((tag) => (
                        <Tag key={tag.tag_id}>{tag.name}</Tag>
                    ))}
                </Typography.Paragraph>
                {eventData.location && (
                    <div>
                        <Typography.Paragraph>
                            Address: {eventData.location.Address}
                        </Typography.Paragraph>
                    </div>
                )}
                <Typography.Paragraph>
                    Created By: {eventData.createdBy.name}
                </Typography.Paragraph>
            </Card>
        </div>
    );
};

export default EventDetails;
