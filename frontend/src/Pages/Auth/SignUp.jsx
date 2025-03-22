// importing requirements
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './School_SignUp.css'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// defining client ID of Google Auth2.0
const clientId = "677130562489-hrvdg2tp2hlt7v0e7l2el986jdpng4cu.apps.googleusercontent.com"

// defining function
const SignUp = () =>{

    // initialize navigate by defining constant
    const navigate = useNavigate();

    // intialize the Hooks
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    // defining the function of handle change 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    // defining the submit function of sign up
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
            if (response.status == 200) {
                console.log("auth token", response.data.token);
                localStorage.setItem('userId', response.data.token);
                navigate('/verifying');
            }
        } catch (error) {
        console.error('Error Sign Up in', error);
        setError('Error signing up. Please try again later.');
        }
    }

    // defining the google auth function on sucess
    const HandleAuth = async (response) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/google", { token: response.credential });
            localStorage.setItem("token", res.data.token); // Store JWT token
            navigate("/dashboard")
        } catch (error) {
            console.error("Auth failed", error);
        }
    }

    return(
        <div>

            {/* creating whole page in two column*/}
            <div className="signup-container">

                {/* This is a form part */}
                <div className='signup-form-container'>

                    {/* Adding the logo image and heading*/}
                    <img src='/src/assets/Images/LOGO.png'/>
                    <h1 style={{fontFamily: "Roboto, sans-serif"}}>Register your account</h1>

                    {/* Sign Up Form */}
                    <form style={{marginTop: '50px'}}>

                        {/* Email input field */}
                        <div>
                            <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                            required
                            className="admission-form-input"
                            style={{padding: '10px'}}
                            />
                        </div>

                        {/* Password input field */}
                        <div>
                            <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create Password"
                            required
                            className="admission-form-input"
                            style={{padding: '10px'}}
                            />
                        </div>

                        {/* Confirm Password field */}
                        <div>
                            <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            required
                            className="admission-form-input"
                            style={{padding: '10px'}}
                            />
                        </div>

                        {/* Terms and Condition field */}
                        <div style={{marginTop: '5px'}}>
                            <input
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="terms" style={{fontFamily: "Roboto, sans-serif"}}>I agree to the terms and conditions</label>
                        </div>

                        {/* Form submit button */}
                        <button
                            type="submit"
                            className="signup-form-button"
                            onClick={handleSubmit}
                            disabled={!formData.terms || !formData.email || !formData.password || !formData.confirmPassword}
                            style={{marginBottom: 20}}
                        >
                            Sign Up
                        </button>

                        {/* OR tag for different signup option */}
                        <p>OR</p>

                        {/* Sign Up with Google */}
                        <GoogleOAuthProvider clientId={clientId}>
                            <GoogleLogin
                                cookiePolicy={"single_host_origin"}
                                onSuccess={HandleAuth}
                                onError={() => {
                                setError("Sign in with Google Failed, Please try again later");
                                }}
                                isSignedIn={true}
                            />
                        </GoogleOAuthProvider>

                        {/* Error in Sign Up message */}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {/* Sign In route */}
                        <p style={{opacity: 0.8}}>Already have an account ? <span>  Login</span> </p>
                    </form>
                </div>

                {/* This is a secound column */}
                <div className='signup-plain-container'>

                    {/* Sign In route */}
                    <div style={{textAlign: 'right', marginTop: '20px'}}>
                    <span >Already have an account ? <button className="signup-form-button">Login</button></span>
                    </div>
                    
                    {/* Adding Advertising Image */}
                    <img src='/src/assets/Images/MANAGING-NOW.JPg' style={{height: '500px'}}/>
                </div>
            </div>
        </div>
    )
}

export default SignUp;