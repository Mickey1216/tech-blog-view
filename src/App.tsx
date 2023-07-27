import React, { Suspense, useEffect } from "react";
import { FloatButton, ConfigProvider } from "antd";
import "@/App.scss";
import MyHead from "./component/MyHeader";
import Loading from "./component/Loading";
import useMyRoutes from "./hook/useMyRoutes";
import { userLogin } from "./request";
import userStore from "./store/userStore";
import { requestSourceMap } from "./request/request";

let prePathname: string;

const App: React.FC = () => {
  // 初始化路由、登录
  const routes = useMyRoutes();

  const changeRoute = (r: typeof routes) => {
    if (!r) return;
    init();
    for (const [, source] of requestSourceMap) {
      source.cancel();
    }
    requestSourceMap.clear();

    const pathname: string = r.props.match.pathname;
    if (prePathname !== pathname) document.documentElement.scrollTop = 0;
    prePathname = pathname;
    if (pathname === "/home") return r;
    return <div className="content-container">{r}</div>;
  };

  // useEffect(callback, [])：只有在第一次渲染完毕后才会执行callback
  useEffect(() => {
    init();
  }, []);

  // 初始化登录
  const init = async () => {
    try {
      if (userStore.isLogin) return; // 已登录

      const token = localStorage.getItem("token");
      if (!token) throw new Error("没有token");

      // 有token，登录
      const user = await userLogin();
      userStore.login(user);
    } catch (error) {
      userStore.logout();
    }
  };

  return (
    <div className={`App`}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#F58F98"
          }
        }}
      >
        <MyHead></MyHead>
        <Suspense fallback={<Loading>页面加载中，请耐心等待...</Loading>}>
          {changeRoute(routes)}
        </Suspense>
        {/* 悬浮按钮，回到顶部 */}
        <FloatButton.BackTop style={{ bottom: 70, right: 70 }} />
      </ConfigProvider>
    </div>
  );
};

export default App;
