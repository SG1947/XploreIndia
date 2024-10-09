import {useState} from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const url=import.meta.env.VITE_SERVER_URL;
export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(`${url}/register`, {
      method: 'POST',
      body: JSON.stringify({username,email,password}),
      headers: {'Content-Type':'application/json'},
    });
    if (response.status === 200) {
      toast.success('Registration successful! Now you can log in', {
        position: "top-center"
      });
    } else {
      toast.error('Registration failed. Please try again later', {
        position: 'top-center',
      }); 
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="email"
             placeholder="example@email.com"
             value={email}
             onChange={ev => setEmail(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Register</button>
      <ToastContainer />
      Already registered?<span><Link to={'/login'}>Login</Link></span>
    </form>
  );
}
