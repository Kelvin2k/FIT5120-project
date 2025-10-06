# 🔄 Pronunciation Assessment - Flow Diagram

## Tổng quan luồng hoạt động

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                              │
│                                                                  │
│  1. Navigate to Learn English page                              │
│  2. Choose language (Chinese/Vietnamese/Indonesian)              │
│  3. Choose category (Greetings/Emergency/etc)                   │
│  4. Click flashcard → Flip to English side                      │
│  5. Click "Talk" button                                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│              FLASHCARD.VUE - handleTalk()                        │
│                                                                  │
│  → Reset previous result                                        │
│  → Check: isAzureConfigured()?                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ↓ YES (Azure configured)      ↓ NO (Use fallback)
┌───────────────────────┐     ┌───────────────────────┐
│  AZURE SPEECH PATH    │     │  WEB SPEECH PATH      │
└───────┬───────────────┘     └───────┬───────────────┘
        │                             │
        ↓                             ↓
┌───────────────────────┐     ┌───────────────────────┐
│ handleAzurePronun..() │     │ handleWebSpeech...()  │
└───────┬───────────────┘     └───────┬───────────────┘
        │                             │
        ↓                             ↓


═══════════════════════════════════════════════════════════════════
                    AZURE SPEECH PATH
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Step 1: START RECORDING                                         │
│  ─────────────────────────────────────────────────────────────  │
│  startRecordingForAzure()                                       │
│  → Request microphone access                                     │
│  → Initialize MediaRecorder                                      │
│  → Set isRecording = true                                       │
│  → UI shows: "Recording..."                                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: RECORD AUDIO (5 seconds)                               │
│  ─────────────────────────────────────────────────────────────  │
│  await new Promise(5000)                                        │
│  → Collect audio chunks                                          │
│  → User speaks the English phrase                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: STOP & GET AUDIO BLOB                                  │
│  ─────────────────────────────────────────────────────────────  │
│  stopRecording()                                                │
│  audioBlob = await getAudioBlob()                               │
│  → Set isRecording = false                                      │
│  → Set isAssessing = true                                       │
│  → UI shows: "Assessing..."                                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: CALL AZURE API                                         │
│  ─────────────────────────────────────────────────────────────  │
│  assessPronunciation(audioBlob, phrase.english, 'en-US')        │
│                                                                  │
│  Inside azureSpeechService.js:                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Get access token from Azure                            │ │
│  │    → POST to {region}.api.cognitive.microsoft.com/sts     │ │
│  │    → Headers: Ocp-Apim-Subscription-Key                   │ │
│  │                                                            │ │
│  │ 2. Convert audioBlob to ArrayBuffer                       │ │
│  │                                                            │ │
│  │ 3. Prepare pronunciation params:                          │ │
│  │    {                                                       │ │
│  │      ReferenceText: "Hello, how are you?",                │ │
│  │      GradingSystem: "HundredMark",                        │ │
│  │      Granularity: "Phoneme",                              │ │
│  │      Dimension: "Comprehensive"                           │ │
│  │    }                                                       │ │
│  │                                                            │ │
│  │ 4. Send POST request:                                     │ │
│  │    → URL: {region}.stt.speech.microsoft.com/speech/...   │ │
│  │    → Headers: Authorization, Pronunciation-Assessment     │ │
│  │    → Body: Audio ArrayBuffer                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: RECEIVE & PARSE AZURE RESPONSE                         │
│  ─────────────────────────────────────────────────────────────  │
│  Azure returns:                                                 │
│  {                                                               │
│    NBest: [{                                                     │
│      PronunciationAssessment: {                                  │
│        AccuracyScore: 87,        ← How accurate                  │
│        FluencyScore: 84,         ← How fluent                    │
│        CompletenessScore: 90,    ← Completeness                  │
│        PronScore: 85             ← Overall                       │
│      },                                                           │
│      Display: "Hello how are you",  ← What user said             │
│      Confidence: 0.95                ← Confidence level          │
│    }]                                                             │
│  }                                                               │
│                                                                  │
│  parseAzureResult() transforms to:                              │
│  {                                                               │
│    success: true,                                                │
│    score: 85,                    ← Main score (0-100)            │
│    accuracyScore: 87,                                            │
│    fluencyScore: 84,                                             │
│    completenessScore: 90,                                        │
│    transcribed: "Hello how are you",                             │
│    reference: "Hello, how are you?",                             │
│    feedback: "Great job! Your pronunciation is very good.",      │
│    level: "great"                ← Color coding key              │
│  }                                                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
                   [GO TO DISPLAY]


