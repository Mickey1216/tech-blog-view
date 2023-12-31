import React from 'react';
import { Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import kwStore from '@/store/SearchStore';
import { useOpenMessageThrottle } from '@/hook';

function MySearch(props: BaseProps) {
  const { Search } = Input;
  const navigate = useNavigate();
  const openMessage = useOpenMessageThrottle(1000);

  // 搜索按钮回调
  const onSearch = (value: string) => {
    if (!kwStore.kw) {
      openMessage({ type: 'warning', content: '关键词不能为空' });
      return;
    }
    if (!value) return;
    navigate(`/article?kw=${kwStore.kw}`);
  };

  // 修改关键字
  const kwOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    kwStore.setKw(e.target.value);
  };

  return (
    <Space
      direction='vertical'
      className={`my-search ${props.className || ''}`}
    >
      <Search
        placeholder='搜索文章'
        onSearch={onSearch}
        style={{ width: 300 }}
        value={kwStore.kw}
        onChange={kwOnChange}
        allowClear
      />
    </Space>
  );
}

export default observer(MySearch);
