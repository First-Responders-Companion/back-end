import MissingComplaint, {
  IMissingComplaint,
} from "../models/MissingComplaint";
import { Types } from "mongoose";
import User from "../models/User";

class MissingComplaintController {
  // check if case is closed before assigning a police officer
  findAvailablePoliceOfficer = async () => {
    const allMissingComplaints = await MissingComplaint.find();

    if (allMissingComplaints.length === 0) {
      const policeOfficer = await User.findOne({ role: "Police" });
      if (!policeOfficer) {
        throw new Error("No police officer found");
      }
      return policeOfficer;
    }

    const policeOfficers = await User.find({ role: "Police" });
    if (policeOfficers.length === 0) {
      throw new Error("No police officers found");
    }

    const policeOfficersAssignedToActiveComplaints = allMissingComplaints
      .filter(
        (complaint: { isCaseClosed: boolean }) =>
          complaint.isCaseClosed === false
      )
      .map((complaint: { assignedTo: any }) => complaint.assignedTo);

    const availablePoliceOfficers = policeOfficers.filter(
      (policeOfficer) =>
        !policeOfficersAssignedToActiveComplaints.some(
          (assignedOfficer: { _id: { toString: () => any } }) => {
            return (
              assignedOfficer._id.toString() === policeOfficer._id.toString()
            );
          }
        )
    );

    if (availablePoliceOfficers.length === 0) {
      throw new Error(
        "Please contact your local police station as we do not have enough resources to address your complaint at this time."
      );
    }
    return availablePoliceOfficers[0];
  };

  createNewMissingComplaint = async (
    missingComplaint: Partial<IMissingComplaint>
  ) => {
    const policeOfficer = await this.findAvailablePoliceOfficer();
    const newMissingComplaint = new MissingComplaint({
      ...missingComplaint,
      assignedTo: policeOfficer,
    }).save();
    return newMissingComplaint;
  };

  closeMissingComplaint = async (missingComplaintId: Types.ObjectId) => {
    const missingComplaint = await MissingComplaint.findById(
      missingComplaintId
    );
    if (!missingComplaint) {
      throw new Error("Missing complaint not found");
    }

    missingComplaint.isCaseClosed = true;

    const updatedMissingComplaint = await missingComplaint.save();
    return updatedMissingComplaint;
  };

  checkIfPoliceOfficerIsAssignedToMissingComplaint = async (
    policeId: Types.ObjectId
  ) => {
    try {
      const policeOfficer = await User.findById(policeId);
      if (!policeOfficer) {
        throw new Error(`Police officer ${policeId} not found`);
      }

      const activeMissingComplaint = await MissingComplaint.findOne({
        assignedTo: policeOfficer,
        isCaseClosed: false,
      }).exec();

      if (!activeMissingComplaint) {
        return false;
      }

      return true;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  getActiveMissingCaseOfPolice = async (policeId: Types.ObjectId) => {
    try {
      const policeOfficer = await User.findById(policeId);
      if (!policeOfficer) {
        throw new Error(`Police officer ${policeId} not found`);
      }

      const activeMissingComplaint = await MissingComplaint.findOne({
        assignedTo: policeOfficer,
        isCaseClosed: false,
      }).exec();

      if (!activeMissingComplaint) {
        throw new Error(
          `No active missing complaint found for police officer ${policeId}`
        );
      }

      return activeMissingComplaint;
    } catch (error: unknown) {
      throw new Error((error as Error).message);
    }
  };

  getAllPastMissingCasesOfPolice = async (policeId: Types.ObjectId) => {
    try {
      const policeOfficer = await User.findById(policeId);
      if (!policeOfficer) {
        throw new Error(`Police officer ${policeId} not found`);
      }

      const pastMissingComplaints = await MissingComplaint.find({
        assignedTo: policeOfficer,
        isCaseClosed: true,
      });

      if (!pastMissingComplaints) {
        throw new Error(
          `Something went wrong while fetching past missing complaints of police officer ${policeId}`
        );
      }

      return pastMissingComplaints;
    } catch (error: unknown) {
      throw new Error((error as Error).message);
    }
  };

  getAllMissingComplaints = async (concernedCitizenId: Types.ObjectId) => {
    try {
      const concernedCitizen = await User.findById(concernedCitizenId);
      if (!concernedCitizen) {
        throw new Error(`User ${concernedCitizenId} not found`);
      }
      const missingComplaints = await MissingComplaint.find({
        complaintFiledBy: concernedCitizen,
      });
      return missingComplaints;
    } catch (error) {
      throw new Error("Something went wrong!");
    }
  };

  getMissingComplaint = async (complaintId: Types.ObjectId) => {
    try {
      const missingComplaint = await MissingComplaint.findById(
        complaintId
      ).exec();
      return missingComplaint;
    } catch (error) {
      throw new Error(`Failed to find missing complaint: ${error}`);
    }
  };
}
export default new MissingComplaintController();
