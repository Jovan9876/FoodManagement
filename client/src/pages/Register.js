import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {ComplexNavbar} from '../components/Navbar'
import {InputDefault} from '../components/InputField'
import {SubmitButton} from '../components/Button'

const RegisterInput = () => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');

  async function submitForm() {
    const userData = {
        username: userName,
        password: userPassword,
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // credentials: 'include',
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse.message);
            window.location.href = "/login";
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

  return (
    <div>
      
      <div class="flex justify-center">
      <div class="grid grid-cols-2 gap-36 place-content-between h-48 pt-10">
       <InputDefault label="User Name" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
       <InputDefault label="Password" type="password" value={userPassword} onChange={(e)=>setUserPassword(e.target.value)}/>
        </div>
      </div>
   
      <div class="pl-10 flex justify-center pt-60">
      <SubmitButton label="Submit" onClick={submitForm}/>
      </div>
    </div>
  );
};

export default RegisterInput;