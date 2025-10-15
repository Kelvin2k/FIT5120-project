<template>
  <div class="scam-alerts">
    <div class="module-header">
      <h2 class="module-title">
        🛡️ {{ t('safety.scam_alerts', 'Scam Alerts') }}
      </h2>
    </div>

    <div class="module-content">
      <!-- Warning banner with prevention tips -->
      <div class="warning-banner">
        <span class="warning-icon">⚠️</span>
        <div class="warning-content">
          <h3 class="warning-title">{{ t('safety.stay_alert', 'Stay Alert!') }}</h3>
          <p class="warning-text">
            {{ t('safety.scam_warning', 'Scammers often target elderly and new immigrants. Be vigilant!') }}
          </p>

          <!-- Prevention tips in banner -->
          <div class="banner-prevention-tips">
            <h4 class="banner-tips-title">
              📝 {{ t('safety.prevention_tips', 'Prevention Tips') }}:
            </h4>
            <ul class="banner-tips-list">
              <li class="banner-tip-item">{{ t('safety.phone_tip1', 'Be suspicious of unexpected calls requesting information') }}</li>
              <li class="banner-tip-item">{{ t('safety.phone_tip2', 'Hang up and call back using official numbers') }}</li>
              <li class="banner-tip-item">{{ t('safety.phone_tip3', 'Government agencies rarely call without prior contact') }}</li>
              <li class="banner-tip-item">{{ t('safety.phone_tip4', 'Never provide personal details over unsolicited calls') }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 最新诈骗警报 -->
      <div class="latest-alerts">
        <div class="alerts-header">
          <div>
            <h3 class="section-title">
              🚨 {{ t('safety.latest_scam_alerts', 'Latest Scam Alerts') }}
            </h3>
            <p class="section-note">{{ t('safety.victoria_only', 'Note: Victoria only') }}</p>
          </div>

          <!-- 类型筛选器 -->
          <div class="category-filter">
            <label for="category-select" class="filter-label">
              🔍 {{ t('safety.filter_by_type', 'Filter by Type') }}:
            </label>
            <select
              id="category-select"
              v-model="selectedCategory"
              class="filter-select"
            >
              <option value="all">{{ t('safety.all_types', 'All Types') }}</option>
              <option
                v-for="category in uniqueCategories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
            <span class="filter-count">
              ({{ formattedScamData.length }} {{ t('safety.results', 'results') }})
            </span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">{{ t('safety.loading_scam_data', 'Loading scam reports...') }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">❌</div>
          <p class="error-text">{{ error }}</p>
          <button @click="retryLoad" class="retry-button">
            🔄 {{ t('safety.retry', 'Retry') }}
          </button>
        </div>

        <!-- Data list (外层滚动容器包裹，避免影响父级宽度/高度) -->
        <div v-else-if="formattedScamData.length > 0" class="alerts-scroll">
          <div class="alerts-list horizontal">
          <div
            v-for="(scam, idx) in formattedScamData"
            :key="scam?.id ?? (scam?.categoryLevel2 + '-' + scam?.categoryLevel3 + '-' + idx)"
            class="scam-card"
            @click="openScam(scam)"
            :class="scam.priority"
          >
            <!-- Scam header with icon and title -->
            <div class="scam-header">
              <span class="scam-icon">{{ scam.icon }}</span>
              <h4 class="scam-title">{{ scam.categoryLevel2 || t('safety.unknown_scam_type', 'Unknown Scam Type') }}</h4>
            </div>

            <!-- Scam details section -->
            <div class="scam-details">
            <div class="scam-description">
                <p class="scam-text">
                  <strong>{{ t('safety.scam_type', 'Type') }}:</strong> {{ scam.categoryLevel3 || t('safety.no_description', 'No description available') }}
                </p>
              </div>

              <!-- Additional scam information -->
          </div>
        </div>

            <!-- Statistics section -->
            <!-- <div class="scam-stats">
              <div class="stat-item" v-if="scam && scam.numberOfReports != null">
                <span class="stat-label">{{ t('safety.reports', 'Reports') }}:</span>
                <span class="stat-value danger">{{ scam.numberOfReports }}</span>
              </div>
              <div class="stat-item" v-if="scam && scam.formattedAmount">
                <span class="stat-label">{{ t('safety.amount_lost', 'Amount Lost') }}:</span>
                <span class="stat-value danger">{{ scam.formattedAmount }}</span>
              </div>
            </div> -->

          </div>
        </div>

        <!-- 详情弹窗：不改动数据，仅展示当前卡片更多信息（放在列表外，避免撑宽横向容器） -->
        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-icon">{{ activeScam?.icon }}</div>
              <h4 class="modal-title">{{ activeScam?.categoryLevel2 || t('safety.unknown_scam_type', 'Unknown Scam Type') }}</h4>
              <button class="modal-close" @click="closeModal">✕</button>
            </div>
            <div class="modal-body">
              <p class="modal-desc">
                {{ activeScam?.categoryLevel3 || t('safety.no_description', 'No description available') }}
              </p>
              <div class="scam-info">
                <div class="info-row" v-if="activeScam?.addressState">
                  <span class="info-label">📍 {{ t('safety.location', 'Location') }}:</span>
                  <span class="info-value">{{ activeScam.addressState }}</span>
                </div>
                <div class="info-row" v-if="activeScam?.scamContactMode">
                  <span class="info-label">📞 {{ t('safety.contact_method', 'Contact Method') }}:</span>
                  <span class="info-value">{{ activeScam.scamContactMode }}</span>
                </div>
                <div class="info-row" v-if="activeScam?.complainantAge">
                  <span class="info-label">👤 {{ t('safety.victim_age', 'Victim Age') }}:</span>
                  <span class="info-value">{{ activeScam.complainantAge }}</span>
                </div>
                <div class="info-row" v-if="activeScam?.formattedDate">
                  <span class="info-label">📅 {{ t('safety.reported_month', 'Reported') }}:</span>
                  <span class="info-value">{{ activeScam.formattedDate }}</span>
                </div>
              </div>
              <div class="modal-stats">
                <div class="stat-item" v-if="activeScam?.numberOfReports">
                  <span class="stat-label">{{ t('safety.reports', 'Reports') }}</span>
                  <span class="stat-value">{{ activeScam.numberOfReports }}</span>
                </div>
                <div class="stat-item" v-if="activeScam?.formattedAmount">
                  <span class="stat-label">{{ t('safety.amount_lost', 'Amount Lost') }}</span>
                  <span class="stat-value danger">{{ activeScam.formattedAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <!-- <div v-else class="no-data-state">
          <div class="no-data-icon">📄</div>
          <p class="no-data-text">{{ t('safety.no_scam_reports', 'No scam reports available') }}</p>
        </div> -->
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import scamReportService from '@/services/scamReportService.js'

const { t } = useI18n()

// 响应式数据
const scamData = ref([])
const loading = ref(false)
const error = ref(null)
const selectedCategory = ref('all') // 筛选类型：'all' 表示全部

// 分页相关数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false
})

// 获取所有唯一的诈骗类型（用于筛选器选项）
const uniqueCategories = computed(() => {
  const categories = new Set()
  scamData.value.forEach(scam => {
    if (scam && scam.categoryLevel2) {
      categories.add(scam.categoryLevel2)
    }
  })
  return Array.from(categories).sort()
})

// Computed property: Format scam data with localization and icons
const formattedScamData = computed(() => {
  let data = Array.isArray(scamData.value) ? scamData.value : []

  // 根据选中的类型筛选
  if (selectedCategory.value !== 'all') {
    data = data.filter(scam => scam && scam.categoryLevel2 === selectedCategory.value)
  }

  return data.map((scam, index) => {
    // Assign icons and priority based on scam type
    let icon = '⚠️'
    let priority = 'medium'

    if (scam && scam.categoryLevel2) {
      const category = String(scam.categoryLevel2 || '').toLowerCase()
      if (category.includes('romance') || category.includes('dating') || category.includes('relationship')) {
        icon = '💔'
        priority = 'high'
      } else if (category.includes('government') || category.includes('authority') || category.includes('police') || category.includes('tax')) {
        icon = '👮'
        priority = 'high'
      } else if (category.includes('investment') || category.includes('financial') || category.includes('trading') || category.includes('crypto')) {
        icon = '💰'
        priority = 'high'
      } else if (category.includes('phishing') || category.includes('email') || category.includes('personal information')) {
        icon = '📧'
        priority = 'high'
      } else if (category.includes('phone') || category.includes('call') || category.includes('mobile')) {
        icon = '📞'
        priority = 'medium'
      } else if (category.includes('online') || category.includes('internet') || category.includes('website')) {
        icon = '💻'
        priority = 'medium'
      }
    }

    return {
      ...(scam || {}),
      icon,
      priority,
      // Format amount for display (remove extra spaces and ensure proper formatting)
      formattedAmount: scam && scam.amountLost ? String(scam.amountLost).trim() : null,
      // Format date for display
      formattedDate: (scam && scam.startOfMonth) ? new Date(scam.startOfMonth).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short'
      }) : null
    }
  })
})

