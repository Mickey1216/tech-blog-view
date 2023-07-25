import request from './request';

// 用户登录
export const userLogin = async (data?: UserLoginForm): Promise<User | undefined> => {
  try {
    return await request({ url: 'user/login', method: 'Post', data });
  } catch (error: any) {
    // 密码错误，清除token
    if (error.message === '密码错误') localStorage.removeItem('token');
  }
};

// 获取所有标签
export const getAllTag = async (): Promise<Tag[]> => {
  return await request({ url: 'tag' });
};

// 添加标签
export const addTag = async (data: {
  name: string;
  color: string;
}): Promise<Tag> => {
  return await request({ url: 'tag', method: 'Post', data });
};

// 更新标签
export const updateTag = async (data: {
  id: string;
  name: string;
  color: string;
}): Promise<Tag> => {
  return await request({ url: 'tag', method: 'Put', data });
};

// 删除标签（根据标签id）
export const deleteTag = async (id: string) => {
  return await request({ url: 'tag', method: 'Delete', data: { id } });
};

// 更新用户推荐列表
export const updateUserRecommendList = async (
  recommendIdList: string[],
  id: string
): Promise<User> => {
  return await request({
    url: 'user/recommendList',
    method: 'Put',
    data: { recommendIdList, id }
  });
};

// 获取用户推荐列表
export const getRecommendArticleList = async (
  recommendIdList: string[],
  defaultData?: boolean
): Promise<Article[]> => {
  return await request({
    url: `article/recommendList`,
    method: 'Post',
    data: { recommendIdList, defaultData }
  });
};

// 根据id获取某篇文章
export const getArticle = async (id: string): Promise<Article> => {
  return await request({ url: `article/${id}`, method: 'Get' });
};

// 创建文章
export const addArticle = async (fd: FormData): Promise<Article> => {
  return await request({
    url: 'article',
    method: 'Post',
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
};

// 更新文章
export const updateArticle = async (fd: FormData): Promise<Article> => {
  return await request({
    url: 'article',
    method: 'Put',
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 删除文章（根据文章id）
export const deleteArticle = async (id: string): Promise<{ affected: number }> => {
  return await request({ url: 'article', method: 'Delete', data: { id } });
};

// 搜索文章
export const searchArticle = async (params?: SearchArticleParams): Promise<SearchArticleResponseData> => {
  return await request({
    url: 'article',
    method: 'Get',
    params
  });
};

// 获取图片
export const getImage = async (url: string) => {
  try {
    const imageSrc = (await request({
      url: 'images/' + url,
      responseType: 'blob',
      timeout: 3 * 60 * 1000 // 3分钟
    })) as Blob;
    return imageSrc ? URL.createObjectURL(imageSrc) : '';
  } catch (error) {
    return '';
  }
};