<template>
  <div class="flashcard-container">
    <div class="flashcard" :class="{ 'is-flipped': isFlipped }" @click="flip">
      <!-- Front side (Native language) -->
      <div class="flashcard-side flashcard-front">
        <div class="card-content">
          <div class="language-label">{{ getLanguageName(nativeLanguage) }}</div>
          <div class="text-content">{{ phrase.native }}</div>
          <div class="flip-hint">Click to see English translation</div>
          <button class="audio-btn" @click.stop="playAudio(phrase.native, nativeLanguage)" :disabled="isPlayingAudio">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 16px; width: 16px">
              <path
                d="M3 10v4a1 1 0 0 0 1 1h2.22l3.13 3.13a1 1 0 0 0 1.65-.76V6.63a1 1 0 0 0-1.65-.76L6.22 9H4a1 1 0 0 0-1 1zM14 8.24a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 1 1-1.41-1.41 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42z" />
              <path
                d="M17.7 5.14a1 1 0 1 1 1.41 1.41 9 9 0 0 1 0 12.73 1 1 0 0 1-1.41-1.41 7 7 0 0 0 0-9.9 1 1 0 0 1 0-1.42z" />
            </svg>
            {{ isPlayingAudio ? 'Playing...' : 'Listen' }}
          </button>
        </div>
      </div>

      <!-- Back side (English) -->
      <div class="flashcard-side flashcard-back">
        <div class="card-content">
          <div class="language-label">English</div>
          <div class="text-content">{{ phrase.english }}</div>
          <div class="flip-hint">Click to see {{ getLanguageName(nativeLanguage) }}</div>

          <!-- Audio Controls -->
          <div class="audio-controls">
            <button class="audio-btn" @click.stop="playAudio(phrase.english, 'en')" :disabled="isPlayingAudio">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 16px; width: 16px">
                <path
                  d="M3 10v4a1 1 0 0 0 1 1h2.22l3.13 3.13a1 1 0 0 0 1.65-.76V6.63a1 1 0 0 0-1.65-.76L6.22 9H4a1 1 0 0 0-1 1zM14 8.24a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 1 1-1.41-1.41 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42z" />
                <path
                  d="M17.7 5.14a1 1 0 1 1 1.41 1.41 9 9 0 0 1 0 12.73 1 1 0 0 1-1.41-1.41 7 7 0 0 0 0-9.9 1 1 0 0 1 0-1.42z" />
              </svg>
              {{ isPlayingAudio ? 'Playing...' : 'Listen' }}
            </button>

            <button class="talk-btn" @click.stop="handleTalk" :disabled="isRecording || isAssessing"
              :title="getTalkButtonTitle()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                style="height: 16px; width: 16px">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path
                  d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              {{ getTalkButtonText() }}
            </button>
          </div>

          <!-- Recording Instructions -->
          <div v-if="isRecording" class="recording-instructions">
            Speak clearly: "{{ phrase.english }}"
          </div>