// 只展示 Victoria 州
const filteredScamData = computed(() => {
  return formattedScamData.value.filter(r => {
    const s = (r.addressState || '').toLowerCase()
    return s.includes('victoria') || s === 'vic' || s === 'vIC'
  })
})

// Fetch scam reports data from API
const fetchScamReports = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    const response = await scamReportService.getScamReports({
      page: 1,
      size: 100,
      state: 'Victoria'
    })

    const respOk = (response && (response.success === true || Array.isArray(response.data)))
    if (respOk) {
      scamData.value = Array.isArray(response.data) ? response.data : []
      pagination.value = {
        currentPage: 1,
        pageSize: (Array.isArray(response.data) ? response.data.length : 0),
        total: (Array.isArray(response.data) ? response.data.length : 0),
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
      }
    } else {
      console.error('[ScamAlerts] bad response shape:', response)
      throw new Error(response?.message || 'Failed to fetch data')
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch scam reports. Please try again later.'
    console.error('Failed to fetch scam reports:', err)
  } finally {
    loading.value = false
  }
}

// Change page for pagination
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchScamReports(page)
  }
}

// Retry loading data
const retryLoad = () => {
  fetchScamReports(pagination.value.currentPage)
}

// Fetch data when component is mounted
onMounted(() => {
  fetchScamReports()
  // 兜底：12秒仍在loading则停止并提示
  setTimeout(() => {
    if (loading.value) {
      error.value = t('safety.loading_scam_data', 'Loading scam reports...')
      loading.value = false
    }
  }, 12000)
})

