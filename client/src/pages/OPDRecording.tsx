import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Save, 
  User, 
  Calendar,
  FileText,
  Clock,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PatientDetails {
  name: string;
  age: string;
  gender: string;
  phoneNumber: string;
  address: string;
  mrn: string;
  dateOfBirth: string;
  phone: string;
}

interface OPDRecord {
  patientDetails: PatientDetails;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  examination: string;
  diagnosis: string;
  treatment: string;
  followUp: string;
  recordingTranscript: string;
  recordingDate: Date;
}

export default function OPDRecording() {
  const { toast } = useToast();
  
    // State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  // Patient and OPD data
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    name: '',
    age: '',
    gender: '',
    phoneNumber: '',
    address: '',
    mrn: '',
    dateOfBirth: '',
    phone: ''
  });
  
  const [opdRecord, setOpdRecord] = useState<OPDRecord>({
    patientDetails: patientDetails,
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    examination: '',
    diagnosis: '',
    treatment: '',
    followUp: '',
    recordingTranscript: '',
    recordingDate: new Date()
  });
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscription(prev => {
          const newTranscript = prev + finalTranscript;
          // Process the transcript for patient details extraction (async)
          extractPatientDetails(newTranscript + interimTranscript).catch(console.error);
          return newTranscript;
        });
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = "There was an issue with speech recognition.";
        let suggestion = "Please try again.";
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = "Microphone access denied.";
            suggestion = "Please allow microphone access in your browser settings and refresh the page.";
            break;
          case 'no-speech':
            errorMessage = "No speech was detected.";
            suggestion = "Please speak clearly into your microphone.";
            break;
          case 'audio-capture':
            errorMessage = "Audio capture failed.";
            suggestion = "Please check your microphone connection and try again.";
            break;
          case 'network':
            errorMessage = "Network error occurred.";
            suggestion = "Please check your internet connection.";
            break;
          case 'service-not-allowed':
            errorMessage = "Speech recognition service not allowed.";
            suggestion = "Try using Chrome, Edge, or Safari browser.";
            break;
          case 'aborted':
            errorMessage = "Speech recognition was aborted.";
            suggestion = "Recording stopped. Click Start Recording to try again.";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
            suggestion = "Try refreshing the page or using a different browser.";
            break;
        }
        
        toast({
          title: "Speech Recognition Error",
          description: `${errorMessage} ${suggestion}`,
          variant: "destructive"
        });
        
        setIsTranscribing(false);
        setIsRecording(false);
      };
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. You can still record audio.",
        variant: "destructive"
      });
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [toast]);

  // Auto-save when OPD record changes
  useEffect(() => {
    const hasSignificantContent = 
      opdRecord.chiefComplaint.length > 10 || 
      opdRecord.diagnosis.length > 5 || 
      opdRecord.treatment.length > 5;

    if (hasSignificantContent && patientDetails.name && patientDetails.age) {
      const timer = setTimeout(async () => {
        setIsAutoSaving(true);
        await autoSaveToHistory();
        setIsAutoSaving(false);
      }, 3000); // Auto-save 3 seconds after content changes

      return () => clearTimeout(timer);
    }
  }, [opdRecord.chiefComplaint, opdRecord.diagnosis, opdRecord.treatment, patientDetails.name, patientDetails.age]);

  // Extract patient details from transcription using AI/NLP patterns
  const extractPatientDetails = async (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Enhanced name patterns
    const namePatterns = [
      /(?:patient(?:'s)? name is|name is|this is|i am) ([a-zA-Z\s]+)/i,
      /(?:my name is|called) ([a-zA-Z\s]+)/i,
      /(?:patient|i)\s+(?:am|is)\s+([A-Za-z\s]+?)(?:\s|,|\.|\band\b|$)/gi,
      /name\s+is\s+([A-Za-z\s]+?)(?:\s|,|\.|\band\b|$)/gi
    ];
    
    // Enhanced age patterns
    const agePatterns = [
      /(?:age is|i am|years old|age) (\d{1,3})/i,
      /(\d{1,3}) years? old/i,
      /(?:age|aged?)\s+(?:is\s+)?(\d+)(?:\s+years?)?/gi,
      /(?:patient|patient's|my)\s+age\s+(?:is\s+)?(\d+)/gi
    ];
    
    // Extract gender patterns
    const genderPatterns = [
      /(?:i am a|i am an?|gender is|sex is) (male|female|man|woman|boy|girl)/i
    ];

    let nameDetected = '';
    let ageDetected = '';

    namePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && match[1].trim().length > 1) {
        const extractedName = match[1].trim();
        if (extractedName !== patientDetails.name && extractedName.length >= 2 && /^[A-Za-z\s]+$/.test(extractedName)) {
          nameDetected = extractedName;
          setPatientDetails(prev => ({ ...prev, name: extractedName }));
          toast({
            title: "Patient Name Detected",
            description: `Name updated to: ${extractedName}`,
          });
        }
      }
    });

    agePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && match[1]) {
        const extractedAge = match[1];
        if (extractedAge !== patientDetails.age && parseInt(extractedAge) > 0 && parseInt(extractedAge) < 120) {
          ageDetected = extractedAge;
          setPatientDetails(prev => ({ ...prev, age: extractedAge }));
          toast({
            title: "Patient Age Detected",
            description: `Age updated to: ${extractedAge} years`,
          });
        }
      }
    });

    genderPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && match[1]) {
        let extractedGender = match[1].toLowerCase();
        if (extractedGender === 'man' || extractedGender === 'boy') extractedGender = 'male';
        if (extractedGender === 'woman' || extractedGender === 'girl') extractedGender = 'female';
        
        if (extractedGender !== patientDetails.gender) {
          setPatientDetails(prev => ({ ...prev, gender: extractedGender }));
          toast({
            title: "Patient Gender Detected",
            description: `Gender updated to: ${extractedGender}`,
          });
        }
      }
    });

    // Auto-create patient if both name and age are detected and not already created
    if (nameDetected && ageDetected && (!patientDetails.mrn || patientDetails.mrn === '')) {
      await createNewPatient(nameDetected, ageDetected);
    }

    // Extract medical information for OPD form
    await extractMedicalInformation(text);
  };

  // Extract medical information from transcription to auto-fill OPD form
  const extractMedicalInformation = async (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Chief Complaint patterns
    const chiefComplaintPatterns = [
      /(?:chief complaint|main complaint|presenting complaint|complains? of|came with|here for) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:patient (?:says|reports|complains)|suffering from|problem (?:is|with)) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:pain in|headache|fever|cough|breathing difficulty|chest pain|abdominal pain) (.+?)(?:\.|,|$|and|also)/gi
    ];

    // History of Present Illness patterns
    const historyPatterns = [
      /(?:history|started|began|since|for the past|been having) (.+?)(?:\.|,|today|yesterday|weeks?|months?|years?)/gi,
      /(?:duration|timing|onset|frequency) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:associated with|along with|accompanied by) (.+?)(?:\.|,|$|and|also)/gi
    ];

    // Past Medical History patterns
    const pastHistoryPatterns = [
      /(?:past history|previous|earlier|before|known case of|diagnosed with) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:diabetes|hypertension|heart disease|surgery|operation|allergies?) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:taking medications?|on treatment) (.+?)(?:\.|,|$|and|also)/gi
    ];

    // Physical Examination patterns
    const examinationPatterns = [
      /(?:on examination|physical exam|findings|appears?|looks?) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:blood pressure|pulse|temperature|respiratory rate) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:heart sounds?|lung sounds?|abdomen|neurological) (.+?)(?:\.|,|$|and|also)/gi
    ];

    // Diagnosis patterns
    const diagnosisPatterns = [
      /(?:diagnosis|diagnosed as|impression|likely|probable|rule out) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:condition|disease|disorder|syndrome) (.+?)(?:\.|,|$|and|also)/gi
    ];

    // Treatment patterns
    const treatmentPatterns = [
      /(?:treatment|management|therapy|prescribed?|give|start) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:medications?|drugs?|tablets?|capsules?) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:advice|recommend|suggest) (.+?)(?:\.|,|$|and|also)/gi
    ];

    // Follow-up patterns
    const followUpPatterns = [
      /(?:follow.?up|next visit|come back|review|return) (.+?)(?:\.|,|$|and|also)/gi,
      /(?:after|in) (\d+) (?:days?|weeks?|months?)/gi,
      /(?:if|when) (.+?) (?:call|contact|visit)/gi
    ];

    // Helper function to extract matches
    const extractMatches = (patterns: RegExp[], field: string, updateField: string, minLength: number = 3) => {
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          if (match[1] && match[1].trim().length > minLength) {
            const extracted = match[1].trim();
            setOpdRecord(prev => {
              const currentValue = (prev as any)[updateField] || '';
              const newValue = currentValue ? `${currentValue}. ${extracted}` : extracted;
              
              if (currentValue !== newValue) {
                toast({
                  title: `${field} Updated`,
                  description: `Added: ${extracted.substring(0, 50)}${extracted.length > 50 ? '...' : ''}`,
                });
                
                return { ...prev, [updateField]: newValue };
              }
              return prev;
            });
          }
        }
        pattern.lastIndex = 0; // Reset regex
      });
    };

    // Process all medical information
    extractMatches(chiefComplaintPatterns, "Chief Complaint", "chiefComplaint", 3);
    extractMatches(historyPatterns, "History", "historyOfPresentIllness", 5);
    extractMatches(pastHistoryPatterns, "Past History", "pastMedicalHistory", 3);
    extractMatches(examinationPatterns, "Examination", "examination", 3);
    extractMatches(diagnosisPatterns, "Diagnosis", "diagnosis", 3);
    extractMatches(treatmentPatterns, "Treatment", "treatment", 3);
    extractMatches(followUpPatterns, "Follow-up", "followUp", 2);

    // Auto-save after extracting medical information
    setTimeout(() => {
      autoSaveToHistory();
    }, 1000); // Delay to allow state updates to complete
  };

  const createNewPatient = async (name: string, age: string) => {
    try {
      const currentDoctor = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      
      // Generate MRN (Medical Record Number)
      const mrn = `MRN${Date.now().toString().slice(-6)}`;
      
      // Calculate approximate date of birth from age
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - parseInt(age);
      const dateOfBirth = `${birthYear}-01-01`; // Approximate DOB
      
      const newPatient = {
        id: `pat_${Date.now()}`,
        name: name,
        age: parseInt(age),
        mrn: mrn,
        dateOfBirth: dateOfBirth,
        phone: '', // Will be updated later if needed
        doctorId: currentDoctor.id || 'unknown',
        createdAt: new Date().toISOString()
      };

      // Save to sessionStorage for now (you can later add API call to save to database)
      const existingPatients = JSON.parse(sessionStorage.getItem('patientList') || '[]');
      const updatedPatients = [...existingPatients, newPatient];
      sessionStorage.setItem('patientList', JSON.stringify(updatedPatients));
      
      // Set as selected patient
      sessionStorage.setItem('selectedPatient', JSON.stringify(newPatient));
      
      setPatientDetails({
        name: name,
        age: age,
        mrn: mrn,
        dateOfBirth: dateOfBirth,
        phone: '',
        phoneNumber: '',
        address: '',
        gender: patientDetails.gender || ''
      });

      toast({
        title: "New Patient Created",
        description: `Patient ${name} (Age: ${age}) has been automatically created with MRN: ${mrn}`,
        duration: 5000,
      });

      return newPatient;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to create new patient automatically.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly for better transcription accuracy.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast({
        title: "Recording Stopped",
        description: "Recording saved successfully.",
      });
    }
  };

  // Pause/Resume recording
  const togglePauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save OPD record
  const saveOPDRecord = async () => {
    const finalRecord = {
      ...opdRecord,
      patientDetails,
      recordingTranscript: transcription,
      recordingDate: new Date()
    };

    try {
      // Save to patient history
      await saveToPatientHistory(finalRecord);
      
      console.log('Saving OPD Record:', finalRecord);
      
      toast({
        title: "OPD Record Saved",
        description: `Record for ${patientDetails.name || 'patient'} saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save OPD record. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Auto-save to patient history whenever significant fields are updated
  const autoSaveToHistory = async () => {
    if (!patientDetails.name || !patientDetails.age) return;
    
    // Only auto-save if we have meaningful content
    const hasContent = opdRecord.chiefComplaint || opdRecord.diagnosis || opdRecord.treatment;
    if (!hasContent) return;

    const autoSavedRecord = {
      id: `auto_${Date.now()}`,
      patientId: patientDetails.mrn || `temp_${Date.now()}`,
      date: new Date().toLocaleDateString(),
      visitType: "OPD Consultation (Auto-saved)",
      diagnosis: opdRecord.diagnosis || "In Progress",
      prescription: opdRecord.treatment || "Treatment plan pending",
      notes: opdRecord.chiefComplaint || "Consultation in progress",
      followUp: opdRecord.followUp || "As needed",
      isAutoSaved: true,
      timestamp: new Date().toISOString(),
      fullRecord: opdRecord
    };

    await saveToPatientHistory(autoSavedRecord);
    
    toast({
      title: "Auto-saved",
      description: `Consultation progress saved for ${patientDetails.name}`,
      duration: 2000,
    });
  };

  // Save to patient history (local storage and session)
  const saveToPatientHistory = async (record: any) => {
    try {
      const patientId = patientDetails.mrn || patientDetails.name.replace(/\s+/g, '_').toLowerCase();
      
      // Get existing patient records
      const existingRecords = JSON.parse(sessionStorage.getItem('patientRecords') || '{}');
      
      // Create or update patient record array
      if (!existingRecords[patientId]) {
        existingRecords[patientId] = [];
      }

      // Add new record (check for duplicates)
      const isDuplicate = existingRecords[patientId].some((r: any) => 
        r.timestamp && record.timestamp && 
        Math.abs(new Date(r.timestamp).getTime() - new Date(record.timestamp).getTime()) < 30000 // 30 seconds
      );

      if (!isDuplicate) {
        existingRecords[patientId].unshift(record); // Add to beginning
        
        // Keep only last 50 records per patient
        if (existingRecords[patientId].length > 50) {
          existingRecords[patientId] = existingRecords[patientId].slice(0, 50);
        }
        
        // Save back to storage
        sessionStorage.setItem('patientRecords', JSON.stringify(existingRecords));
        
        console.log('Record saved to patient history:', record);
      }
    } catch (error) {
      console.error('Error saving to patient history:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OPD Recording</h1>
          <p className="text-muted-foreground">AI-powered patient consultation recording</p>
        </div>
        <div className="flex items-center space-x-2">
          {isAutoSaving && (
            <Badge variant="secondary" className="text-sm animate-pulse">
              <Save className="w-3 h-3 mr-1" />
              Auto-saving...
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            <Activity className="w-4 h-4 mr-1" />
            Live Session
          </Badge>
        </div>
      </div>

      {/* Browser Compatibility Notice */}
      {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Speech Recognition Not Supported</h3>
              <p className="text-sm text-yellow-700">
                Your browser doesn't support speech recognition. For the best experience, please use 
                <strong> Chrome, Edge, or Safari</strong>. You can still record audio manually.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recording Controls */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Recording Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recording Status */}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isRecording 
                    ? 'bg-red-100 border-4 border-red-500 animate-pulse' 
                    : 'bg-gray-100 border-4 border-gray-300'
                }`}>
                  {isRecording ? (
                    <Mic className="w-8 h-8 text-red-500" />
                  ) : (
                    <MicOff className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                
                <div className="text-2xl font-mono font-bold">
                  {formatTime(recordingTime)}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to record'}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-center gap-2">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600">
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={togglePauseRecording}
                        variant="outline"
                        size="sm"
                      >
                        {isPaused ? (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={stopRecording}
                        variant="destructive"
                        size="sm"
                      >
                        <Square className="w-4 h-4 mr-1" />
                        Stop
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Test Microphone Button */}
                {!isRecording && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={async () => {
                      try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        stream.getTracks().forEach(track => track.stop());
                        toast({
                          title: "Microphone Test Successful",
                          description: "Your microphone is working correctly!",
                        });
                      } catch (error) {
                        console.error('Microphone test failed:', error);
                        toast({
                          title: "Microphone Test Failed",
                          description: "Please check your microphone permissions and try again.",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Test Microphone
                  </Button>
                )}
              </div>

              {/* Audio Playback */}
              {audioBlob && (
                <div className="mt-4">
                  <Label>Recorded Audio</Label>
                  <audio 
                    controls 
                    src={URL.createObjectURL(audioBlob)}
                    className="w-full mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Details
                <Badge variant="secondary" className="ml-auto">Auto-detected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patientName">Name</Label>
                <Input
                  id="patientName"
                  value={patientDetails.name}
                  onChange={(e) => setPatientDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Patient name will be auto-detected"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="patientAge">Age</Label>
                  <Input
                    id="patientAge"
                    value={patientDetails.age}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Auto-detected"
                  />
                </div>
                <div>
                  <Label htmlFor="patientGender">Gender</Label>
                  <Input
                    id="patientGender"
                    value={patientDetails.gender}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, gender: e.target.value }))}
                    placeholder="Auto-detected"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="patientPhone">Phone Number</Label>
                <Input
                  id="patientPhone"
                  value={patientDetails.phoneNumber}
                  onChange={(e) => setPatientDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Optional"
                />
              </div>

              <div>
                <Label htmlFor="patientAddress">Address</Label>
                <Input
                  id="patientAddress"
                  value={patientDetails.address}
                  onChange={(e) => setPatientDetails(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transcription and OPD Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Transcription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Live Transcription
                {isTranscribing && (
                  <Badge variant="secondary" className="animate-pulse">
                    Transcribing...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg min-h-[200px] max-h-[300px] overflow-y-auto">
                {transcription ? (
                  <p className="text-sm leading-relaxed">{transcription}</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    Start recording to see live transcription...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* OPD Form */}
          <Card>
            <CardHeader>
              <CardTitle>OPD Consultation Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Textarea
                  id="chiefComplaint"
                  value={opdRecord.chiefComplaint}
                  onChange={(e) => setOpdRecord(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  placeholder="Main reason for visit..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="historyPresent">History of Present Illness</Label>
                <Textarea
                  id="historyPresent"
                  value={opdRecord.historyOfPresentIllness}
                  onChange={(e) => setOpdRecord(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
                  placeholder="Detailed history of current condition..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pastHistory">Past Medical History</Label>
                <Textarea
                  id="pastHistory"
                  value={opdRecord.pastMedicalHistory}
                  onChange={(e) => setOpdRecord(prev => ({ ...prev, pastMedicalHistory: e.target.value }))}
                  placeholder="Previous medical conditions, surgeries, medications..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="examination">Physical Examination</Label>
                <Textarea
                  id="examination"
                  value={opdRecord.examination}
                  onChange={(e) => setOpdRecord(prev => ({ ...prev, examination: e.target.value }))}
                  placeholder="Physical examination findings..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={opdRecord.diagnosis}
                  onChange={(e) => setOpdRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Primary and secondary diagnoses..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="treatment">Treatment Plan</Label>
                <Textarea
                  id="treatment"
                  value={opdRecord.treatment}
                  onChange={(e) => setOpdRecord(prev => ({ ...prev, treatment: e.target.value }))}
                  placeholder="Medications, procedures, recommendations..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="followUp">Follow-up Instructions</Label>
                <Textarea
                  id="followUp"
                  value={opdRecord.followUp}
                  onChange={(e) => setOpdRecord(prev => ({ ...prev, followUp: e.target.value }))}
                  placeholder="Next appointment, monitoring, lifestyle changes..."
                  rows={2}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={saveOPDRecord}>
                  <Save className="w-4 h-4 mr-2" />
                  Save OPD Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}