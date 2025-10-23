import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Auth Pages
const Login = () => import('@/views/auth/LoginView.vue')
const Register = () => import('@/views/auth/RegisterView.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPasswordView.vue')

// Main Pages
const Home = () => import('@/views/HomeView.vue')
const Dashboard = () => import('@/views/DashboardView.vue')
const Settings = () => import('@/views/SettingsView.vue')
const Pricing = () => import('@/views/Pricing.vue')

// Account Pages
const Accounts = () => import('@/views/accounts/AccountsView.vue')
const AccountDetail = () => import('@/views/accounts/AccountDetailView.vue')
const AddAccount = () => import('@/views/accounts/AddAccountView.vue')

// Analytics Pages
const Followers = () => import('@/views/analytics/FollowersView.vue')
const Interactions = () => import('@/views/analytics/InteractionsView.vue')
const Posts = () => import('@/views/analytics/PostsView.vue')
const Statistics = () => import('@/views/analytics/StatisticsView.vue')
const WordAnalysis = () => import('@/views/analytics/WordAnalysisView.vue')

// Giveaway Pages
const Giveaways = () => import('@/views/giveaways/GiveawaysView.vue')
const GiveawayDetail = () => import('@/views/giveaways/GiveawayDetailView.vue')
const CreateGiveaway = () => import('@/views/giveaways/CreateGiveawayView.vue')

// Bluesky Specific Pages
const Lists = () => import('@/views/bluesky/ListsView.vue')
const Blocking = () => import('@/views/bluesky/BlockingView.vue')

// Subscription Pages
const SubscriptionPlans = () => import('@/views/subscription/PlansView.vue')
const ManageSubscription = () => import('@/views/subscription/ManageView.vue')
const Tokens = () => import('@/views/subscription/TokensView.vue')

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: 'pricing',
        name: 'pricing',
        component: Pricing
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'register',
        name: 'register',
        component: Register
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings
      },
      // Accounts
      {
        path: 'accounts',
        name: 'accounts',
        component: Accounts
      },
      {
        path: 'accounts/add',
        name: 'add-account',
        component: AddAccount
      },
      {
        path: 'accounts/:id',
        name: 'account-detail',
        component: AccountDetail
      },
      // Analytics
      {
        path: 'accounts/:id/followers',
        name: 'followers',
        component: Followers
      },
      {
        path: 'accounts/:id/interactions',
        name: 'interactions',
        component: Interactions
      },
      {
        path: 'accounts/:id/posts',
        name: 'posts',
        component: Posts
      },
      {
        path: 'accounts/:id/statistics',
        name: 'statistics',
        component: Statistics
      },
      {
        path: 'accounts/:id/word-analysis',
        name: 'word-analysis',
        component: WordAnalysis
      },
      // Giveaways
      {
        path: 'giveaways',
        name: 'giveaways',
        component: Giveaways
      },
      {
        path: 'giveaways/create',
        name: 'create-giveaway',
        component: CreateGiveaway
      },
      {
        path: 'giveaways/:id',
        name: 'giveaway-detail',
        component: GiveawayDetail
      },
      // Bluesky specific
      {
        path: 'accounts/:id/lists',
        name: 'lists',
        component: Lists,
        meta: { blueskyOnly: true }
      },
      {
        path: 'accounts/:id/blocking',
        name: 'blocking',
        component: Blocking,
        meta: { blueskyOnly: true }
      },
      // Subscription
      {
        path: 'subscription',
        name: 'subscription',
        component: ManageSubscription
      },
      {
        path: 'subscription/plans',
        name: 'subscription-plans',
        component: SubscriptionPlans
      },
      {
        path: 'tokens',
        name: 'tokens',
        component: Tokens
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isBlueskyOnly = to.matched.some(record => record.meta.blueskyOnly)
  
  // Check if the route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Check if the route is for Bluesky-specific features
  else if (isBlueskyOnly) {
    const accountId = to.params.id as string
    try {
      // Verify if the account is a Bluesky account
      const isBlueskyAccount = await authStore.checkIsBlueskyAccount(accountId)
      if (!isBlueskyAccount) {
        next({ name: 'account-detail', params: { id: accountId } })
      } else {
        next()
      }
    } catch (error) {
      next({ name: 'accounts' })
    }
  } else {
    next()
  }
})

export default router