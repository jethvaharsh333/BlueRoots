import mongoose from "mongoose";

const transactionControl = async (req, res, next) => {
  if (req.method === "GET") return next();

  const session = await mongoose.startSession();
  session.startTransaction();
  req.dbSession = session;

  res.on("finish", async () => {
    try {
      if (res.statusCode < 400) {
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
      }
    } catch (err) {
      console.error("Transaction commit/abort failed:", err);
    } finally {
      session.endSession();
    }
  });

  next();
};

export {transactionControl};

/*
  const userRole = new UserRole({ userId: user._id, roleId });
  await userRole.save({ session: req.dbSession });
*/