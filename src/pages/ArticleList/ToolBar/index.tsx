import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button, Form } from "antd";
import { FormOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import "./index.scss";
import { useShowPromiseModal, useOpenMessageThrottle } from "@/hook";
import { userLogin } from "@/request";
import userStore from "@/store/userStore";

function ArticleListTool() {
  // 登录
  const showPromiseModal = useShowPromiseModal("confirm");
  const openMessage = useOpenMessageThrottle(1000);

  const [userLoginForm, setUserLoginForm] = useState<UserLoginForm>({
    username: "",
    password: ""
  });

  const loginFormHandle: SetStateFunctionHandler<typeof userLoginForm> = (
    target,
    value
  ) => {
    setUserLoginForm((user) => {
      user[target] = value;
      return { ...user };
    });
  };

  // 登录账户按钮回调函数
  const userLoginBtnHandle = () => {
    showPromiseModal({
      title: "用户登录",
      content: promiseConfirmContentDom(),
      onOk(close) {
        setUserLoginForm((state) => {
          if (state.username === "" || state.password === "") {
            openMessage({ type: "warning", content: "用户名和密码均不能为空！" });
            return state;
          }
          userInit(state, close);
          return state;
        });
      }
    });
  };

  const userInit = async (data: UserLoginForm, close: Function) => {
    try {
      const user = await userLogin(data);
      userStore.login(user);
      setUserLoginForm({ username: "", password: "" });
      openMessage({ type: "success", content: "登录成功" });
      close();
    } catch (error) {
      openMessage({ type: "warning", content: (error as Error).message });
    }
  };

  // 退出登录
  const logout = () => {
    showPromiseModal({
      title: "退出登录",
      content: "确认退出",
      onOk(...args) {
        userStore.logout();
        openMessage({ type: "success", content: "已退出登录" });
      }
    });
  };

  // 登录框
  const promiseConfirmContentDom = () => {
    return (
      <div className="login">
        <Form name="basic" autoComplete="off">
          <Form.Item
            label="账户"
            name="username"
            rules={[{ required: true, message: "请输入账户！" }]}
            initialValue={userLoginForm.username}
          >
            <Input
              placeholder="输入账户"
              onChange={(e) => {
                loginFormHandle("username", e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
            initialValue={userLoginForm.password}
          >
            <Input.Password
              placeholder="输入密码"
              onChange={(e) => {
                loginFormHandle("password", e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <div className={`tool-bar`}>
      {userStore.isLogin ? (
        <div style={{ textAlign: "left" }}>
          <Link to={"editTag"}>
            <Button type="default" icon={<FormOutlined />} size={"small"}>
              编辑标签
            </Button>
          </Link>
          <Link to={"editRecommend"}>
            <Button type="default" icon={<FormOutlined />} size={"small"}>
              编辑精选
            </Button>
          </Link>
          <Link to={"addArticle"}>
            <Button type="default" icon={<FormOutlined />} size={"small"}>
              发布文章
            </Button>
          </Link>
          <Button
            type="default"
            onClick={logout}
            icon={<LogoutOutlined />}
            size={"small"}
          >
            退出登录
          </Button>
        </div>
      ) : (
        <Button
          type="default"
          icon={<UserOutlined />}
          size={"small"}
          onClick={userLoginBtnHandle}
        >
          登录账户
        </Button>
      )}
    </div>
  );
}

export default observer(ArticleListTool);
