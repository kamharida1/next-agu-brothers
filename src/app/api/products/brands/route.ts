import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = async (req: any) => {
  await dbConnect()
  const brands = await ProductModel.find().distinct('brand')
  return Response.json(brands)
}