import React, { useState, useEffect } from "react";
import { LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Menu } from "antd";
import { useAuth } from "@/contexts/AuthContext";

function SideMenu() {
  const router = useRouter();
  const pathname = router.pathname;
  const [selectedKeys, setSelectedKeys] = useState(pathname);

  const { clearAuthState } = useAuth();

  useEffect(() => {
    setSelectedKeys(pathname);
  }, [pathname]);

  const signOut = () => {
    clearAuthState();
    router.push("/");
  };

  return (
    <div className="SideMenu">
      <Menu
        mode="vertical"
        onClick={(item) => {
          if (item.key === "signOut") {
            signOut();
          } else {
            router.push(item.key);
          }
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Example Protected Route",
            key: "/protected",
            icon: <HomeOutlined />,
          },
          {
            label: "Sign Out",
            key: "signOut",
            icon: <LogoutOutlined />,
          },
        ]}
      ></Menu>
    </div>
  );
}
export default SideMenu;
