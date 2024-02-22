import { Router } from "express";
import ROLES from "../utils/Roles";
import { Types } from "mongoose";
import { IAuthenticatedRequest } from "../middleware/authenticate";
import MissingComplaintController from "../controllers/MissingComplaintController";

export default Router()
  /**
   * Create a new missing complaint
   **/
  .post("/", async (request: IAuthenticatedRequest, response) => {
    try {
      const missingComplaint = await (
        await MissingComplaintController.createNewMissingComplaint(request.body)
      ).toObject();
      response.status(201).send(missingComplaint);
    } catch (error: any) {
      response.status(400).send({ message: error.message });
    }
  })

  /**
   * Close a missing complaint
   **/
  .put(`/:missingComplaintIdString/close`, async (request, response) => {
    try {
      const { missingComplaintIdString } = request.params;
      const missingComplaintId = Types.ObjectId(missingComplaintIdString);
      const missingComplaint =
        await MissingComplaintController.closeMissingComplaint(
          missingComplaintId
        );
      response.status(200).send(missingComplaint);
    } catch ({ message }) {
      if (
        message ===
        "Police officer not assigned to this missing complaint, cannot close the case"
      ) {
        response.status(403).send(message);
      } else {
        response.status(400).send(message);
      }
    }
  })

  .get(
    "/:concernedCitizenIdString",
    async (request: IAuthenticatedRequest, response) => {
      const { concernedCitizenIdString } = request.params;
      const concernedCitizenId = Types.ObjectId(concernedCitizenIdString);
      try {
        const missingComplaints =
          await MissingComplaintController.getAllMissingComplaints(
            concernedCitizenId
          );
        response.status(200).send(missingComplaints);
      } catch (error: any) {
        response.status(400).send({ message: error.message });
      }
    }
  )

  .get(
    "/complaint/:missingComplaintIdString",
    async (request: IAuthenticatedRequest, response) => {
      const { missingComplaintIdString } = request.params;
      const missingComplaintId = Types.ObjectId(missingComplaintIdString);
      try {
        const missingComplaint =
          await MissingComplaintController.getMissingComplaint(
            missingComplaintId
          );
        if (missingComplaint === null) {
          throw new Error("complaint does not exist");
        }
        response.status(200).send(missingComplaint);
      } catch (error: any) {
        response.status(400).send({ message: error.message });
      }
    }
  );