<<<<<<< HEAD
          <!-- Pronunciation Result (Enhanced Feedback) -->
          <div v-if="pronunciationResult" class="pronunciation-result" :class="getResultClass()">
            <div class="result-feedback">{{ pronunciationResult.feedback }}</div>

            <!-- Score Display -->
            <div v-if="pronunciationResult.score !== undefined" class="result-score">
              <span class="score-value">{{ pronunciationResult.score }}</span>
              <span class="score-label">/100</span>
            </div>

            <!-- Word Analysis for Partial/Poor Results -->
            <div
              v-if="pronunciationResult.wordAnalysis && (pronunciationResult.level === 'partial' || pronunciationResult.level === 'poor')"
              class="word-analysis">
              <!-- Incorrect Words -->
              <div v-if="pronunciationResult.wordAnalysis.incorrect.length > 0" class="incorrect-words">
                <div class="analysis-label">Words to improve:</div>
                <div class="word-list">
                  <span v-for="word in pronunciationResult.wordAnalysis.incorrect" :key="word.expected"
                    class="incorrect-word">
                    "{{ word.expected }}" (you said "{{ word.actual }}")
                  </span>
                </div>
              </div>

              <!-- Missing Words -->
              <div v-if="pronunciationResult.wordAnalysis.missing.length > 0" class="missing-words">
                <div class="analysis-label">Missing words:</div>
                <div class="word-list">
                  <span v-for="word in pronunciationResult.wordAnalysis.missing" :key="word" class="missing-word">
                    "{{ word }}"
                  </span>
                </div>
              </div>
            </div>

            <!-- Pronunciation Tips -->
            <div v-if="pronunciationResult.tips && pronunciationResult.tips.length > 0" class="pronunciation-tips">
              <div class="tips-label">Tips to improve:</div>
              <ul class="tips-list">
                <li v-for="tip in pronunciationResult.tips" :key="tip" class="tip-item">{{ tip }}</li>
              </ul>
            </div>

            <!-- Transcription Comparison -->
            <div v-if="pronunciationResult.transcribed && pronunciationResult.level !== 'excellent'"
              class="transcription-comparison">
              <div class="comparison-label">What you said:</div>
              <div class="transcribed-text">"{{ pronunciationResult.transcribed }}"</div>
              <div class="expected-text">Expected: "{{ pronunciationResult.reference }}"</div>
=======
          <!-- Pronunciation Result (Simple Feedback) -->
          <div v-if="pronunciationResult" class="pronunciation-result" :class="`result-${pronunciationResult.color}`">
            <div class="result-feedback">{{ pronunciationResult.feedback }}</div>

            <!-- Word-level feedback for partial or poor results -->
            <div v-if="pronunciationResult.differences && pronunciationResult.differences.length > 0"
              class="word-differences">
              <div class="word-comparison">
                <div class="expected-words">
                  <span class="label">Expected:</span>
                  <span class="text">{{ pronunciationResult.reference }}</span>
                </div>
                <div class="recognized-words">
                  <span class="label">You said:</span>
                  <span class="text">{{ pronunciationResult.transcribed }}</span>
                </div>
              </div>
>>>>>>> main
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition.js'

const props = defineProps({
  phrase: {
    type: Object,
    required: true,
  },
  nativeLanguage: {
    type: String,
    required: true,
  },
  autoFlip: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['flip', 'audio-start', 'audio-end'])

// Reactive state
const isFlipped = ref(false)
const isPlayingAudio = ref(false)
const isRecording = ref(false)
const isAssessing = ref(false)
const pronunciationResult = ref(null)

// Speech recognition composable
const {
  startRecordingWebAPI,
  stopRecording,
  evaluatePronunciation,
  recognitionResult
} = useSpeechRecognition()

// Computed properties
const getLanguageName = computed(() => {
  const languageMap = {
    zh: 'Chinese',
    vi: 'Vietnamese',
    id: 'Bahasa Indonesia',
  }
  return (langCode) => languageMap[langCode] || langCode
})

// Get talk button text
const getTalkButtonText = () => {
  if (isRecording.value) return 'Recording... (5s)'
  if (isAssessing.value) return 'Assessing...'
  return 'Talk'
}

// Get talk button title/tooltip
const getTalkButtonTitle = () => {
  return 'Click and speak clearly: "' + props.phrase.english + '"'
}

<<<<<<< HEAD
// Get result class based on pronunciation result
const getResultClass = () => {
  if (!pronunciationResult.value) return ''

  const level = pronunciationResult.value.level
  const color = pronunciationResult.value.color

  if (color === 'green') return 'result-excellent'
  if (color === 'light-green') return 'result-great'
  if (color === 'yellow') return 'result-partial'
  if (color === 'red') return 'result-poor'

  // Fallback to level-based classes
  return `result-${level}`
}

=======
>>>>>>> main
// Methods
const flip = () => {
  isFlipped.value = !isFlipped.value
  emit('flip', isFlipped.value)
}

const playAudio = async (text, langCode) => {
  if (isPlayingAudio.value) return

  try {
    isPlayingAudio.value = true
    emit('audio-start')

    // Use Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(text)

    // Set language for speech synthesis
    const langMap = {
      en: 'en-US',
      zh: 'zh-CN',
      vi: 'vi-VN',
      id: 'id-ID',
    }
    utterance.lang = langMap[langCode] || 'en-US'

    utterance.rate = 0.8 // Slightly slower for learning
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      isPlayingAudio.value = false
      emit('audio-end')
    }

    utterance.onerror = () => {
      isPlayingAudio.value = false
      emit('audio-end')
    }

    speechSynthesis.speak(utterance)
  } catch (error) {
    console.error('Audio playback error:', error)
    isPlayingAudio.value = false
    emit('audio-end')
  }
}

