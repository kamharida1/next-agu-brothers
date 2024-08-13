// File: pages/about.js

import { Metadata } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { IoIosInformation } from 'react-icons/io'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
  openGraph: {
    title: 'About Us',
    description: 'Learn more about our company',
    type: 'website',
  }
}

export default function About() {
  return (
    <div>
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={'/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <IoIosInformation className="w-4 h-4 mr-2 stroke-current" />
            About Us
          </li>
        </ul>
      </div>
      <Head>
        <title>About Us</title>
      </Head>
      <section className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
            About Us
          </h1>
          <p className="text-lg mb-6 text-gray-600">
            Welcome to our company! We are committed to delivering the best
            products and services to our customers. Our team is dedicated to
            innovation, quality, and customer satisfaction.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">
                Our Mission
              </h2>
              <p className="text-gray-600">
                Our mission is to revolutionize the industry with cutting-edge
                solutions and unparalleled customer service. We strive to exceed
                expectations and foster long-term relationships with our
                clients.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">
                Our Vision
              </h2>
              <p className="text-gray-600">
                Our vision is to be the global leader in our field, recognized
                for our innovative products and outstanding service. We aim to
                create a positive impact on society and the environment.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium text-gray-800">
                Team Member 1
              </h3>
              <p className="text-gray-600">CEO</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium text-gray-800">
                Team Member 2
              </h3>
              <p className="text-gray-600">CTO</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium text-gray-800">
                Team Member 3
              </h3>
              <p className="text-gray-600">CFO</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Follow Us
            </h2>
            <div className="flex justify-center space-x-4">
              <Link
                className="text-blue-600 hover:text-blue-800"
                href="https://www.facebook.com"
              >
                Facebook
              </Link>
              <Link
                className="text-blue-400 hover:text-blue-600"
                href="https://www.twitter.com"
              >
                X
              </Link>
              <Link
                className="text-blue-700 hover:text-blue-900"
                href="https://www.linkedin.com"
              >
                LinkedIn
              </Link>
              <Link
                className="text-pink-500 hover:text-pink-700"
                href="https://www.instagram.com"
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
