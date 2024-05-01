import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  InputNumber,
  TimeRangePickerProps,
} from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { API_URL } from "../../../common/constants";
import { ITag, IEvent } from "../../../common/interfaces";
import dayjs from "dayjs";
import { useAuth } from "@/contexts/AuthContext";
import { parse } from "path";
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

// Time validation
dayjs.extend(customParseFormat);
const disabledDate: TimeRangePickerProps["disabledDate"] = (current) => {
  const today = dayjs();
  return current && current < today;
};
/*const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
const disabledTime = () => {
  const current = dayjs();
  // If it's the current date, disable times before the current time
  if (dayjs().isSame(current, "day")) {
    return {
      disabledHours: () => range(0, dayjs().hour() + 1), // Disable hours before the current hour
    };
  }
  // For other dates, allow all times
  return {};
};
*/

function parseTags(selected: number[]): any {
  if (selected == undefined) {
    return undefined;
  } else return { tag_id: Number(selected) };
}

const CreateEvent: React.FC = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoadingTags] = useState(false);
  const router = useRouter();
  const { getAuthState, authState } = useAuth();

  // Fetch tags
  useEffect(() => {
    async function fetchTags() {
      const token = getAuthState()?.decodedToken;
      if (!token) {
        router.push("/");
        return;
      }
      if (!token.canPostEvents) {
        message.error("Unauthorized user");
        router.push("/events");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/tags`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthState()?.token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching tags: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched tags:", data);
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    fetchTags();
  }, [getAuthState]);

  // Handle form submission
  const handleSubmit = async (values: IEvent) => {
    const token = getAuthState()?.token;
    if (!token) {
      message.error("Unauthorized user");
      return;
    }
    try {
      const body = JSON.stringify({
        ...values,
        qty: values.qty.toString(),
        createdBy: authState?.decodedToken?.id,
        tags: parseTags(values.tags as number[]),
      });
      console.log("request body " + body);
      const response = await fetch(`${API_URL}/api/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthState()?.token}`,
        },
        body: body,
      });

      if (!response.ok) {
        console.error("Error creating event");
        throw new Error(`${response.status}`);
      }

      message.success("Event created successfully!");
      router.push("/events"); // Redirect to events list after successful creation
    } catch (error) {
      console.error(error);
      message.error("Error creating event. Please try again later.");
    }
  };

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Create Event
      </Typography.Title>
      <Form form={form} {...layout} onFinish={handleSubmit}>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            placeholder="Enter event description"
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>
        <Form.Item label="Quantity" name="qty" rules={[{ required: true }]}>
          <InputNumber placeholder="Enter quantity" />
        </Form.Item>
        <Form.Item
          label="Expiration Time"
          name="exp_time"
          rules={[{ required: true }]}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={disabledDate}
            //disabledTime={disabledTime}
            showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
          />
        </Form.Item>
        <Form.Item
          label="Tag (Optional)"
          name="tags"
          rules={[{ required: false }]}
        >
          <Select loading={isLoadingTags}>
            {tags.map((tag) => (
              <Option key={tag.tag_id}>{tag.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateEvent;
