import MyTag from '@/component/MyTag';
import { useRequestImage } from '@/hook';
import {
  CalendarOutlined,
  EditOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import defaultImage from '@/assets/images/defaultImage.png';
import { Image } from 'antd';
import './index.scss';

interface Props extends BaseProps {
  article: Article;
  index: number;
}

function ArticleListItem({ article, index }: Props) {
  const imageSrc = useRequestImage(article);

  return (
    <div
      className='article-list-item animate__animated animate__zoomIn'
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className='img-wrapper'>
        <Link className='title' to={'/article/' + article.id}>
          <Image
            src={imageSrc}
            alt={article.title}
            title={article.title}
            fallback={defaultImage}
            loading='lazy'
            preview={false}
          />
        </Link>
        <Link className='tag-link' to={`/article?kw=${article.tag.name}&orderType=tagName&filterType=0,0,0,1`}>
          <MyTag color={article.tag.color}>{article.tag.name}</MyTag>
        </Link>
      </div>
      <div className='detail'>
        <Link className='title' to={'/article/' + article.id}>
          {article.title}
        </Link>
        <div className='info'>
          <span>
            <CalendarOutlined />
            {article.createTime.format('YYYY.MM.DD')}
          </span>
          <span>
            <EditOutlined />
            {article.updateTime.format('YYYY.MM.DD')}
          </span>
          {!article.publicState && (
            <span>
              <LockOutlined />
              私有
            </span>
          )}
        </div>
        <span className='introduction'>{article.introduction}</span>
      </div>
    </div>
  );
}

export default ArticleListItem;
