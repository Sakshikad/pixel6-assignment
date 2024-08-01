import React from 'react'
import { Route, Routes } from "react-router-dom";
import CustomerForm from '../components/CustomerForm';
import CustomerList from '../components/CustomerList';

const MainRoutes = () => {
    return (
        <>

            <Routes>
                <Route path='/' element={<CustomerList />} />
                <Route path='/customer' element={<CustomerForm />} />
            </Routes>

        </>
    )
}

export default MainRoutes