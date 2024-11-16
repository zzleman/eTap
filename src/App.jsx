import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import {store} from './redux/store'
 
function App() {
  return (
   <Provider store={store}>
     <BrowserRouter>
      <Layout />
      <ToastContainer />
    </BrowserRouter>
   </Provider>
  );
}

export default App;
