'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const AdminLayout = ({
  activeItem = 'dashboard',
  children,
}: {
  activeItem: string
  children: React.ReactNode
  }) => {
  
  const { data: session } = useSession()
  if (!session || !session.user.isAdmin) {
    return (
      <div className="relative flex flex-grow p-4">
        <div>
          <h1 className="text-2xl">Unauthorized</h1>
          <p>Admin permisson required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-grow">
      <div className="w-full grid md:grid-cols-5">
        <div className="bg-base-200">
          <ul className="menu">
            <li>
              <Link
                className={'dashboard' === activeItem ? 'active' : ''}
                href="/admin/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className={'categories' === activeItem ? 'active' : ''}
                href="/admin/categories"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                className={'orders' === activeItem ? 'active' : ''}
                href="/admin/orders"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                className={'products' === activeItem ? 'active' : ''}
                href="/admin/products"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className={'users' === activeItem ? 'active' : ''}
                href="/admin/users"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                className={'blog' === activeItem ? 'active' : ''}
                href="/admin/blog"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                className={'jobs' === activeItem ? 'active' : ''}
                href="/admin/jobs"
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                className={'settings' === activeItem ? 'active' : ''}
                href="/admin/settings"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                className={'profits' === activeItem ? 'active' : ''}
                href="/admin/profits"
              >
                Profits
              </Link>
            </li>
            <li>
              <Link
                className={'messages' === activeItem ? 'active' : ''}
                href="/admin/messages"
              >
                Messages
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4 px-4">{children} </div>
      </div>
    </div>
  )
}

export default AdminLayout
