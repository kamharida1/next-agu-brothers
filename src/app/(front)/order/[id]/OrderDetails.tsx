'use client'
import { OrderItem } from "@/lib/models/OrderModel"
import { formatPrice } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

export default function OrderDetails({
  orderId,
}: {
  orderId: string
  }) {
  const [loading, setLoading] = useState<boolean>(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState<boolean>(false)
  const [rrr, setRRR] = useState<string | null>(null)  
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()
   useEffect(() => {
     // Log when the script is loaded
     if (scriptLoaded) {
       console.log('Remita Payment Engine loaded')
     }
   }, [scriptLoaded])
  useEffect(() => {
    // Dynamically add Monnify SDK script to the document
    const script = document.createElement('script')
    script.src = 'https://sdk.monnify.com/plugin/monnify.js'
    script.async = true
    document.body.appendChild(script)

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
   const script = document.createElement('script')
   script.src = 'https://demo.remita.net/payment/v1/remita-pay-inline.bundle.js'
   script.async = true
   script.onload = () => {
     console.log('Remita script loaded successfully')
     if (typeof (window as any).RmPaymentEngine === 'undefined') {
       console.error('Remita Payment Engine not loaded')
     } else {
       console.log('Remita Payment Engine loaded')
     }
   }
   script.onerror = () => console.error('Failed to load Remita script')
   document.body.appendChild(script)

   return () => {
     document.body.removeChild(script)
   }
 }, [])
  
  const { trigger: deleteOrder, isMutating: isDeleting } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Order deleted successfully')
        : toast.error(data.message
        )
      router.push('/admin/orders')
    }
    
  )
  
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message)
    }
  )

  const {trigger: payOrder, isMutating: isPaying } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Order paid successfully')
        : toast.error(data.message)
    }
  )

  const { data: session } = useSession()

  async function onApproveMonnifyOrder(data: any) { 
    try {
      const response = await fetch(
        `/api/orders/${orderId}/capture-monnify-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        // If the response is not OK, throw an error with the status code
        const errorMessage = await response.text() // Fetch the error message from the response
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorMessage}`
        )
      }

      const orderData = await response.json()

      // Handle successful response
      toast.success('Order paid successfully')
      return orderData
    } catch (error) {
      // Handle fetch or JSON parsing error
      console.error('Error processing order payment:', error)
      toast.error('Failed to process payment. Please try again.')
    }
  }

 async function onApproveRemitaOrder(data: any) {
   try {
     const response = await fetch(
       `/api/orders/${orderId}/capture-remita-order`,
       {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
       }
     )

     if (!response.ok) {
       // If the response is not OK, throw an error with the status code
       const errorMessage = await response.text() // Fetch the error message from the response
       throw new Error(
         `HTTP error! Status: ${response.status} - ${errorMessage}`
       )
     }

     const orderData = await response.json()

     // Handle successful response
     toast.success('Order paid successfully')
     return orderData
   } catch (error) {
     // Handle fetch or JSON parsing error
     console.error('Error processing order payment:', error)
     toast.error('Failed to process payment. Please try again.')
   }
 }
  
  async function handleGenerateRRR() {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/remita/generate-rrr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      console.log('RRR data:', data)
      if (data.message === 'RRR generated successfully') {
        const result = JSON.parse(data.rrr)
        setRRR(result.RRR) // Assuming RRR is returned in data.data.RRR
        setIsModalOpen(true) // Open the modal
        // Redirect to Remita payment page
        //setStatus(JSON.parse(data.result).status)
        // window.location.href = `https://remita.net/payment/v1/remita-pay/${data.data.RRR}`
      } else {
        console.log('Error generating RRR:', data.error)
      }
      //toast.success('RRR generated successfully')
    } catch (error: any) {
      //setStatus(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  async function handleCheckStatus() { 
    if (!rrr) {
      setStatus('RRR is missing')
      toast.error('Please enter the RRR')
      return
    }
    setStatusLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/check-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rrr }),
      })
      const data = await response.json()
      console.log("RRR status: ",data)
      if (!response.ok) {
        throw new Error(data.message)
      }
      toast.success('RRR status checked successfully')
      setStatus(data.message)
    } catch (error: any) {
      toast.error('Failed to check RRR status')
      setStatus(error.message)
    } finally {
      setStatusLoading(false)
    }
  }

  const makePayment = () => {
    if (typeof (window as any).RmPaymentEngine === 'function') {
      const transactionId = Math.floor(Math.random() * 1101233).toString() // Generate a random transaction ID

      const paymentEngine = (window as any).RmPaymentEngine.init({
        key: 'QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY', // Use your correct public key
        processRrr: true,
        transactionId, // Dynamic transaction ID
        extendedData: {
          customFields: [
            {
              name: 'rrr',
              value: rrr, // Replace this with the RRR you want to process
            },
          ],
        },
        onSuccess: function (response: any) {
          console.log('Payment Successful', response)
          // Handle success
        },
        onError: function (response: any) {
          console.error('Payment Error', response)
          // Handle error
        },
        onClose: function () {
          console.log('Payment Widget Closed')
        },
      })

      paymentEngine.showPaymentWidget() // Show the payment widget
    } else {
      console.error('RmPaymentEngine is not loaded or is not a function')
    }
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  if (error) return error.message
  if (!data) return 'loading...'

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = data

  const monnifyPay = () => {
    if (typeof (window as any).MonnifySDK === 'undefined') {
      console.error('Monnify SDK not loaded')
      return
    }

    (window as any).MonnifySDK.initialize({
      amount: totalPrice,
      currency: 'NGN',
      reference: new String(new Date().getTime()),
      customerFullName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      apiKey: 'MK_TEST_3TQCCKWD03', 
      contractCode: '2893747607', 
      paymentDescription: 'Monnify Payment',
      onLoadStart: () => {
        console.log('loading has started')
      },
      onLoadComplete: () => {
        console.log('SDK is UP')
      },
      onComplete: (response: any) => {
        console.log('Payment Successful', response)
        onApproveMonnifyOrder(response) 
      },
      onClose: (data: any) => {
        console.log(data)
      },
    })
    
  }

 const remitaPay = () => {
   // Ensure the Remita Payment Engine is loaded before using it
   if (typeof (window as any).RmPaymentEngine !== 'undefined') {
    const remita = (window as any).RmPaymentEngine

    // Check if shippingAddress and shippingAddress.name are defined
    if (shippingAddress && shippingAddress.fullName) {
      const [firstName, lastName] = shippingAddress?.fullName.split(' ')

      const paymentEngine = remita.init({
        key: 'QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY', // Ensure this is using the correct environment variable prefix
        customerId: shippingAddress.email,
        firstName,
        lastName,
        email: shippingAddress.email,
        amount: totalPrice,
        narration: 'Payment Initiated',
        transactionId: Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join(''),
        channel: 'CARD,USSD,QR,IBANK',
        onSuccess: (response: any) => {
          console.log('Payment Successful', response)
          onApproveRemitaOrder(response)
        },
        onError: (response: any) => {
          console.log('Payment Error', response)
        },
        onClose: () => {
          console.error('Payment widget closed')
        },
      })

      paymentEngine.showPaymentWidget()
    } else {
      toast.error('Shipping address or name is missing')
    }
     
   } else {
     return toast.error('Remita Payment Engine not loaded')
   }
 }


  return (
    <div>
      <h1 className="text-2xl py-4"> Order {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">Paid at {paidAt}</div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4 ">
            <div className="card-body">
              <h2 className="card-title">Order Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>{formatPrice(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <div className="mb-2 flex justify-between">
                <span>Items</span>
                <span>{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(taxPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {!isPaid && paymentMethod === 'Remita' && (
                <div>
                  <ul>
                    <li>
                      <button
                        className="btn btn-primary w-full my-2"
                        onClick={handleGenerateRRR}
                      >
                        Pay with Remita
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              {rrr && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Remita Retrieval Reference (RRR)
                  </h3>
                  <p>{rrr}</p>
                  <button
                    className="btn btn-secondary w-full my-2"
                    onClick={handleCheckStatus}
                    disabled={statusLoading}
                  >
                    {statusLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Check RRR Status'
                    )}
                  </button>
                  {status && <p>Status: {status}</p>}
                </div>
              )}
              {!isPaid && paymentMethod === 'Moniepoint' && (
                <div>
                  <ul>
                    <li>
                      {/* <MonnifyButton orderId={orderId} /> */}
                      <button
                        className="btn btn-primary w-full my-2"
                        onClick={() => monnifyPay()}
                      >
                        Pay with Monnify
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              {/* Add the Script component to load the Remita script */}
              <Script
                src="https://demo.remita.net/payment/v1/remita-pay-inline.bundle.js"
                strategy="lazyOnload"
                onLoad={() => setScriptLoaded(true)} // Mark script as loaded when done
                onError={() =>
                  toast.error('Failed to load Remita Payment Engine')
                }
              />
              {rrr && (
                <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                  <div className="modal-box">
                    <h4 className="font-bold text-lg">RRR: {rrr}</h4>
                    <form
                      id="payment-form"
                      onSubmit={(e) => {
                        e.preventDefault()
                        makePayment()
                      }}
                    >
                      <div className="form-floating mb-3 mt-3">
                        <input
                          type="text"
                          className="form-control"
                          id="js-firstName"
                          placeholder="Enter RRR"
                          value={rrr}
                          readOnly
                        />
                        <label htmlFor="rrr">Payment Reference</label>
                      </div>
                      <input
                        type="button"
                        onClick={makePayment}
                        value="Submit"
                        className="button"
                      />
                    </form>
                    <div className="modal-action">
                      <button
                        className="btn btn-primary w-full my-2"
                        onClick={handleCheckStatus}
                        disabled={statusLoading}
                      >
                        {statusLoading
                          ? 'Checking payment status...'
                          : 'Check payment status'}
                      </button>
                      <button
                        className="btn"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {session?.user.isAdmin && !isDelivered && (
                <button
                  className="btn w-full my-2"
                  onClick={() => deliverOrder()}
                  disabled={isDelivering || isDelivered}
                >
                  {isDelivering && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Mark as delivered
                </button>
              )}
              {session?.user.isAdmin && !isPaid && (
                <button
                  className="btn w-full my-2"
                  onClick={() => payOrder()}
                  disabled={isPaying || isPaid}
                >
                  {isPaying && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Mark as paid & delivered
                </button>
              )}
              {isDelivered && (
                <Link
                  className="btn w-full my-2 btn-primary"
                  href={`/`}
                  passHref
                >
                  Shop for more items
                </Link>
              )}
            </div>
          </div>
          {session?.user.isAdmin && (
            <div className="card-footer">
              <button
                className="btn btn-error my-2 w-full"
                onClick={() => deleteOrder()}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <span className="loading loading-spinner"></span>
                )}
                Delete Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}