// Handle "Talk" button click
const handleTalk = async () => {
  if (isRecording.value || isAssessing.value) return

  // Reset previous result
  pronunciationResult.value = null

  try {
    console.log('Using Web Speech API for pronunciation assessment')
    await handleWebSpeechPronunciation()
  } catch (error) {
    console.error('Talk handler error:', error)
    pronunciationResult.value = {
      success: false,
      score: 0,
      feedback: `Error: ${error.message || 'Please try again.'}`,
      level: 'error',
      color: 'red'
    }
    isRecording.value = false
    isAssessing.value = false
  }
}

// Web Speech API pronunciation assessment (enhanced)
const handleWebSpeechPronunciation = async () => {
  isRecording.value = true

  try {
    console.log('Starting Web Speech API pronunciation assessment...')
    console.log('Target phrase:', props.phrase.english)

    // Reset previous results
    recognitionResult.value = null

    // Start Web Speech Recognition with better settings
    await startRecordingWebAPI('en-US')

    // Wait for recognition result or timeout (longer timeout for better accuracy)
    await new Promise((resolve) => {
      let attempts = 0
      const maxAttempts = 100 // 10 seconds with 100ms intervals

      const checkInterval = setInterval(() => {
        attempts++

        if (recognitionResult.value || attempts >= maxAttempts) {
          clearInterval(checkInterval)
          stopRecording()
          resolve()
        }
      }, 100)
    })

    isRecording.value = false
    isAssessing.value = true

    // Evaluate pronunciation
    if (recognitionResult.value && recognitionResult.value.text) {
      console.log('Recognition successful:', {
        transcribed: recognitionResult.value.text,
        confidence: recognitionResult.value.confidence,
        target: props.phrase.english
      })

      const result = evaluatePronunciation(
        props.phrase.english,
        recognitionResult.value.text,
        recognitionResult.value.confidence || 1
      )

      pronunciationResult.value = {
        feedback: result.feedback,
<<<<<<< HEAD
=======
        color: result.color,
        differences: result.differences,
        reference: result.reference,
        transcribed: result.transcribed,
>>>>>>> main
        method: 'web-speech-api'
      }

      // Auto-clear result after 5 seconds
      setTimeout(() => {
        pronunciationResult.value = null
      }, 5000)
    } else {
      // No speech detected
      console.warn('No speech detected by Web Speech API')
      pronunciationResult.value = {
        feedback: 'No speech detected. Please speak clearly and try again.',
<<<<<<< HEAD
=======
        color: 'red',
>>>>>>> main
        method: 'web-speech-api'
      }

      // Auto-clear result after 5 seconds
      setTimeout(() => {
        pronunciationResult.value = null
      }, 5000)
    }

    isAssessing.value = false
  } catch (error) {
    console.error('Web Speech API error:', error)
    isRecording.value = false
    isAssessing.value = false

    pronunciationResult.value = {
      feedback: `Speech recognition error: ${error.message}. Please try again.`,
<<<<<<< HEAD
=======
      color: 'red',
>>>>>>> main
      method: 'web-speech-api'
    }

    // Auto-clear result after 5 seconds
    setTimeout(() => {
      pronunciationResult.value = null
    }, 5000)
  }
}

