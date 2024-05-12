import './App.css';
import {useRoutes} from "react-router-dom"
import routes from './routes';

export default function App(){
  // 使用路遊註冊表
  const element = useRoutes(routes)
  return(
    <div className='app'>
      {element}
    </div>
  );
}