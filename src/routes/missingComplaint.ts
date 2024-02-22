import { Router } from "express";
import ROLES from "../utils/Roles";
import limitToRoles from "../middleware/limitToRoles";
import { Types } from "mongoose";
import { IAuthenticatedRequest } from "../middleware/authenticate";
import MissingComplaintController from "../controllers/MissingComplaintController";

export default Router()
  /**
   * Create a new missing complaint
   **/
  .post(
    "/",
    limitToRoles([ROLES.CITIZEN]),
    async (request: IAuthenticatedRequest, response) => {
      try {
        const missingComplaint = await (
          await MissingComplaintController.createNewMissingComplaint(
            request.body
          )
        ).toObject();
        response.status(201).send(missingComplaint);
      } catch (error: any) {
        response.status(400).send({ message: error.message });
      }
    }
  )

  /**
   * Close a missing complaint
   **/
  .put(
    `/:missingComplaintIdString/close`,
    limitToRoles([ROLES.POLICE]),
    async (request, response) => {
      try {
        const { missingComplaintIdString } = request.params;
        const missingComplaintId = Types.ObjectId(missingComplaintIdString);
        const missingComplaint =
          await MissingComplaintController.closeMissingComplaint(
            missingComplaintId,
            request.body
          );
        response.status(200).send(missingComplaint);
      } catch (error: any) {
        const message = (error as Error).message;
        if (
          message ===
          "Police officer not assigned to this missing complaint, cannot close the case"
        ) {
          response.status(403).send(message);
        } else {
          response.status(400).send(message);
        }
      }
    }
  )

  /**
   * Get active missing case of police
   **/
  .get(
    "/:policeIdString/current",
    limitToRoles([ROLES.POLICE]),
    async (request: IAuthenticatedRequest, response) => {
      try {
        const { policeIdString } = request.params;
        const policeId = Types.ObjectId(policeIdString);
        const activeMissingComplaint =
          await MissingComplaintController.getActiveMissingCaseOfPolice(
            policeId
          );
        response.status(200).send(activeMissingComplaint);
      } catch (error: any) {
        response.status(400).send({ message: error.message });
      }
    }
  )

  /**
   * Get if the police officer is assigned to a missing complaint
   **/
  .get(
    "/:policeIdString/isAssigned",
    limitToRoles([ROLES.POLICE]),
    async (request: IAuthenticatedRequest, response) => {
      try {
        const { policeIdString } = request.params;
        const policeId = Types.ObjectId(policeIdString);
        const isAssigned =
          await MissingComplaintController.checkIfPoliceOfficerIsAssignedToMissingComplaint(
            policeId
          );
        response.status(200).send({ isAssigned });
      } catch (error: any) {
        response.status(400).send({ message: error.message });
      }
    }
  )

  .get(
    "/:concernedCitizenIdString",
    limitToRoles([ROLES.CITIZEN, ROLES.POLICE]),
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

  /**
   * Get all past cases assigned to a police officer
   **/
  .get(
    "/:policeIdString/all",
    limitToRoles([ROLES.POLICE]),
    async (request: IAuthenticatedRequest, response) => {
      try {
        const { policeIdString } = request.params;
        const policeId = Types.ObjectId(policeIdString);
        const pastMissingComplaints =
          await MissingComplaintController.getAllPastMissingCasesOfPolice(
            policeId
          );
        response.status(200).send(pastMissingComplaints);
      } catch (error: any) {
        response.status(400).send({ message: error.message });
      }
    }
  )

  .get(
    "/complaint/:missingComplaintIdString",
    limitToRoles([ROLES.CITIZEN, ROLES.POLICE]),
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
