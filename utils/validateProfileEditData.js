const validateProfileData = (req) => {
  const allowedFields = ["firstName", "lastName", "location", "age"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );


  return isEditAllowed;
};

module.exports = validateProfileData;
