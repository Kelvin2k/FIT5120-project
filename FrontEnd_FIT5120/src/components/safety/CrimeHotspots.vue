<template>
  <div class="crime-hotspots">
    <div class="module-header">
      <h2 class="module-title">
        🚨 {{ t('safety.crime_hotspots', 'Crime Hotspots') }}
      </h2>
    </div>

    <div class="module-content">

      <!-- Crime Hotspots Map -->
      <div class="crime-map-section">
        <div class="map-header">
          <h3 class="map-title">
            🗺️ {{ t('safety.crime_hotspots_map', 'Crime Hotspots Map') }}
          </h3>
          
          <!-- 筛选器容器 -->
          <div class="filters-container">

            <!-- 犯罪等级筛选器 -->
            <div class="level-filter">
              <label for="level-select" class="filter-label">
                📊 {{ t('safety.filter_by_level', 'Crime Level') }}:
              </label>
              <select 
                id="level-select"
                v-model="selectedCrimeLevel" 
                class="filter-select"
              >
                <option value="all">{{ t('safety.all_levels', 'All Levels') }}</option>
                <option value="very-low">{{ t('safety.very_low_crime', 'Very Low') }}</option>
                <option value="low">{{ t('safety.low_crime', 'Low') }}</option>
                <option value="medium">{{ t('safety.medium_crime', 'Medium') }}</option>
                <option value="high">{{ t('safety.high_crime', 'High') }}</option>
                <option value="very-high">{{ t('safety.very_high_crime', 'Very High') }}</option>
              </select>
            </div>

            <!-- 结果计数 -->
            <span class="filter-count">
              ({{ crimeAreas.length }} {{ t('safety.lgas', 'LGAs') }})
            </span>
          </div>
        </div>

        <div class="map-container">
          <div id="crime-map" class="crime-map"></div>

          <!-- Map Legend -->
          <div class="map-legend">
            <div class="legend-section">
              <h4 class="legend-title">{{ t('safety.crime_points_map', 'LGA Crime Points Map') }}</h4>
              <div class="points-legend">
                <div class="legend-points">
                  <div class="legend-point-item">
                    <div class="point-sample very-low-point"></div>
                    <span>{{ t('safety.very_low_crime', 'Very Low Crime') }}</span>
                  </div>
                  <div class="legend-point-item">
                    <div class="point-sample low-point"></div>
                    <span>{{ t('safety.low_crime', 'Low Crime') }}</span>
                  </div>
                  <div class="legend-point-item">
                    <div class="point-sample medium-point"></div>
                    <span>{{ t('safety.medium_crime', 'Medium Crime') }}</span>
                  </div>
                  <div class="legend-point-item">
                    <div class="point-sample high-point"></div>
                    <span>{{ t('safety.high_crime', 'High Crime') }}</span>
                  </div>
                  <div class="legend-point-item">
                    <div class="point-sample very-high-point"></div>
                    <span>{{ t('safety.very_high_crime', 'Very High Crime') }}</span>
                  </div>
                </div>
              </div>
              <p class="legend-description">
                {{ t('safety.points_explanation', 'Each point represents a Local Government Area. Point size and color intensity indicate crime levels - larger and deeper red points show higher crime counts.') }}
              </p>
              <!-- 数据时间说明 -->
              <div class="metadata-info">
                <p class="metadata-item">
                  <strong>{{ t('safety.data_timeframe', 'Data timeframe') }}:</strong>
                  {{ timeframeText }}
                </p>
                <p class="metadata-item">
                  <strong>{{ t('safety.updated', 'Updated') }}:</strong>
                  {{ lastUpdatedText }}
                </p>
              </div>
            </div>

            <div class="legend-section">
              <h4 class="legend-title">{{ t('safety.coverage_stats', 'Coverage Statistics') }}</h4>
              <div class="coverage-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ crimeAreas.length }}</span>
                  <span class="stat-label">{{ t('safety.total_lgas', 'LGAs Covered') }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">
                    {{
                      formatNumberSI(crimeAreas.reduce((sum, area) => sum + area.offenceCount, 0))
                    }}
                  </span>
                  <span class="stat-label">{{ t('safety.total_offences', 'Total Offences') }}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ t('safety.loading_crime_data', 'Loading crime statistics...') }}</p>
        </div>

        <!-- Error State -->
        <div v-if="error && !loading" class="error-state">
          <div class="error-icon">⚠️</div>
          <h4>{{ t('safety.error_loading', 'Error Loading Data') }}</h4>
          <p>{{ error }}</p>
          <button @click="fetchCrimeData" class="retry-btn">
            {{ t('safety.retry', 'Retry') }}
          </button>
        </div>



        <!-- Selected Region Info -->
        <!-- <div v-if="selectedArea" class="selected-area-info">
          <h4 class="area-info-title">🚨 {{ selectedArea.name }}</h4>
          <div class="area-stats-grid">
            <div class="area-stat">
              <span class="stat-label">{{ t('safety.total_offences', 'Total Offences') }}:</span>
              <span class="stat-value">{{ selectedArea.offenceCount.toLocaleString() }}</span>
            </div>

            <div class="area-stat" v-if="selectedArea.areas">
              <span class="stat-label">{{ t('safety.areas_included', 'Areas Included') }}:</span>
              <span class="stat-value">{{ selectedArea.areas.length }}</span>
            </div>

            <div class="area-stat">
              <span class="stat-label">{{ t('safety.safety_level', 'Safety Level') }}:</span>
              <span class="stat-value" :class="selectedArea.safetyLevel.class">{{ selectedArea.safetyLevel.text }}</span>
            </div>
          </div>

          <div v-if="selectedArea.areas && selectedArea.areas.length > 1" class="region-areas-breakdown">
            <h5 class="breakdown-title">{{ t('safety.area_breakdown', 'Area Breakdown') }}:</h5>
            <div class="breakdown-list">
              <div v-for="area in selectedArea.areas" :key="area.name" class="breakdown-item">
                <span class="breakdown-name">{{ area.name }}</span>
                <span class="breakdown-count">{{ area.offenceCount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div> -->
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getLGACoordinates, isValidLGA } from '@/data/lgaCoordinates'
import crimeStatisticsService from '@/services/crimeStatisticsService'

const { t } = useI18n()

// 数值格式化：将 12345 -> 12.3k, 1234567 -> 1.23M
function formatNumberSI(value) {
  const n = Number(value || 0)
  if (!isFinite(n)) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 2).replace(/\.0+$/, '')}B`
  if (abs >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 2).replace(/\.0+$/, '')}M`
  if (abs >= 1e3) return `${(n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1).replace(/\.0+$/, '')}k`
  return n.toLocaleString('en-AU')
}

