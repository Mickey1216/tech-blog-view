import { MenuOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { useState } from 'react';
import MySearch from '../MySearch';
import Profile from '../../Profile';
import './index.scss';

function MyHeadDrawer() {
  const [open, setOpen] = useState(false);

  const openSwitch = (value: boolean) => {
    setOpen(value);
  };

  return (
    <div className='my-head-dropdown small-screen-show' id='my-head-dropdown'>
      <Dropdown
        getPopupContainer={() => {
          return document.getElementById('my-head-dropdown')!;
        }}
        trigger={['click']}
        placement='bottomRight'
        open={open}
        dropdownRender={() => {
          return (
            <>
              <div
                className='dropdown-mask'
                onClick={(e) => {
                  e.preventDefault();
                  openSwitch(false);
                }}
              ></div>
              <div className='dropdown-container'>
                <MySearch></MySearch>
                <Profile></Profile>
              </div>
            </>
          );
        }}
      >
        <Button
          type='link'
          onClick={(e) => {
            e.preventDefault();
            openSwitch(!open);
          }}
        >
          <Space>
            <MenuOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
}

export default MyHeadDrawer;
