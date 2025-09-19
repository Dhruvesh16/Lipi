import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  Search,
  User,
  Stethoscope,
  ClipboardList,
  Users,
  Eye,
  Phone,
  MapPin,
  CalendarDays
} from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import ClinicalNotes from "./ClinicalNotes";
import OPDRecording from "../pages/OPDRecording";
import { useState, useEffect } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  license: string;
  email: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  mrn: string;
  dateOfBirth: string;
  phone: string;
}

export default function DoctorDashboard() {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [patientList, setPatientList] = useState<Patient[]>([
    { 
      id: "pat1", 
      name: "John Smith", 
      age: 45, 
      mrn: "MRN001",
      dateOfBirth: "1979-03-15",
      phone: "+1-555-0123"
    },
    { 
      id: "pat2", 
      name: "Maria Garcia", 
      age: 32, 
      mrn: "MRN002",
      dateOfBirth: "1992-07-22",
      phone: "+1-555-0124"
    },
    { 
      id: "pat3", 
      name: "Robert Johnson", 
      age: 67, 
      mrn: "MRN003",
      dateOfBirth: "1957-11-08",
      phone: "+1-555-0125"
    }
  ]);

  const [patientRecords, setPatientRecords] = useState<{ [key: string]: any[] }>({
    "pat1": [
      {
        id: "rec1",
        date: "2024-03-15",
        diagnosis: "Hypertension",
        prescription: "Lisinopril 10mg daily",
        notes: "Blood pressure well controlled",
        visitType: "Follow-up"
      }
    ],
    "pat2": [
      {
        id: "rec2",
        date: "2024-03-10",
        diagnosis: "Upper Respiratory Infection",
        prescription: "Amoxicillin 500mg TID x 7 days",
        notes: "Resolved completely",
        visitType: "Acute Care"
      }
    ],
    "pat3": [
      {
        id: "rec3",
        date: "2024-02-28",
        diagnosis: "Annual Physical Exam",
        prescription: "Vitamin D supplement",
        notes: "Overall good health",
        visitType: "Routine Check-up"
      }
    ]
  });

  useEffect(() => {
    // Get current doctor from sessionStorage
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      setCurrentDoctor(JSON.parse(userData));
    }

    // Load existing patient records from sessionStorage
    const savedRecords = sessionStorage.getItem('patientRecords');
    if (savedRecords) {
      setPatientRecords(JSON.parse(savedRecords));
    }

    // Load dynamic patient list from sessionStorage (includes auto-created patients)
    const savedPatients = sessionStorage.getItem('patientList');
    if (savedPatients) {
      const dynamicPatients = JSON.parse(savedPatients);
      // Merge with existing static patients, avoiding duplicates
      const mergedPatients = [...patientList];
      dynamicPatients.forEach((dynamicPatient: Patient) => {
        const exists = mergedPatients.find(p => p.mrn === dynamicPatient.mrn);
        if (!exists) {
          mergedPatients.push(dynamicPatient);
        }
      });
      setPatientList(mergedPatients);
    }
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setDetailViewOpen(true);
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  const refreshPatientList = () => {
    const savedPatients = sessionStorage.getItem('patientList');
    if (savedPatients) {
      const dynamicPatients = JSON.parse(savedPatients);
      // Merge with existing static patients, avoiding duplicates
      const mergedPatients = [...patientList];
      dynamicPatients.forEach((dynamicPatient: Patient) => {
        const exists = mergedPatients.find(p => p.mrn === dynamicPatient.mrn);
        if (!exists) {
          mergedPatients.push(dynamicPatient);
        }
      });
      setPatientList(mergedPatients);
    }
  };

  // Auto-refresh patient list every 5 seconds to show newly created patients
  useEffect(() => {
    const interval = setInterval(refreshPatientList, 5000);
    return () => clearInterval(interval);
  }, [patientList]);

  // Detailed Patient View Modal Component
  const PatientDetailModal = () => (
    <Dialog open={detailViewOpen} onOpenChange={setDetailViewOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-lg font-semibold">
                {selectedPatient?.name.split(' ').map(n => n[0]).join('') || 'P'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{selectedPatient?.name}</h2>
              <p className="text-muted-foreground text-sm">Patient Details & Medical History</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Patient Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">MRN:</span>
                      <span className="text-sm">{selectedPatient.mrn}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Age:</span>
                      <span className="text-sm">{selectedPatient.age} years</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">DOB:</span>
                      <span className="text-sm">{selectedPatient.dateOfBirth}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">{selectedPatient.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">First Visit:</span>
                      <span className="text-sm">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical History Tabs */}
              <Tabs defaultValue="opd-history" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="opd-history">OPD History</TabsTrigger>
                  <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="opd-history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ClipboardList className="w-5 h-5" />
                          <span>OPD Consultation History</span>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            sessionStorage.setItem('selectedPatient', JSON.stringify(selectedPatient));
                            window.location.href = '/opd-recording';
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          New OPD
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(patientRecords[selectedPatient.id] || []).map((record, index) => (
                          <div key={record.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Badge variant={index === 0 ? "default" : "outline"}>
                                  {record.visitType}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{record.date}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium text-sm text-primary">{record.diagnosis}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                              </div>
                              
                              <Separator />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-xs font-medium text-muted-foreground">PRESCRIPTION</span>
                                  <p className="text-sm mt-1">{record.prescription}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-muted-foreground">FOLLOW-UP</span>
                                  <p className="text-sm mt-1">{record.followUp || 'As needed'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {(!patientRecords[selectedPatient.id] || patientRecords[selectedPatient.id].length === 0) && (
                          <div className="text-center py-8 text-muted-foreground">
                            <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="font-medium mb-2">No OPD Records</h3>
                            <p className="text-sm mb-4">This patient has no consultation history yet.</p>
                            <Button 
                              onClick={() => {
                                sessionStorage.setItem('selectedPatient', JSON.stringify(selectedPatient));
                                window.location.href = '/opd-recording';
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Start First Consultation
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="clinical-notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Clinical Notes & Observations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClinicalNotes />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Medical Documents</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium mb-2">No Documents</h3>
                        <p className="text-sm">Medical documents and reports will appear here.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Patient Detail Modal */}
      <PatientDetailModal />
      
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Lipi - Doctor Portal</h1>
                <p className="text-muted-foreground text-sm">
                  Welcome, {currentDoctor?.name || 'Doctor'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Stethoscope className="w-3 h-3" />
                <span>{currentDoctor?.specialty || 'Specialist'}</span>
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Doctor Dashboard</h2>
              <p className="text-muted-foreground">Manage your patients and consultations</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/opd-recording'}
                className="flex items-center space-x-2"
              >
                <ClipboardList className="w-4 h-4" />
                <span>New OPD Recording</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientList.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>MRN: {patient.mrn}</p>
                      <p>Age: {patient.age} • DOB: {patient.dateOfBirth}</p>
                      <p>Phone: {patient.phone}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {(patientRecords[patient.id] || []).map((record) => (
                        <div key={record.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">{record.visitType}</Badge>
                            <span className="text-xs text-muted-foreground">{record.date}</span>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{record.diagnosis}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{record.notes}</p>
                          <div className="text-xs">
                            <strong>Rx:</strong> {record.prescription}
                          </div>
                        </div>
                      ))}
                      {(!patientRecords[patient.id] || patientRecords[patient.id].length === 0) && (
                        <p className="text-muted-foreground text-center py-4 text-sm">
                          No medical history
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      <p className="text-muted-foreground text-center py-4 text-sm">
                        Clinical notes will appear here
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-4 pt-4 border-t flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
                      window.location.href = '/opd-recording';
                    }}
                  >
                    <ClipboardList className="w-3 h-3 mr-1" />
                    New OPD
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}