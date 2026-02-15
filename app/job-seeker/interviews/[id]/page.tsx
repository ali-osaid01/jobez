'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockInterviews, mockAIQuestions } from '@/lib/mock-data';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Volume2,
  Settings
} from 'lucide-react';

type InterviewPhase = 'intro' | 'permission' | 'text-phase' | 'video-permission' | 'video-phase' | 'completed';

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const interview = mockInterviews.find(i => i.id === params.id);
  
  const [phase, setPhase] = useState<InterviewPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const questions = mockAIQuestions.slice(0, 5);
  const textQuestions = questions.slice(0, 2);
  const videoQuestions = questions.slice(2);

  useEffect(() => {
    if (phase === 'video-phase' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNextQuestion();
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase, currentQuestion, timeLeft]);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      console.log('[v0] Attaching stream to video element');
      console.log('[v0] Video ref exists:', !!videoRef.current);
      console.log('[v0] Stream active:', mediaStream.active);
      videoRef.current.srcObject = mediaStream;
      
      // Ensure video plays
      videoRef.current.play().catch(err => {
        console.log('[v0] Video play error:', err);
      });
    }
  }, [mediaStream]);

  if (!interview) {
    return <div>Interview not found</div>;
  }

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      console.log('[v0] Got media stream:', stream);
      setMediaStream(stream);
      setMicEnabled(true);
      setVideoEnabled(true);
      setPermissionsGranted(true);
      setPhase('video-phase');
      setCurrentQuestion(0);
      setTimeLeft(120);
      simulateAISpeaking();
    } catch (err) {
      console.log('[v0] Permission denied:', err);
      alert('Camera and microphone access is required for the video interview.');
    }
  };

  const simulateAISpeaking = () => {
    setAiSpeaking(true);
    setTranscript('');
    const question = phase === 'video-phase' 
      ? videoQuestions[currentQuestion]?.question 
      : textQuestions[currentQuestion]?.question;
    
    if (question) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < question.length) {
          setTranscript(question.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setAiSpeaking(false);
        }
      }, 30);
    }
  };

  const handleStartInterview = () => {
    setPhase('text-phase');
    setCurrentQuestion(0);
    simulateAISpeaking();
  };

  const handleNextQuestion = () => {
    if (phase === 'text-phase') {
      if (currentAnswer.trim()) {
        setAnswers([...answers, currentAnswer]);
        setCurrentAnswer('');
        
        if (currentQuestion < textQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setTimeout(() => simulateAISpeaking(), 500);
        } else {
          setPhase('video-permission');
          setCurrentQuestion(0);
        }
      }
    } else if (phase === 'video-phase') {
      setAnswers([...answers, transcript]);
      setTranscript('');
      
      if (currentQuestion < videoQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(120);
        setTimeout(() => simulateAISpeaking(), 500);
      } else {
        router.push(`/job-seeker/interviews/${params.id}/results`);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl">AI Interview</CardTitle>
                <p className="text-muted-foreground mt-2 text-lg">
                  {interview.jobTitle} at {interview.company}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Interview Format:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                      Text-Based Questions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {textQuestions.length} questions where you'll type your responses
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/5">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm">2</span>
                      Video Interview
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {videoQuestions.length} questions with AI avatar and real-time transcription
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Before you begin:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Find a quiet place with good lighting</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Ensure stable internet connection</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Total duration: approximately {questions.length * 2} minutes</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Camera and microphone access required for video phase</span>
                </li>
              </ul>
            </div>

            <Button onClick={handleStartInterview} size="lg" className="w-full bg-primary hover:bg-primary/90">
              Start Interview
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'video-permission') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Video className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">Video Interview Phase</CardTitle>
              <p className="text-muted-foreground text-lg">
                Great job on the text questions! Now let's continue with the video interview.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-center">We need your permission to:</h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card className="bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <Video className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Camera Access</h4>
                    <p className="text-sm text-muted-foreground">
                      To record your video responses
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <Mic className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Microphone Access</h4>
                    <p className="text-sm text-muted-foreground">
                      To capture your spoken answers
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm text-center">
                <strong>Privacy Note:</strong> Your video and audio will only be used for interview evaluation. 
                We respect your privacy and handle all data securely.
              </p>
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 hover:bg-primary hover:text-white hover:border-primary"
                onClick={() => setPhase('text-phase')}
              >
                Go Back
              </Button>
              <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={requestPermissions}
              >
                Allow Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'text-phase') {
    const progress = ((currentQuestion + 1) / textQuestions.length) * 100;
    
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Text Question {currentQuestion + 1} of {textQuestions.length}
                </span>
                <Badge variant="outline">Phase 1: Written Responses</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Interviewer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-primary/20">
                  <div className="text-center">
                    <div className={`w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto ${aiSpeaking ? 'animate-pulse' : ''}`}>
                      <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">AI Avatar</p>
                  </div>
                  {aiSpeaking && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-background/95 backdrop-blur p-3 rounded-lg border shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                          <span className="text-xs font-medium">Speaking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Question</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{textQuestions[currentQuestion].type}</Badge>
                    <Badge variant="outline">{textQuestions[currentQuestion].category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                  <p className="text-lg leading-relaxed min-h-[60px]">
                    {transcript || textQuestions[currentQuestion].question}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Your Answer</label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={10}
                    disabled={aiSpeaking}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {currentAnswer.length} characters
                    </span>
                    <span className="text-muted-foreground">
                      {textQuestions.length - currentQuestion - 1} questions remaining
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer.trim() || aiSpeaking}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {currentQuestion === textQuestions.length - 1 ? 'Continue to Video Interview' : 'Next Question'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'video-phase') {
    const progress = ((currentQuestion + 1) / videoQuestions.length) * 100;
    const currentVideoQuestion = videoQuestions[currentQuestion];
    
    return (
      <div className="h-screen flex flex-col bg-slate-950">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="max-w-[1800px] mx-auto space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Video Question {currentQuestion + 1} of {videoQuestions.length}
              </span>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-primary text-primary">Phase 2: Video Interview</Badge>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-hidden">
          <div className="max-w-[1800px] mx-auto h-full grid lg:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl h-full flex flex-col">
              <div className="absolute top-6 left-6 z-10">
                <Badge className="bg-primary/90 backdrop-blur text-white border-0">AI Interviewer</Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-8">
                <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl ${aiSpeaking ? 'animate-pulse scale-110' : ''} transition-all duration-300`}>
                  <Sparkles className="h-20 w-20 text-white" />
                </div>
              </div>
              
              <div className="p-6 bg-slate-900/95 backdrop-blur border-t border-slate-700">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {aiSpeaking && <Volume2 className="h-5 w-5 text-primary animate-pulse" />}
                    <span className="text-sm font-medium text-white">Current Question:</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs bg-primary/20 text-secondary">{currentVideoQuestion.type}</Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">{currentVideoQuestion.category}</Badge>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-white">
                    {transcript || currentVideoQuestion.question}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-secondary/30 bg-slate-900 shadow-2xl h-full flex flex-col">
              <div className="absolute top-6 left-6 z-10">
                <Badge className="bg-secondary/90 backdrop-blur text-white border-0">You</Badge>
              </div>
              <div className="absolute top-6 right-6 z-10 flex gap-2">
                <Button
                  size="icon"
                  variant={videoEnabled ? 'default' : 'destructive'}
                  onClick={() => {
                    const newVideoState = !videoEnabled;
                    console.log('[v0] Toggling video to:', newVideoState);
                    setVideoEnabled(newVideoState);
                    if (mediaStream) {
                      const videoTrack = mediaStream.getVideoTracks()[0];
                      if (videoTrack) {
                        videoTrack.enabled = newVideoState;
                        console.log('[v0] Video track enabled:', videoTrack.enabled);
                      }
                    }
                  }}
                  className="bg-slate-800/80 backdrop-blur hover:bg-primary border-0"
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant={micEnabled ? 'default' : 'destructive'}
                  onClick={() => {
                    const newMicState = !micEnabled;
                    console.log('[v0] Toggling mic to:', newMicState);
                    setMicEnabled(newMicState);
                    if (mediaStream) {
                      const audioTrack = mediaStream.getAudioTracks()[0];
                      if (audioTrack) {
                        audioTrack.enabled = newMicState;
                        console.log('[v0] Audio track enabled:', audioTrack.enabled);
                      }
                    }
                  }}
                  className="bg-slate-800/80 backdrop-blur hover:bg-primary border-0"
                >
                  {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex-1 relative bg-slate-800 overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`}
                />
                {!videoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <VideoOff className="h-20 w-20 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Camera Off</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-900/95 backdrop-blur border-t border-slate-700">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${micEnabled ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium text-white">Your Response (Live):</span>
                  </div>
                  <div className="min-h-[60px] p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-300">
                      {transcript || 'Start speaking and your words will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <div className="text-sm text-slate-400">
              {videoQuestions.length - currentQuestion - 1} questions remaining
            </div>
            <Button 
              onClick={handleNextQuestion}
              disabled={aiSpeaking}
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8"
            >
              {currentQuestion === videoQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
