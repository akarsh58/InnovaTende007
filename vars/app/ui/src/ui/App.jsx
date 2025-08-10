import React from 'react'
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { TenderProvider } from './context/TenderContext'
import { ToastProvider } from './components/ToastProvider'
import { AuthProvider } from './components/AuthProvider'
import ResponsiveNav from './components/ResponsiveNav'
import DashboardPage from './pages/DashboardPage'
import RFQPage from './pages/RFQPage'
import RFQWizard from './pages/RFQWizard'

import BidPage from './pages/BidPage'
import MilestonePage from './pages/MilestonePage'
import InsightsPage from './pages/InsightsPage'
import ProjectsPage from './pages/ProjectsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <TenderProvider>
          <ToastProvider>
            <div style={{ fontFamily:'Inter,system-ui', maxWidth: 1200, margin: '20px auto', padding: 20 }}>
              <ResponsiveNav />
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/rfqs" element={<RFQPage />} />
                <Route path="/rfqs/new" element={<RFQWizard />} />
                <Route path="/bids" element={<BidPage />} />
                <Route path="/milestones" element={<MilestonePage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </ToastProvider>
        </TenderProvider>
      </AuthProvider>
    </HashRouter>
  )
}
