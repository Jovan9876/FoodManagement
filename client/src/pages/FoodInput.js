import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {ComplexNavbar} from '../components/Navbar'
import {InputDefault} from '../components/InputField'
import {SubmitButton} from '../components/Button'

const FoodInput = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityType, setQuantityType] = useState('');
  const [cost, setCost] = useState('');

  async function submitForm() {
    const foodData = {
        name: itemName,
        quantity: quantity,
        quantityType: quantityType,
        cost: cost,
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/input_food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foodData),
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse.message);
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
       <InputDefault label="Food Item Name" value={itemName} onChange={(e)=>setItemName(e.target.value)}/>
       <InputDefault label="Quantity" value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
       <InputDefault label="Quantity Type" value={quantityType} onChange={(e)=>setQuantityType(e.target.value)}/>
       <InputDefault label="Cost" value={cost} onChange={(e)=>setCost(e.target.value)}/>
        </div>
      </div>
   
      <div class="pl-10 flex justify-center pt-60">
      <SubmitButton label="Submit" onClick={submitForm}/>
      </div>
    </div>
  );
};

export default FoodInput;