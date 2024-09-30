// src/pages/MyNewPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {ComplexNavbar} from '../components/Navbar'
import {InputDefault} from '../components/InputField'
import {SubmitButton} from '../components/Button'

const FoodInput = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [quantityType, setQuantityType] = useState('');
  const [cost, setCost] = useState('');

  function submitForm() {
    console.log(itemName);
    console.log(stock);
    console.log(quantityType);
    console.log(cost);
  }

  return (
    <div>
      <div class="pt-2"></div>
      <ComplexNavbar></ComplexNavbar>
      <div class="flex justify-center">
      <div class="grid grid-cols-2 gap-36 place-content-between h-48 pt-10">
       <InputDefault label="Food Item Name" value={itemName} onChange={(e)=>setItemName(e.target.value)}/>
       <InputDefault label="Current Stock" value={stock} onChange={(e)=>setStock(e.target.value)}/>
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