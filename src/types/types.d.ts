type Dayjs = import('dayjs').Dayjs;

type SetStateFunctionHandler<T> = <K extends keyof T>(
  target: K,
  value: T[K],
) => void;

// 基础props
interface BaseProps {
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  key?: number | string;
}

// 文章
interface Article {
  id: string;
  title: string;
  tag: Tag;
  introduction: string;
  content: string;
  imageSrc: string;
  createTime: Dayjs;
  updateTime: Dayjs;
  publicState: boolean; // 是否公开
}

// 文章表单数据
interface ArticleForm {
  title: string;
  tagId: string; // 标签id
  content: string;
  introduction: string;
  createTime: Dayjs;
  updateTime: Dayjs;
  publicState: boolean;
}

// 标签
interface Tag {
  id: string;
  name: string;
  color: string;
}

// 登录数据
interface UserLoginForm {
  username: string;
  password: string;
}

// 用户
interface User extends UserLoginForm {
  id: string;
  recommendIdList?: string[];
  token?: string;
}

// 搜索参数
interface SearchArticleParams {
  skip?: number; // 跳过多少条
  take?: number; // 获取多少条
  kw?: string; // 关键字
  order?: 'DESC' | 'ASC'; // 排序方式
  orderType?: 'createTime' | 'updateTime' | 'tagName'; // 排序类型
  filterType?: `${'1' | '0'},${'1' | '0'},${'1' | '0'},${'1' | '0'}`; // 对应title、introduction、content、tagName（1为搜索）
}

// 搜索文章响应的数据
interface SearchArticleResponseData {
  count: number; // 数量
  articleList: Article[];
}

// 扩展Jquery类型
interface JQuery {
  ripples: (
    options:
      | {
          resolution: number;
          dropRadius: number;
          perturbance: number;
          interactive: boolean;
        }
      | 'destroy'
      | 'drop',
    x?: number,
    y?: number,
    dropRadius?: number,
    strength?: number,
  ) => JQuery;
}
