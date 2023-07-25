import { Link, useNavigate } from 'react-router-dom';
import './index.scss';
import { Image } from 'antd';
import defaultImage from '@/assets/images/defaultImage.png';
import MyTag from '../MyTag';
import { LockOutlined } from '@ant-design/icons';
import { useRequestImage } from '@/hook';

interface Props extends BaseProps {
  article: Article;
  shadow?: boolean;
}

function MyCard(props: Props) {
  const { article, shadow, className, style } = props;

  const imageSrc = useRequestImage(article);

  const navigate = useNavigate();

  return (
    <Link
      className={`card ${className || ''}`}
      style={style}
      to={'/article/' + article.id}
    >
      <div className='info-wrapper'>
        {!article.publicState && (
          <MyTag hidePoint className='private-article' color={'red'}>
            <LockOutlined />
          </MyTag>
        )}
        <div className='info'>
          <MyTag
            color={article.tag.color}
            style={{ fontSize: '16px' }}
            tagProps={{
              onClick: (e) => {
                e.preventDefault();
                navigate(
                  `/article?kw=${article.tag.name}&orderType=tagName&filterType=0,0,0,1`,
                );
              },
            }}
          >
            {article.tag.name}
          </MyTag>
          {!shadow && (
            <>
              <span className='title'>{article.title}</span>
              <span className='create-time'>
                {article.createTime.format('YYYY.MM.DD')}
              </span>
            </>
          )}
        </div>
        {shadow && (
          <>
            <div className='introduction'>{article.introduction}</div>
            <div className='title'>{article.title}</div>
          </>
        )}
      </div>
      <Image
        src={imageSrc}
        alt={article.title}
        title={article.title}
        fallback={defaultImage}
        loading='lazy'
        preview={false}
      />
    </Link>
  );
}

export default MyCard;
