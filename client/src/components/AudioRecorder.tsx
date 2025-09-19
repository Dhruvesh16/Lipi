import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square, Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Simulate audio level animation
      const animateLevel = () => {
        setAudioLevel(Math.random() * 100);
        animationRef.current = requestAnimationFrame(animateLevel);
      };
      animateLevel();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (!isRecording) setAudioLevel(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, isPaused]);

  const startRecording = () => {
    console.log('Start recording clicked');
    // todo: remove mock functionality - integrate with Web Audio API
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const pauseRecording = () => {
    console.log('Pause recording clicked');
    // todo: remove mock functionality - pause actual recording
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    console.log('Stop recording clicked');
    // todo: remove mock functionality - stop and save recording
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingStatus = () => {
    if (!isRecording) return { text: "Ready to Record", color: "secondary" as const };
    if (isPaused) return { text: "Paused", color: "outline" as const };
    return { text: "Recording", color: "destructive" as const };
  };

  const status = getRecordingStatus();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Audio Recorder</span>
          <Badge variant={status.color} data-testid="badge-recording-status">
            {status.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Waveform Visualization */}
        <div className="h-20 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
          <div className="flex items-end space-x-1 h-16">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className={`w-1 bg-primary transition-all duration-100 ${
                  isRecording && !isPaused ? 'animate-pulse' : ''
                }`}
                style={{
                  height: `${Math.max(4, (audioLevel * Math.sin(i * 0.5) + 50) * 0.6)}%`,
                  animationDelay: `${i * 50}ms`
                }}
                data-testid={`waveform-bar-${i}`}
              />
            ))}
          </div>
        </div>

        {/* Recording Time */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-foreground" data-testid="text-recording-time">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            Recording Duration
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button
              size="lg"
              onClick={startRecording}
              className="rounded-full w-16 h-16"
              data-testid="button-start-recording"
            >
              <Mic className="w-6 h-6" />
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="outline"
                onClick={pauseRecording}
                className="rounded-full w-16 h-16"
                data-testid="button-pause-recording"
              >
                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={stopRecording}
                className="rounded-full w-16 h-16"
                data-testid="button-stop-recording"
              >
                <Square className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>

        {/* Recording Tips */}
        <div className="text-center text-sm text-muted-foreground">
          {!isRecording && (
            <p data-testid="text-recording-tip">
              Click the microphone to start recording patient consultation
            </p>
          )}
          {isRecording && !isPaused && (
            <p data-testid="text-recording-active">
              🎙️ Listening... Speak clearly for best transcription results
            </p>
          )}
          {isPaused && (
            <p data-testid="text-recording-paused">
              Recording paused. Click play to continue.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}