// 数据时间说明（可根据 API 元数据更新）
const timeframeText = computed(() => {
  if (availableYears.value && availableYears.value.length) {
    const minY = Math.min(...availableYears.value)
    const maxY = Math.max(...availableYears.value)
    return `${minY} - ${maxY}`
  }
  return 'Last 12 months'
})

const lastUpdatedText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: '2-digit' })
})

// Map and selection state
let map = null
const selectedArea = ref(null)

// Current location (mock data)
const currentLocation = ref('Melbourne CBD')

// 犯罪数据（模拟数据，实际应从后端API获取）
const crimeData = ref([
  {
    type: 'theft',
    name: t('safety.theft', 'Theft'),
    icon: '🚗',
    count: 156,
    severity: 'medium',
    trend: {
      direction: 'down',
      icon: '📉',
      text: t('safety.decreasing', '↓ 12% from last month')
    }
  },
  {
    type: 'assault',
    name: t('safety.assault', 'Assault'),
    icon: '⚔️',
    count: 89,
    severity: 'high',
    trend: {
      direction: 'up',
      icon: '📈',
      text: t('safety.increasing', '↑ 5% from last month')
    }
  },
  {
    type: 'burglary',
    name: t('safety.burglary', 'Burglary'),
    icon: '🏠',
    count: 34,
    severity: 'medium',
    trend: {
      direction: 'stable',
      icon: '➡️',
      text: t('safety.stable', '→ Stable')
    }
  },
  {
    type: 'fraud',
    name: t('safety.fraud', 'Fraud'),
    icon: '💳',
    count: 67,
    severity: 'high',
    trend: {
      direction: 'up',
      icon: '📈',
      text: t('safety.increasing', '↑ 18% from last month')
    }
  }
])

// API data state
const rawCrimeData = ref([])
const loading = ref(false)
const error = ref(null)
const availableYears = ref([])
const availablePoliceRegions = ref([])
const selectedPoliceRegion = ref('all') // 筛选警区：'all' 表示全部
const selectedCrimeLevel = ref('all') // 筛选犯罪等级：'all' 表示全部

// 获取所有唯一的警区（用于筛选器选项）
const uniquePoliceRegions = computed(() => {
  const regions = new Set()
  rawCrimeData.value.forEach(item => {
    if (item && item.policeRegion) {
      regions.add(item.policeRegion)
    }
  })
  return Array.from(regions).sort()
})

// 计算全局归一化基准（使用所有原始数据）
const globalNormalizationBase = computed(() => {
  const allProcessedData = []
  
  rawCrimeData.value.forEach(item => {
    const coordinates = getLGACoordinates(item.lga)
    if (coordinates) {
      allProcessedData.push({
        offenceCount: item.offenceCount
      })
    }
  })
  
  if (allProcessedData.length === 0) {
    return { max: 0, min: 0 }
  }
  
  const offenceCounts = allProcessedData.map(area => area.offenceCount)
  return {
    max: Math.max(...offenceCounts),
    min: Math.min(...offenceCounts)
  }
})

// Process API data to include coordinates using LGA mapping
const crimeAreas = computed(() => {
  let data = rawCrimeData.value
  
  // 根据选中的警区筛选
  if (selectedPoliceRegion.value !== 'all') {
    data = data.filter(item => item && item.policeRegion === selectedPoliceRegion.value)
  }
  
  const processedData = []

  data.forEach(item => {
    const coordinates = getLGACoordinates(item.lga)

    if (coordinates) {
      processedData.push({
        name: item.lga,
        policeRegion: item.policeRegion,
        offenceCount: item.offenceCount,
        ratePerPopulation: item.ratePerPopulation || 0, // API might not have this field
        coordinates: coordinates
      })
    } else {
      console.warn(`Could not find coordinates for LGA: ${item.lga}`)
    }
  })

  // 根据选中的犯罪等级筛选（使用全局归一化基准）
  if (selectedCrimeLevel.value !== 'all') {
    const { max: maxOffences, min: minOffences } = globalNormalizationBase.value
    
    return processedData.filter(area => {
      const normalizedIntensity = maxOffences > minOffences 
        ? (area.offenceCount - minOffences) / (maxOffences - minOffences)
        : 0
      
      const level = getCrimeLevelClass(normalizedIntensity)
      return level === selectedCrimeLevel.value
    })
  }

  return processedData
})

// 获取犯罪等级的类名（用于筛选）
const getCrimeLevelClass = (normalizedIntensity) => {
  if (normalizedIntensity >= 0.8) return 'very-high'
  if (normalizedIntensity >= 0.6) return 'high'
  if (normalizedIntensity >= 0.4) return 'medium'
  if (normalizedIntensity >= 0.2) return 'low'
  return 'very-low'
}