// Auto-flip functionality
if (props.autoFlip) {
  setTimeout(() => flip(), 2000)
}

// Expose methods for parent component
defineExpose({
  flip,
  playAudio,
  isFlipped,
})
</script>

<style scoped>
/* Quizlet-style Flashcard Design */
.flashcard-container {
  perspective: 1000px;
  width: 100%;
  max-width: 800px;
  min-width: 300px;
  height: 340px;
  margin: 0 auto;
}

.flashcard {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.45s ease;
  transform-style: preserve-3d;
  cursor: pointer;
  border-radius: 12px;
}

.flashcard.is-flipped {
  transform: rotateY(180deg);
}

.flashcard-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #2e3856;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.flashcard-front {
  /* Clean white background with subtle border */
  background: #ffffff;
}

.flashcard-back {
  /* Slightly different background for distinction */
  background: #fafbfc;
  transform: rotateY(180deg);
}

.flashcard:hover .flashcard-side {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  text-align: center;
  padding: 2.5rem 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.language-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.text-content {
  font-size: clamp(1.25rem, 3vw, 1.875rem);
  font-weight: 600;
  line-height: 1.4;
  color: #1e293b;
  margin: 0;
  text-align: center;
  max-width: 100%;
  word-wrap: break-word;
}

.flip-hint {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 400;
  margin: 0;
  opacity: 0.8;
}

.audio-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  justify-content: center;
}

.audio-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.audio-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.audio-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Audio Controls Container */
.audio-controls {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  width: 100%;
}

