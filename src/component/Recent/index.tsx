import { useEffect, useRef, useState } from 'react';
import './index.scss';
import MyCard from '@/component/MyCard';
import { Link } from 'react-router-dom';
import { useGetSearchArticleData } from '@/hook';
import { debounce } from '@/tools';

function Recent() {
  //数据初始化
  const {
    searchArticleData: { articleList },
    updateSearchArticleData,
  } = useGetSearchArticleData();

  useEffect(() => {
    updateSearchArticleData({ take: 12 });
  }, [updateSearchArticleData]);

  //宽度监听
  const recentDivRef = useRef<HTMLDivElement>(null);
  const [listShow, setListShow] = useState(false);
  const [cardListStyle, setCardListStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const recentDiv = recentDivRef.current;
    const resizeObserverHandle: ResizeObserverCallback = (entries) => {
      //盒子宽度
      const recentDivWidth = entries[0].contentRect.width;
      let repeatCount = ~~((recentDivWidth - 300) / 300) + 1;

      setCardListStyle({ gridTemplateColumns: `repeat(${repeatCount}, 1fr)` });
      if (!listShow) return setListShow(true);
    };
    const myObserver = new ResizeObserver(debounce(resizeObserverHandle, 500));
    if (recentDiv) {
      myObserver.observe(recentDiv);
    }
    return () => {
      if (recentDiv) {
        myObserver.unobserve(recentDiv);
      }
    };
  }, [listShow]);

  return (
    <div className='recent' ref={recentDivRef}>
      {listShow && (
        <>
          <div className='list-tag'>
            <span>最近更新</span>
            <Link className='view-more' to={'/article'}>
              查看更多
            </Link>
          </div>
          <div className={`card-list`} style={cardListStyle}>
            {articleList.map((item, index) => {
              return (
                <MyCard
                  article={item}
                  className='card-item animate__animated animate__zoomIn'
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                  key={index}
                  shadow
                ></MyCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Recent;
