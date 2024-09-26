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
    const { firstName, lastName, username, password, email, mobileNumber, address, profileImage } = req.body; // Access profileImage directly from req.body

    const newCitizen = new Citizen({
      firstName,
      lastName,
      username,
      password,
      email,
      mobileNumber,
      address,
      profileImage, // Use the Base64 image string directly
    });

    await newCitizen.save();
    res.status(201).json(newCitizen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating citizen' });
  }
};

// DELETE a citizen by ID
export const deleteCitizen = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCitizen = await Citizen.findByIdAndDelete(id);

    if (!deletedCitizen) {
      return res.status(404).json({ message: 'Citizen not found' });
    }
    
    res.status(200).json({ message: 'Citizen deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
