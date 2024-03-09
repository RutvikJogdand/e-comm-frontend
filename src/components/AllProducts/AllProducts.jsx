import React, { useCallback, useEffect, useState, useReducer } from "react"
import axios from "axios";

const ActionTypes = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT',
  };

const countReducer = (state, action) => {
    // state: Represents the current state of the counter, which is an object where each key is a product_id and its value is the count.
    switch (action.type) {
        case ActionTypes.INCREMENT:
            return { ...state, [action.payload]: (state[action.payload] || 0) + 1 };
        case ActionTypes.DECREMENT:
            // If the action is DECREMENT, decrease the count, ensuring it doesn't go below 0.
            return { ...state, [action.payload]: (state[action.payload] || 0) > 0 ? state[action.payload] - 1 : 0 };
        case 'INITIALIZE':
            // INITIALIZE sets the state to the payload, used for setting initial values from local storage.
            return action.payload;
        default:
            return state;
    }
};

export default function AllProducts({setCartLength}) {
    const [productsData, setProductsData] = useState([]);
    const initialCounters = JSON.parse(localStorage.getItem('selectedProducts')) || {};
    const [counters, dispatch] = useReducer(countReducer, initialCounters);
  
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/get-products');
            const savedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
            const updatedData = response.data.map(product => ({
                ...product,
                quantity: savedProducts.find(p => p.product_id === product.product_id)?.quantity || 0
            }));

            const initialCounters = savedProducts.reduce((acc, product) => {
                acc[product.product_id] = product.quantity;
                return acc;
            }, {});

            setProductsData(updatedData);
            setCartLength(savedProducts?.length)
            dispatch({ type: 'INITIALIZE', payload: initialCounters });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []); // Dependencies array is empty, meaning this function is created once

    useEffect(() => {
        fetchData()
    },[fetchData])

    const updateLocalStorage = (updatedProduct) => {
        let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        const existingProductIndex = selectedProducts.findIndex(p => p.product_id === updatedProduct.product_id);

        if (existingProductIndex !== -1) {
        if (updatedProduct.quantity > 0) {
            selectedProducts[existingProductIndex] = updatedProduct;
        } else {
            selectedProducts.splice(existingProductIndex, 1);
        }
        } else if (updatedProduct.quantity > 0) {
        selectedProducts.push(updatedProduct);
        }

        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        setCartLength(selectedProducts.length)
  
    };
    
    const adjustCount = (productId, numChange) => {
        const newCount = (counters[productId] || 0) + numChange;
        dispatch({ type: numChange > 0 ? ActionTypes.INCREMENT : ActionTypes.DECREMENT, payload: productId });
    
        const newProductsData = productsData.map(product => {
            if (product.product_id === productId) {
                const updatedProduct = { ...product, quantity: newCount >= 0 ? newCount : 0 };
                updateLocalStorage(updatedProduct);
                return updatedProduct;
            }
            return product;
        });
        setProductsData(newProductsData);
    };
    
    const increment = productId => adjustCount(productId, 1);
    const decrement = productId => adjustCount(productId, -1);
    
   
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