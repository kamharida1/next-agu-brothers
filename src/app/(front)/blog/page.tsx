import BlogItem from '@/components/blog/BlogItem'
import type { Blog } from '@/lib/models/BlogModel'
import blogServices from '@/lib/services/blogService'
import { convertDocToObj } from '@/lib/utils'
import Link from 'next/link'

export default async function Blog() {
  const posts = await blogServices.getBlogs()
  return (
    <>
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold">Our Blog</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((post: Blog) => (
          <BlogItem blog={convertDocToObj(post)} key={post.slug} />
        ))}
      </div>
    </>
  )
}

// 'use server'

// import CldImage from '@/components/CldImage'
// import blogServices from '@/lib/services/blogService'
// import Link from 'next/link'

// export default async function BlogPage() {
//   const posts = await blogServices.getBlogs()
//   const dateOptions: Intl.DateTimeFormatOptions = {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-start p-8 md:p-24 bg-gray-100">
//       <div className="mb-8 text-center w-full">
//         <h1 className="text-5xl font-bold text-gray-800">Blog</h1>
//         <p className="text-gray-500 mt-2">Read our latest blog posts</p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
//         {posts.map((post) => (
//           <div
//             key={post.slug}
//             className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
//           >
//             <CldImage
//               src={post.image}
//               alt={post.title}
//               width={300}
//               height={200}
//               className="w-full h-48 object-cover rounded-md"
//             />
//             <h2 className="text-2xl font-bold mt-4 text-gray-800">
//               {post.title}
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               {new Date(post?.createdAt).toLocaleDateString(
//                 'en-US',
//                 dateOptions
//               )}
//             </p>
//             {/* <p className="mt-4 text-gray-700">{post.content.slice(0, 60)}...</p> */}
//             <article className='prose prose-sm' >
//               <p className="mt-4 text-gray-700">{post.content.slice(0, 60)}...</p>
//             </article>
//             <Link
//               href={`/blog/${post.slug}`}
//               className="text-blue-500 mt-4 inline-block"
//             >
//               Read more
//             </Link>
//           </div>
//         ))}
//       </div>
//     </main>
//   )
// }
