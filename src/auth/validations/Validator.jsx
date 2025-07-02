import validator, { isEmpty } from 'validator';

export const userIdValidator = (userId) => {
  if (isEmpty(userId)) {
    return "User ID is required";
  } 
  // else if (!validator.isLength(userId, { min: 10, max: 10 })) {
  //   return "please enter a valid mobile no.";
  // }
  return "";
};

export const userName = (user) => {
  if (isEmpty(user)) {
    return "User Name is required";
  }
  return "";
};
export const newUserName = (name) => {
  if (isEmpty(name)) {
    return "Name is required";
  }
  return "";
};

export const userHierarchy = (name) => {
  if (isEmpty(name)) {
    return "Hierarchy is required";
  }
  return "";
};

export const validateAccount = (acctNo) => {
  if (isEmpty(acctNo)) {
    return "Account No is required";
  }
  if (!validator.isLength(acctNo, { min: 10, max: 10 })) {
    return "Account No must have 10 digits";
  }
  return "";
};

export const passwordValidator = password => {
  if (isEmpty(password)) {
    return "Password is required";
  } 
  return "";
};

export const userIDValidator = (userID) => {
  if (isEmpty(userID)) {
    return "Login ID is required";
  }  
  return "";
};


export const emailValidator = (email) => {
  if (isEmpty(email)) {
    return "Email is required";
  } else if (!validator.isEmail(email)) {
    return "Incorrect email format";
  }
  return "";
};