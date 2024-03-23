import React from "react"

export default function AllProducts({productsData, increment, decrement, counters}) {
      
    return (
      <div className="bg-white">
         <h2 className='lg:ml-40 lg:mt-20 sm:mx-auto md:mx-auto w-2/4 sm:text-center lg:text-left font-semibold'>All Products:</h2>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
  
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {productsData.map((product) => (
              <div key={product.product_id} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.product_name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{`$${product.price/100}`}</p>
                <p className="mt-1 text-lg font-medium text-gray-600">Stock: {product.stock}</p>
                <div>
                    <button onClick={() => decrement(product.product_id)}>-</button>
                    <span className="mx-2">{counters[product.product_id] || 0}</span>
                    <button onClick={() => increment(product.product_id)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }