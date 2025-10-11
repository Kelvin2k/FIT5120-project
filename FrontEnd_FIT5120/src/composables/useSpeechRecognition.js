import { ref } from 'vue'

/**
 * Composable for speech recognition and pronunciation assessment
 * Uses Web Speech API only
 */
export function useSpeechRecognition() {
  const isRecording = ref(false)
  const transcript = ref('')
  const error = ref(null)
  const recognitionResult = ref(null)
  const pronunciationScore = ref(null)

  let recognition = null

  /**
   * Initialize Web Speech API
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
  const startRecording = async (language = 'en-US') => {
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
    isRecording.value = false
  }

  /**
   * Compare transcribed text with reference text
   * Returns similarity score (0-100)
   */
  const calculateSimilarity = (reference, transcribed) => {
    // Normalize text by removing punctuation and converting to lowercase
    const normalizeText = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    }

    const ref = normalizeText(reference)
    const trans = normalizeText(transcribed)

    console.log('calculateSimilarity normalized:', { ref, trans })

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

    console.log('calculateSimilarity result:', similarity)
    return Math.round(similarity)
  }

  /**
   * Analyze word-level differences between reference and transcribed text
   */
  const analyzeWordDifferences = (reference, transcribed) => {
    // Normalize text by removing punctuation and converting to lowercase
    const normalizeText = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    }

    const refWords = normalizeText(reference).split(/\s+/)
    const transWords = normalizeText(transcribed).split(/\s+/)

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

    console.log('analyzeWordDifferences result:', differences)
    return differences
  }

  /**
   * Evaluate pronunciation based on reference text
   */
  const evaluatePronunciation = (referenceText, transcribedText, confidence = 1) => {
    const similarity = calculateSimilarity(referenceText, transcribedText)
    const finalScore = Math.round(similarity * confidence)
    const differences = analyzeWordDifferences(referenceText, transcribedText)

    console.log('evaluatePronunciation debug:', {
      referenceText,
      transcribedText,
      similarity,
      finalScore,
      differences,
      confidence,
    })

    let feedback = ''
    let level = ''
    let color = ''

    // Determine feedback level and color based on score and word analysis
    const incorrectDifferences = differences.filter((d) => d.type === 'incorrect')

    console.log('incorrectDifferences:', incorrectDifferences)

    if (finalScore >= 85 && incorrectDifferences.length === 0) {
      // Excellent - Green
      feedback = 'Excellent! Your pronunciation is perfect!'
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
  }

  return {
    // State
    isRecording,
    transcript,
    error,
    recognitionResult,
    pronunciationScore,

    // Methods
    startRecording,
    stopRecording,
    evaluatePronunciation,
    calculateSimilarity,
    analyzeWordDifferences,
    reset,
  }
}
