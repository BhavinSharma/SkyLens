import express from "express";

import { removeDetections } from "../controllers/detectionController.js";





 const router = express.Router();



 router.route("/remove/:id").delete(removeDetections)

  
 
             

 
   export default router;