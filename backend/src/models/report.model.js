import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the User who submitted it
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        // default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ['CUTTING', 'DUMPING', 'POLLUTION', 'LAND_CLEARING', 'OTHER'],
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'ACTIONED'],
      default: 'PENDING',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ location: '2dsphere' });

export const Report = mongoose.model('Report', reportSchema);
