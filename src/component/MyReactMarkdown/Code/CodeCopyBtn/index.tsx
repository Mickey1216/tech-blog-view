import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import './index.scss';

interface Props extends BaseProps {
  language: string;
}

export default function CodeCopyBtn({ children, language }: Props) {
  const [copyOk, setCopyOk] = useState(false);

  // CopyOutlined图标按钮回调函数
  const handleClick = async () => {
    const text = children[0].props.children[0];
    if (window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      copy(text);
    }
    setCopyOk(true);
  };

  useEffect(() => {
    if (copyOk) {
      setTimeout(() => {
        setCopyOk(false);
      }, 1000);
    }
  }, [copyOk]);

  return (
    <div className='code-copy-btn'>
      {copyOk ? (
        <Button className='copy-btn'>
          <LoadingOutlined />
        </Button>
      ) : (
        <Button className='copy-btn' onClick={handleClick}>
          <CopyOutlined />
        </Button>
      )}
      {language}
    </div>
  );
}
