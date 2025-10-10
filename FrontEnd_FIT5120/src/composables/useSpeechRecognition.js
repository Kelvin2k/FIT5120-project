import { ref } from 'vue'

/**
 * Composable for speech recognition and pronunciation assessment
 * Supports both Web Speech API (fallback) and Azure Speech Service
 */
export function useSpeechRecognition() {
  const isRecording = ref(false)
  const transcript = ref('')
  const error = ref(null)
  const recognitionResult = ref(null)
  const pronunciationScore = ref(null)

  let recognition = null
  let mediaRecorder = null
  let audioChunks = []

  /**
   * Initialize Web Speech API (fallback method)
   */
  const initWebSpeechAPI = (language = 'en-US') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      throw new Error(
        'Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
      )
    }

    recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    // Note: grammars property is deprecated and can cause errors in some browsers
    // We'll skip setting grammars to avoid compatibility issues

    console.log('Initialized Web Speech Recognition with settings:', {
      language: recognition.lang,
      continuous: recognition.continuous,
      interimResults: recognition.interimResults,
      maxAlternatives: recognition.maxAlternatives,
    })

    return recognition
  }

  /**
   * Start recording with Web Speech API
   */
  const startRecordingWebAPI = async (language = 'en-US') => {
    try {
      error.value = null
      transcript.value = ''
      recognitionResult.value = null
      isRecording.value = true

      const rec = initWebSpeechAPI(language)

      rec.onstart = () => {
        console.log('Speech recognition started')
      }

      rec.onresult = (event) => {
        console.log('Speech recognition result:', event.results)
        const result = event.results[0][0]
        transcript.value = result.transcript
        recognitionResult.value = {
          text: result.transcript,
          confidence: result.confidence,
        }
        console.log(`Recognized: "${result.transcript}" (confidence: ${result.confidence})`)
      }

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        error.value = `Speech recognition error: ${event.error}`
        isRecording.value = false
      }

      rec.onend = () => {
        console.log('Speech recognition ended')
        isRecording.value = false
      }

      rec.start()
      console.log('Started Web Speech Recognition for language:', language)
    } catch (err) {
      console.error('Failed to start Web Speech Recognition:', err)
      error.value = err.message
      isRecording.value = false
    }
  }

  /**
   * Stop recording
   */
  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    isRecording.value = false
  }

  /**
   * Record audio for Azure Speech Service
   */
  const startRecordingForAzure = async () => {
    try {
      error.value = null
      audioChunks = []
      isRecording.value = true

      // Request audio with specific constraints for Azure compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Try to use WAV format first, fallback to WebM
      const preferredTypes = [
        'audio/wav',
        'audio/webm;codecs=pcm',
        'audio/webm;codecs=opus',
        'audio/webm',
      ]

      let mimeType = 'audio/webm'
      for (const type of preferredTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type
          break
        }
      }

      console.log('Using MediaRecorder with MIME type:', mimeType)

      mediaRecorder = new MediaRecorder(stream, { mimeType })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      return mediaRecorder
    } catch (err) {
      error.value = `Microphone access error: ${err.message}`
      isRecording.value = false
      throw err
    }
  }

  /**
   * Get recorded audio blob
   */
  const getAudioBlob = () => {
    return new Promise((resolve) => {
      if (audioChunks.length > 0) {
        // Try to keep original MIME type
        const mimeType = mediaRecorder ? mediaRecorder.mimeType : 'audio/webm'
        const audioBlob = new Blob(audioChunks, { type: mimeType })
        console.log('Created audio blob:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: audioChunks.length,
        })
        resolve(audioBlob)
      } else if (mediaRecorder) {
        mediaRecorder.onstop = () => {
          const mimeType = mediaRecorder.mimeType || 'audio/webm'
          const audioBlob = new Blob(audioChunks, { type: mimeType })
          console.log('Created audio blob on stop:', {
            size: audioBlob.size,
            type: audioBlob.type,
            chunks: audioChunks.length,
          })
          resolve(audioBlob)
        }
      } else {
        // Create empty blob if no data
        console.warn('No audio data available, creating empty blob')
        resolve(new Blob([], { type: 'audio/webm' }))
      }
    })
  }

  /**
   * Compare transcribed text with reference text
   * Returns similarity score (0-100)
   */
  const calculateSimilarity = (reference, transcribed) => {
    const ref = reference.toLowerCase().trim()
    const trans = transcribed.toLowerCase().trim()

    if (ref === trans) return 100

    // Levenshtein distance algorithm
    const matrix = []
    for (let i = 0; i <= trans.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= ref.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= trans.length; i++) {
      for (let j = 1; j <= ref.length; j++) {
        if (trans.charAt(i - 1) === ref.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          )
        }
      }
    }

    const distance = matrix[trans.length][ref.length]
    const maxLength = Math.max(ref.length, trans.length)
    const similarity = ((maxLength - distance) / maxLength) * 100

    return Math.round(similarity)
  }

  /**
   * Analyze word-level differences between reference and transcribed text
   */
  const analyzeWordDifferences = (reference, transcribed) => {
    const refWords = reference.toLowerCase().trim().split(/\s+/)
    const transWords = transcribed.toLowerCase().trim().split(/\s+/)

    const differences = []
    const maxLength = Math.max(refWords.length, transWords.length)

    for (let i = 0; i < maxLength; i++) {
      const refWord = refWords[i] || ''
      const transWord = transWords[i] || ''

      if (refWord !== transWord) {
        differences.push({
          position: i,
          expected: refWord,
          actual: transWord,
          type: !refWord ? 'extra' : !transWord ? 'missing' : 'incorrect',
        })
      }
    }

    return differences
  }

  /**
   * Evaluate pronunciation based on reference text
   */
  const evaluatePronunciation = (referenceText, transcribedText, confidence = 1) => {
    const similarity = calculateSimilarity(referenceText, transcribedText)
    const finalScore = Math.round(similarity * confidence)

    // Analyze word-level differences
    const differences = analyzeWordDifferences(referenceText, transcribedText)

    let feedback = ''
    let level = ''
    let color = ''

    if (finalScore >= 90) {
      feedback = 'Excellent! Your pronunciation is very accurate.'
      level = 'excellent'
      color = 'green'
    } else if (finalScore >= 75) {
      feedback = 'Good job! Your pronunciation is clear.'
      level = 'good'
      color = 'green'
    } else if (finalScore >= 60) {
      const incorrectWords = differences
        .filter((d) => d.type === 'incorrect')
        .map((d) => d.expected)

      if (incorrectWords.length > 0) {
        feedback = `Partially correct. Check pronunciation of: ${incorrectWords.join(', ')}`
      } else {
        feedback = 'Not bad, but try to practice more.'
      }
      level = 'fair'
      color = 'yellow'
    } else {
      const incorrectWords = differences
        .filter((d) => d.type === 'incorrect')
        .map((d) => d.expected)

      if (incorrectWords.length > 0) {
        feedback = `Need improvement. Focus on: ${incorrectWords.join(', ')}`
      } else {
        feedback = 'Keep practicing. Listen carefully and try again.'
      }
      level = 'needs-improvement'
      color = 'red'
    }

    pronunciationScore.value = {
      feedback,
      level,
      color,
      reference: referenceText,
      transcribed: transcribedText,
      differences,
    }

    return pronunciationScore.value
  }

  /**
   * Reset all states
   */
  const reset = () => {
    isRecording.value = false
    transcript.value = ''
    error.value = null
    recognitionResult.value = null
    pronunciationScore.value = null
    audioChunks = []
  }

  return {
    // State
    isRecording,
    transcript,
    error,
    recognitionResult,
    pronunciationScore,

    // Methods
    startRecordingWebAPI,
    startRecordingForAzure,
    stopRecording,
    getAudioBlob,
    evaluatePronunciation,
    calculateSimilarity,
    analyzeWordDifferences,
    reset,
  }
}
