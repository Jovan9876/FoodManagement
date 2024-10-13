// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { ComplexNavbar } from "../components/Navbar";
// import { InputDefault } from "../components/InputField";
// import { SubmitButton } from "../components/Button";

// const Login = () => {
//   const [userName, setUserName] = useState("");
//   const [userPassword, setUserPassword] = useState("");

//   async function submitForm() {
//     const userData = {
//       username: userName,
//       password: userPassword,
//     };

//     try {
//       const response = await fetch("http://127.0.0.1:5000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: 'include',
//         body: JSON.stringify(userData),
//       });

//       if (response.ok) {
//         const jsonResponse = await response.json();
//         console.log(response);
//         console.log(jsonResponse);
//         console.log(jsonResponse.message);
//         window.location.href = "/input";
//       } else {
//         console.error("Error:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   }

//   return (
//     <div>
//       <div className="flex justify-center">
//         <div className="grid grid-cols-2 gap-36 place-content-between h-48 pt-10">
//           <InputDefault
//             label="User Name"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//           />
//           <InputDefault
//             label="Password"
//             type="password"
//             value={userPassword}
//             onChange={(e) => setUserPassword(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="pl-10 flex justify-center pt-60">
//         <SubmitButton label="Login" onClick={submitForm} />
//       </div>

//       <div className="flex justify-center pt-5">
//         <Link to="/Register">Don't have an account? Register here</Link>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { InputDefault } from "../components/InputField";
import { SubmitButton } from "../components/Button";

const Login = ({ onLogin }) => { // Accept onLogin prop
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  async function submitForm() {
    const userData = {
      username: userName,
      password: userPassword,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(response);
        console.log(jsonResponse);
        console.log(jsonResponse.message);
        
        // Call the onLogin function to update the auth state
        onLogin();

        // Use navigate to redirect to the input page
        navigate("/");
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <div className="login-box">
        <div className="input-grid">
          <InputDefault
            label="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <InputDefault
            label="Password"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>
        <div className="submit-button">
          <SubmitButton label="Login" onClick={submitForm} />
        </div>
        <div className="register-link">
          <Link to="/Register">Don't have an account? Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
