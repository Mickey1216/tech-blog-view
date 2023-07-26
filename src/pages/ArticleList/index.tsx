import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Pagination, Skeleton } from 'antd';
import './index.scss';
import kwStore from '@/store/SearchStore';
import { useChangePageTitle, useGetSearchArticleData } from '@/hook';
import ArticleListItem from './ArticleListItem';
import React from 'react';
import TagSearch from './TagSearch';
import ToolBar from './ToolBar';
import SearchSelector from './SearchSelector';
import searchStore from '@/store/SearchStore';

const pageSize = 10;

/**
 * 获取搜索参数
 * @param searchParams 搜索参数
 * @returns 
 */
const getSearchParams = (searchParams: URLSearchParams): SearchArticleParams => {
  const kw = searchParams.get('kw') || '';

  let skip = Number(searchParams.get('skip')) || 0;
  skip = skip >= 0 ? skip : 0;

  let take = Number(searchParams.get('take')) || pageSize;
  take = take >= 1 ? take : 10;

  const order = searchParams.get('order') === 'ASC' ? 'ASC' : 'DESC';

  let orderType =
    (searchParams.get('orderType') as any) || searchStore.orderType;

  let filterType =
    (searchParams.get('filterType') as any) || searchStore.filterType;

  return {
    kw,
    skip,
    take,
    order,
    orderType,
    filterType,
  };
};

function ArticleList() {
  // query参数
  const [searchParams, setSearchParams] = useSearchParams();

  // 收集query信息
  const params = getSearchParams(searchParams);

  const {
    searchArticleData,
    updateSearchArticleData,
    isNull,
    isLoading: articleListIsLoading,
  } = useGetSearchArticleData();

  // 获取文章列表
  useEffect(() => {
    const nParams = getSearchParams(searchParams);
    nParams.kw && kwStore.setKw(nParams.kw);
    updateSearchArticleData(nParams);
  }, [searchParams, updateSearchArticleData]);

  // 处理分页
  const onChangePage = (page: number, pageSize: number) => {
    setSearchParams((state) => {
      return { ...state, ...params, skip: (page - 1) * pageSize };
    });
  };

  useChangePageTitle(
    params.kw ? `Mickey技术博客-文章列表-${params.kw}` : 'Mickey技术博客-文章列表',
    [params.kw]
  );

  return (
    <div className={`article-list`}>
      <ToolBar></ToolBar>
      <TagSearch></TagSearch>
      <SearchSelector params={params}></SearchSelector>
      {params.kw && (
        <Alert message={`正在展示 ${params.kw} 的搜索结果`} type='info' />
      )}
      <div>
        {isNull ? (
          <Alert message={`暂无数据`} type='info' />
        ) : articleListIsLoading ? (
          <>
            {new Array(4).fill('').map((item, index) => {
              return (
                <Skeleton
                  key={index}
                  active
                  title={false}
                  paragraph={{ rows: 3 }}
                />
              );
            })}
          </>
        ) : (
          searchArticleData.articleList.map((article, index) => {
            return (
              <ArticleListItem
                key={article.id}
                article={article}
                index={index}
              />
            );
          })
        )}
      </div>
      <Pagination
        style={{ textAlign: 'right' }}
        total={searchArticleData.count}
        showTotal={(total) => `total:${total}`}
        onChange={onChangePage}
        pageSize={params.take}
        current={~~((params.skip || 0) / (params.take || pageSize)) + 1}
      />
    </div>
  );
}

export default React.memo(ArticleList);
