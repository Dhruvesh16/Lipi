import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Download, Edit, Save, FileText } from "lucide-react";
import { useState } from "react";

interface ClinicalNote {
  id: string;
  patientName: string;
  date: string;
  status: 'draft' | 'review' | 'completed';
  sections: {
    chief_complaint: string;
    hpi: string;
    physical_exam: string;
    assessment: string;
    plan: string;
  };
}

export default function ClinicalNotes() {
  // todo: remove mock functionality - fetch from API
  const [note, setNote] = useState<ClinicalNote>({
    id: "note-001",
    patientName: "Sarah Johnson",
    date: new Date().toLocaleDateString(),
    status: "review",
    sections: {
      chief_complaint: "Patient presents with persistent cough and shortness of breath for 3 days.",
      hpi: "45-year-old female presents with a 3-day history of productive cough with yellow sputum, associated with shortness of breath on exertion. Denies fever, chills, or chest pain. No recent travel or sick contacts. Patient has a history of seasonal allergies but states this feels different from her usual allergic symptoms.",
      physical_exam: "Vital signs: BP 125/80, HR 88, RR 20, Temp 98.6°F, O2 sat 96% on room air. General: Alert, well-appearing female in no acute distress. HEENT: Normal. Cardiac: Regular rate and rhythm, no murmurs. Pulmonary: Mild expiratory wheeze bilateral lower lobes, no rales or rhonchi. Abdomen: Soft, non-tender. Extremities: No edema.",
      assessment: "1. Acute bronchitis, likely viral etiology\n2. Mild reactive airway component\n3. No evidence of pneumonia based on examination and lack of fever",
      plan: "1. Supportive care with rest and increased fluid intake\n2. Albuterol inhaler 2 puffs q4-6h PRN shortness of breath\n3. Guaifenesin 400mg BID for cough\n4. Return if symptoms worsen or fever develops\n5. Follow-up in 1 week if not improving"
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);

  const handleEdit = () => {
    console.log('Edit note clicked');
    setIsEditing(true);
    setEditedNote({ ...note });
  };

  const handleSave = () => {
    console.log('Save note clicked');
    // todo: remove mock functionality - save to API
    setNote(editedNote);
    setIsEditing(false);
  };

  const handleExport = () => {
    console.log('Export note clicked');
    // todo: remove mock functionality - export to EHR or PDF
  };

  const updateSection = (section: keyof ClinicalNote['sections'], value: string) => {
    setEditedNote(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'review': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const sections = [
    { key: 'chief_complaint', title: 'Chief Complaint' },
    { key: 'hpi', title: 'History of Present Illness' },
    { key: 'physical_exam', title: 'Physical Examination' },
    { key: 'assessment', title: 'Assessment' },
    { key: 'plan', title: 'Plan' }
  ] as const;

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Clinical Note</span>
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-muted-foreground">
                Patient: <span className="font-medium text-foreground" data-testid="text-patient-name">{note.patientName}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Date: <span className="font-medium text-foreground" data-testid="text-note-date">{note.date}</span>
              </span>
              <Badge variant={getStatusColor(note.status)} data-testid="badge-note-status">
                {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Button onClick={handleSave} data-testid="button-save-note">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleEdit} data-testid="button-edit-note">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleExport} data-testid="button-export-note">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, index) => (
          <div key={section.key}>
            <h3 className="font-semibold mb-3" data-testid={`text-section-title-${section.key}`}>
              {section.title}
            </h3>
            {isEditing ? (
              <Textarea
                value={editedNote.sections[section.key]}
                onChange={(e) => updateSection(section.key, e.target.value)}
                className="min-h-[100px] font-mono text-sm"
                data-testid={`textarea-${section.key}`}
              />
            ) : (
              <div 
                className="bg-muted/30 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap"
                data-testid={`text-section-content-${section.key}`}
              >
                {note.sections[section.key]}
              </div>
            )}
            {index < sections.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}

        {/* AI-Generated Insights */}
        {!isEditing && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm text-primary">AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li data-testid="text-ai-insight-1">
                  • Consider ordering chest X-ray to rule out pneumonia if symptoms persist
                </li>
                <li data-testid="text-ai-insight-2">
                  • Patient may benefit from spirometry given history of reactive airway symptoms
                </li>
                <li data-testid="text-ai-insight-3">
                  • Ensure patient has rescue inhaler technique education
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}