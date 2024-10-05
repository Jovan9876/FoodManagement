import * as React from 'react';

export const Inventory = () => {
  const [inventory, setInventory] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:5000/inventory');
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
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            <h1>{item.name}</h1>
          </li>
        ))}
      </ul>
    </div>
  );
};
