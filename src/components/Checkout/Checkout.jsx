import React from "react";

function Checkout(){

    return(
        <div class="container mx-auto px-4">
  <div class="flex flex-col md:flex-row -mx-4">
    <div class="md:flex-1 px-4">
      <h2 class="text-2xl font-bold mb-5">Checkout</h2>

      {/* <!-- Billing information --> */}
      <div class="mb-5">
        <h3 class="font-semibold text-lg mb-3">Billing Information</h3>
        <input class="w-full p-2 border border-gray-200 rounded mb-3" type="text" placeholder="Full Name" />
        <input class="w-full p-2 border border-gray-200 rounded mb-3" type="email" placeholder="Email Address" />
        <input class="w-full p-2 border border-gray-200 rounded mb-3" type="text" placeholder="Address" />
        <input class="w-full p-2 border border-gray-200 rounded mb-3" type="text" placeholder="City" />
        <div class="flex -mx-2">
          <input class="w-1/2 p-2 mx-2 border border-gray-200 rounded mb-3" type="text" placeholder="State" />
          <input class="w-1/2 p-2 mx-2 border border-gray-200 rounded mb-3" type="text" placeholder="Zip Code" />
        </div>
      </div>

      {/* <!-- Payment details --> */}
      <div class="mb-5">
        <h3 class="font-semibold text-lg mb-3">Payment Details</h3>
        <input class="w-full p-2 border border-gray-200 rounded mb-3" type="text" placeholder="Card Number" />
        <div class="flex -mx-2">
          <input class="w-1/3 p-2 mx-2 border border-gray-200 rounded mb-3" type="text" placeholder="MM/YY" />
          <input class="w-1/3 p-2 mx-2 border border-gray-200 rounded mb-3" type="text" placeholder="CVC" />
        </div>
      </div>

      <button class="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">Complete Order</button>
    </div>

    {/* <!-- Order Summary --> */}
    <div class="md:w-1/3 px-4 mt-10 md:mt-0">
      <h3 class="font-semibold text-lg mb-3">Order Summary</h3>
      <div class="p-4 border border-gray-200 rounded">
        <div class="flex justify-between mb-3">
          <span>Product Name #1</span>
          <span>$99.99</span>
        </div>
        <div class="flex justify-between mb-3">
          <span>Product Name #2</span>
          <span>$129.99</span>
        </div>
        <div class="flex justify-between font-semibold">
          <span>Total</span>
          <span>$229.98</span>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}

export default Checkout