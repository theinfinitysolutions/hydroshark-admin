'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { MdOutlineGroups3 } from 'react-icons/md';
import { MdAddShoppingCart } from 'react-icons/md';
import { MdOutlineViewList } from 'react-icons/md';
import { MdCheckCircleOutline } from 'react-icons/md';
import { MdOutlineMessage } from 'react-icons/md';
import { IoShirtOutline } from 'react-icons/io5';
import { PiFlagBanner } from 'react-icons/pi';
import { MdOutlineTypeSpecimen } from 'react-icons/md';
import { TbShoppingCartShare } from 'react-icons/tb';

const options = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: ({ addedClass }) =>
      addedClass ? (
        <MdOutlineSpaceDashboard className={` text-2xl text-white`} />
      ) : (
        <MdOutlineSpaceDashboard className={` text-2xl text-black`} />
      ),
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: ({ addedClass }) =>
      addedClass ? (
        <MdOutlineGroups3 className={` text-2xl text-white`} />
      ) : (
        <MdOutlineGroups3 className={` text-2xl text-black`} />
      ),
  },
  {
    title: 'Products',
    path: '/dashboard/products',
    icon: ({ addedClass }) =>
      addedClass ? (
        <MdOutlineViewList className={` text-2xl text-white`} />
      ) : (
        <MdOutlineViewList className={` text-2xl text-black`} />
      ),
  },
  {
    title: 'Gymwear',
    path: '/dashboard/gymwear',
    icon: ({ addedClass }) =>
      addedClass ? (
        <IoShirtOutline className={` text-2xl text-white`} />
      ) : (
        <IoShirtOutline className={` text-2xl text-black`} />
      ),
  },
  {
    title: 'Manage Gymwear',
    path: '/dashboard/manage-gymwear',
    icon: ({ addedClass }) =>
      addedClass ? (
        <MdOutlineTypeSpecimen className={` text-2xl text-white`} />
      ) : (
        <MdOutlineTypeSpecimen className={` text-2xl text-black`} />
      ),
  },
  {
    title: 'Abandoned Carts',
    path: '/dashboard/carts',
    icon: ({ addedClass }) =>
      addedClass ? (
        <MdAddShoppingCart className={` text-2xl text-white`} />
      ) : (
        <MdAddShoppingCart className={` text-2xl text-black`} />
      ),
  },
  {
    title: 'All Carts',
    path: '/dashboard/all-carts',
    icon: ({ addedClass }) =>
      addedClass ? (
        <TbShoppingCartShare className={` text-2xl text-white`} />
      ) : (
        <TbShoppingCartShare className={` text-2xl text-black`} />
      ),
  },
  {
    title: 'Orders',
    path: '/dashboard/orders',
    icon: ({ addedClass }) =>
      addedClass ? (
        <MdCheckCircleOutline className={`text-2xl text-white`} />
      ) : (
        <MdCheckCircleOutline className={`text-2xl text-black`} />
      ),
  },
  {
    title: 'Banner',
    path: '/dashboard/banner',
    icon: ({ addedClass }) =>
      addedClass ? (
        <PiFlagBanner className={`text-2xl text-white`} />
      ) : (
        <PiFlagBanner className={`text-2xl text-black`} />
      ),
  },
  {
    title: 'Feedback',
    path: '/dashboard/feedback',
    icon: ({ addedClass }) =>
      addedClass ? (
        <MdOutlineMessage className={` text-2xl text-white`} />
      ) : (
        <MdOutlineMessage className={` text-2xl text-black`} />
      ),
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [active, setActive] = useState('');

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <div className=' flex flex-col items-start p-4 w-full h-full '>
      {options.map((option) => (
        <a
          key={option.title}
          href={option.path}
          className={`flex flex-row items-center ${
            active == option.path ? 'bg-black' : 'bg-white'
          } gap-x-4 rounded-md py-2 px-4 w-full cursor-pointer`}
        >
          <option.icon addedClass={active == option.path} />
          <p className={` ${active != option.path ? 'text-black' : 'text-white'} text-black text-base mt-1`}>
            {option.title}
          </p>
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
