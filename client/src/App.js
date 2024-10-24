import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Geography from "scenes/geography";



// watchTower FIle
import Citizens from "scenes/citizens";
import Rescuers from "scenes/rescuers";
import Reports from "scenes/reports";
import PendingReports from "scenes/pendingreports";
import LiveReports from "scenes/livereports"
import Overview from "scenes/overview";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";




function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/pending-reports" element={<PendingReports />} />
              <Route path="/live-reports" element={<LiveReports />} />
              <Route path="/geography" element={<Geography />} />

              {/* Watch Tower */}
              <Route path="/citizens" element={<Citizens />} />
              <Route path="/rescuers" element={<Rescuers />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