// Fetch crime data from API
const fetchCrimeData = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Fetching crime statistics from API...')
    const response = await crimeStatisticsService.getCrimeStatisticsByLGA()

    if (response.success && response.data) {
      rawCrimeData.value = response.data
      console.log(`Loaded ${response.data.length} crime statistics records`)
    } else {
      throw new Error(response.message || 'Failed to fetch crime statistics')
    }
  } catch (err) {
    console.error('Error fetching crime data:', err)
    error.value = err.message || 'Failed to load crime data'

    // Fallback to sample data for demonstration
    rawCrimeData.value = [
      { policeRegion: '1 North West Metro', lga: 'Banyule', offenceCount: 9698 },
      { policeRegion: '1 North West Metro', lga: 'Melbourne', offenceCount: 35767 },
      { policeRegion: '1 North West Metro', lga: 'Yarra', offenceCount: 14134 }
    ]
    console.log('Using fallback sample data')
  } finally {
    loading.value = false
  }
}

// Fetch available metadata
const fetchMetadata = async () => {
  try {
    const [yearsResponse, regionsResponse] = await Promise.all([
      crimeStatisticsService.getAvailableYears(),
      crimeStatisticsService.getAvailablePoliceRegions()
    ])

    if (yearsResponse.success) {
      availableYears.value = yearsResponse.data
    }

    if (regionsResponse.success) {
      availablePoliceRegions.value = regionsResponse.data
    }
  } catch (err) {
    console.warn('Failed to fetch metadata:', err.message)
  }
}

// Function to add new LGA data dynamically
const addLGAData = (policeRegion, lgaName, offenceCount, ratePerPopulation) => {
  if (!isValidLGA(lgaName)) {
    console.warn(`LGA "${lgaName}" not found in coordinate mapping`)
    return false
  }

  rawCrimeData.value.push({
    policeRegion,
    lga: lgaName,
    offenceCount,
    ratePerPopulation
  })

  return true
}

// Function to load data from external source (like CSV or API)
const loadCrimeData = (dataArray) => {
  rawCrimeData.value = []

  dataArray.forEach(item => {
    if (item.lga && item.offenceCount && item.ratePerPopulation) {
      rawCrimeData.value.push({
        policeRegion: item.policeRegion || 'Unknown',
        lga: item.lga,
        offenceCount: parseInt(item.offenceCount) || 0,
        ratePerPopulation: parseFloat(item.ratePerPopulation) || 0
      })
    }
  })

  console.log(`Loaded ${rawCrimeData.value.length} LGA crime records`)
}

// Aggregate crime data by police region
const policeRegionData = computed(() => {
  const regions = {}

  crimeAreas.value.forEach(area => {
    const regionKey = area.policeRegion
    if (!regions[regionKey]) {
      regions[regionKey] = {
        name: regionKey,
        totalOffences: 0,
        areas: [],
        coordinates: null
      }
    }

    regions[regionKey].totalOffences += area.offenceCount
    regions[regionKey].areas.push(area)
  })

  // Calculate center coordinates for each region
  Object.keys(regions).forEach(regionKey => {
    const region = regions[regionKey]
    const latSum = region.areas.reduce((sum, area) => sum + area.coordinates[0], 0)
    const lngSum = region.areas.reduce((sum, area) => sum + area.coordinates[1], 0)
    region.coordinates = [latSum / region.areas.length, lngSum / region.areas.length]
  })

  return Object.values(regions)
})

