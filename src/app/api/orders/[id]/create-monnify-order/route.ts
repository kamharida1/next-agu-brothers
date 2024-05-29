import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import { monnify } from '@/lib/monnify'

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()

  const order = await OrderModel.findById(params.id)
  if (order) {
    try {
      const monnifyOrder = await monnify.initialiseTransaction(
        order.totalPrice,
        order.shippingAddress.fullName,
        'nnamdiagu470@gmail.com',
        'Order payment',
      )
       return Response.json(monnifyOrder)
    } catch (err: any) {
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      )
    }
  } else {
    return Response.json(
      { message: 'Order not found' },
      {
        status: 404,
      }
    )
  }
})