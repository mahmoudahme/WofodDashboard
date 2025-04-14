import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

function SignUpForm() {
  const [Message, setMessage] = React.useState(); // لتخزين الرسالة

  const [state, setState] = React.useState({
    fisrtName: "",
    lastName : "" ,
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };
  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { fisrtName , lastName , email, password } = state;
    try {
      const response = await axios.post("http://147.79.101.225:8888/api/auth/admin/register/" , state )
    
      if (response.status === 200) {
        setMessage(response.data.Message); 
        navigate("/");
        setTimeout(()=>{window.location.reload()} , 3000)
      }
    } catch (error) {
      if (error.response) {
        if(error.response.status === 500){
          setMessage("Email Is Used Before"); 
        }
      } else {
        console.log("Connection Error:", error.message);
        alert(error.message);
      }
    }

  };
  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit} className="formsign">
        <h1 style={{color : "black"}}> Create Account</h1>
        {Message && <h3 style={{color :"#0268d4"}}>{Message}</h3>}
        <input
          type="text"
          name="fisrtName"
          value={state.name}
          onChange={handleChange}
          placeholder="Enter Your First Name"
        />
        <input
          type="text"
          name="lastName"
          value={state.name}
          onChange={handleChange}
          placeholder="Enter Your Last Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
