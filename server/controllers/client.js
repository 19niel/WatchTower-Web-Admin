import Citizen from "../models/Citizen.js";
import OverallStat from "../models/OverallStat.js"; // Import your OverallStat model
import Rescuer from "../models/Rescuer.js";

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
    const { firstName, lastName, username, password, email, mobileNumber, address, profileImage } = req.body;

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

    // Increment the totalCitizens count in the overallstat collection
    await OverallStat.updateOne({}, { $inc: { totalCitizens: 1 } });

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

   // Decrement the totalCitizen count in OverallStat
   await OverallStat.updateOne({}, { $inc: { totalCitizens: -1 } });
    res.status(200).json({ message: 'Citizen deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a citizen by ID
export const updateCitizen = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCitizen = await Citizen.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedCitizen) {
      return res.status(404).json({ message: 'Citizen not found' });
    }

    res.status(200).json(updatedCitizen);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const addRescuers = async (req, res) => {
  try {
    const { firstName, lastName, username, password, email, mobileNumber, address, profileImage } = req.body;

    const newRescuer = new Rescuer({
      firstName,
      lastName,
      username,
      password,
      email,
      mobileNumber,
      address,
      profileImage,
    });

    await newRescuer.save();
    res.status(201).json(newRescuer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Rescuer' });
  }
};

// Delete Citizen
export const deleteRescuers = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRescuer = await Rescuer.findByIdAndDelete(id);

    if (!deletedRescuer) {
      return res.status(404).json({ message: 'Rescuer not found' });
    }

    res.status(200).json({ message: 'Rescuer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a rescuer by ID
export const updateRescuers = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedRescuer = await Rescuer.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedRescuer) {
      return res.status(404).json({ message: 'Rescuer not found' });
    }

    res.status(200).json(updatedRescuer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
