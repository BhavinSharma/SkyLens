import Detection from "../models/Detection.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const FLASK_API_URL = "http://localhost:5000/detect";

function mapCounts(yoloCounts = {}) {
  const people = yoloCounts.person || 0;

  const vehicles =
    (yoloCounts.car || 0) +
    (yoloCounts.bus || 0) +
    (yoloCounts.truck || 0) +
    (yoloCounts.motorcycle || 0) +
    (yoloCounts.bicycle || 0);

  return { people, vehicles };
}

export const uploadDetection = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "image file is required",
        success: false,
      });
    }

    const detection = await Detection.create({
      user: req.id,
      missionName: req.body.missionName || "",
      notes: req.body.notes || "",
      originalName: req.file.originalname,
      imageUrl: `/uploads/${req.file.filename}`,
      annotatedUrl: "",
      status: "PROCESSING",
      total_objects: 0,
      counts: {
        people: 0,
        vehicles: 0,
      },
      detections: [],
    });

    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));

    const flaskResponse = await axios.post(FLASK_API_URL, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    const result = flaskResponse.data;

    const mappedCounts = mapCounts(result.counts);

    detection.status = "COMPLETED";
    detection.total_objects = result.total_objects || 0;
    detection.counts = mappedCounts;
    detection.detections = result.detections || [];
    detection.annotatedUrl = result.annotated_image
      ? `http://localhost:5000${result.annotated_image}`
      : "";

    await detection.save();

    return res.status(201).json({
      message: "image uploaded and detected successfully",
      success: true,
      detection,
      counts: detection.counts,
      total_objects: detection.total_objects,
      annotatedUrl: detection.annotatedUrl,
    });
  } catch (error) {
    console.log("Upload detection error:", error);

    return res.status(500).json({
      message:
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error.message ||
        "Detection failed",
      success: false,
    });
  }
};

export const getDetections = async (req, res) => {
  try {
    const detections = await Detection.find({ user: req.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      detections,
    });
  } catch (error) {
    console.log("Get detections error:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const removeDetections = async (req, res) => {
  try {
    const detectionId = req.params.id;

    const deletedDetection = await Detection.findByIdAndDelete(detectionId);

    if (!deletedDetection) {
      return res.status(404).json({
        message: "Detection not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Detection removed",
      success: true,
    });
  } catch (error) {
    console.log("Remove detection error:", error);

    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};