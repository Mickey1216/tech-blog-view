import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown, Space } from 'antd';
import React, { useState } from 'react';
import './index.scss';
import { useSearchParams } from 'react-router-dom';
import searchStore from '@/store/SearchStore';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

type OrderTypeItem = {
  value: SearchArticleParams['orderType'];
  text: string;
};

const orderTypeItems: OrderTypeItem[] = [
  {
    value: 'createTime',
    text: '创建时间',
  },
  {
    value: 'updateTime',
    text: '更新时间',
  },
  {
    value: 'tagName',
    text: '标签名',
  },
];

const filterTypeOptions = [
  { label: '文章标题', value: 'title' },
  { label: '文章简介', value: 'introduction' },
  { label: '文章内容', value: 'content' },
  { label: '文章标签', value: 'tagName' },
];

//获取过滤器的值
const getFilterValue = (params: SearchArticleParams) => {
  const filterValue = params.filterType
    ?.split(',')
    .map((item, index) => {
      if (item === '1') return filterTypeOptions[index].value;
      return null;
    })
    .filter((item) => item) as unknown as CheckboxValueType[];
  return filterValue;
};

interface Props extends BaseProps {
  params: SearchArticleParams;
}

function SearchSelector(props: Props) {
  //query参数
  const [, setSearchParams] = useSearchParams();

  const { params } = props;

  const [openOrder, setOpenOrder] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);

  //排序中文名
  const orderTypeText =
    orderTypeItems.find((item) => {
      return item.value === params.orderType;
    })?.text || '创建时间';

  //修改排序方式
  const selectorOrderItemOnClickHandler = (item: OrderTypeItem) => {
    setOpenOrder(false);
    if (item.value === params.orderType) return;
    const orderType = item.value || 'createTime';
    localStorage.setItem('orderType', orderType);
    searchStore.init();
    setSearchParams((state) => {
      return { ...state, ...params, orderType };
    });
  };

  //过滤器初始值
  const [filterValue, setFilterValue] = useState(getFilterValue(params));

  const filterValueOnChange = (checkedValue: CheckboxValueType[]) => {
    if (checkedValue.length === 0) return;
    setFilterValue(checkedValue);
  };

  //修改搜索范围
  const selectorFilterOnclickHandler = () => {
    if (!openFilter) return setOpenFilter(!openFilter);
    const filterType = filterTypeOptions
      .map((item) => {
        return filterValue.includes(item.value) ? '1' : '0';
      })
      .join(',');
    if (filterType === params.filterType) return;
    localStorage.setItem('filterType', filterType);
    searchStore.init();
    setSearchParams((state) => {
      return { ...state, ...params, filterType };
    });
  };

  return (
    <div className='search-selector'>
      <Dropdown
        dropdownRender={() => {
          return (
            <div className='selector-wrapper selector-order-wrapper'>
              {orderTypeItems.map((item) => {
                return (
                  <div
                    key={item.value}
                    className='selector-item selector-order-item'
                    onClick={() => selectorOrderItemOnClickHandler(item)}
                  >
                    {item.text}
                  </div>
                );
              })}
            </div>
          );
        }}
        getPopupContainer={() => {
          return document.querySelector('.search-selector')!;
        }}
        open={openOrder}
        onOpenChange={(flag) => {
          setOpenOrder(flag);
        }}
        trigger={['click']}
        placement='bottomRight'
        arrow
      >
        <Space style={{ marginRight: 20 }}>
          <span className='selector-text'>{orderTypeText}</span>
          <SortAscendingOutlined />
        </Space>
      </Dropdown>
      <Dropdown
        dropdownRender={() => {
          return (
            <div className='selector-wrapper selector-filter-wrapper'>
              <Checkbox.Group
                className='selector-item selector-filter-item'
                options={filterTypeOptions}
                value={filterValue}
                onChange={filterValueOnChange}
              />
            </div>
          );
        }}
        getPopupContainer={() => {
          return document.querySelector('.search-selector')!;
        }}
        open={openFilter}
        onOpenChange={(flag) => {
          setOpenFilter(flag);
          flag && setFilterValue(getFilterValue(params));
        }}
        trigger={['click']}
        placement='bottomRight'
        arrow
      >
        <Space onClick={selectorFilterOnclickHandler}>
          <span className='selector-text'>
            {openFilter ? '确认搜索' : '搜索范围'}
          </span>
          <FilterOutlined />
        </Space>
      </Dropdown>
    </div>
  );
}

export default SearchSelector;
