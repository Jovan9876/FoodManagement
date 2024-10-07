import * as React from 'react';
import { useState } from 'react';
export const Expenses = () => {
  const [shoppingList] = useState([
    { name: 'apples', quantity: 6, price: 3.99, img: 'apples.jpg' },
    { name: 'bananas', quantity: 4, price: 2.5, img: 'bananas.jpg' },
    { name: 'bread', quantity: 2, price: 3.0, img: 'bread.jpg' },
    { name: 'steak', quantity: 5, price: 55.0, img: 'steak.jpg' },
  ]);
  const [totalExpenses] = useState(() => {
    return shoppingList.reduce((acc, item) => acc + item.price, 0);
  });
  return (
    <div className=' justify-items-center'>
      <div>
        <header style={{ fontSize: '40px', justifyItems: 'center', paddingTop: '20px' }}>
          <h4>
            <b>Expenses Sheet:</b>
          </h4>
        </header>
        <ul className='w-96 outline outline-offset-2 outline-6 outline-light-green-800 pb-3 sm:pb-4 pt-1 pl-5 pr-2 mt-10'>
          {shoppingList.map((item, index) => (
            <li
              key={index}
              className='w-full border-b-4 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50'>
              <div className='flex items-center space-x-12 rtl:space-x-revers '>
                <img class='w-8 h-8 rounded-full mr-6' src={`/${item.name}.jpg`} alt='Bananas' />
                {item.name}: Quantity: {item.quantity} Price: ${item.price}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <header style={{ fontSize: '40px', justifyItems: 'center', paddingTop: '50px' }}>
          <h4>
            <b>Expenses Summary:</b>
          </h4>
        </header>
        <div className='flex items-center space-x-12 rtl:space-x-revers w-96 outline outline-offset-2 outline-6 outline-light-green-800 pb-3 sm:pb-4 pt-1 pl-5 pr-2 mt-10'>
          <p>Total Expenses: </p>
          <p>{`\$${totalExpenses}`}</p>
        </div>
      </div>
    </div>
  );
};
