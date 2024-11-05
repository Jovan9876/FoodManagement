import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import * as React from 'react';

export const Inventory = () => {
  const [inventory, setInventory] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(!open);
  };

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

  const normalizeItemName = (name) => {
    const normalizedNames = {
      apple: 'apples',
      carrot: 'carrots',
      pizza: 'pizzas',
      steak: 'steaks',
      sushi: 'sushi',
      bread: 'bread',
      // Add more mappings as needed
    };

    for (const key in normalizedNames) {
      if (name.toLowerCase().includes(key)) {
        return normalizedNames[key];
      }
    }

    const normalizedName = name.toLowerCase();
    return normalizedName.endsWith('s') ? normalizedName : `${normalizedName}s`;
  };

  return (
    <div className='justify-items-center pt-8'>
      <ul className='flex flex-col space-y-4 max-w-xl divide-y pl-8'>
        {inventory.map((item) => (
          <li
            className='outline outline-offset-2 outline-6 outline-light-green-800 rounded-3xl pb-3 sm:pb-4 pt-4 pl-5 pr-2'
            key={item.id}>
            <div className='flex items-center space-x-4 rtl:space-x-reverse'>
              <div className='flex-shrink-0 flex justify-center items-center w-16 h-16'>
                <img className='w-16 h-16 rounded-full' src={`/${normalizeItemName(item.name)}.jpg`} alt={item.name} />
              </div>
              <div className='flex-1 min-w-0 pl-2 flex flex-col items-center'>
                <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>{item.name}</p>
                <Button onClick={() => handleOpen(item)} variant='text' color='green' size='sm'>
                  NUTRITION
                </Button>
              </div>
              <div className='flex flex-col items-start text-base font-semibold text-gray-900 dark:text-white'>
                <div className='inline-flex items-center'>
                  <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>Price:</p>
                  {item.cost}
                </div>
                <div className='inline-flex items-center'>
                  <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>Stock:</p>
                  {item.quantity}
                </div>
              </div>
              <Button
                onClick={() => (window.location.href = `http://127.0.0.1:3000/input/${item.name}`)} // Navigate to the input page for this food item
                variant='outlined'
                color='blue'
                size='sm'>
                Update
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <Dialog open={open} handler={() => setOpen(!open)} size='xs'>
          <DialogHeader>NUTRITIONAL INFO FOR: {selectedItem.name.toUpperCase()}</DialogHeader>
          <DialogBody>
            <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
              CALORIES: {`\t${selectedItem.nutrition_info.calories}`}
              <br></br>
              FAT: {`\t${selectedItem.nutrition_info.fat}`}
              <br></br>
              CARBS: {`\t${selectedItem.nutrition_info.carbs}`}
              <br></br>
              PROTEIN: {`\t${selectedItem.nutrition_info.protein}`}
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant='text' color='green' onClick={() => setOpen(!open)} className='mr-1'>
              <span>CLOSE</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};
