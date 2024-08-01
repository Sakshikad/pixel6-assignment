import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCustomer } from "../store/slice/customerSlice";
import { checkInputValidity } from "../utils/validators";

const EditCustomerForm = ({ customer, onCancel }) => {
  const dispatch = useDispatch(); 

  const [formData, setFormData] = useState({ ...customer }); 
  const [errors, setErrors] = useState({}); 
  // Function to handle input blur event and validate inputs
  const onBlur = checkInputValidity(setErrors);

  // Handle changes in the input fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  // Handle changes in the address fields
  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = formData.addresses.map((address, i) =>
      i === index ? { ...address, [field]: value } : address
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      addresses: updatedAddresses,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCustomer(formData)); // Dispatch the updateCustomer action with form data
    alert("Your Form is Updated!!!");
    onCancel(); // Close the form after submission
  };

  return (
    <div className="edit-customer-form py-10 min-h-screen">
      <h5 className="text-center text-2xl font-semibold mb-8">Edit Customer</h5>
      <div className="container mx-auto">
      <form onSubmit={handleSubmit}className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <label
            className="block text-gray-800 text-sm font-medium mb-2"
            htmlFor="pan"
          >
            PAN Number<span className="required">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
            id="pan"
            type="text"
            value={formData.pan}
            onChange={handleChange}
            onBlur={onBlur}
            required
          />
          {errors.pan && (
            <span className="text-red-500 text-xs mt-1">{errors.pan}</span>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-800 text-sm font-medium mb-2"
            htmlFor="fullName"
          >
            Full Name<span className="required">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={onBlur}
            required
          />
          {errors.fullName && (
            <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-800 text-sm font-medium mb-2"
            htmlFor="email"
          >
            Email<span className="required">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={onBlur}
            required
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">{errors.email}</span>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-800 text-sm font-medium mb-2"
            htmlFor="mobile"
          >
            Mobile Number<span className="required">*</span>
          </label>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/5 px-3 md:mb-0">
              <input
                className="bg-gray-200 shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
                id="+91"
                value={"+91"}
                readOnly
              />
            </div>
            <div className="w-full md:w-4/5 px-3 md:mb-0">
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
                id="mobile"
                type="text"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={onBlur}
                required
              />
              {errors.mobile && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.mobile}
                </span>
              )}
            </div>
          </div>
        </div>

        {formData.addresses.map((address, index) => (
          <div key={index} className="mb-6">
            <h6 className="text-lg font-semibold mb-4">Address {index + 1}</h6>
            <div className="mb-4">
              <label
                className="block text-gray-800 text-sm font-medium mb-2"
                htmlFor={`addressLine1-${index}`}
              >
                Address Line 1<span className="required">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
                id={`addressLine1-${index}`}
                type="text"
                value={address.addressLine1}
                onBlur={checkInputValidity(setErrors)}
                onChange={(e) =>
                  handleAddressChange(index, "addressLine1", e.target.value)
                }
                
                required
              />
               {errors[`addressLine1-${index}`] && <span className="text-red-500 text-xs mt-1">{errors[`addressLine1-${index}`]}</span>}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-800 text-sm font-medium mb-2"
                htmlFor={`addressLine2-${index}`}
              >
                Address Line 2
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
                id={`addressLine2-${index}`}
                type="text"
                value={address.addressLine2}
                onChange={(e) =>
                  handleAddressChange(index, "addressLine2", e.target.value)
                }
              />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block text-gray-800 text-sm font-medium mb-2"
                  htmlFor={`postcode-${index}`}
                >
                  Postcode<span className="required">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
                  id={`postcode-${index}`}
                  type="text"
                  value={address.postcode}
                  onBlur={checkInputValidity(setErrors)}
                  onChange={(e) =>
                    handleAddressChange(index, "postcode", e.target.value)
                  }      
                  required
                />
                 {errors[`postcode-${index}`] && <span className="text-red-500 text-xs mt-1">{errors[`postcode-${index}`]}</span>}
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block text-gray-800 text-sm font-medium mb-2"
                  htmlFor={`state-${index}`}
                >
                  State
                </label>
                <input
                  className="bg-gray-200 shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
                  id={`state-${index}`}
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    handleAddressChange(index, "state", e.target.value)
                  }
                  readOnly
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block text-gray-800 text-sm font-medium mb-2"
                  htmlFor={`city-${index}`}
                >
                  City
                </label>
                <input
                  className="bg-gray-200 shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none"
                  id={`city-${index}`}
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(index, "city", e.target.value)
                  }
                  readOnly
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-3 px-8 mx-2 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white font-bold py-3 px-8 mx-2 rounded focus:outline-none focus:shadow-outline"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditCustomerForm;
