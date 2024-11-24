import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id
        if (!jobId) {
            return res.status(400).json({
                message: "Job Id is required",
                success: false
            })

        }
        const existingApplication = await Application.findOne({ job: jobId, user: userId })
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,

        })

        job.applications.push(newApplication._id)
        await job.save();
        return res.status(200).json({
            message: "Application submitted successfully",
            success: true
        })

    } catch (error) {
        console.log(error);

    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } }
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No applications found",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true

        })
    }
    catch (error) {
        console.log(error);
    }
}

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        })
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body
        const applicantId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Status is required",
                success:false
            })
        };

        const application = await Application.findOne({_id:applicantId});
        if(!application){
            return res.status(404).json({
                message:"Application not found",
                success:false
            })
        };

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Application status updated successfully",
            success:true
        });



    } catch (error) {
        console.log(error);

    }
}

export const cancelApplication = async (req, res) => {
    try {
        const { id } = req.params; // Job ID
        const userId = req.user?._id; // Authenticated user ID from middleware

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Find the user's application and remove it
        const applicationIndex = job.applications.findIndex(app => app.applicant === userId);
        if (applicationIndex === -1) {
            return res.status(400).json({ success: false, message: "You have not applied for this job" });
        }

        job.applications.splice(applicationIndex, 1);
        await job.save();

        res.status(200).json({ success: true, message: "Application canceled successfully" });
    } catch (error) {
        console.error("Cancel application error:", error);
        res.status(500).json({ success: false, message: "Failed to cancel application" });
    }
};
