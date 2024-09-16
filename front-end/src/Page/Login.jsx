import {useState } from "react";
import FormInput from "../Components/FormInput/FormInput";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import toast from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [isLoginScreen, setLoginScreen] = useState(true);
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [username, setUsername] = useState({ username: "" });

  const [, setCaptchaVerified] = useState(false);

  const recaptchaKey = "YOUR_RECAPTCHA_SITE_KEY"; // Replace with your site key

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "UserName",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
  ];
  const forgotInputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "Enter Your UserName",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
  ];
  const isForgotPasswordScreen = () => setLoginScreen(!isLoginScreen);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/users/login`,
        values
      );
      const {fullName} = response.data.user;

      const { token } = response.data;
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("token", token);

      if (response.data) {
        navigate("/company-table");
      }
    } catch (error) {
      toast.error(error.response?.data?.error);
    }
  };

  const handleVerfiyUsername = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/users/finduser/forgotpassword`,
        username
      );
      const { token } = response.data;
      if (response.data) {
        navigate(`/forgotPassword/${token}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onChangeForgot = (e) => {
    setUsername({ ...username, [e.target.name]: e.target.value });
  };

  const onCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  return (
    <div className="sign-main">
      {isLoginScreen ? (
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          ))}
          <i className="forgot-span" onClick={isForgotPasswordScreen}>
            Forgot password ?
          </i>
          <ReCAPTCHA sitekey={recaptchaKey} onChange={onCaptchaChange} />
          {/* disabled={!captchaVerified} */}
          <button className="submit-button">Login</button>
          <div className="login-prompt">
            New User?
            <Link to="/signup" className="login-link">
              Signup
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerfiyUsername}>
          <h1>Forgot Password</h1>
          {forgotInputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={username[input.name]}
              onChange={onChangeForgot}
            />
          ))}

          <button className="submit-button">Submit</button>
          <div className="login-prompt-forgot" onClick={isForgotPasswordScreen}>
            Back To Login
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
