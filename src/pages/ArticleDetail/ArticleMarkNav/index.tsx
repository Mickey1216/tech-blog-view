import { MenuOutlined } from '@ant-design/icons';
import { Dropdown, FloatButton } from 'antd';
import { useState } from 'react';
import MarkdownNavbar from 'markdown-navbar';
import './index.scss';

interface Props extends BaseProps {
  article: Article;
}

function ArticleMarkNav(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      getPopupContainer={() => {
        return document.getElementById('article-detail')!;
      }}
      placement='topRight'
      trigger={['click']}
      open={open}
      onOpenChange={(flag) => {
        setOpen(flag);
      }}
      dropdownRender={() => {
        return (
          <div className='article-mark-nav'>
            <div className='mark-nav-title'>目录</div>
            <div className='mark-nav-wrapper'>
              <MarkdownNavbar
                className='mark-nav'
                source={'\n' + props.article.content}
                ordered={true}
                updateHashAuto={true}
                declarative={true}
                headingTopOffset={60}
              />
            </div>
          </div>
        );
      }}
    >
      <FloatButton style={{ right: 20, bottom: 20 }} icon={<MenuOutlined />} />
    </Dropdown>
  );
}

export default ArticleMarkNav;