// Create simple point-based crime visualization
const createHeatmapEffect = (map) => {
  // 使用全局归一化基准，确保颜色和等级一致
  const { max: maxCrimeCount, min: minCrimeCount } = globalNormalizationBase.value

  crimeAreas.value.forEach(area => {
    const intensity = area.offenceCount

    // Normalize intensity based on crime count (0-1)，使用全局基准
    const normalizedIntensity = maxCrimeCount > minCrimeCount
      ? (intensity - minCrimeCount) / (maxCrimeCount - minCrimeCount)
      : 0

    // Calculate point size based on crime count (larger for more crimes)
    const pointRadius = Math.max(5, Math.min(20, 5 + (normalizedIntensity * 15)))

    // 使用单一色系（红色）渐变表示强度：越深越高
    const lightness = 90 - (normalizedIntensity * 55) // 90% -> 35%
    const opacity = 0.6 + (normalizedIntensity * 0.4)  // 0.6 -> 1.0
    const fillColor = `hsla(0, 85%, ${lightness}%, ${opacity})`
    const borderColor = `hsl(0, 85%, ${Math.max(30, lightness - 10)}%)`

    // Create single point marker for each LGA
    const pointMarker = L.circleMarker(area.coordinates, {
      radius: pointRadius,
      fillColor: fillColor,
      color: borderColor,
      weight: 2,
      opacity: 1,
      fillOpacity: opacity
    }).addTo(map)

    // Add popup for LGA information
    const popupContent = `
      <div class="map-popup">
        <h4>${area.name}</h4>
        <p><strong>${t('safety.police_region', 'Police Region')}:</strong> ${area.policeRegion}</p>
        <p><strong>${t('safety.total_offences', 'Total Offences')}:</strong> ${area.offenceCount.toLocaleString()}</p>
        <p><strong>${t('safety.crime_level', 'Crime Level')}:</strong> <span class="${getCrimeLevel(normalizedIntensity).class}">${getCrimeLevel(normalizedIntensity).text}</span></p>
      </div>
    `

    pointMarker.bindPopup(popupContent)

    // Add click event to select area
    pointMarker.on('click', () => {
      selectedArea.value = {
        ...area,
        safetyLevel: getCrimeLevel(normalizedIntensity),
        normalizedIntensity: normalizedIntensity
      }
    })

    // Add hover effect for better interaction
    pointMarker.on('mouseover', function() {
      this.setStyle({
        radius: pointRadius + 3,
        weight: 3
      })
    })

    pointMarker.on('mouseout', function() {
      this.setStyle({
        radius: pointRadius,
        weight: 2
      })
    })

    // Store point marker for cleanup
    if (!map.heatmapLayers) map.heatmapLayers = []
    map.heatmapLayers.push(pointMarker)
  })
}

// Calculate crime level based on normalized intensity (0-1)
const getCrimeLevel = (normalizedIntensity) => {
  if (normalizedIntensity >= 0.8) {
    return { class: 'very-high', text: t('safety.very_high_crime', 'Very High Crime') }
  } else if (normalizedIntensity >= 0.6) {
    return { class: 'high', text: t('safety.high_crime', 'High Crime') }
  } else if (normalizedIntensity >= 0.4) {
    return { class: 'medium', text: t('safety.medium_crime', 'Medium Crime') }
  } else if (normalizedIntensity >= 0.2) {
    return { class: 'low', text: t('safety.low_crime', 'Low Crime') }
  } else {
    return { class: 'very-low', text: t('safety.very_low_crime', 'Very Low Crime') }
  }
}

// Calculate safety level based on crime rate (keep for backward compatibility)
const getSafetyLevel = (rate) => {
  if (rate >= 15000) {
    return { class: 'very-high', text: t('safety.very_high_risk', 'Very High Risk') }
  } else if (rate >= 10000) {
    return { class: 'high', text: t('safety.high_risk', 'High Risk') }
  } else if (rate >= 7000) {
    return { class: 'medium', text: t('safety.moderate_risk', 'Moderate Risk') }
  } else if (rate >= 5000) {
    return { class: 'low', text: t('safety.low_risk', 'Low Risk') }
  } else {
    return { class: 'very-low', text: t('safety.very_low_risk', 'Very Low Risk') }
  }
}

// Get color based on crime rate
const getCrimeColor = (rate) => {
  if (rate >= 15000) return '#d32f2f'      // Very High - Dark Red
  if (rate >= 10000) return '#f57c00'     // High - Orange
  if (rate >= 7000) return '#fbc02d'      // Medium - Yellow
  if (rate >= 5000) return '#689f38'      // Low - Light Green
  return '#388e3c'                        // Very Low - Green
}

