import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // The NGO user who escalated the reports
    },
    severity: {
      type: String,
      required: true,
      enum: ['LOW', 'MEDIUM', 'CRITICAL'],
    },
    status: {
      type: String,
      required: true,
      enum: ['NEW', 'UNDER_INVESTIGATION', 'RESOLVED'],
      default: 'NEW',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: {
      // A summary written by the NGO for the authorities
      type: String,
      required: true,
    },
    reports: [
      {
        // Links to all the underlying evidence reports
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Report',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Alert = mongoose.model('Alert', alertSchema);