═══════════════════════════════════════════════════════════════════
                  WEB SPEECH API PATH
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Step 1: START SPEECH RECOGNITION                                │
│  ─────────────────────────────────────────────────────────────  │
│  startRecordingWebAPI('en-US')                                  │
│  → Initialize SpeechRecognition (window.webkitSpeechRecognition) │
│  → Set language = 'en-US'                                       │
│  → Set isRecording = true                                       │
│  → UI shows: "Recording..."                                      │
│  → recognition.start()                                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: LISTEN FOR SPEECH (up to 10 seconds)                   │
│  ─────────────────────────────────────────────────────────────  │
│  Wait for recognition result...                                 │
│  → User speaks the English phrase                               │
│  → Browser sends audio to Google servers                        │
│  → Google processes speech → text                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: RECEIVE RECOGNITION RESULT                             │
│  ─────────────────────────────────────────────────────────────  │
│  recognition.onresult = (event) => {                            │
│    recognitionResult.value = {                                   │
│      text: "Hello how are you",     ← Transcribed text           │
│      confidence: 0.95                ← Confidence (0-1)          │
│    }                                                             │
│  }                                                               │
│  → Set isRecording = false                                      │
│  → Set isAssessing = true                                       │
│  → UI shows: "Assessing..."                                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: EVALUATE PRONUNCIATION (Local Algorithm)               │
│  ─────────────────────────────────────────────────────────────  │
│  evaluatePronunciation(referenceText, transcribedText, conf)    │
│                                                                  │
│  Inside useSpeechRecognition.js:                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 1. Calculate similarity using Levenshtein Distance:       │ │
│  │                                                            │ │
│  │    reference   = "hello how are you"    (normalized)      │ │
│  │    transcribed = "hello how are you"    (normalized)      │ │
│  │                                                            │ │
│  │    Build matrix to find edit distance:                    │ │
│  │    ┌───┬───┬───┬───┬───┬───┬───┐                         │ │
│  │    │   │ h │ e │ l │ l │ o │...│                         │ │
│  │    ├───┼───┼───┼───┼───┼───┼───┤                         │ │
│  │    │ h │ 0 │ 1 │ 2 │ 3 │ 4 │...│                         │ │
│  │    │ e │ 1 │ 0 │ 1 │ 2 │ 3 │...│                         │ │
│  │    │...│...│...│...│...│...│...│                         │ │
│  │    └───┴───┴───┴───┴───┴───┴───┘                         │ │
│  │                                                            │ │
│  │    distance = 0 (perfect match)                           │ │
│  │    similarity = ((maxLen - distance) / maxLen) * 100      │ │
│  │    similarity = 100%                                       │ │
│  │                                                            │ │
│  │ 2. Apply confidence multiplier:                           │ │
│  │    finalScore = similarity * confidence                   │ │
│  │    finalScore = 100 * 0.95 = 95                           │ │
│  │                                                            │ │
│  │ 3. Generate feedback based on score:                      │ │
│  │    if (score >= 90) → "Excellent!"                        │ │
│  │    if (score >= 75) → "Good job!"                         │ │
│  │    if (score >= 60) → "Not bad"                           │ │
│  │    else            → "Keep practicing"                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Returns:                                                        │
│  {                                                               │
│    success: true,                                                │
│    score: 95,                                                    │
│    similarity: 100,                                              │
│    confidence: 95,                                               │
│    transcribed: "Hello how are you",                             │
│    reference: "Hello, how are you?",                             │
│    feedback: "Excellent! Your pronunciation is very accurate.",  │
│    level: "excellent"                                            │
│  }                                                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ↓
                   [GO TO DISPLAY]


