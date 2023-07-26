import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import { Avatar } from "antd";
import "./index.scss";
import MySearch from "./MySearch";
import MyHeadDropdown from "./MyDropdown";
import { throttle } from "@/tools";
import github from "@/assets/images/github.png";

const menuList = [
  {
    title: "首页",
    url: "home"
  },
  {
    title: "文章",
    url: "article"
  }
];

let hide = false;
let scrollTop = 0;

const switchToShow = (myHeader: HTMLDivElement, newScrollTop: number) => {
  scrollTop = newScrollTop;
  if (!hide) return;
  myHeader.classList.remove("hide");
  hide = false;
};

const switchToHide = (myHeader: HTMLDivElement, newScrollTop: number) => {
  scrollTop = newScrollTop;
  if (hide) return;
  myHeader.classList.add("hide");
  hide = true;
};

const scrollHandlerWithThrottle = throttle((myHeader: HTMLDivElement) => {
  const newScrollTop = document.documentElement.scrollTop;
  if (newScrollTop <= 200 || scrollTop <= 200) {
    switchToShow(myHeader, newScrollTop);
  } else if (newScrollTop < scrollTop && scrollTop - newScrollTop >= 50) {
    switchToShow(myHeader, newScrollTop);
  } else if (newScrollTop > scrollTop && newScrollTop - scrollTop >= 50) {
    switchToHide(myHeader, newScrollTop);
  }
}, 100);

function MyHead() {
  const myHeaderRef = useRef<HTMLDivElement>(null);

  const scrollHandler = useCallback(() => {
    if (!myHeaderRef.current) return;
    scrollHandlerWithThrottle(myHeaderRef.current);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  return (
    <div className="my-header" ref={myHeaderRef}>
      <div className="container">
        <div className="left-wrapper">
          <div className="github">
            <a href="https://github.com/Mickey1216">
              <Avatar size={32} src={github} />
            </a>
          </div>
          <div className="logo">Mickey技术博客</div>

          <div className="menu">
            {menuList.map((item, index) => {
              return (
                <NavLink
                  key={index}
                  to={item.url}
                  className={({ isActive }) => (isActive ? "myActive" : "")}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </div>
        <MyHeadDropdown></MyHeadDropdown>
        <MySearch className="small-screen-hide"></MySearch>
      </div>
    </div>
  );
}

export default MyHead;
