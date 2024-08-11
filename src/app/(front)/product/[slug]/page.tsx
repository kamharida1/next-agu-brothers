import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj, formatPrice } from '@/lib/utils'
import productServices from '@/lib/services/productService'
import { FaStar } from 'react-icons/fa'
import Link from 'next/link'
import React from 'react'
import { Rating } from '@/components/products/Rating'
import ProductImages from '@/components/products/ProductImages'
import ReviewForm from '@/components/products/ReviewForm'
import { format } from 'date-fns'
import { Review } from '@/lib/models/ReviewModel'
import Breadcrumb from '@/components/Breadcrumbs'

const formatDate = (dateString: any) => {
  return format(new Date(dateString), 'MMMM do yyyy, h:mm:ss a')
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    category: product.category,
  }
}

export default async function ProductDetails({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) {
    return <div>Product Not Found</div>
  }
  return (
    <>
      {/* <Breadcrumb homeElement='Home' parallelRoutesKey={`/${params.slug}`} /> */}
      <div className="my-4">
        <Link href="/" className="text-blue-500 hover:underline cursor-pointer">
          Back to products
        </Link>
      </div>
      <div className="grid md:grid-cols-5 md:gap-6">
        <div className="md:col-span-2">
          <ProductImages images={product.images} />
        </div>
        <div className="md:col-span-2">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Rating
              value={product.rating}
              caption={`${product.numReviews} ratings`}
            />
            <p className="text-lg">{product.brand}</p>
            <div className="divider"></div>
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-md">{product.description}</p>
              </div>
            </div>
            <div className="divider"></div>
            <div>
              <h3 className="text-lg font-semibold">Additional Properties</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <ul className="list-disc list-inside">
                  {product.properties &&
                    Object.entries(product.properties).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="font-medium text-md">{key}:</span>
                        <span>{value}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-200 shadow-xl my-3 md:my-0">
            <div className="card-body">
              <div className="flex justify-between mb-2">
                <div>Price</div>
                <div>{formatPrice(product.price)}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div>Status</div>
                <div>
                  {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                </div>
              </div>
              {product.countInStock !== 0 && (
                <div className="card-actions justify-center">
                  <AddToCart
                    item={{
                      ...convertDocToObj(product),
                      qty: 0,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <h1 className="card-title mt-6 text-2xl font-bold">Reviews</h1>
      <div className="grid md:grid-cols-4 gap-6 my-6">
        {product._id && <ReviewForm productId={product._id} />}
        <div className="md:col-span-2">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">All reviews</h2>
              <ul className="space-y-4">
                {product.reviews &&
                  product.reviews.map((review: Review) => (
                    <li
                      key={review._id}
                      className="p-4 bg-base-100 rounded-lg shadow"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                color={i < review.rating ? 'gold' : 'gray'}
                              />
                            ))}
                          </div>
                          <h3 className="text-sm text-gray-500">
                            {formatDate(review?.createdAt)}
                          </h3>
                        </div>
                        <strong className="my-2 text-lg">{review.title}</strong>
                        <p>{review.comment}</p>
                        <small className="text-gray-500">
                          by {review.username}
                        </small>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
