import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import {InputDefault} from '../components/InputField'
import {SubmitButton} from '../components/Button'
import { TextareaSizes } from '../components/TextArea';

const FoodInput = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitType, setUnitType] = useState('');
  const [cost, setCost] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const [category, setCategory] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  async function submitForm() {
    const foodData = {
        name: itemName,
        quantity: quantity,
        unitType: unitType,
        cost: cost,
        lowThreshold: lowThreshold,
        category: category,
        expirationDate: expirationDate,
        description: description
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/input_food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
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
    <div class="pb-3">
      <div class="pl-44 pt-6">
      <h1 class="font-bold text-2xl">Add New Food Item</h1>
      <h2 class="font-normal pb-10">Let's add your new food item</h2>
      </div >
     
      <div class="flex justify-center">
      <div class="grid grid-cols-3 grid-rows-6 gap-16 p-10 border-solid border-2 border-black rounded-lg">
       <InputDefault class="" label="Food Item Name" value={itemName} placeholder={"e.g. Banana"} onChange={(e)=>setItemName(e.target.value)}/>
       <InputDefault label="Quantity" value={quantity} placeholder={"e.g. 5"} type={"number"} onChange={(e)=>setQuantity(e.target.value)}/>
       <InputDefault label="Unit of Measure" value={unitType} placeholder={"e.g. lbs, kg, each"} onChange={(e)=>setUnitType(e.target.value)}/>
       <InputDefault label="Cost" value={cost} placeholder={"e.g. 2.99"} type={"number"} onChange={(e)=>setCost(e.target.value)}/>
       <InputDefault label="Category" value={category} placeholder={"e.g. Fruit, Vegtable, Frozen"} onChange={(e)=>setCategory(e.target.value)}/>
       <InputDefault label="Low Threshold Amount" value={lowThreshold} placeholder={"e.g. < 2"}  type={"number"} onChange={(e)=>setLowThreshold(e.target.value)}/>
       <InputDefault label="Expiration Date" value={expirationDate} placeholder={"e.g. 2024-10-08"} type={"date"} onChange={(e)=>setExpirationDate(e.target.value)}/>
       <div class="col-span-2 row-span-2 row-start-4">
       <TextareaSizes label="Description (Optional)"value={description} onChange={(e)=>setDescription(e.target.value)}/>
        </div>
        <div class="row-start-6 col-start-2 justify-center flex">
        <SubmitButton label="Submit" onClick={submitForm}/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FoodInput;