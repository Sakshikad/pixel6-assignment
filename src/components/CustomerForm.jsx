import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCustomer,
  resetPanVerificationDeatils,
  resetPostcodeDetails,
} from "../store/slice/customerSlice";
import { fetchCityAndState, verifyPAN } from "../services/apiservice";
import {
  validatePAN,
  validateFullName,
  validateEmail,
  validateMobile,
  validatePostcode,
  validateAddressLine1,
  checkInputValidity,
} from "../utils/validators";

const CustomerForm = () => {
  const dispatch = useDispatch();
  const { panVerificationDeatils, postcodeDetails, loading, error } =
    useSelector((state) => state.customer);

  // Initial state for form data
  const [formData, setFormData] = useState({
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [
      { addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" },
    ],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoveBtnVisible, setIsRemoveBtnVisible] = useState(false);

  const onBlur = checkInputValidity(setErrors);

  // Update state and city fields based on fetched postcode details
  useEffect(() => {
    if (formData.addresses.length > 1) {
      setIsRemoveBtnVisible(true);
    } else {
      setIsRemoveBtnVisible(false);
    }

    formData.addresses.forEach((address, index) => {
      if (address.postcode && postcodeDetails[index]) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          addresses: prevFormData.addresses.map((addr, i) =>
            i === index
              ? {
                  ...addr,
                  state: postcodeDetails[index].state,
                  city: postcodeDetails[index].city,
                }
              : addr
          ),
        }));
      }
    });
  }, [postcodeDetails, formData.addresses.length]);

  // Handle changes in the input fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  // Handle changes in the address fields
  const handleAddressChange = (index, field, value) => {
    const newAddresses = formData.addresses.map((address, i) => {
      if (i === index) {
        return { ...address, [field]: value };
      }
      return address;
    });
    setFormData((prev) => ({ ...prev, addresses: newAddresses }));
    if (field === "postcode" && validatePostcode(value)) {
      dispatch(fetchCityAndState({ postcode: value, index }));
    }
  };

  // Add a new address field
  const handleAddAddress = () => {
    if (formData.addresses.length < 10) {
      setFormData((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses,
          {
            addressLine1: "",
            addressLine2: "",
            postcode: "",
            state: "",
            city: "",
          },
        ],
      }));
    } else {
      alert("Maximum 10 addresses allowed");
    }
  };

  // Remove an address field
  const handleRemoveAddress = (index) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, addresses: newAddresses }));
  };

  // Update form data based on PAN verification details
  useEffect(() => {
    if (panVerificationDeatils.isValid) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        fullName: panVerificationDeatils.fullName,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, pan: "" }));
    } else if (panVerificationDeatils.isValid === false) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pan: panVerificationDeatils.message,
      }));
    }
  }, [panVerificationDeatils]);

  // Handle PAN input change
  const handlePANChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, pan: value }));

    if (validatePAN(value)) {
      setIsLoading(true);
      dispatch(verifyPAN(value)).finally(() => setIsLoading(false));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, pan: "Invalid PAN format" }));
    }
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate form fields
    if (!validatePAN(formData.pan)) newErrors.pan = "Invalid PAN format";
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!validateMobile(formData.mobile))
      newErrors.mobile = "Invalid mobile number format";

    formData.addresses.forEach((address, index) => {
      if (!validateAddressLine1(address.addressLine1))
        newErrors[`addressLine1-${index}`] = "Address Line 1 is required";
      if (!validatePostcode(address.postcode))
        newErrors[`postcode-${index}`] = "Invalid postcode";
    });

    // If there are validation errors, update the errors state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Dispatch addCustomer action and reset the form
      dispatch(addCustomer(formData));
      setFormData({
        pan: "",
        fullName: "",
        email: "",
        mobile: "",
        addresses: [
          {
            addressLine1: "",
            addressLine2: "",
            postcode: "",
            state: "",
            city: "",
          },
        ],
      });

      // Clear errors and reset state
      setErrors({});
      dispatch(resetPanVerificationDeatils());
      dispatch(resetPostcodeDetails());
      alert("Congratulations your Form is Submitted!!!");
    }
  };


  return (
    <div className="customer-form py-10 bg-gray-100 min-h-screen">
      <h5 className="text-center text-2xl font-semibold mb-8">Customer Form</h5>
      <div className="container mx-auto">
        <form
          className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md"
          onSubmit={onSubmit}
        >
          <div className="mb-6 relative">
            <label
              className="block text-gray-800 text-sm font-medium mb-2"
              htmlFor="pan"
            >
              PAN Number<span className="required">*</span>
            </label>
            <div className="relative">
              <input
                className={`shadow appearance-none border ${errors.pan ? "border-red-500" : ""
                  } rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none ${isLoading ? "pr-10" : ""
                  }`}
                id="pan"
                type="text"
                placeholder="Enter PAN Number"
                value={formData.pan}
                onChange={handlePANChange}
                onBlur={onBlur}
                required
              />
              {isLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              )}
            </div>
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
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="fullName"
              type="text"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={onBlur}
              readOnly
              required
            />
            {errors.fullName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.fullName}
              </span>
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
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter Email"
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
                  type="tel"
                  placeholder="Enter Mobile Number"
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
            <div key={index}>
              <hr className="mb-6" />
              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor={`addressLine1-${index}`}>
                  Address Line 1<span className="required">*</span>
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  id={`addressLine1-${index}`}
                  type="text"
                  placeholder="Address Line 1"
                  value={address.addressLine1}
                  onBlur={checkInputValidity(setErrors)}
                  onChange={(e) => handleAddressChange(index, 'addressLine1', e.target.value)}
                  required
                />
                {errors[`addressLine1-${index}`] && <span className="text-red-500 text-xs mt-1">{errors[`addressLine1-${index}`]}</span>}
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor={`addressLine2-${index}`}>
                  Address Line 2
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  id={`addressLine2-${index}`}
                  type="text"
                  placeholder="Address Line 2"
                  value={address.addressLine2}
                  onChange={(e) => handleAddressChange(index, 'addressLine2', e.target.value)}
                />
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor={`postcode-${index}`}>
                    Postcode<span className="required">*</span>
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id={`postcode-${index}`}
                    type="number"
                    placeholder="902101"
                    value={address.postcode}
                    onChange={(e) => handleAddressChange(index, 'postcode', e.target.value)}
                    onBlur={checkInputValidity(setErrors)}
                    required
                  />
                  {errors[`postcode-${index}`] && <span className="text-red-500 text-xs mt-1">{errors[`postcode-${index}`]}</span>}
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor={`state-${index}`}>
                    State
                  </label>
                  <input
                    className="bg-gray-200 shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id={`state-${index}`}
                    type="text"
                    placeholder="State"
                    value={address.state}
                    readOnly
                    required
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor={`city-${index}`}>
                    City
                  </label>
                  <input
                    className="bg-gray-200 shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id={`city-${index}`}
                    type="text"
                    placeholder="City"
                    value={address.city}
                    readOnly
                    required
                  />
                </div>
              </div>

              <hr className="mb-6" />
            </div>
          ))}

          <div className="flex flex-wrap mx-auto mb-6">
            <button
              id="addAddress"
              type="button"
              className="bg-green-500 text-white text-xl font-bold rounded-full focus:outline-none focus:shadow-outline mb-4 w-12 h-12 flex items-center justify-center leading-none"
              onClick={handleAddAddress}
            >
              <i className="fa-solid fa-plus"></i>
            </button>

            <label
              className="block text-gray-800 text-sm font-medium mt-3 mx-2"
              htmlFor="addAddress"
            >
              Add Address
            </label>
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-3 px-8 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