// Initialize map with dense heatmap showing LGA crime data
const initializeMap = () => {
  try {
    // Create map centered on Melbourne with wider view for all LGAs
    map = L.map('crime-map').setView([-37.5, 145.5], 8)

    // Add tile layer with slightly muted colors for better heatmap visibility
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      opacity: 0.8
    }).addTo(map)

    // Create dense heatmap effect for all LGAs
    createHeatmapEffect(map)

    console.log(`Crime heatmap initialized successfully with ${crimeAreas.value.length} Local Government Areas`)
  } catch (error) {
    console.error('Error initializing crime heatmap:', error)
  }
}

// Get color for police region based on total crimes
const getRegionColor = (totalOffences) => {
  if (totalOffences >= 150000) return '#8B0000'      // Dark Red
  if (totalOffences >= 100000) return '#DC143C'      // Crimson
  if (totalOffences >= 50000) return '#FF4500'       // Orange Red
  if (totalOffences >= 20000) return '#FF6347'       // Tomato
  return '#FFA07A'                                   // Light Salmon
}

// Cleanup map
const cleanupMap = () => {
  if (map) {
    // Clean up heatmap layers
    if (map.heatmapLayers) {
      map.heatmapLayers.forEach(layer => {
        map.removeLayer(layer)
      })
      map.heatmapLayers = []
    }

    map.remove()
    map = null
  }
}


// 监听筛选条件变化，重新渲染地图
watch([selectedPoliceRegion, selectedCrimeLevel], () => {
  if (map) {
    // 清除现有的热力图层
    if (map.heatmapLayers) {
      map.heatmapLayers.forEach(layer => {
        map.removeLayer(layer)
      })
      map.heatmapLayers = []
    }
    
    // 重新创建热力图
    createHeatmapEffect(map)
    
    console.log(`Map updated: ${crimeAreas.value.length} LGAs displayed`)
  }
})

// Lifecycle hooks
onMounted(async () => {
  // Fetch data from API and initialize metadata
  await Promise.all([
    fetchCrimeData(),
    // fetchMetadata()
  ])

  // Initialize map after data is loaded
  setTimeout(() => {
    initializeMap()
  }, 100)
})

onUnmounted(() => {
  // Cleanup map when component is destroyed
  cleanupMap()
})

// Expose functions for external use
defineExpose({
  // Legacy functions for backward compatibility
  addLGAData,
  loadCrimeData,

  // New API-based functions
  fetchCrimeData,
  fetchMetadata,

  // Data properties
  crimeAreas,
  rawCrimeData,
  policeRegionData,
  availableYears,
  availablePoliceRegions,

  // State properties
  loading,
  error
})
</script>

