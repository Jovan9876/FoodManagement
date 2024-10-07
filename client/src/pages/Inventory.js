import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import * as React from 'react';
export const Inventory = () => {
  const [inventory, setInventory] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

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
  console.log('inventory is :::::::::<br></br>');
  console.log(inventory);

  return (
    <div className='justify-items-center pt-8'>
      <ul class='flex flex-col space-y-8 max-w-md divide-y pl-8'>
        {inventory.map((item) => (
          <li
            class='outline outline-offset-2 outline-6 outline-light-green-800 rounded-3xl pb-3 sm:pb-4 pt-4 pl-5 pr-2'
            key={item.id}>
            <div class='flex items-center space-x-2 rtl:space-x-reverse'>
              <div class='flex-shrink-0'>
                <img class='w-8 h-8 rounded-full' src={`/${item.name}.jpg`} alt='Bananas' />
              </div>
              <div class='flex-1 min-w-0 pl-2'>
                <p class='text-sm font-medium text-gray-900 truncate dark:text-white'>{item.name}</p>
              </div>
              <div class='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white pr-6'>
                <p class='text-sm font-medium text-gray-900 truncate dark:text-white'>Stock:</p>
                {item.quantity}
                <Button onClick={handleOpen} variant='text' color='green' size='sm'>
                  NUTRITION
                </Button>
                <Dialog open={open} handler={handleOpen} size='xs'>
                  <DialogHeader>NUTRITIONAL INFO:</DialogHeader>
                  <DialogBody>
                    <p class='text-sm font-medium text-gray-900 truncate dark:text-white'>
                      CALORIES: {`\t${item.nutrition_info.calories}`}
                      <br></br>
                      FAT: {`\t${item.nutrition_info.fat}`}
                      <br></br>
                      CARBS: {`\t${item.nutrition_info.carbs}`}
                      <br></br>
                      PROTEIN: {`\t${item.nutrition_info.protein}`}
                    </p>
                  </DialogBody>
                  <DialogFooter>
                    <Button variant='text' color='green' onClick={handleOpen} className='mr-1'>
                      <span>CLOSE</span>
                    </Button>
                  </DialogFooter>
                </Dialog>
              </div>
              <div class='inline-flex items-center text-base font-semibold text-gray-900 dark:text-white'>
                <p class='text-sm font-medium text-gray-900 truncate dark:text-white'>Price:</p>
                {item.cost}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
