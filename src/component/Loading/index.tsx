import ReactDOM from 'react-dom';
import './index.scss';

interface Props extends BaseProps {
  children: string;
}

function Loading(props: Props) {
  return ReactDOM.createPortal(
    <div className='loading'>
      <div className='sprite'></div>
      <br />
      {props.children.split('').map((item, index) => {
        return (
          <span
            key={index}
            className={`loading-text loading-text-${index + 1}`}
            style={{ animationDelay: index * 0.1 + 's' }}
          >
            {item}
          </span>
        );
      })}
    </div>,
    document.querySelector('#root')!
  );
}

export default Loading;
