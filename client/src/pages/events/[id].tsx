import { GetServerSideProps, NextPage } from 'next';
import { Card, Spin, Typography, Alert } from 'antd';
import { IEvent, ITag } from '../../common/interfaces';
import dayjs from 'dayjs';
import { API_URL } from '../../common/constants';
import Head from 'next/head';

interface EventDetailsProps {
    event: IEvent | null;
    error: string | null;
}

const EventDetailsPage: NextPage<EventDetailsProps> = ({ event, error }) => {
    if (error) {
        return (
            <>
                <Head>
                    <title>Error</title>
                    <meta name="description" content="Error loading event details" />
                </Head>
                <Alert
                    message="Error Loading Event"
                    description={error || "An unexpected error occurred while fetching the event details."}
                    type="error"
                    showIcon
                    aria-live="assertive"
                />
            </>
        );
    }

    if (!event) {
        return (
            <>
                <Head>
                    <title>Loading...</title>
                    <meta name="description" content="Loading event details" />
                </Head>
                <Spin size="large" style={{ display: 'block', marginTop: 50 }} />
            </>
        );
    }

    //handle the rendering of tags based on their type
    const renderTags = (tags: ITag[] | number[]): string => {
        if (tags.length === 0) return 'None';
        if (typeof tags[0] === 'number') {
            return tags.join(', '); 
        } else {
            return (tags as ITag[]).map(tag => tag.name).join(', '); 
        }
    };

    return (
        <>
            <Head>
                <title>Event Details - ID: {event.event_id}</title>
                <meta name="description" content={`Details for event ${event.event_id}`} />
            </Head>
            <Card
                title={`Event Details - ID: ${event.event_id}`}
                bordered={false}
                style={{ margin: '20px' }}
            >
                <Typography.Paragraph>
                    <strong>Post Time:</strong> {dayjs(event.post_time).format('YYYY-MM-DD HH:mm')}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Expire Time:</strong> {dayjs(event.exp_time).format('YYYY-MM-DD HH:mm')}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Description:</strong> {event.description}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Quantity:</strong> {event.qty}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Tags:</strong> {event.tags ? renderTags(event.tags) : 'No tags'}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Location:</strong> {event.location ? `${event.location.Address}, Floor ${event.location.floor}, Room ${event.location.room}` : 'Not specified'}
                </Typography.Paragraph>
            </Card>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id;
    let event: IEvent | null = null;
    let error: string | null = null;

    if (!id || typeof id !== 'string' || isNaN(Number(id))) {
        error = 'Invalid ID';
        return { props: { event, error } };
    }

    try {
        const response = await fetch(`${API_URL}/events/${id}`);
        if (response.ok) {
            const data = await response.json();
            event = data.event;
        } else {
            error = `Failed to load event: ${response.status}`;
        }
    } catch (e) {
        error = 'An error occurred while fetching event details.';
    }

    return { props: { event, error } };
};

export default EventDetailsPage;

