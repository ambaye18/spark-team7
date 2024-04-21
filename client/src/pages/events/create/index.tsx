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
} from "antd";
import { API_URL } from "../../../common/constants";
import { IAuthTokenDecoded, IEvent, ITag, ITagType } from "../../../common/interfaces";
import { FilterOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "@/contexts/AuthContext";
import { get_tags } from "../../../../../server/app/tags/tags.controller";
const { Paragraph } = Typography;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface ICreateEventForm {
  description: string;
  qty: number;
  exp_time: Date;
  tags: String | null;
}

const CreateEvent: React.FC = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const router = useRouter();
  const { getAuthState, authState } = useAuth();

  // Fetch existing tags
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await fetch(`${API_URL}/api/tags`);
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error(error);
        message.error("Error fetching tags. Please try again later.");
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: ICreateEventForm) => {
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
      });
      console.log(body);
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

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
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
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="Tag (Optional)" name="tags">
          <Select loading={isLoadingTags}>
            {tags.map((tag) => (
              <Option key={tag.tag_id} value={tag.tag_id}>
                {tag.name}
              </Option>
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
