import {Company} from '../models/company.model.js';
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You cannot register the same company.",
                success: false
            });
        }

        // Create the new company and save it to the database
        company = await Company.create({
            name: companyName,
            userId: req.id
        });
        
        // Return the created company with its _id in the response
        return res.status(201).json({
            message: "Company registered successfully.",
            success: true,
            company  
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred during company registration.",
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies) {
            return res.status(400).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company) {
            return res.status(400).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Company ID is missing in request parameters.",
                success: false
            });
        }

        const { name, description, website, location } = req.body;
        const file = req.file; 

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;




       

        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true,
            company
        });

    } catch (error) {
        console.log("Error updating company:", error);
        return res.status(500).json({
            message: "Server error while updating company information.",
            success: false
        });
    }
};