═══════════════════════════════════════════════════════════════════
                     DISPLAY RESULT (Both paths merge here)
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  FLASHCARD.VUE - Display Result                                 │
│  ─────────────────────────────────────────────────────────────  │
│  pronunciationResult.value = result                             │
│  isAssessing = false                                            │
│                                                                  │
│  UI updates to show:                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ┌────────────────────────────────────────────────────────┐ │ │
│  │ │  PRONUNCIATION RESULT                                  │ │ │
│  │ │                                                         │ │ │
│  │ │         ┌─────────┐                                    │ │ │
│  │ │         │   85    │  ← Score (large, bold)            │ │ │
│  │ │         │  /100   │                                    │ │ │
│  │ │         └─────────┘                                    │ │ │
│  │ │                                                         │ │ │
│  │ │  🎉 Great job! Your pronunciation is very good.        │ │ │
│  │ │     ← Feedback message                                 │ │ │
│  │ │                                                         │ │ │
│  │ │  You said: "Hello how are you"                         │ │ │
│  │ │  ← Transcription                                       │ │ │
│  │ └─────────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │  CSS class applied: .result-great                           │ │
│  │  → Border color: #3b82f6 (blue)                             │ │
│  │  → Background: #eff6ff (light blue)                         │ │
│  │  → Animation: slideIn (smooth appearance)                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                  COLOR CODING BY SCORE LEVEL
═══════════════════════════════════════════════════════════════════

Score Range    Level                Color        CSS Class
───────────────────────────────────────────────────────────────────
90-100         Excellent            🟢 Green      .result-excellent
80-89          Great                🔵 Blue       .result-great
70-79          Good                 🟡 Yellow     .result-good
60-69          Fair                 🟠 Orange     .result-fair
0-59           Needs Improvement    🔴 Red        .result-needs-improvement
Error          Error                🔴 Dark Red   .result-error


═══════════════════════════════════════════════════════════════════
                       ERROR HANDLING
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Microphone Access Denied                                        │
│  ─────────────────────────────────────────────────────────────  │
│  → Catch error in startRecording                                │
│  → Display: "Microphone access denied"                          │
│  → Button remains enabled for retry                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Azure API Error                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  → Catch error in assessPronunciation                           │
│  → Automatic fallback to Web Speech API                         │
│  → Log error to console for debugging                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  No Speech Recognized                                            │
│  ─────────────────────────────────────────────────────────────  │
│  → recognitionResult.value = null                               │
│  → Display: "Could not recognize speech. Please try again."     │
│  → Score: 0, Level: error                                       │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                        FILE STRUCTURE
═══════════════════════════════════════════════════════════════════

Flashcard.vue
    │
    ├── Imports
    │   ├── useSpeechRecognition.js
    │   └── azureSpeechService.js
    │
    ├── State
    │   ├── isRecording
    │   ├── isAssessing
    │   └── pronunciationResult
    │
    ├── Methods
    │   ├── handleTalk()
    │   ├── handleAzurePronunciation()
    │   └── handleWebSpeechPronunciation()
    │
    └── Template
        ├── Talk Button (click → handleTalk)
        └── Result Display (v-if pronunciationResult)

useSpeechRecognition.js
    │
    ├── Web Speech API
    │   ├── startRecordingWebAPI()
    │   ├── initWebSpeechAPI()
    │   └── evaluatePronunciation()
    │       └── calculateSimilarity() [Levenshtein]
    │
    └── Azure Recording
        ├── startRecordingForAzure()
        ├── stopRecording()
        └── getAudioBlob()

azureSpeechService.js
    │
    ├── Configuration
    │   ├── AZURE_CONFIG (key, region, endpoint)
    │   └── isAzureConfigured()
    │
    ├── API Calls
    │   ├── getAzureAccessToken()
    │   └── assessPronunciation()
    │       └── parseAzureResult()
    │
    └── Error Handling
        └── Try-catch with fallback


═══════════════════════════════════════════════════════════════════
                    TESTING SCENARIOS
═══════════════════════════════════════════════════════════════════

✅ Scenario 1: Perfect Pronunciation
   User says exactly: "Hello, how are you?"
   → Score: 95-100
   → Level: excellent
   → Color: Green

✅ Scenario 2: Good Pronunciation (minor accent)
   User says: "Hello, how are you?" (slight accent)
   → Score: 75-89
   → Level: good/great
   → Color: Yellow/Blue

✅ Scenario 3: Poor Pronunciation
   User says: "Halo, haw are yu?"
   → Score: 40-59
   → Level: needs-improvement
   → Color: Red

✅ Scenario 4: No Speech / Silent
   User doesn't speak
   → Score: 0
   → Feedback: "Could not recognize speech"
   → Level: error

✅ Scenario 5: Azure Unavailable
   Azure key invalid or quota exceeded
   → Automatic fallback to Web Speech API
   → Still functional, slightly lower accuracy


═══════════════════════════════════════════════════════════════════
                   END OF FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════
```
