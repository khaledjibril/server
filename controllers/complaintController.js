import {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
} from "../models/complaintModel.js";

export const submitComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { complaint } = req.body;

    if (!complaint || complaint.trim() === "") {
      return res
        .status(400)
        .json({ message: "Complaint details cannot be empty." });
    }

    const newComplaint = await createComplaint(userId, complaint);

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint,
    });
  } catch (err) {
    console.error("Error submitting complaint:", err);
    res.status(500).json({ message: "Server error submitting complaint" });
  }
};

export const fetchUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const complaints = await getUserComplaints(userId);

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching user complaints:", err);
    res.status(500).json({ message: "Server error fetching complaints" });
  }
};

export const fetchAllComplaints = async (req, res) => {
  try {
    const complaints = await getAllComplaints();

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching all complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
};
