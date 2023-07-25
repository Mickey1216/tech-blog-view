import React, { useEffect } from 'react';
import { Carousel, Skeleton } from 'antd';
import './index.scss';
import MyCard from '../MyCard';
import { useGetRecommendArticleList } from '@/hook';
import userStore from '@/store/userStore';

function Recommend() {
  const { articleList, updateRecommendArticleList, isLoading } =
    useGetRecommendArticleList();

  useEffect(() => {
    updateRecommendArticleList(userStore.user.recommendIdList || [], true);
  }, [updateRecommendArticleList]);

  return (
    <div className='recommend'>
      {isLoading ? (
        <Skeleton.Avatar
          shape={'square'}
          style={{
            width: '100%',
            height: '0',
            paddingBottom: `${900 / 16}%`,
          }}
          active
        />
      ) : (
        <Carousel effect='fade' autoplay={true} autoplaySpeed={5000}>
          {articleList.map((item, index) => {
            return <MyCard key={index} article={item}></MyCard>;
          })}
        </Carousel>
      )}
    </div>
  );
}

export default Recommend;