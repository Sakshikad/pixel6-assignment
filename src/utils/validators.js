
export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan) && pan.length === 10;
};

export const validateFullName = (fullName) => {
  return fullName.length > 0 && fullName.length <= 140;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const validateMobile = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

export const validatePostcode = (postcode) => {
  const postcodeRegex = /^[0-9]{6}$/;
  return postcodeRegex.test(postcode);
};

export const validateAddressLine1 = (addressLine1) => {
  return addressLine1.length > 0;
};

export const validationMap = {

  pan: {
    validate: validatePAN,
    errorMessage: 'Invalid PAN number.'
  },
  fullName: {
    validate: validateFullName,
    errorMessage: 'Full Name should be less than 140 characters.'
  },
  email: {
    validate: validateEmail,
    errorMessage: 'Invalid email format.'
  },
  mobile: {
    validate: validateMobile,
    errorMessage: 'Invalid mobile number.'
  },
  postcode: {
    validate: validatePostcode,
    errorMessage: 'Invalid postcode.'
  },
  addressLine1: {
    validate: validateAddressLine1,
    errorMessage: 'Address Line 1 is required.'
  }
};

// Higher-order function to check the validity of input fields and set errors
export const checkInputValidity = (setErrors) => (e) => {
  const { id, value } = e.target;
  // Extract base id from dynamic id 
  const baseId = id.split('-')[0];
  const validation = validationMap[baseId];

  if (validation) {
    let error = '';
    // If the value is not valid, set the error message
    if (!validation.validate(value)) {
      error = validation.errorMessage;
    }
    // Update the errors state with the new error message 
    setErrors(prevErrors => ({ ...prevErrors, [id]: error }));
  }
};
