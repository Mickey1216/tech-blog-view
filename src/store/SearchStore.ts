/**
 * MobX，它通过透明的函数响应式编程(transparently applying functional reactive programming - TFRP)使得状态管理变得简单和可扩展。
 */
import { observable, action, makeObservable, configure } from 'mobx';

configure({
  enforceActions: 'observed' // 必须使用@action函数修改状态
});

class SearchStore {
  constructor() {
    makeObservable(this); // mobx6后需要添加这个构造函数，组件才会更新
    this.init();
  }

  // @observable可被观测的数据
  @observable kw: string = '';

  // @observable可被观测的数据
  @observable orderType: SearchArticleParams['orderType'] = 'createTime';

  // @observable可被观测的数据
  @observable filterType: SearchArticleParams['filterType'] = '1,1,1,1';

  // 箭头函数保证this指向，普通函数则使用@action.bound
  @action
  setKw(str: string) {
    this.kw = str;
  }

  @action
  init() {
    // 设置orderType
    let orderType: any = localStorage.getItem('orderType');
    if (orderType === null) {
      localStorage.setItem('orderType', 'createTime');
      orderType = 'createTime';
    }

    if (!['createTime', 'updateTime', 'tagName'].includes(orderType)) {
      orderType = 'createTime';
      localStorage.setItem('orderType', orderType);
    }

    this.orderType = orderType;

    // 设置filterType
    let filterType: any = localStorage.getItem('filterType');
    if (filterType === null) {
      localStorage.setItem('filterType', '1,1,1,1');
      filterType = '1,1,1,1';
    }

    let refreshFilterType = false;
    let filterTypeArr: Array<'0' | '1'> = filterType
      .split(',')
      .map((item: string) => {
        if (['1', '0'].includes(item)) return item;
        refreshFilterType = true;
        return '1';
      });
    if (filterTypeArr.length !== 4) {
      filterTypeArr = ['1', '1', '1', '1'];
      refreshFilterType = true;
    }
    filterType = filterTypeArr.join(',');
    refreshFilterType && localStorage.setItem('filterType', filterType);

    this.filterType = filterType;
  }
}

const searchStore = new SearchStore();

export default searchStore;

// 注意：函数式组件需包裹observer()，调用该实例可直接使用变量和函数
// export default observer(MyHead);
