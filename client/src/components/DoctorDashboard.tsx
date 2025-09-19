import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Users
} from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import ClinicalNotes from "./ClinicalNotes";
import OPDRecording from "./OPDRecording";
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
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>My Patients</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patientList.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">MRN: {patient.mrn}</p>
                        <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPatient ? (
              <Tabs defaultValue="opd" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="opd">OPD Recording</TabsTrigger>
                  <TabsTrigger value="history">Patient History</TabsTrigger>
                  <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="opd" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ClipboardList className="w-5 h-5" />
                        <span>OPD Recording - {selectedPatient.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <OPDRecording />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Medical History - {selectedPatient.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(patientRecords[selectedPatient.id] || []).map((record) => (
                          <div key={record.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">{record.visitType}</Badge>
                              <span className="text-sm text-muted-foreground">{record.date}</span>
                            </div>
                            <h3 className="font-medium mb-2">{record.diagnosis}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{record.notes}</p>
                            <div className="text-sm">
                              <strong>Prescription:</strong> {record.prescription}
                            </div>
                          </div>
                        ))}
                        {(!patientRecords[selectedPatient.id] || patientRecords[selectedPatient.id].length === 0) && (
                          <p className="text-muted-foreground text-center py-8">
                            No medical history found for this patient.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Clinical Notes - {selectedPatient.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClinicalNotes />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Patient</h3>
                    <p className="text-muted-foreground">
                      Choose a patient from the sidebar to view their records and start an OPD session.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}