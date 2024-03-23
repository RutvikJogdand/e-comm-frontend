import React, { Fragment, useEffect, useState, useCallback, useReducer } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import './../../index.css';
import AllProducts from '../AllProducts/AllProducts';
import Cart from '../Cart/Cart';

const navigation = [
  { name: 'Grocerify', href: '#', current: true },
//   { name: 'Team', href: '#', current: false },
//   { name: 'Projects', href: '#', current: false },
//   { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ActionTypes = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  SETZERO: 'SETZERO'
};

const countReducer = (state, action) => {
  // state: Represents the current state of the counter, which is an object where each key is a product_id and its value is the count.
  switch (action.type) {
      case ActionTypes.INCREMENT:
          return { ...state, [action.payload]: (state[action.payload] || 0) + 1 };
      case ActionTypes.DECREMENT:
          // If the action is DECREMENT, decrease the count, ensuring it doesn't go below 0.
          return { ...state, [action.payload]: (state[action.payload] || 0) > 0 ? state[action.payload] - 1 : 0 };
      case ActionTypes.SETZERO:
          return {...state, [action.payload]: 0};
      case 'INITIALIZE':
          // INITIALIZE sets the state to the payload, used for setting initial values from local storage.
          return action.payload;
      default:
          return state;
  }
};

export default function TailwindNav() {

  const [cartLength, setCartLength] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

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
      dispatch({ type: numChange > 0 ? ActionTypes.INCREMENT : ActionTypes.DECREMENT  , payload: productId });
  
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

  const remove = productId => {
    // Dispatch SETZERO action to update the counter state
    dispatch({ type: ActionTypes.SETZERO, payload: productId });

    // Update the productsData state to reflect the removal (count set to 0)
    const newProductsData = productsData.map(product => {
        if (product.product_id === productId) {
            // Here you update the product quantity to 0
            return { ...product, quantity: 0 };
        }
        return product;
    });
    setProductsData(newProductsData);

    let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    const productIndex = selectedProducts.findIndex(p => p.product_id === productId);

    if (productIndex !== -1) {
        selectedProducts.splice(productIndex, 1);
    }

    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    setCartLength(selectedProducts.length);
};


  const handleCartView = () => {
    setCartOpen(prevState => !prevState)
  }
  return (
    <>
    <Disclosure as="nav" className=" sticky top-0 z-50 bg-green-600">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src={require("../../assets/store.png")} alt="shop--v1"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-white-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-transparent-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <ShoppingBagIcon
                      className="h-6 w-6 mx-2 flex-shrink-0  text-white text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                      onClick={handleCartView}
                />
                 <span className="ml-2 color-white bg-transparent-800 text-white text-sm font-medium text-white-700 group-hover:text-white-800">{cartLength}</span>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    <AllProducts  increment={increment} decrement={decrement} counters={counters} productsData={productsData} setCartLength={setCartLength}/>
    <Cart increment={increment} decrement={decrement} remove={remove} counters={counters} productsData={productsData} cartState={cartOpen} toggleCartState={setCartOpen} />
    </>
  )
}
