import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to fetch city and state details based on postcode
export const fetchCityAndState = createAsyncThunk(
    'customer/fetchCityAndState',
    async ({ postcode, index }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'https://lab.pixel6.co/api/get-postcode-details.php',
                {
                    postcode: postcode,
                }
            );
            const data = response.data;

            if (data.status === 'Success') {
                // Extract city and state from the response data
                const city = data.city[0].name;
                const state = data.state[0].name;
                return { city, state, index }; // Return city, state, and index
            } else {
                return rejectWithValue('Invalid postcode'); // Handle invalid postcode case
            }
        } catch (error) {
            return rejectWithValue(error.message); // Handle request errors
        }
    }
);

// Thunk to verify PAN number
export const verifyPAN = createAsyncThunk(
    'customer/verifyPAN',
    async (panNumber, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://lab.pixel6.co/api/verify-pan.php', {
                panNumber: panNumber
            });
            const data = response.data;

            if (data.status === 'Success') {
                // Return validity and full name if PAN is valid
                return { isValid: true, fullName: data.fullName };
            } else {
                // Return error details if PAN is invalid
                return rejectWithValue({ isValid: false, message: data.message, panNumber: data.panNumber });
            }
        } catch (error) {
            return rejectWithValue({ isValid: false, message: error.message }); // Handle request errors
        }
    }
);
