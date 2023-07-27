import { useEffect, useRef } from 'react';
// GSAP（GreenSock Animation Platform）是一个功能强大且高性能的JavaScript动画库，用于在Web上创建各种动画效果
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import $ from 'jquery';
import './index.scss';
import Recommend from '@/component/Recommend';
import Recent from '@/component/Recent';
import Profile from '@/component/Profile';
import { useChangePageTitle } from '@/hook';
import { debounce } from '@/tools';

gsap.registerPlugin(ScrollTrigger);

const onClickHandler = (ele: HTMLDivElement) => {
  ele.scrollIntoView({ behavior: 'smooth' });
};

function Home() {
  useChangePageTitle('Mickey技术博客-首页', []);

  const homeContainerRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 水波特效
    const resolution = 380; // 波纹传播速度，越大越慢
    const dropRadius = 18; // 扩散大小
    const perturbance = 0.01; // 波纹折射
    const randomRippleDelay = 4000; // 随机水滴间隔
    $('#home-bg');
    try {
      $('#home-bg').ripples({
        resolution,
        dropRadius,
        perturbance,
        interactive: true // 点击和移动触发
      });
    } catch {}

    let Interval: NodeJS.Timer;

    // 缩圈特效
    const scrollTrigger = ScrollTrigger.create({
      trigger: '#bg-wrapper',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      animation: gsap
        .timeline()
        .fromTo(
          '#home-bg',
          { clipPath: 'circle(100% at 50% 50%)' },
          { clipPath: 'circle(25% at 50% 50%)' },
        ),
    });

    // 监听宽度改变
    const Home = homeRef.current;
    const resizeObserverHandle: ResizeObserverCallback = () => {
      const bodyClass = document.body.classList.toString();
      
      Interval && clearInterval(Interval);
      if (!bodyClass.includes('small-screen-style')) {
        scrollTrigger.refresh();
        Interval = setInterval(function () {
          const $el = $('#home-bg');
          if (!$el) return;

          const x = Math.random() * $el.outerWidth()!;
          const y = Math.random() * $el.outerHeight()!;
          const strength = 0.01 + Math.random() * 0.04; // 强度

          $el.ripples('drop', x, y, dropRadius, strength);
        }, randomRippleDelay);
      }
    };

    const myObserver = new ResizeObserver(debounce(resizeObserverHandle, 500));
    if (Home) {
      myObserver.observe(Home);
    }

    return () => {
      scrollTrigger.kill();
      Interval && clearInterval(Interval);
      $('#home-bg').ripples('destroy');
      if (Home) {
        myObserver.unobserve(Home);
      }
    };
  }, []);

  return (
    <div className='home' ref={homeRef}>
      <div className='bg-wrapper' id='bg-wrapper'>
        <div className='home-bg' id='home-bg'>
          <div
            className='start'
            onClick={() => {
              homeContainerRef.current &&
                onClickHandler(homeContainerRef.current);
            }}
          >
            {'开启阅读之旅'}
            <div className='hover-area hover-area-top'></div>
            <div className='hover-area hover-area-bottom'></div>
          </div>
        </div>
      </div>
      <div className='home-container content-container' ref={homeContainerRef}>
        <div className='right small-screen-hide'>
          <Profile></Profile>
        </div>
        <div className='left'>
          <Recommend></Recommend>
          <Recent></Recent>
        </div>
      </div>
    </div>
  );
}

export default Home;
