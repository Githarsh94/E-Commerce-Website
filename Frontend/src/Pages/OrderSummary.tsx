import React from 'react'
import CheckAddress from '../Components/CheckAddress/CheckAddress'
import Payment from '../Components/Payment/Payment'
const OrderSummary = () => {
  return (
    <div>
      {/* <h1>Order Summary</h1> */}
      <CheckAddress />
      <Payment />
    </div>
  )
}

export default OrderSummary;