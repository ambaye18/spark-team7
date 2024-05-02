import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, Spin, Card, Tag } from "antd";
import { API_URL } from "../../common/constants";
import { IEvent } from "@/common/interfaces";
import { useAuth } from "@/contexts/AuthContext";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { event_id: stringEventId } = router.query;
  const { getAuthState, authState } = useAuth();
  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!stringEventId) return;

      setIsLoading(true);

      try {
        const eventId = Number(stringEventId);
        const response = await fetch(`${API_URL}/api/events/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthState()?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Event not found");
        }
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [getAuthState, stringEventId]);

  if (isLoading) {
    return <Spin />;
  }

  if (!eventData) {
    return <div>Event not found</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#eaf7f0",
        padding: "20px",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        {eventData.description}
      </Typography.Title>

      <Card style={{ marginTop: 16 }}>
        <Typography.Paragraph>
          Description: {eventData.description}
        </Typography.Paragraph>
        <Typography.Paragraph>
          Quantity Available: {eventData.qty}
        </Typography.Paragraph>
        <Typography.Paragraph>
          Post Time: {dayjs(eventData.post_time).format("YYYY-MM-DD HH:mm")}{" "}
        </Typography.Paragraph>
        <Typography.Paragraph>
          Expires: {dayjs(eventData.exp_time).format("YYYY-MM-DD HH:mm")}{" "}
        </Typography.Paragraph>
        <Typography.Paragraph>
          Tags:
          {eventData.tags.map((tagOrId, index) => (
            <React.Fragment key={index}>
              {typeof tagOrId === "number" ? (
                <Tag key={index}>{tagOrId}</Tag>
              ) : (
                <Tag key={tagOrId.tag_id}>{tagOrId.name}</Tag>
              )}
            </React.Fragment>
          ))}
        </Typography.Paragraph>
        {eventData.location && (
          <div>
            <Typography.Paragraph>
              Address: {eventData.location.Address}
            </Typography.Paragraph>
            <Typography.Paragraph>
              Floor: {eventData.location.floor}
            </Typography.Paragraph>
            <Typography.Paragraph>
              Room: {eventData.location.room}
            </Typography.Paragraph>
            <Typography.Paragraph>
              Note: {eventData.location.loc_note}
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