// Protection guidelines (can be used in future features)
const protectionTips = ref([
  {
    id: 1,
    icon: '🔒',
    title: t('safety.protect_personal_info', 'Protect Personal Information'),
    description: t('safety.protect_personal_desc', 'Never share personal details like passwords, bank account numbers, or Medicare numbers with strangers.')
  },
  {
    id: 2,
    icon: '⏰',
    title: t('safety.take_time', 'Take Your Time'),
    description: t('safety.take_time_desc', 'Scammers create urgency. Always take time to think and consult with trusted family or friends.')
  },
  {
    id: 3,
    icon: '🔍',
    title: t('safety.verify_identity', 'Verify Identity'),
    description: t('safety.verify_identity_desc', 'Always verify the identity of callers by hanging up and calling official numbers independently.')
  },
  {
    id: 4,
    icon: '💳',
    title: t('safety.secure_payments', 'Secure Payment Methods'),
    description: t('safety.secure_payments_desc', 'Use secure payment methods and avoid wire transfers, gift cards, or cryptocurrency for unknown parties.')
  }
])

// 仅用于展示弹窗的本地状态，不修改任何数据源
const showModal = ref(false)
const activeScam = ref(null)
function openScam(scam) { activeScam.value = scam; showModal.value = true }
function closeModal() { showModal.value = false }


</script>

<style scoped>
.scam-alerts {
  display: block;
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
}

/* 移除滚动条，改为直接平铺 */

/* Alerts header with filter */
.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.category-filter {
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

.category-filter:hover {
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
  min-width: 200px;
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
  .alerts-header {
    flex-direction: column;
    align-items: stretch;
  }

  .category-filter {
    width: 100%;
    justify-content: space-between;
  }

  .filter-select {
    flex: 1;
    min-width: 0;
  }
}

/* Warning banner */
.warning-banner {
  display: flex;
  align-items: center;
  background: #fce4ec;
  border: 1px solid #f1bee7;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.1);
}

.warning-icon {
  font-size: 2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.warning-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #6a1b9a;
}

.warning-text {
  margin: 0 0 1.5rem 0;
  color: #6a1b9a;
  line-height: 1.4;
}

/* Prevention tips in banner */
.banner-prevention-tips {
  margin-top: 1rem;
}

.banner-tips-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #6a1b9a;
}

.banner-tips-list {
  margin: 0;
  padding-left: 1.2rem;
}

.banner-tip-item {
  margin-bottom: 0.5rem;
  color: #6a1b9a;
  line-height: 1.4;
  font-size: 0.9rem;
}

.banner-tip-item:last-child {
  margin-bottom: 0;
}

