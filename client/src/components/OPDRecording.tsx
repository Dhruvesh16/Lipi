import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Save, 
  Mic, 
  MicOff, 
  User, 
  Stethoscope, 
  FileText,
  Clock,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import AudioRecorder from "./AudioRecorder";

const opdSchema = z.object({
  chiefComplaint: z.string().min(10, "Chief complaint must be at least 10 characters"),
  historyOfPresentIllness: z.string().min(20, "History of present illness must be at least 20 characters"),
  vitalSigns: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.string().optional(),
    temperature: z.string().optional(),
    respiratoryRate: z.string().optional(),
    oxygenSaturation: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional()
  }),
  physicalExamination: z.string().min(20, "Physical examination must be at least 20 characters"),
  diagnosis: z.string().min(5, "Diagnosis is required"),
  diagnosisType: z.enum(["primary", "secondary", "differential"]),
  treatment: z.string().min(10, "Treatment plan must be at least 10 characters"),
  medications: z.string().optional(),
  followUp: z.string().optional(),
  notes: z.string().optional()
});

type OPDForm = z.infer<typeof opdSchema>;

export default function OPDRecording() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const patientData = sessionStorage.getItem('selectedPatient');
    const doctorData = sessionStorage.getItem('selectedDoctor');
    
    if (patientData) {
      setSelectedPatient(JSON.parse(patientData));
    }
    if (doctorData) {
      setSelectedDoctor(JSON.parse(doctorData));
    }
  }, []);

  const form = useForm<OPDForm>({
    resolver: zodResolver(opdSchema),
    defaultValues: {
      chiefComplaint: "",
      historyOfPresentIllness: "",
      vitalSigns: {
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        weight: "",
        height: ""
      },
      physicalExamination: "",
      diagnosis: "",
      diagnosisType: "primary",
      treatment: "",
      medications: "",
      followUp: "",
      notes: ""
    }
  });

  const onSubmit = async (data: OPDForm) => {
    console.log('OPD Record submission:', {
      patient: selectedPatient?.name,
      doctor: selectedDoctor?.name,
      ...data
    });
    
    setIsSaving(true);
    
    try {
      // Simulate API call to save OPD record
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dispatch custom event to update patient history
      const opdRecordEvent = new CustomEvent('opdRecordSaved', {
        detail: data
      });
      window.dispatchEvent(opdRecordEvent);
      
      // Reset form after successful save
      form.reset();
      alert('OPD record saved successfully!');
    } catch (error) {
      console.error('Error saving OPD record:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVoiceToText = () => {
    setIsRecording(!isRecording);
    console.log('Voice to text:', isRecording ? 'stopped' : 'started');
    // In a real implementation, this would integrate with speech recognition
  };

  const diagnosisTypes = [
    { value: "primary", label: "Primary Diagnosis" },
    { value: "secondary", label: "Secondary Diagnosis" },
    { value: "differential", label: "Differential Diagnosis" }
  ];

  if (!selectedPatient || !selectedDoctor) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No patient or doctor selected</p>
          <p className="text-sm text-muted-foreground">Please login and select a patient to start OPD recording</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Patient and Doctor Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-lg" data-testid="text-patient-name">
                    {selectedPatient.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Age: {selectedPatient.age} • MRN: {selectedPatient.mrn}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Stethoscope className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold" data-testid="text-doctor-name">
                    {selectedDoctor.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor.specialty}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{new Date().toLocaleDateString()}</span>
              </Badge>
              <Button
                variant="outline"
                onClick={handleVoiceToText}
                data-testid="button-voice-to-text"
                className={isRecording ? "bg-red-50 border-red-200" : ""}
              >
                {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Recording Section */}
        <div className="lg:col-span-1">
          <AudioRecorder />
        </div>

        {/* OPD Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>OPD Consultation Form</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Chief Complaint */}
                <div className="space-y-2">
                  <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                  <Textarea
                    id="chiefComplaint"
                    placeholder="Patient's primary concern or reason for visit..."
                    {...form.register("chiefComplaint")}
                    data-testid="textarea-chief-complaint"
                    className="min-h-[80px]"
                  />
                  {form.formState.errors.chiefComplaint && (
                    <p className="text-sm text-destructive" data-testid="error-chief-complaint">
                      {form.formState.errors.chiefComplaint.message}
                    </p>
                  )}
                </div>

                {/* History of Present Illness */}
                <div className="space-y-2">
                  <Label htmlFor="historyOfPresentIllness">History of Present Illness</Label>
                  <Textarea
                    id="historyOfPresentIllness"
                    placeholder="Detailed description of current illness timeline, symptoms, and progression..."
                    {...form.register("historyOfPresentIllness")}
                    data-testid="textarea-hpi"
                    className="min-h-[120px]"
                  />
                  {form.formState.errors.historyOfPresentIllness && (
                    <p className="text-sm text-destructive" data-testid="error-hpi">
                      {form.formState.errors.historyOfPresentIllness.message}
                    </p>
                  )}
                </div>

                {/* Vital Signs */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Vital Signs</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'bloodPressure', label: 'Blood Pressure', placeholder: '120/80 mmHg' },
                      { key: 'heartRate', label: 'Heart Rate', placeholder: '72 bpm' },
                      { key: 'temperature', label: 'Temperature', placeholder: '98.6°F' },
                      { key: 'respiratoryRate', label: 'Respiratory Rate', placeholder: '16/min' },
                      { key: 'oxygenSaturation', label: 'O2 Saturation', placeholder: '98%' },
                      { key: 'weight', label: 'Weight', placeholder: '70 kg' }
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm">{label}</Label>
                        <Input
                          id={key}
                          placeholder={placeholder}
                          {...form.register(`vitalSigns.${key}` as any)}
                          data-testid={`input-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Physical Examination */}
                <div className="space-y-2">
                  <Label htmlFor="physicalExamination">Physical Examination</Label>
                  <Textarea
                    id="physicalExamination"
                    placeholder="Detailed physical examination findings by system..."
                    {...form.register("physicalExamination")}
                    data-testid="textarea-physical-exam"
                    className="min-h-[120px]"
                  />
                  {form.formState.errors.physicalExamination && (
                    <p className="text-sm text-destructive" data-testid="error-physical-exam">
                      {form.formState.errors.physicalExamination.message}
                    </p>
                  )}
                </div>

                {/* Diagnosis Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Primary diagnosis and ICD codes if applicable..."
                      {...form.register("diagnosis")}
                      data-testid="textarea-diagnosis"
                      className="min-h-[100px]"
                    />
                    {form.formState.errors.diagnosis && (
                      <p className="text-sm text-destructive" data-testid="error-diagnosis">
                        {form.formState.errors.diagnosis.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosisType">Diagnosis Type</Label>
                    <Controller
                      name="diagnosisType"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger data-testid="select-diagnosis-type">
                            <SelectValue placeholder="Select diagnosis type" />
                          </SelectTrigger>
                          <SelectContent>
                            {diagnosisTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Treatment Plan */}
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  <Textarea
                    id="treatment"
                    placeholder="Detailed treatment plan, procedures, referrals..."
                    {...form.register("treatment")}
                    data-testid="textarea-treatment"
                    className="min-h-[100px]"
                  />
                  {form.formState.errors.treatment && (
                    <p className="text-sm text-destructive" data-testid="error-treatment">
                      {form.formState.errors.treatment.message}
                    </p>
                  )}
                </div>

                {/* Medications */}
                <div className="space-y-2">
                  <Label htmlFor="medications">Medications/Prescriptions</Label>
                  <Textarea
                    id="medications"
                    placeholder="Prescribed medications with dosage, frequency, and duration..."
                    {...form.register("medications")}
                    data-testid="textarea-medications"
                    className="min-h-[80px]"
                  />
                </div>

                {/* Follow-up */}
                <div className="space-y-2">
                  <Label htmlFor="followUp">Follow-up Instructions</Label>
                  <Textarea
                    id="followUp"
                    placeholder="Next appointment, follow-up timeline, warning signs..."
                    {...form.register("followUp")}
                    data-testid="textarea-follow-up"
                    className="min-h-[80px]"
                  />
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional observations or notes..."
                    {...form.register("notes")}
                    data-testid="textarea-notes"
                    className="min-h-[80px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    data-testid="button-reset-form"
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    data-testid="button-save-opd"
                    className="min-w-[120px]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save OPD Record"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}