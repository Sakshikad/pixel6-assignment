import { createSlice } from '@reduxjs/toolkit';
import { fetchCityAndState, verifyPAN } from '../../services/apiservice';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
    customers: [], // List of customers
    panVerificationDeatils: {
      isValid: null, 
      fullName: '', 
      message: '',
    },
    postcodeDetails: {}, // Details of city and state based on postcode
    loading: false,
    error: null,
};

// Slice
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Action to update customer details
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    // Action to reset PAN verification details
    resetPanVerificationDeatils: (state) => {
      state.panVerificationDeatils = {
        isValid: null,
        fullName: '',
        message: '',
      };
    },
    // Action to reset postcode details
    resetPostcodeDetails: (state) => {
      state.postcodeDetails = {
        city: '',
        state: '',
      };
    },
    // Action to add a new customer
    addCustomer: (state, action) => {
      state.customers.push({ ...action.payload, id: uuidv4() });
    },
    // Action to delete a customer
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
    },
  },
  
  extraReducers: (builder) => {
    builder
    .addCase(fetchCityAndState.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCityAndState.fulfilled, (state, action) => {
      state.loading = false;
      state.postcodeDetails[action.payload.index] = {
        city: action.payload.city,
        state: action.payload.state,
      };
    })
    .addCase(fetchCityAndState.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch postcode details';
    })
      .addCase(verifyPAN.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.panVerificationDeatils = {
          isValid: null,
          fullName: '',
          message: '',
        };
      })
      .addCase(verifyPAN.fulfilled, (state, action) => {
        state.loading = false;
        const { isValid, fullName } = action.payload;
        state.panVerificationDeatils.isValid = isValid;
        state.panVerificationDeatils.fullName = fullName;
        state.panVerificationDeatils.message = '';

        if (isValid && state.customers.length > 0) {
          state.customers[state.customers.length - 1].fullName = fullName;
        }
      })
      .addCase(verifyPAN.rejected, (state, action) => {
        state.loading = false;
        state.panVerificationDeatils.isValid = false;
        state.panVerificationDeatils.message = action.payload.message;
        state.error = action.error.message;
      });
  },
});

// Actions
export const { addCustomer, deleteCustomer, resetPanVerificationDeatils, resetPostcodeDetails, updateCustomer } = customerSlice.actions;

// Reducer
export default customerSlice.reducer;