/* Talk Button */
.talk-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.talk-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.talk-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.talk-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* Pronunciation Result */
.pronunciation-result {
  margin-top: 0.3rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  animation: slideIn 0.3s ease-out;
  width: 100%;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation for word analysis elements */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.word-analysis {
  animation: fadeInUp 0.4s ease-out 0.1s both;
}

.pronunciation-tips {
  animation: fadeInUp 0.4s ease-out 0.2s both;
}

.transcription-comparison {
  animation: fadeInUp 0.4s ease-out 0.3s both;
}

/* Pulse animation for scores */
@keyframes scorePulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.result-excellent .score-value,
.result-great .score-value {
  animation: scorePulse 0.6s ease-out;
}

.result-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.score-label {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.result-feedback {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #22c55e;
  background: #e6fbe6;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.08);
}

.result-transcribed {
  font-size: 0.8125rem;
  color: #64748b;
  text-align: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Result Level Colors - Enhanced */
.result-green {
  border-color: #22c55e;
  background: linear-gradient(135deg, #f0fdf4, #e6fbe6);
}

.result-green .result-feedback {
  color: #15803d;
  background: #dcfce7;
  border-left: 4px solid #22c55e;
}

.result-yellow {
  border-color: #eab308;
  background: linear-gradient(135deg, #fefce8, #fef3c7);
}

.result-yellow .result-feedback {
  color: #a16207;
  background: #fef08a;
  border-left: 4px solid #eab308;
}

.result-red {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

.result-red .result-feedback {
  color: #b91c1c;
  background: #fecaca;
  border-left: 4px solid #ef4444;
}

/* Word Differences Styling */
.word-differences {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.word-comparison {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.expected-words,
.recognized-words {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.expected-words .label,
.recognized-words .label {
  font-weight: 600;
  color: #64748b;
  min-width: 80px;
}

.expected-words .text {
  color: #16a34a;
  font-weight: 500;
  background: #dcfce7;
  padding: 2px 6px;
  border-radius: 4px;
}

.recognized-words .text {
  color: #dc2626;
  font-weight: 500;
  background: #fecaca;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Enhanced result feedback styling */
.result-feedback {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Responsive Design for new elements */
@media (max-width: 768px) {
  .flashcard-container {
    max-width: 90vw;
    height: 300px;
  }

  .card-content {
    padding: 2rem 1.5rem;
    gap: 1.25rem;
  }

  .text-content {
    font-size: clamp(1.125rem, 4vw, 1.5rem);
  }

  .pronunciation-result {
    padding: 0.75rem;
  }

  .word-analysis,
  .pronunciation-tips,
  .transcription-comparison {
    padding: 0.5rem;
  }

  .word-list {
    gap: 0.25rem;
  }

  .incorrect-word,
  .missing-word {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
  }

  .tip-item {
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .flashcard-container {
    height: 280px;
  }

  .card-content {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }

  .language-label {
    font-size: 0.8125rem;
  }

  .flip-hint {
    font-size: 0.75rem;
  }

  .audio-btn {
    padding: 8px 16px;
    font-size: 0.8125rem;
    min-width: 90px;
  }
}

/* Focus states for accessibility */
.flashcard:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.audio-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading state */
.flashcard.loading .flashcard-side {
  opacity: 0.7;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .flashcard-side {
    border: 2px solid #000;
  }

  .language-label {
    color: #000;
  }

  .text-content {
    color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .flashcard {
    transition: none;
  }

  .flashcard-side {
    transition: none;
  }

  .audio-btn {
    transition: none;
  }
}

/* Recording instructions */
.recording-instructions {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  animation: pulse 2s infinite;
  margin-top: 8px;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

/* Talk button enhancements */
.talk-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.talk-btn:disabled {
  background: #94a3b8 !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.talk-btn:disabled:hover {
  background: #94a3b8 !important;
  transform: none;
  box-shadow: none;
}

/* Pronunciation result enhancements */
<<<<<<< HEAD
.pronunciation-result {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  animation: slideIn 0.3s ease-out;
  width: 100%;
}

/* Color-coded feedback styles */
.result-excellent {
  border-color: #22c55e;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.result-excellent .result-feedback {
  color: #15803d;
  font-weight: 600;
}

.result-great {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.result-great .result-feedback {
  color: #047857;
  font-weight: 600;
}

.result-partial {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.result-partial .result-feedback {
  color: #d97706;
  font-weight: 600;
}

.result-poor {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fecaca);
}

.result-poor .result-feedback {
  color: #dc2626;
  font-weight: 600;
}

/* Word Analysis Styles */
.word-analysis {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.analysis-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.word-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.incorrect-word,
.missing-word {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.incorrect-word {
  background: #fde2e8;
  color: #be185d;
  border: 1px solid #f9a8d4;
}

.missing-word {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fcd34d;
}

/* Pronunciation Tips */
.pronunciation-tips {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.tips-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.tips-list {
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.tip-item {
  font-size: 0.8125rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

/* Transcription Comparison */
.transcription-comparison {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.comparison-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.transcribed-text {
  font-size: 0.875rem;
  color: #374151;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  border-left: 3px solid #9ca3af;
}

.expected-text {
  font-size: 0.875rem;
  color: #059669;
  padding: 0.5rem;
  background: #ecfdf5;
  border-radius: 4px;
  border-left: 3px solid #10b981;
}

/* Enhanced result score display */
.result-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin: 0.75rem 0;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
}

.result-excellent .score-value {
  color: #16a34a;
}

.result-great .score-value {
  color: #059669;
}

.result-partial .score-value {
  color: #d97706;
}

.result-poor .score-value {
  color: #dc2626;
}

.score-label {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
=======
.result-confidence {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.result-method {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
  font-style: italic;
}

.result-transcribed {
  background: #f3f4f6;
  padding: 8px;
  border-radius: 6px;
  margin-top: 8px;
  font-size: 0.875rem;
>>>>>>> main
}

/* Recording animation */
.recording-instructions {
  animation: recordingPulse 1.5s ease-in-out infinite;
}

@keyframes recordingPulse {

  0%,
  100% {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    transform: scale(1);
  }

  50% {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: scale(1.02);
  }
}
</style>