/* 最新警报 */
.latest-alerts {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}
.section-note { margin: -0.5rem 0 0.75rem; color: #6c757d; font-size: .85rem; }

.alerts-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}
.alerts-list.horizontal {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem 0;
  /* 不设置 width，让内容自然扩展，外层容器负责滚动 */
}
.alerts-list.horizontal .scam-card { flex: 0 0 280px; scroll-snap-align: start; }

/* 新增最外层滚动容器，固定宽度、避免撑大父级 */
.alerts-scroll {
  width: 60vw;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
  scroll-snap-type: x mandatory; /* 滚动捕捉 */
  padding-bottom: 0.5rem; /* 为滚动条留出空间 */
  /* 自定义滚动条样式 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(142, 36, 170, 0.3) transparent;
}

.alerts-scroll::-webkit-scrollbar {
  height: 6px;
}

.alerts-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.alerts-scroll::-webkit-scrollbar-thumb {
  background: rgba(142, 36, 170, 0.3);
  border-radius: 10px;
}

.alerts-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(142, 36, 170, 0.5);
}

.scam-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 3px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.scam-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.15);
}

.scam-card.high {
  border-left-color: #8e24aa;
}

.scam-card.medium {
  border-left-color: #ba68c8;
}

.scam-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.scam-rank {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.scam-icon {
  font-size: 2.8rem;
  margin: 0 0 0.4rem 0;
}

.scam-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: #333;
  text-align: center;
}

/* Scam details section */
.scam-details {
  margin-bottom: 1rem;
}

.scam-description {
  margin-bottom: 1rem;
}

.scam-text {
  color: #555;
  line-height: 1.5;
  margin: 0;
}

/* Scam information section */
.scam-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #495057;
  flex-shrink: 0;
  min-width: 140px;
}

.info-value {
  color: #6c757d;
  text-align: right;
  font-weight: 500;
}

.scam-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
}

.stat-value.danger {
  color: #dc3545;
}

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.3); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { width: min(560px, 92vw); background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.2); overflow: hidden; }
.modal-header { display: flex; align-items: center; gap: .75rem; padding: 1rem; border-bottom: 1px solid #eee; }
.modal-icon { font-size: 1.4rem; }
.modal-title { margin: 0; font-size: 1.05rem; font-weight: 700; }
.modal-close { margin-left: auto; border: none; background: transparent; font-size: 1.1rem; cursor: pointer; }
.modal-body { padding: 1rem; }
.modal-desc { margin: 0 0 .75rem; color: #444; }
.modal-stats { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }


/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6f42c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

/* 错误状态样式 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: #fff5f5;
  border: 2px solid #fed7d7;
  border-radius: 12px;
  margin: 1rem 0;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-text {
  color: #e53e3e;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.4;
}

.retry-button {
  background: #8e24aa;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.3);
}

.retry-button:hover {
  background: #6a1b9a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.4);
}

/* 无数据状态样式 */
.no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  margin: 1rem 0;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.no-data-text {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.pagination-btn {
  background: #8e24aa;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 120px;
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.3);
}

.pagination-btn:hover:not(.disabled) {
  background: #6a1b9a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.4);
}

.pagination-btn.disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.page-numbers {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.total-records {
  font-size: 0.85rem;
  color: #666;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .module-content {
    padding: 1rem;
  }

  .warning-banner {
    flex-direction: column;
    text-align: center;
  }

  .warning-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .banner-tips-title {
    font-size: 0.9rem;
  }

  .banner-tip-item {
    font-size: 0.85rem;
  }

  .scam-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-btn {
    min-width: auto;
    width: 100%;
  }

  .pagination-info {
    order: -1;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .info-label {
    min-width: auto;
  }

  .info-value {
    text-align: left;
  }
}

/* 小屏幕设备优化 */
@media (max-width: 480px) {
  .module-content {
    padding: 0.8rem;
  }

  .module-header {
    padding: 1rem;
  }

  .banner-tips-title {
    font-size: 0.85rem;
  }

  .banner-tip-item {
    font-size: 0.8rem;
  }

  .pagination {
    padding: 0.8rem;
  }

  .pagination-btn {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  .loading-state,
  .error-state,
  .no-data-state {
    padding: 2rem 0.8rem;
  }

  .scam-info {
    padding: 0.8rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .info-label {
    min-width: auto;
    font-size: 0.85rem;
  }

  .info-value {
    text-align: left;
    font-size: 0.85rem;
  }
}
</style>

