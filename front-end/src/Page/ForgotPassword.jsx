import { useState } from "react";
import FormInput from "../Components/FormInput/FormInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;
const ForgotPassword = () => {
  let { token } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const inputs = [
    {
      id: 1,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
    {
      id: 2,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      label: "Confirm Password",
      pattern: values.password,
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respone = await axios.post(
        `${apiUrl}/api/v1/users/forgotpassword`,
        { ...values, token }
      );
      toast.success(respone.data.message);
      if (respone) {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data?.error);
      // toast.error(error);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="sign-main">
      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button className="submit-button">Submit</button>
        <div className="login-prompt">
          User?
          <Link to="/login" className="login-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
