import * as React from 'react';
import { useState } from 'react';

export const Expenses = () => {
  const [shoppingList] = useState([
    {
      id: 1,
      name: 'apples',
      cost: 3.99,
      quantity: 6,
      nutrition_info: { calories: 52, fat: 0.2, carbs: 14, protein: 0.3 },
    },
    {
      id: 2,
      name: 'bananas',
      cost: 2.5,
      quantity: 4,
      nutrition_info: { calories: 89, fat: 0.3, carbs: 23, protein: 1.1 },
    },
    {
      id: 3,
      name: 'bread',
      cost: 3.0,
      quantity: 2,
      nutrition_info: { calories: 265, fat: 3.2, carbs: 49, protein: 9 },
    },
    {
      id: 4,
      name: 'steak',
      cost: 55.0,
      quantity: 5,
      nutrition_info: { calories: 679, fat: 48, carbs: 0, protein: 62 },
    },
  ]);

  const [totalExpenses] = useState(() => {
    return shoppingList.reduce((acc, item) => acc + item.cost, 0);
  });

  const normalizeItemName = (name) => {
    const normalizedNames = {
      bread: 'bread',
    };

    // Check if the name contains any of the keys in normalizedNames
    for (const key in normalizedNames) {
      if (name.toLowerCase().includes(key)) {
        return normalizedNames[key];
      }
    }

    // If the name is not in the normalizedNames, add it and return the plural form by default
    const normalizedName = name.toLowerCase();
    const pluralName = normalizedName.endsWith('s') ? normalizedName : `${normalizedName}s`;
    normalizedNames[normalizedName] = pluralName;
    return pluralName;
  };

  return (
    <div className='justify-items-center'>
      <div>
        <header style={{ fontSize: '40px', justifyItems: 'center', paddingTop: '20px' }}>
          <h4>
            <b>Expenses Sheet:</b>
          </h4>
        </header>
        <ul className='w-96 outline outline-offset-2 outline-6 outline-light-green-800 pb-3 sm:pb-4 pt-1 pl-5 pr-2 mt-4'>
          {shoppingList.map((item, index) => (
            <li
              key={index}
              className='w-full border-b-4 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50'>
              <div className='flex items-center space-x-12 rtl:space-x-reverse'>
                <img
                  className='w-16 h-16 rounded-full mr-6'
                  src={`/${normalizeItemName(item.name)}.jpg`}
                  alt={item.name}
                />
                {item.name}: Quantity: {item.quantity} Price: ${item.cost}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <header style={{ fontSize: '40px', justifyItems: 'center', paddingTop: '20px' }}>
          <h4>
            <b>Expenses Summary:</b>
          </h4>
        </header>
        <p>Total Expenses: ${totalExpenses}</p>
      </div>
    </div>
  );
};
