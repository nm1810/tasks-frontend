import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost:8000/api/login_check', {
      username: username,
      password: password
    }).then(function (data) {
        if (data.data.token) {
          setToken(data.data.token)
          setUsername('')
          setPassword('')
          navigate("/", { replace: true });
        } else {
          alert(data.message)
        }
      });
  };

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
          className={'inputBox'}
        />
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={handleLogin} value={'Log in'} />
      </div>
    </div>
  );
};

export default Login;