<style scoped>
.crime-hotspots {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.module-header {
  background: #f3e5f5;
  color: #6a1b9a;
  padding: 1.5rem;
  border-radius: 16px 16px 0 0;
  border-bottom: 2px solid #ce93d8;
}

.module-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

.module-content {
  padding: 1.5rem;
  flex-grow: 1;
}

/* 概览统计 */
.crime-overview {
  margin-bottom: 2rem;
}

.overview-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.safety-rating {
  background: #fafafa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e1bee7;
  box-shadow: 0 2px 8px rgba(106, 27, 154, 0.1);
}

.rating-display {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.rating-score {
  font-size: 2.5rem;
  font-weight: 700;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 10px;
  min-width: 80px;
  text-align: center;
}

.rating-score.very-safe {
  background: #d4edda;
  color: #155724;
}

.rating-score.moderately-safe {
  background: #fff3cd;
  color: #856404;
}

.rating-score.caution-needed {
  background: #f8d7da;
  color: #721c24;
}

.rating-score.high-risk {
  background: #f5c6cb;
  color: #721c24;
}

.rating-info p {
  margin: 0.2rem 0;
}

.rating-level {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.rating-location {
  color: #666;
  font-size: 0.95rem;
}

.rating-description {
  color: #555;
  line-height: 1.4;
}

/* 犯罪统计 */
.crime-stats {
  margin-bottom: 2rem;
}

.stats-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 3px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(106, 27, 154, 0.15);
}

.stat-card.high {
  border-left-color: #8e24aa;
}

.stat-card.medium {
  border-left-color: #ba68c8;
}

.stat-card.low {
  border-left-color: #ce93d8;
}

.stat-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stat-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.stat-type {
  font-weight: 600;
  color: #333;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #dc3545;
  margin-bottom: 0.5rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.trend-icon {
  margin-right: 0.3rem;
}

.stat-trend.up {
  color: #dc3545;
}

.stat-trend.down {
  color: #28a745;
}

.stat-trend.stable {
  color: #6c757d;
}

/* 区域对比 */
.area-comparison {
  margin-bottom: 2rem;
}

.comparison-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.comparison-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.comparison-section {
  background: #fafafa;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.area-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.area-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
}

.area-item.safe {
  background: rgba(40, 167, 69, 0.1);
  color: #155724;
}

.area-item.danger {
  background: rgba(220, 53, 69, 0.1);
  color: #721c24;
}

.area-score {
  font-weight: 600;
}

/* 安全建议 */
.safety-advice {
  margin-bottom: 1rem;
}

.advice-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.advice-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  background: #e7f3ff;
  border-radius: 8px;
  font-size: 0.95rem;
}

.advice-icon {
  font-size: 1.2rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.advice-text {
  color: #333;
  line-height: 1.4;
}

/* Crime Map Section */
.crime-map-section {
  margin-bottom: 2rem;
}

/* Map header with filter */
.map-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.map-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

/* 筛选器容器 */
.filters-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.region-filter,
.level-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.region-filter:hover,
.level-filter:hover {
  border-color: #8e24aa;
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.15);
}

.filter-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #495057;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
}

.filter-select:hover {
  border-color: #8e24aa;
}

.filter-select:focus {
  outline: none;
  border-color: #8e24aa;
  box-shadow: 0 0 0 3px rgba(142, 36, 170, 0.1);
}

.filter-count {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  white-space: nowrap;
}

/* 响应式：小屏幕时筛选器独占一行 */
@media (max-width: 768px) {
  .map-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-container {
    flex-direction: column;
    width: 100%;
  }
  
  .region-filter,
  .level-filter {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-select {
    flex: 1;
    min-width: 0;
  }
  
  .filter-count {
    width: 100%;
    text-align: center;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
}

.map-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(106, 27, 154, 0.1);
}

.crime-map {
  height: 350px;
  width: 100%;
  border-radius: 12px 12px 0 0;
}

/* Map Legend */
.map-legend {
  padding: 1rem;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.legend-section {
  margin-bottom: 1rem;
}

.legend-section:last-child {
  margin-bottom: 0;
}

.legend-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

/* Points Legend */
.points-legend {
  margin-bottom: 1rem;
}

.legend-points {
  display: flex;
  /* flex-direction: column; */
  gap: 0.5rem;
}

.legend-point-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.point-sample {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
}

/* Point sample colors matching the map */
.very-low-point {
  background-color: hsla(0, 85%, 90%, 0.8);
  border-color: hsl(0, 85%, 80%);
}

.low-point {
  background-color: hsla(0, 85%, 80%, 0.85);
  border-color: hsl(0, 85%, 70%);
}

.medium-point {
  background-color: hsla(0, 85%, 65%, 0.9);
  border-color: hsl(0, 85%, 55%);
}

.high-point {
  background-color: hsla(0, 85%, 50%, 0.95);
  border-color: hsl(0, 85%, 40%);
}

.very-high-point {
  background-color: hsla(0, 85%, 35%, 1);
  border-color: hsl(0, 85%, 25%);
}

/* Legend Description */
.legend-description {
  margin: 0.75rem 0 0 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  font-style: italic;
}

/* Coverage Statistics */
.coverage-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(241, 190, 231, 0.2);
  border-radius: 8px;
  border-left: 3px solid #8e24aa;
}

.stat-number {
  font-size: 1.4rem;
  font-weight: 600;
  color: #8e24aa;
  min-width: 3rem;
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.gradient-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

/* Region Legend */
.region-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.region-legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.region-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.region-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  flex-grow: 1;
}

.region-count {
  font-size: 0.8rem;
  font-weight: 700;
  color: #666;
  background: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
}

/* Selected Area Info */
.selected-area-info {
  margin-top: 1.5rem;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #ab47bc;
}

.area-info-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.area-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.area-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #fafafa;
  border-radius: 8px;
  font-size: 0.9rem;
}

.area-stat .stat-label {
  font-weight: 600;
  color: #666;
}

.area-stat .stat-value {
  font-weight: 700;
  color: #333;
}

.area-stat .stat-value.very-high {
  color: #d32f2f;
}

.area-stat .stat-value.high {
  color: #f57c00;
}

.area-stat .stat-value.medium {
  color: #fbc02d;
}

.area-stat .stat-value.low {
  color: #689f38;
}

.area-stat .stat-value.very-low {
  color: #388e3c;
}

/* Region Areas Breakdown */
.region-areas-breakdown {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
}

.breakdown-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.breakdown-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.85rem;
}

