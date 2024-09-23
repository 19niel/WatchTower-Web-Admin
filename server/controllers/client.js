
import User from "../models/User.js";
import getCountryIso3 from "country-iso-2-to-3";

import Citizen from "../models/Citizen.js";
import Rescuer from "../models/Rescuer.js";
// import Report from "../models/Report.js"


export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }


};

  // WatchTower ////////////////////////////////////////////////////////
  export const getCitizens = async (req, res) => {
    try {
      const citizens = await Citizen.find().select("-password");
      res.status(200).json(citizens);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };


  export const createCitizen = async (req, res) => {
    const { firstName, lastName, username, password, email, mobileNumber, address, profileImage } = req.body;
  
    try {
      const newCitizen = new Citizen({
        firstName,
        lastName,
        username,
        password, // Ensure this is hashed before saving
        email,
        mobileNumber,
        address,
        profileImage,
      });
  
      await newCitizen.save();
      res.status(201).json(newCitizen);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  




  export const getRescuers = async (req, res) => {
    try {
      const rescuers = await Rescuer.find().select("-password");
      res.status(200).json(rescuers);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

