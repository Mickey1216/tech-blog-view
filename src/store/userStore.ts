/**
 * MobX，它通过透明的函数响应式编程(transparently applying functional reactive programming - TFRP)使得状态管理变得简单和可扩展。
 */
import { observable, action, makeObservable, configure, computed } from 'mobx';

configure({
  enforceActions: 'observed' // 必须使用@action函数修改状态
});

const defaultUser = {
  id: '',
  token: '',
  username: '',
  password: '',
  recommendIdList: []
};

class UserStore {
  constructor() {
    makeObservable(this);
  }

  init = false; 

  // @observable可被观测的数据
  @observable user: User = defaultUser;

  @action
  login(nUser?: typeof this.user) {
    this.init = true;
    if (!nUser) return;
    this.user = nUser;
    if (nUser.token) localStorage.setItem('token', nUser.token);
  }

  @action
  logout() {
    this.user = { ...defaultUser };
    this.init = true;
  }

  @computed
  get isLogin() {
    if (this.user.token) return true;
    return false;
  }
}

const userStore = new UserStore();

export default userStore;