.breakdown-name {
  font-weight: 600;
  color: #333;
}

.breakdown-count {
  font-weight: 700;
  color: #ab47bc;
}

/* Region Labels on Map */
:global(.region-label) {
  background: transparent;
  border: none;
}

:global(.region-label-content) {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #ab47bc;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:global(.region-name) {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #ab47bc;
  margin-bottom: 0.2rem;
}

:global(.region-count) {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rating-display {
    flex-direction: column;
    text-align: center;
  }

  .rating-score {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .comparison-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .crime-map {
    height: 300px;
  }

  .region-legend {
    gap: 0.25rem;
  }

  .region-legend-item {
    padding: 0.4rem;
    gap: 0.5rem;
  }

  .region-name {
    font-size: 0.8rem;
  }

  .region-count {
    font-size: 0.75rem;
    padding: 0.15rem 0.4rem;
  }

  .area-stats-grid {
    grid-template-columns: 1fr;
  }

  .breakdown-list {
    grid-template-columns: 1fr;
  }

  .map-container {
    border-radius: 12px;
  }

  .crime-map {
    border-radius: 12px 12px 0 0;
  }
}

/* Map Popup Styles */
:global(.leaflet-popup-content) {
  margin: 8px 12px;
  line-height: 1.4;
}

:global(.map-popup h4) {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

:global(.map-popup p) {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #666;
}

:global(.map-popup .very-high) {
  color: #d32f2f;
  font-weight: 600;
}

:global(.map-popup .high) {
  color: #f57c00;
  font-weight: 600;
}

:global(.map-popup .medium) {
  color: #fbc02d;
  font-weight: 600;
}

:global(.map-popup .low) {
  color: #689f38;
  font-weight: 600;
}

:global(.map-popup .very-low) {
  color: #388e3c;
  font-weight: 600;
}

/* Data Loading Information */
.data-loading-info {
  margin: 1rem 0;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.info-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-title::before {
  content: "📊";
  font-size: 1.2rem;
}

.data-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.data-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border-left: 3px solid #6c757d;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #495057;
}

.data-description {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.4;
  font-style: italic;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  border-left: 3px solid #28a745;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  margin: 1rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6a1b9a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border-radius: 12px;
  border: 1px solid #feb2b2;
  margin: 1rem 0;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h4 {
  color: #e53e3e;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.error-state p {
  color: #744444;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.retry-btn {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
}

/* Metadata Information */
.metadata-info {
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: rgba(106, 27, 154, 0.1);
  border-radius: 8px;
  border-left: 3px solid #6a1b9a;
}

.metadata-item {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #495057;
  line-height: 1.4;
}

.metadata-item strong {
  color: #6a1b9a;
}
</style>
