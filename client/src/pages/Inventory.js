import * as React from 'react';

export const Inventory = () => {
  const [inventory, setInventory] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:5000/inventory', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const [rows, columnNames] = await response.json();

          const newInventory = rows.map((data) => {
            return columnNames.reduce((previous, columnName, index) => {
              if (columnName === 'nutrition_info') {
                previous[columnName] = JSON.parse(data[index]);
              } else {
                previous[columnName] = data[index];
              }

              return previous;
            }, {});
          });

          setInventory(newInventory);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    void fetchData();
  }, []);

  console.log(inventory);

  return (
    <div className=''>
      <ul class='max-w-md divide-y divide-gray-200 dark:divide-gray-700'>
        {inventory.map((item) => (
          <li class='pb-3 sm:pb-4' key={item.id}>
            <div class='flex items-center space-x-4 rtl:space-x-reverse'>
              <div class='flex-shrink-0'>
                <img class='w-8 h-8 rounded-full' src='https://sl.bing.net/fiaDToK9WdU' alt='Neil' />
              </div>
              <div class='flex-1 min-w-0'>
                <p class='text-sm font-medium text-gray-900 truncate dark:text-white'>{item.name}</p>
                <p class='text-sm font-medium text-gray-900 truncate dark:text-white'>{item.nutrition_info.calories}</p>

                {/* need to add stock here */}
                {/* <p class='text-sm text-gray-500 truncate dark:text-gray-400'>{item.Inventory}</p> */}
              </div>
              <div class='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
                {item.cost}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
