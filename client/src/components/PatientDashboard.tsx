import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FileText, 
  Clock, 
  Calendar,
  User,
  Heart,
  Pill,
  Activity,
  Download,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";

interface Patient {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  phone: string;
  email: string;
  bloodGroup: string;
  allergies: string[];
}

interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  visitType: string;
  nextAppointment?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'discontinued';
}

export default function PatientDashboard() {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([
    {
      id: "rec1",
      date: "2024-03-15",
      doctorName: "Dr. John Smith",
      diagnosis: "Annual Health Check-up",
      prescription: "Vitamin D supplement, Multi-vitamin",
      notes: "Overall health is good. Continue current lifestyle.",
      visitType: "Routine Check-up",
      nextAppointment: "2024-09-15"
    },
    {
      id: "rec2",
      date: "2024-02-10",
      doctorName: "Dr. Sarah Johnson",
      diagnosis: "Common Cold",
      prescription: "Rest, fluids, Paracetamol as needed",
      notes: "Symptoms should resolve in 5-7 days.",
      visitType: "Acute Care"
    },
    {
      id: "rec3",
      date: "2024-01-20",
      doctorName: "Dr. Michael Brown",
      diagnosis: "Preventive Care Consultation",
      prescription: "Continue current medications",
      notes: "Blood pressure and cholesterol levels are within normal range.",
      visitType: "Preventive Care",
      nextAppointment: "2024-07-20"
    }
  ]);

  const [currentMedications, setCurrentMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      startDate: "2024-03-15",
      endDate: "2024-09-15",
      status: "active"
    },
    {
      id: "med2",
      name: "Multivitamin",
      dosage: "1 tablet",
      frequency: "Once daily",
      startDate: "2024-03-15",
      endDate: "2024-09-15",
      status: "active"
    }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: "apt1",
      date: "2024-04-15",
      time: "10:00 AM",
      doctorName: "Dr. John Smith",
      type: "Follow-up",
      location: "Room 201"
    },
    {
      id: "apt2",
      date: "2024-05-10",
      time: "2:30 PM",
      doctorName: "Dr. Sarah Johnson",
      type: "Consultation",
      location: "Room 105"
    }
  ]);

  useEffect(() => {
    // Get current patient from sessionStorage
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentPatient({
        id: user.id,
        name: user.name,
        age: 28,
        dateOfBirth: "1996-05-15",
        phone: "+1-555-0100",
        email: user.email,
        bloodGroup: "O+",
        allergies: ["Penicillin", "Shellfish"]
      });
    }

    // Load medical history from sessionStorage if available
    const savedHistory = sessionStorage.getItem('patientMedicalHistory');
    if (savedHistory) {
      setMedicalHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'discontinued': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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
                <h1 className="text-xl font-bold">Lipi - Patient Portal</h1>
                <p className="text-muted-foreground text-sm">
                  Welcome, {currentPatient?.name || 'Patient'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>Patient ID: {currentPatient?.id || 'P001'}</span>
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
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg">
                      {currentPatient?.name.split(' ').map(n => n[0]).join('') || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium">{currentPatient?.name}</h3>
                  <p className="text-sm text-muted-foreground">Age: {currentPatient?.age}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Date of Birth:</strong>
                    <p className="text-muted-foreground">{currentPatient?.dateOfBirth}</p>
                  </div>
                  <div>
                    <strong>Blood Group:</strong>
                    <p className="text-muted-foreground">{currentPatient?.bloodGroup}</p>
                  </div>
                  <div>
                    <strong>Phone:</strong>
                    <p className="text-muted-foreground">{currentPatient?.phone}</p>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <p className="text-muted-foreground">{currentPatient?.email}</p>
                  </div>
                  <div>
                    <strong>Allergies:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentPatient?.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Records
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminders
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">Medical History</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recent Visit */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>Recent Visit</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {medicalHistory[0] && (
                        <div>
                          <p className="font-medium">{medicalHistory[0].diagnosis}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {medicalHistory[0].date} - {medicalHistory[0].doctorName}
                          </p>
                          <p className="text-sm">{medicalHistory[0].notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Next Appointment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Next Appointment</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingAppointments[0] && (
                        <div>
                          <p className="font-medium">{upcomingAppointments[0].type}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {upcomingAppointments[0].date} at {upcomingAppointments[0].time}
                          </p>
                          <p className="text-sm">
                            {upcomingAppointments[0].doctorName} - {upcomingAppointments[0].location}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Active Medications Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Pill className="w-4 h-4" />
                      <span>Current Medications ({currentMedications.filter(m => m.status === 'active').length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentMedications.filter(m => m.status === 'active').map((medication) => (
                        <div key={medication.id} className="border rounded-lg p-3">
                          <h4 className="font-medium">{medication.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage} - {medication.frequency}
                          </p>
                          <Badge className={`mt-2 ${getMedicationStatusColor(medication.status)}`}>
                            {medication.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Medical History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {medicalHistory.map((record) => (
                        <div key={record.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{record.visitType}</Badge>
                            <span className="text-sm text-muted-foreground">{record.date}</span>
                          </div>
                          <h3 className="font-medium mb-2">{record.diagnosis}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Doctor:</strong> {record.doctorName}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">{record.notes}</p>
                          <div className="text-sm">
                            <strong>Prescription:</strong> {record.prescription}
                          </div>
                          {record.nextAppointment && (
                            <div className="text-sm mt-2">
                              <strong>Next Appointment:</strong> {record.nextAppointment}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Pill className="w-5 h-5" />
                      <span>My Medications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentMedications.map((medication) => (
                        <div key={medication.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{medication.name}</h3>
                            <Badge className={getMedicationStatusColor(medication.status)}>
                              {medication.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Dosage:</strong> {medication.dosage}
                            </div>
                            <div>
                              <strong>Frequency:</strong> {medication.frequency}
                            </div>
                            <div>
                              <strong>Start Date:</strong> {medication.startDate}
                            </div>
                            <div>
                              <strong>End Date:</strong> {medication.endDate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Upcoming Appointments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{appointment.type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time}
                            </span>
                          </div>
                          <h3 className="font-medium mb-2">{appointment.doctorName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Location: {appointment.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}