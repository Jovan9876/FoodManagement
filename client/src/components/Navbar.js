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
  AcademicCapIcon
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
import React from 'react';

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
    label: 'Inbox',
    icon: InboxArrowDownIcon,
  },
  {
    label: 'Help',
    icon: LifebuoyIcon,
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
            src='https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80'
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

// nav list menu
const navListMenuItems = [
  {
    title: 'Food Inventory',
    description: '',
    link: '/inventory',
  },
  {
    title: 'Expenses',
    description: '',
    link: '/expenses',
  },
  {
    title: 'Shopping List',
    description: '',
    link: '/shopping',
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(({ title, description, link }) => (
    <a href={link} key={title}>
      <MenuItem>
        <Typography variant='h6' color='blue-gray' className='mb-1'>
          {title}
        </Typography>
        <Typography variant='small' color='gray' className='font-normal'>
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as='a' href='#' variant='small' className='font-normal'>
            <MenuItem className='hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full'>
              <Square3Stack3DIcon className='h-[18px] w-[18px] text-blue-gray-500' /> Pages{' '}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className='hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid'>
          <Card
            color='blue'
            shadow={false}
            variant='gradient'
            className='col-span-3 grid h-full w-full place-items-center rounded-md'>
            <RocketLaunchIcon strokeWidth={1} className='h-28 w-28' />
          </Card>
          <ul className='col-span-4 flex w-full flex-col gap-1'>{renderItems}</ul>
        </MenuList>
      </Menu>
      <MenuItem className='flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden'>
        <Square3Stack3DIcon className='h-[18px] w-[18px] text-blue-gray-500' /> Pages{' '}
      </MenuItem>
      <ul className='ml-6 flex w-full flex-col gap-1 lg:hidden'>{renderItems}</ul>
    </React.Fragment>
  );
}

// nav list component
const navListItems = [
  {
    label: 'Account',
    icon: UserCircleIcon,
  },
  {
    label: 'Blocks',
    icon: CubeTransparentIcon,
  },
  {
    label: 'Docs',
    icon: CodeBracketSquareIcon,
  },
];

function NavList() {
  return (
    <ul className='mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center'>
      <NavListMenu />
      {navListItems.map(({ label, icon }, key) => (
        <Typography key={label} as='a' href='#' variant='small' color='gray' className='font-medium text-blue-gray-500'>
          <MenuItem className='flex items-center gap-2 lg:rounded-full'>
            {React.createElement(icon, { className: 'h-[18px] w-[18px]' })}{' '}
            <span className='text-gray-900'> {label}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

export function ComplexNavbar() {
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
          className='mr-4 ml-2 cursor-pointer py-1.5 font-medium'
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

        <Button size='sm' variant='text' onClick={() => (window.location.href = 'http://127.0.0.1:3000/input')}>
          <span>Add Food</span>
        </Button>
        {/* <Button
          size='sm'
          variant='text'
          onClick={() => {
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
          }}>
          <span>Signout</span>
        </Button> */}
        <ProfileMenu />
      </div>
      <MobileNav open={isNavOpen} className='overflow-scroll'>
        <NavList />
      </MobileNav>
    </Navbar>
  );
}
