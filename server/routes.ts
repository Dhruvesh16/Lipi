import type { Express } from "express";
import { createServer, type Server } from "http";
import { User, OPDRecord, type IUser, type IOPDRecord } from "./database";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  
  // POST /api/auth/login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, userType } = req.body;
      
      if (!email || !password || !userType) {
        return res.status(400).json({ 
          error: "Email, password, and user type are required" 
        });
      }

      // Find user by email and userType
      const user = await User.findOne({ 
        email: email.toLowerCase().trim(), 
        userType,
        password // Note: In production, use bcrypt to hash passwords
      });

      if (!user) {
        return res.status(401).json({ 
          error: "Invalid credentials or user type" 
        });
      }

      // Return user data (excluding password)
      const { password: _, ...userData } = user.toObject();
      res.json({ 
        success: true, 
        user: userData,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/auth/signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = req.body;
      
      if (!userData.email || !userData.password || !userData.userType) {
        return res.status(400).json({ 
          error: "Email, password, and user type are required" 
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        email: userData.email.toLowerCase().trim() 
      });

      if (existingUser) {
        return res.status(409).json({ 
          error: "User with this email already exists" 
        });
      }

      // Create new user
      const newUser = new User({
        ...userData,
        email: userData.email.toLowerCase().trim()
      });

      const savedUser = await newUser.save();
      
      // Return user data (excluding password)
      const { password: _, ...userResponse } = savedUser.toObject();
      res.status(201).json({ 
        success: true, 
        user: userResponse,
        message: "User created successfully"
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/users - Get all users (for development/testing)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude passwords
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // OPD Recording routes
  
  // POST /api/opd/save - Save OPD record
  app.post("/api/opd/save", async (req, res) => {
    try {
      const {
        doctorId,
        patientDetails,
        chiefComplaint,
        historyOfPresentIllness,
        pastMedicalHistory,
        examination,
        diagnosis,
        treatment,
        followUp,
        recordingTranscript,
        audioRecordingUrl
      } = req.body;

      if (!doctorId || !patientDetails || !chiefComplaint) {
        return res.status(400).json({ 
          error: "Doctor ID, patient details, and chief complaint are required" 
        });
      }

      const newOPDRecord = new OPDRecord({
        doctorId,
        patientDetails,
        chiefComplaint,
        historyOfPresentIllness: historyOfPresentIllness || '',
        pastMedicalHistory: pastMedicalHistory || '',
        examination: examination || '',
        diagnosis: diagnosis || '',
        treatment: treatment || '',
        followUp: followUp || '',
        recordingTranscript: recordingTranscript || '',
        audioRecordingUrl: audioRecordingUrl || '',
        recordingDate: new Date()
      });

      const savedRecord = await newOPDRecord.save();
      
      res.status(201).json({ 
        success: true, 
        record: savedRecord,
        message: "OPD record saved successfully"
      });
    } catch (error) {
      console.error("Save OPD record error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/opd/records/:doctorId - Get OPD records for a doctor
  app.get("/api/opd/records/:doctorId", async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const records = await OPDRecord.find({ doctorId })
        .sort({ recordingDate: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));

      const total = await OPDRecord.countDocuments({ doctorId });

      res.json({
        success: true,
        records,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalRecords: total
        }
      });
    } catch (error) {
      console.error("Get OPD records error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/opd/record/:recordId - Get specific OPD record
  app.get("/api/opd/record/:recordId", async (req, res) => {
    try {
      const { recordId } = req.params;
      
      const record = await OPDRecord.findById(recordId);
      
      if (!record) {
        return res.status(404).json({ error: "OPD record not found" });
      }

      res.json({ success: true, record });
    } catch (error) {
      console.error("Get OPD record error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PUT /api/opd/record/:recordId - Update OPD record
  app.put("/api/opd/record/:recordId", async (req, res) => {
    try {
      const { recordId } = req.params;
      const updateData = req.body;

      const updatedRecord = await OPDRecord.findByIdAndUpdate(
        recordId,
        updateData,
        { new: true }
      );

      if (!updatedRecord) {
        return res.status(404).json({ error: "OPD record not found" });
      }

      res.json({ 
        success: true, 
        record: updatedRecord,
        message: "OPD record updated successfully"
      });
    } catch (error) {
      console.error("Update OPD record error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // DELETE /api/opd/record/:recordId - Delete OPD record
  app.delete("/api/opd/record/:recordId", async (req, res) => {
    try {
      const { recordId } = req.params;
      
      const deletedRecord = await OPDRecord.findByIdAndDelete(recordId);
      
      if (!deletedRecord) {
        return res.status(404).json({ error: "OPD record not found" });
      }

      res.json({ 
        success: true, 
        message: "OPD record deleted successfully"
      });
    } catch (error) {
      console.error("Delete OPD record error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
