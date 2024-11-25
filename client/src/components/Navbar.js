import {
  Bars2Icon,
  ChevronDownIcon,
  CodeBracketSquareIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
  AcademicCapIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CircleStackIcon,
  BellIcon
} from '@heroicons/react/24/solid';
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  MobileNav,
  Navbar,
  Typography,
} from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import { NotificationsMenu } from '../components/NotificationDropdown'

// profile menu component
const profileMenuItems = [
  {
    label: 'My Profile',
    icon: UserCircleIcon,
  },
  {
    label: 'Edit Profile',
    icon: Cog6ToothIcon,
  },
  {
    label: 'Notifications',
    icon: BellIcon,
  },
  {
    label: 'Sign Out',
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  function Logout() {
    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies with the request
    })
      .then((response) => {
        if (response.ok) {
          // Redirect to login page after successful logout
          window.location.href = 'http://127.0.0.1:3000/login';
        } else {
          console.error('Failed to log out');
        }
      })
      .catch((error) => {
        console.error('Error during signout:', error);
      });
  }

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement='bottom-end'>
      <MenuHandler>
        <Button
          variant='text'
          color='blue-gray'
          className='flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto'>
          <Avatar
            variant='circular'
            size='sm'
            alt='tania andrew'
            className='border border-gray-900 p-0.5'
            src={`${process.env.PUBLIC_URL}/images/profile.png`}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className='p-1'>
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={isLastItem ? Logout : closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem ? 'hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10' : ''
              }`}>
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? 'text-red-500' : ''}`,
                strokeWidth: 2,
              })}
              <Typography as='span' variant='small' className='font-normal' color={isLastItem ? 'red' : 'inherit'}>
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list component
const navListItems = [
  {
    label: 'Food Inventory',
    icon: CircleStackIcon,
    color: 'text-blue-600',
    onClick: () => (window.location.href = 'http://127.0.0.1:3000/'),
  },
  {
    label: 'Expenses',
    icon: CurrencyDollarIcon,
    color: 'text-green-500',
    onClick: () => (window.location.href = 'http://127.0.0.1:3000/expenses'),
  },
  {
    label: 'Shopping List',
    icon: ClipboardDocumentListIcon,
    color: 'text-yellow-600',
    onClick: () => (window.location.href = 'http://127.0.0.1:3000/shopping'),
  },
  {
    label: 'Add Food',
    icon: PlusCircleIcon,
    color: 'text-black',
    onClick: () => (window.location.href = 'http://127.0.0.1:3000/input'),
  },
];

function NavList() {
  return (
    <ul className='mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center'>
      {/* <NavListMenu /> */}
      {navListItems.map(({ label, icon, color, onClick }, key) => (
        <Typography key={label} as='a' href='#' variant='small' color='gray' className='font-medium text-blue-gray-500'>
          <MenuItem className='flex items-center gap-2 lg:rounded-full'onClick={onClick}>
            {React.createElement(icon, { className: `h-[18px] w-[18px] ${color}`})}{' '}
            <span className='text-gray-900'> {label}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

export function ComplexNavbar() {
  const [notifications, setNotifications] = useState([]); 
  // Function to fetch notifications and update state
 
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/notifications', {
        method: 'GET', // GET request
        credentials: 'include', // Include cookies for session management
        headers: {
          'Content-Type': 'application/json', // Optional for GET requests but can be included if necessary
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data || []); // Make sure to handle response structure
      } else {
        console.error('Error fetching notifications:', response.statusText);
        setNotifications([])
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, []); 

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/notifications/${id}`, {
          method: "DELETE",
          credentials: "include", // Include cookies for user session
      });

      if (response.ok) {
          // const data = await response.json();
          // console.log(data.message);
          fetchNotifications();
      } else {
          const error = await response.json();
          console.error(error.error);
      }
  } catch (error) {
      console.error("Error deleting notification:", error);
  }
  }
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setIsNavOpen(false));
  }, []);

  return (
    <Navbar className='mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6'>
      <div className='relative mx-auto flex items-center justify-between text-blue-gray-900'>
        <Typography
          as='a'
          href='#'
          className='mr-4 ml-2 cursor-pointer py-1.5 font-semibold text-lg'
          onClick={() => (window.location.href = 'http://127.0.0.1:3000/')}>
          StockedUp
        </Typography>
        <div className='hidden lg:block'>
          <NavList />
        </div>
        <IconButton
          size='sm'
          color='blue-gray'
          variant='text'
          onClick={toggleIsNavOpen}
          className='ml-auto mr-2 lg:hidden'>
          <Bars2Icon className='h-6 w-6' />
        </IconButton>
        <div className='flex items-center ml-auto'>
          <div>
        <NotificationsMenu notifications={notifications} deleteNotification={deleteNotification}/>
          </div>
        <ProfileMenu />
    </div>  
      </div>
      <MobileNav open={isNavOpen} className='overflow-scroll'>
        <NavList />
      </MobileNav>
    </Navbar>
  );
}
