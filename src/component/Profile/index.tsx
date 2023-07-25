import './index.scss';
import avatar from '@/assets/images/avatar.png';

function Profile() {
  return (
    <div className='profile'>
      <img src={avatar} className='avatar' alt='头像' />
      <span className='name'>Mickey</span>
      <span className='job'>前端开发工程师</span>
      <span className='info'>不会滑雪的游泳佬不是一个称职的代码搬运工</span>
    </div>
  );
}

export default Profile;
