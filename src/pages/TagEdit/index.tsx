import { useState } from 'react';
import { Button, Input, message } from 'antd';
import './index.scss';
import {
  useChangePageTitle,
  useGetTagListData,
  useOpenMessageThrottle,
  useShowPromiseModal
} from '@/hook';
import { addTag, deleteTag, updateTag } from '@/request';
import MyTag from '@/component/MyTag';

function EditTag() {
  useChangePageTitle('Mickey技术博客-编辑标签', []);

  const { tagList, setTagList } = useGetTagListData();
  const [newTag, setNewTag] = useState<Omit<Tag, 'id'>>({
    name: '',
    color: '#000000'
  });

  const openMessage = useOpenMessageThrottle(1000);

  const showPromiseModal = useShowPromiseModal('confirm');

  // 输入绑定
  const changeOldTag = (item: Tag, target: keyof Tag, value: string) => {
    setTagList((state) => {
      item[target] = value;
      return [...state];
    });
  };

  // 修改标签：标签名称/标签颜色
  const changeNewTag: SetStateFunctionHandler<typeof newTag> = (
    target,
    value
  ) => {
    setNewTag((tag) => {
      tag[target] = value;
      return { ...tag };
    });
  };

  // 修改/删除按钮回调函数
  const submitOldTag = (item: Tag, type: 'Delete' | 'Edit') => {
    switch (type) {
      case 'Delete':
        showPromiseModal({
          title: '删除标签',
          content: '确认删除该标签？',
          onOk(...args) {
            return new Promise(async (resolve, reject) => {
              try {
                await deleteTag(item.id);
                setTagList((state) => {
                  state = state.filter((tagItem) => {
                    return tagItem.id !== item.id;
                  });
                  return [...state];
                });
                message.success('标签删除成功', 3);
              } catch (error) {
                message.warning((error as Error).message, 3);
              }
              resolve('');
            });
          }
        });
        return;
      case 'Edit':
        if (item.name.trim() === '') {
          openMessage({ type: 'warning', content: '标签名不能为空' });
          return;
        }
        showPromiseModal({
          title: '编辑标签',
          content: '确认编辑该标签？',
          onOk(...args) {
            return new Promise(async (resolve, reject) => {
              try {
                await updateTag(item);
                message.success('标签编辑成功', 3);
              } catch (error) {
                message.warning((error as Error).message, 3);
              }
              resolve('');
            });
          }
        });
        return;
    }
  };

  // 新增按钮回调函数
  const submitNewTag = () => {
    if (newTag.name.trim() === '') {
      openMessage({ type: 'warning', content: '标签名不能为空' });
      return;
    }
    showPromiseModal({
      title: '创建新标签',
      content: '确认创建新标签？',
      onOk(...args) {
        return new Promise(async (resolve, reject) => {
          try {
            const data = await addTag(newTag);
            setTagList((state) => {
              return [...state, data];
            });
            setNewTag({ name: '', color: '#000000' });
            message.success('标签创建成功', 3);
          } catch (error) {
            message.warning((error as Error).message, 3);
          }
          resolve('');
        });
      }
    });
  };

  return (
    <div className='edit-tag'>
      <h1>编辑标签</h1>
      <div className='edit-container'>
        {tagList.map((item, index) => {
          return (
            <div className='tag-item' key={item.id}>
              <Input
                placeholder='标签名称'
                size='small'
                value={item.name}
                style={{ width: '120px' }}
                onChange={(e) => {
                  changeOldTag(item, 'name', e.target.value);
                }}
              />
              <Input
                size='small'
                type='color'
                value={item.color}
                style={{ width: '50px' }}
                onChange={(e) => {
                  changeOldTag(item, 'color', e.target.value);
                }}
              />
              <Button
                type='primary'
                size='small'
                onClick={() => {
                  submitOldTag(item, 'Edit');
                }}
              >
                修改
              </Button>
              <Button
                type='primary'
                size='small'
                onClick={() => {
                  submitOldTag(item, 'Delete');
                }}
                danger
              >
                删除
              </Button>
              <MyTag color={item.color} className='small-screen-hide'>
                {item.name}
              </MyTag>
            </div>
          );
        })}
        <div className='tag-item'>
          <Input
            placeholder='标签名称'
            size='small'
            style={{ width: '100px' }}
            value={newTag.name}
            onChange={(e) => {
              changeNewTag('name', e.target.value);
            }}
          />
          <Input
            placeholder='标签颜色'
            size='small'
            type='color'
            style={{ width: '50px' }}
            value={newTag.color}
            onChange={(e) => {
              changeNewTag('color', e.target.value);
            }}
          />
          <Button type='primary' size='small' onClick={submitNewTag}>
            新增
          </Button>
          {newTag.name && <MyTag color={newTag.color}>{newTag.name}</MyTag>}
        </div>
      </div>
    </div>
  );
}

export default EditTag;
