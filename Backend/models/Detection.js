import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    missionName: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    annotatedUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "UPLOADED",
    },
    total_objects: {
      type: Number,
      default: 0,
    },
    counts: {
      people: {
        type: Number,
        default: 0,
      },
      vehicles: {
        type: Number,
        default: 0,
      },
    },
    detections: {
      type: [
        {
          class: String,
          confidence: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const Detection = mongoose.model("Detection", detectionSchema);

export default Detection;