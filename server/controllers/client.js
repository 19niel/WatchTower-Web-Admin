
import Citizen from "../models/Citizen.js";
import Rescuer from "../models/Rescuer.js";
// import Report from "../models/Report.js"




// Citizens ////////////////////////////////////////
  export const getCitizens = async (req, res) => {
    try {
      const citizens = await Citizen.find().select("-password");
      res.status(200).json(citizens);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };


  export const addCitizen = async (req, res) => {
    try {
      const { firstName, lastName, username, password, email, mobileNumber, address } = req.body;
      const profileImage = req.file ? req.file.filename : null; // Handle image upload
  
      const newCitizen = new Citizen({
        firstName,
        lastName,
        username,
        password,
        email,
        mobileNumber,
        address,
        profileImage,
      });
  
      await newCitizen.save();
      res.status(201).json(newCitizen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating citizen' });
    }
  };
  


// Rescuers /////////////////////////////////////////////////////
  export const getRescuers = async (req, res) => {
    try {
      const rescuers = await Rescuer.find().select("-password");
      res.status(200).json(rescuers);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

