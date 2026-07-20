'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector, selectToken } from '@/lib/store';
import {
  useGetInterviewByIdQuery,
  useFailInterviewSecurityMutation,
  useStartInterviewMutation,
  useSubmitInterviewResponsesMutation,
} from '@/lib/store/api/interviewsApi';
import type { InterviewQuestion } from '@/lib/store/types';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Bot,
  Camera,
  ExternalLink,
  Loader2,
  Mic,
  MicOff,
  Play,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';

type InterviewPhase = 'intro' | 'loading' | 'active' | 'submitting' | 'complete';

type RecordedAnswer = {
  questionId: string;
  response: string;
  duration: number;
  timestamp: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8002/api/v1';
const ANSWER_SECONDS = 35;
const AUTO_RECORD_DELAY_MS = 5000;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function upsertResponse(
  responses: RecordedAnswer[],
  nextResponse: RecordedAnswer,
): RecordedAnswer[] {
  const withoutCurrent = responses.filter((item) => item.questionId !== nextResponse.questionId);
  const merged = [...withoutCurrent, nextResponse];
  return merged.sort((a, b) => a.questionId.localeCompare(b.questionId));
}

function getScheduledDateTime(date: string, time: string) {
  const parsed = new Date(`${date}T${time}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function AIInterviewerAvatar({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border bg-primary/10 shadow-sm">
      <Bot className="h-12 w-12 text-primary" />
      <span className={`absolute bottom-3 h-2 w-10 rounded-full bg-primary/50 ${active ? 'animate-pulse' : ''}`} />
    </div>
  );
}

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAppSelector(selectToken);
  const interviewId = params.id as string;

  const { data: interview, isLoading: interviewLoading } = useGetInterviewByIdQuery(interviewId);
  const [startInterview, { isLoading: isStarting }] = useStartInterviewMutation();
  const [submitInterviewResponses] = useSubmitInterviewResponsesMutation();
  const [failInterviewSecurity] = useFailInterviewSecurityMutation();

  const [phase, setPhase] = useState<InterviewPhase>('intro');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<RecordedAnswer[]>([]);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [isWaitingToRecord, setIsWaitingToRecord] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [canEditTranscript, setCanEditTranscript] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready to begin');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [answerSecondsRemaining, setAnswerSecondsRemaining] = useState(ANSWER_SECONDS);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingStartRef = useRef<number | null>(null);
  const activeRecordingQuestionRef = useRef<InterviewQuestion | null>(null);
  const timerRef = useRef<number | null>(null);
  const autoRecordTimerRef = useRef<number | null>(null);
  const questionAudioUrlRef = useRef<string | null>(null);
  const securityFailureRef = useRef(false);
  const responsesRef = useRef<RecordedAnswer[]>([]);
  const questionsRef = useRef<InterviewQuestion[]>([]);
  const currentQuestionIndexRef = useRef(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((responses.length / questions.length) * 100) : 0;
  const scheduledAt = useMemo(
    () => (interview ? getScheduledDateTime(interview.scheduledDate, interview.scheduledTime) : null),
    [interview?.scheduledDate, interview?.scheduledTime],
  );
  const interviewIsAvailable = scheduledAt ? scheduledAt.getTime() <= Date.now() : true;
  const hasRecordedCurrentQuestion = useMemo(
    () => responses.some((item) => item.questionId === currentQuestion?.id),
    [responses, currentQuestion?.id],
  );

  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  const stopAudioPlayback = useCallback(() => {
    if (autoRecordTimerRef.current) {
      window.clearTimeout(autoRecordTimerRef.current);
      autoRecordTimerRef.current = null;
    }
    setIsWaitingToRecord(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (questionAudioUrlRef.current) {
      URL.revokeObjectURL(questionAudioUrlRef.current);
      questionAudioUrlRef.current = null;
    }
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const stopRecordingSession = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const ensureInterviewMedia = async () => {
    if (mediaStreamRef.current) return mediaStreamRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    mediaStreamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => undefined);
    }
    return stream;
  };

  const enterFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  };

  const markSecurityFailure = async (reason: string) => {
    if (securityFailureRef.current || phase !== 'active') return;
    securityFailureRef.current = true;
    stopAudioPlayback();
    stopRecordingSession();
    setPhase('submitting');
    setStatusMessage('Interview failed');
    try {
      await failInterviewSecurity({ id: interviewId, reason }).unwrap();
      toast.error('Interview closed due to security violation. Score marked 0.');
    } catch (error) {
      console.error('[Interview] Failed to record security failure:', error);
      toast.error('Interview closed due to security violation.');
    } finally {
      router.push(`/job-seeker/interviews/${interviewId}/results`);
    }
  };

  const handleLeaveInterview = () => {
    const shouldLeave = phase !== 'active' || window.confirm('Leaving now will discard any in-progress interview answers.');
    if (!shouldLeave) return;
    stopAudioPlayback();
    stopRecordingSession();
    router.push('/job-seeker/interviews');
  };

  useEffect(() => {
    return () => {
      stopAudioPlayback();
      stopRecordingSession();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (autoRecordTimerRef.current) {
        window.clearTimeout(autoRecordTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase === 'active' || phase === 'loading' || phase === 'submitting') {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = '';
        return '';
      };

      const handlePopState = () => {
        const shouldLeave = window.confirm('Leaving now will discard any in-progress interview answers.');
        if (shouldLeave) {
          stopAudioPlayback();
          stopRecordingSession();
          window.removeEventListener('popstate', handlePopState);
          router.push('/job-seeker/interviews');
          return;
        }

        window.history.pushState({ interviewGuard: true }, '', window.location.href);
      };

      window.history.pushState({ interviewGuard: true }, '', window.location.href);
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }

    return undefined;
  }, [phase, router]);

  useEffect(() => {
    if (phase !== 'active' || interview?.type !== 'ai') return undefined;

    const failForVisibility = () => {
      if (document.hidden) {
        void markSecurityFailure('Candidate left the interview tab.');
      }
    };
    const failForBlur = () => {
      void markSecurityFailure('Candidate switched away from the interview window.');
    };
    const failForFullscreenExit = () => {
      if (!document.fullscreenElement) {
        void markSecurityFailure('Candidate exited fullscreen mode.');
      }
    };

    document.addEventListener('visibilitychange', failForVisibility);
    document.addEventListener('fullscreenchange', failForFullscreenExit);
    window.addEventListener('blur', failForBlur);
    window.addEventListener('pagehide', failForBlur);

    return () => {
      document.removeEventListener('visibilitychange', failForVisibility);
      document.removeEventListener('fullscreenchange', failForFullscreenExit);
      window.removeEventListener('blur', failForBlur);
      window.removeEventListener('pagehide', failForBlur);
    };
  }, [phase, interview?.type]);

  useEffect(() => {
    if (phase === 'active' && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [phase, currentQuestionIndex]);

  useEffect(() => {
    if (phase !== 'active' || !currentQuestion) return;

    let cancelled = false;

    const playQuestion = async () => {
      setQuestionError(null);
      setCanEditTranscript(false);
      setIsWaitingToRecord(false);
      setStatusMessage('Playing question');
      stopAudioPlayback();

      const queueRecording = () => {
        setIsPlayingQuestion(false);
        setIsWaitingToRecord(true);
        setStatusMessage('Ready to record');
        autoRecordTimerRef.current = window.setTimeout(() => {
          if (!cancelled) {
            void startRecording();
          }
        }, AUTO_RECORD_DELAY_MS);
      };

      try {
        const response = await fetch(
          `${API_BASE}/interviews/${interviewId}/questions/${currentQuestion.id}/audio`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );

        if (!response.ok) {
          throw new Error(`Audio request failed (${response.status})`);
        }

        const blob = await response.blob();
        if (cancelled) return;

        if (questionAudioUrlRef.current) {
          URL.revokeObjectURL(questionAudioUrlRef.current);
        }

        const audioUrl = URL.createObjectURL(blob);
        questionAudioUrlRef.current = audioUrl;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setIsPlayingQuestion(true);
        setStatusMessage('Listening to the question');

        audio.onended = () => {
          if (cancelled) return;
          if (questionAudioUrlRef.current) {
            URL.revokeObjectURL(questionAudioUrlRef.current);
            questionAudioUrlRef.current = null;
          }
          queueRecording();
        };

        audio.onerror = () => {
          if (cancelled) return;
          setIsPlayingQuestion(false);
          setIsWaitingToRecord(true);
          setQuestionError('Question audio could not be played. You can still answer manually.');
          setStatusMessage('Ready to record');
        };

        await audio.play();
      } catch (error) {
        if (cancelled) return;
        setIsPlayingQuestion(false);
        setQuestionError('Question audio could not be loaded. You can still answer manually.');
        setStatusMessage('Answer when ready');
        console.error('[Interview] Audio playback failed:', error);
        stopAudioPlayback();
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.onend = () => {
          if (cancelled) return;
          queueRecording();
        };
        utterance.onerror = () => {
          if (cancelled) return;
          queueRecording();
        };
        setIsPlayingQuestion(true);
        setStatusMessage('Listening to the question');
        window.speechSynthesis.speak(utterance);
      }
    };

    void playQuestion();

    return () => {
      cancelled = true;
      stopAudioPlayback();
    };
  }, [phase, currentQuestion, interviewId, token]);

  useEffect(() => {
    if (phase !== 'active') {
      setRecordingSeconds(0);
      setAnswerSecondsRemaining(ANSWER_SECONDS);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (!isRecording || !recordingStartRef.current) {
      setRecordingSeconds(0);
      setAnswerSecondsRemaining(ANSWER_SECONDS);
      return;
    }

    timerRef.current = window.setInterval(() => {
      if (!recordingStartRef.current) return;
      const elapsed = Math.max(0, Math.floor((Date.now() - recordingStartRef.current) / 1000));
      setRecordingSeconds(elapsed);
      setAnswerSecondsRemaining(Math.max(0, ANSWER_SECONDS - elapsed));
      if (elapsed >= ANSWER_SECONDS) {
        stopRecording();
      }
    }, 500);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording, phase]);

  const persistResponseAndAdvance = async (nextResponse: RecordedAnswer) => {
    const latestResponses = responsesRef.current;
    const latestQuestions = questionsRef.current;
    const latestQuestionIndex = currentQuestionIndexRef.current;
    const nextResponses = upsertResponse(latestResponses, nextResponse);
    setResponses(nextResponses);
    responsesRef.current = nextResponses;
    setDraftAnswer(nextResponse.response);
    setCanEditTranscript(false);

    if (latestQuestionIndex >= latestQuestions.length - 1) {
      stopAudioPlayback();
      stopRecordingSession();
      setPhase('submitting');
      setStatusMessage('Submitting interview');
      try {
        await submitInterviewResponses({
          interviewId,
          responses: nextResponses.map((item) => ({
            questionId: item.questionId,
            response: item.response,
            duration: item.duration,
            timestamp: item.timestamp,
          })),
        }).unwrap();
        setPhase('complete');
        toast.success('Interview submitted successfully');
        router.push(`/job-seeker/interviews/${interviewId}/results`);
      } catch (error) {
        console.error('[Interview] Failed to submit interview:', error);
        toast.error('Failed to submit interview');
        setPhase('active');
        setStatusMessage('Submission failed. Try again.');
      }
      return;
    }

    setDraftAnswer('');
    setCurrentQuestionIndex(latestQuestionIndex + 1);
  };

  const transcribeAnswer = async (
    audioBlob: Blob,
    questionId: string,
    duration: number,
    timestamp: string,
  ) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, `answer-${questionId}.webm`);
    formData.append('duration', String(Math.max(1, duration)));
    formData.append('timestamp', timestamp);

    const response = await fetch(
      `${API_BASE}/interviews/${interviewId}/questions/${questionId}/transcribe`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Transcription failed (${response.status})`);
    }

    const payload = await response.json();
    const data = payload.data ?? payload;
    return data as {
      interviewId: string;
      questionId: string;
      transcript: string;
      duration: number;
      timestamp: string;
    };
  };

  const startRecording = async () => {
    if (!currentQuestion) return;
    if (isRecording || isTranscribing) return;

    try {
      if (autoRecordTimerRef.current) {
        window.clearTimeout(autoRecordTimerRef.current);
        autoRecordTimerRef.current = null;
      }
      setRecordingError(null);
      setDraftAnswer('');
      setCanEditTranscript(false);
      setIsWaitingToRecord(false);
      const stream = await ensureInterviewMedia();
      const audioStream = new MediaStream(stream.getAudioTracks());
      chunksRef.current = [];
      recordingStartRef.current = Date.now();
      activeRecordingQuestionRef.current = currentQuestion;
      setAnswerSecondsRemaining(ANSWER_SECONDS);
      setIsRecording(true);
      setStatusMessage('Recording answer');

      const recorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        setStatusMessage('Transcribing answer');

        const audioBlob = new Blob(chunksRef.current, {
          type: chunksRef.current[0] instanceof Blob ? chunksRef.current[0].type : 'audio/webm',
        });
        const questionForRecording = activeRecordingQuestionRef.current ?? currentQuestion;
        const recordedDuration = recordingStartRef.current
          ? Math.max(1, Math.round((Date.now() - recordingStartRef.current) / 1000))
          : Math.max(1, recordingSeconds);
        const recordedAt = new Date().toISOString();

        try {
          if (!questionForRecording) {
            throw new Error('Missing question for recorded answer');
          }
          if (audioBlob.size === 0) {
            throw new Error('No audio was captured');
          }
          const transcriptData = await transcribeAnswer(
            audioBlob,
            questionForRecording.id,
            recordedDuration,
            recordedAt,
          );
          const transcript = transcriptData.transcript.trim();
          if (!transcript) {
            throw new Error('No transcript text was returned');
          }
          await persistResponseAndAdvance({
            questionId: transcriptData.questionId || questionForRecording.id,
            response: transcript,
            duration: transcriptData.duration || recordedDuration,
            timestamp: transcriptData.timestamp || recordedAt,
          });
          toast.success('Answer recorded');
        } catch (error) {
          console.error('[Interview] Transcription failed:', error);
          setRecordingError('Transcription failed. Type the answer below, then continue.');
          setDraftAnswer('');
          setCanEditTranscript(true);
          setStatusMessage('Type answer and continue');
        } finally {
          setIsTranscribing(false);
          setRecordingSeconds(0);
          recordingStartRef.current = null;
          activeRecordingQuestionRef.current = null;
          chunksRef.current = [];
        }
      };

      recorder.start();
    } catch (error) {
      console.error('[Interview] Microphone start failed:', error);
      setRecordingError('Microphone access is required to record your answer.');
      toast.error('Microphone access failed');
      setIsRecording(false);
      setIsWaitingToRecord(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleContinueWithDraft = async () => {
    if (!currentQuestion || !draftAnswer.trim() || isRecording || isTranscribing) return;

    setIsTranscribing(true);
    setRecordingError(null);
    setStatusMessage('Saving answer');
    try {
      await persistResponseAndAdvance({
        questionId: currentQuestion.id,
        response: draftAnswer.trim(),
        duration: Math.max(1, recordingSeconds || ANSWER_SECONDS),
        timestamp: new Date().toISOString(),
      });
      toast.success('Answer saved');
    } catch (error) {
      console.error('[Interview] Failed to save typed answer:', error);
      setRecordingError('Could not save this answer. Please try again.');
      setStatusMessage('Type answer and continue');
    } finally {
      setIsTranscribing(false);
    }
  };


  
  const handleStartInterview = async () => {
    if (!interview) return;
    if (interview.type !== 'ai') return;

    try {
      setCameraError(null);
      await ensureInterviewMedia();
      await enterFullscreen();
      securityFailureRef.current = false;
      setPhase('loading');
      setStatusMessage('Generating questions');
      const response = await startInterview(interviewId).unwrap();
      setQuestions(response.questions.slice(0, 5));
      setResponses([]);
      setCurrentQuestionIndex(0);
      setDraftAnswer('');
      setPhase('active');
      setStatusMessage('Question ready');
      toast.success('Interview prepared');
    } catch (error) {
      console.error('[Interview] Failed to start interview:', error);
      setCameraError('Camera, microphone, and fullscreen access are required to start the AI interview.');
      toast.error('Camera, microphone, and fullscreen are required');
      setPhase('intro');
    }
  };

  if (interviewLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 text-muted-foreground">
        <p>Interview not found.</p>
        <Link href="/job-seeker/interviews">
          <Button className="mt-4" variant="outline">
            Back to interviews
          </Button>
        </Link>
      </div>
    );
  }

  if (phase === 'intro') {
    if (interview.type === 'human') {
      return (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="gap-2" onClick={handleLeaveInterview}>
              <ArrowLeft className="h-4 w-4" />
              Back to interviews
            </Button>
            <Badge variant="secondary">Human Interview</Badge>
          </div>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl">Interview Details</CardTitle>
                  <p className="text-muted-foreground mt-2 text-lg">
                    {interview.jobTitle} at {interview.company}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-muted/40">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Interview Type</p>
                    <p className="text-2xl font-bold">Human</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold">{interview.scheduledDate}</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-2xl font-bold">{interview.duration}m</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
                <h3 className="font-semibold text-lg">Instructions</h3>
                <p className="text-sm text-muted-foreground">
                  This is a human interview. Use the meeting link provided by the employer to join the session.
                </p>
                {interview.notes && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{interview.notes}</p>
                )}
                {interview.meetingLink ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      disabled={!interviewIsAvailable}
                      className="gap-2"
                    >
                      <a href={interview.meetingLink} target="_blank" rel="noreferrer">
                        {interviewIsAvailable ? 'Join Meeting' : 'Meeting not open yet'}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    {scheduledAt && !interviewIsAvailable && (
                      <p className="text-xs text-muted-foreground">
                        Available at {scheduledAt.toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    The meeting link has not been added yet. Check back with the employer.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={handleLeaveInterview}>
            <ArrowLeft className="h-4 w-4" />
            Back to interviews
          </Button>
          <Badge variant="secondary">AI Interview</Badge>
        </div>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
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
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-muted/40">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-2xl font-bold">5</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/40">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Voice I/O</p>
                  <p className="text-2xl font-bold">OpenAI</p>
                </CardContent>
              </Card>
                <Card className="bg-muted/40">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Summary</p>
                    <p className="text-2xl font-bold">OpenAI</p>
                  </CardContent>
                </Card>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">How it works</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>The backend generates 5 questions from your resume and the job description.</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Each question is spoken aloud with OpenAI text-to-speech.</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Your spoken answers are recorded and transcribed with OpenAI speech-to-text.</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>OpenAI evaluates the final transcript and generates your score and summary.</span>
                </div>
              </div>
            </div>

            {!interviewIsAvailable && scheduledAt && (
              <p className="text-sm text-muted-foreground">
                This interview opens at {scheduledAt.toLocaleString()}.
              </p>
            )}

            {cameraError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {cameraError}
              </div>
            )}

            <Button onClick={handleStartInterview} size="lg" className="w-full gap-2" disabled={isStarting || !interviewIsAvailable}>
              {isStarting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing interview
                </>
              ) : !interviewIsAvailable ? (
                'Unavailable until the scheduled time'
              ) : (
                <>
                  Start Interview
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="ghost" className="gap-2" onClick={handleLeaveInterview}>
          <ArrowLeft className="h-4 w-4" />
          Back to interviews
        </Button>
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (phase === 'submitting') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Submitting interview and generating feedback</p>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div className="space-y-4">
          <Sparkles className="h-10 w-10 mx-auto text-primary" />
          <p className="font-medium">Interview completed</p>
          <p className="text-sm text-muted-foreground">Redirecting to results...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const answeredCount = responses.length;

  return (
    <div className="min-h-screen space-y-4 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col gap-3 rounded-lg border bg-background px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4">
        <div className="min-w-0">
          <p className="text-sm font-medium break-words">{interview.jobTitle}</p>
          <p className="text-xs text-muted-foreground break-words">{interview.company}</p>
        </div>
        <div className="w-full min-w-0 flex-1 sm:min-w-52 lg:max-w-md">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{answeredCount} recorded</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <Badge variant="outline" className="w-fit">{statusMessage}</Badge>
      </div>

      <div className="grid min-h-[calc(100dvh-132px)] gap-4 lg:grid-cols-2">
        <section className="flex min-h-[320px] flex-col overflow-hidden rounded-lg border bg-black sm:min-h-[420px]">
          <div className="flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">Candidate Camera</span>
            </div>
            <Badge variant={isRecording ? 'destructive' : 'secondary'}>
              {isRecording ? `${formatTime(recordingSeconds)} recording` : 'Camera active'}
            </Badge>
          </div>
          <div className="relative flex-1">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              autoPlay
            />
          </div>
        </section>

        <section className="flex min-h-[320px] flex-col rounded-lg border bg-background p-4 sm:min-h-[420px] sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <AIInterviewerAvatar active={isPlayingQuestion || isRecording || isTranscribing} />
              <div>
                <p className="text-lg font-heading font-semibold sm:text-xl">AI Interviewer</p>
                <p className="text-sm text-muted-foreground">
                  {isPlayingQuestion ? 'Speaking question' : isRecording ? 'Listening to answer' : isTranscribing ? 'Preparing transcript' : 'Ready'}
                </p>
              </div>
            </div>
            {hasRecordedCurrentQuestion && <Badge variant="secondary">Answer saved</Badge>}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="secondary">{currentQuestion.type}</Badge>
            <Badge variant="outline">{currentQuestion.category}</Badge>
          </div>

          <div className="mt-4 rounded-lg border bg-muted/30 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Volume2 className="h-4 w-4" />
              Question
            </div>
            <p className="text-lg leading-relaxed sm:text-xl">{currentQuestion.question}</p>
          </div>

          {questionError && (
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {questionError}
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Answer timer</span>
                <Badge variant={answerSecondsRemaining <= 10 ? 'destructive' : 'secondary'}>
                  {answerSecondsRemaining}s
                </Badge>
              </div>
              <Progress value={(answerSecondsRemaining / ANSWER_SECONDS) * 100} className="mt-2 h-2" />
            </div>
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Transcript</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isRecording ? <Mic className="h-3 w-3 text-red-500" /> : <MicOff className="h-3 w-3" />}
                  {isTranscribing ? 'Transcribing' : 'Ready'}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Auto records for {ANSWER_SECONDS}s</p>
            </div>
          </div>

          <Textarea
            rows={7}
            value={draftAnswer}
            readOnly={!canEditTranscript || isRecording || isTranscribing}
            onChange={(event) => setDraftAnswer(event.target.value)}
            placeholder={canEditTranscript ? 'Type your answer here to continue.' : 'Your transcript will appear here after the recorded answer is transcribed.'}
            className="mt-4 resize-none"
          />

          <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
            <Button
              variant="outline"
              onClick={() => {
                if (isRecording || isTranscribing) return;
                if (autoRecordTimerRef.current) {
                  window.clearTimeout(autoRecordTimerRef.current);
                  autoRecordTimerRef.current = null;
                }
                setIsWaitingToRecord(false);
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
                window.speechSynthesis.cancel();
                setCanEditTranscript(false);
                setQuestionError(null);
                setIsPlayingQuestion(true);
                setIsWaitingToRecord(false);
                setStatusMessage('Replaying question');
                utterance.onend = () => {
                  setIsPlayingQuestion(false);
                  setIsWaitingToRecord(true);
                  setStatusMessage('Ready to record');
                };
                utterance.onerror = () => {
                  setIsPlayingQuestion(false);
                  setIsWaitingToRecord(true);
                  setStatusMessage('Ready to record');
                };
                window.speechSynthesis.speak(utterance);
              }}
              className="gap-2"
              disabled={isRecording || isTranscribing}
            >
              <Play className="h-4 w-4" />
              Replay
            </Button>
            {!isRecording ? (
              <Button onClick={startRecording} className="gap-2" disabled={isPlayingQuestion || isTranscribing}>
                <Mic className="h-4 w-4" />
                {isPlayingQuestion ? 'Question playing' : isWaitingToRecord ? 'Start recording now' : 'Start recording'}
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopRecording} className="gap-2">
                <Square className="h-4 w-4" />
                Stop recording
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setDraftAnswer('')}
              disabled={isRecording || isTranscribing || !draftAnswer}
            >
              Clear
            </Button>
            {canEditTranscript && (
              <Button
                onClick={handleContinueWithDraft}
                disabled={!draftAnswer.trim() || isTranscribing}
                className="gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
      </div>

      {recordingError && (
        <Card className="border-destructive/20">
          <CardContent className="py-4 text-sm text-destructive">
            {recordingError}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
