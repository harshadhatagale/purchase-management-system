import React from 'react'
import Link from 'next/link'
import LogoutButton from './LogOutBtn'
export default function Nav() {
  return (
    <div className='flex justify-between items-center h-16 w-full bg-purple-600 px-2'>
        <Link href={'/'} className='text-xl font-bold text-white'>Purchase Management System</Link>
        <LogoutButton/>
    </div>
  )
}
