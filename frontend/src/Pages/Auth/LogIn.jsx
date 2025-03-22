import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './School_SignUp.css'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "677130562489-hrvdg2tp2hlt7v0e7l2el986jdpng4cu.apps.googleusercontent.com"

const LogIn = () =>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            if (response.status == 200 || response.id) {
                localStorage.setItem('userId', response.data.id);
                navigate('/dashboard');
            }
        } catch (error) {
        console.error('Error Sign Up in', error);
        setError('Error signing up. Please try again later.');
        }
    }

    return(
        <div>
            <div className="signup-container">
                <div className='signup-form-container'>
                <img src='/src/assets/Images/LOGO.png'/>
                    <h1 style={{fontFamily: "Roboto, sans-serif"}}>Log In</h1>
                    <form style={{marginTop: '50px'}}>
                        <div>
                            <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                            required
                            className="admission-form-input"
                            />
                        </div>
                        <div>
                            <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="admission-form-input"
                            />
                        </div>
                        <button
                            type="submit"
                            className="signup-form-button"
                            onClick={handleSubmit}
                            disabled={!formData.email || !formData.password}
                        >
                            Log In
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {/* OR tag for different signup option */}
                        <p>OR</p>

                        {/* Sign In with Google */}
                        <GoogleOAuthProvider clientId={clientId}>
                            <GoogleLogin
                                cookiePolicy={"single_host_origin"}
                                onSuccess={console.log("Success")}
                                onError={() => {
                                setError("Sign in with Google Failed, Please try again later");
                                }}
                                isSignedIn={true}
                            />
                        </GoogleOAuthProvider>
                        <p style={{opacity: 0.8}}>I do not have an account yet ? <span>  Login</span> </p>
                    </form>
                </div>
                <div className='signup-plain-container'>
                    <div style={{textAlign: 'right', marginTop: '20px'}}>
                    <span >I do not have an account yet<button className="signup-form-button">Sign Up</button></span>
                    </div>
                    <h1 style={{marginTop: '40px', fontFamily: "Roboto, sans-serif"}}>EDU RISE Managemnt Software</h1>
                    <img src='/src/assets/Images/MANAGING-NOW.jpg' style={{height: '400px'}}/>
                </div>
            </div>
        </div>
    )
}

export default LogIn;