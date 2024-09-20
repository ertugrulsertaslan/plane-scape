import "./App.css";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/HomeScreen/Home";
import Login from "./component/Login";
import Header from "./component/Header";
import FlightsScreen from "./component/FlightScreen/FlightsScreen";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <div className="w-full min-h-screen flex-col flex items-center justify-center p-4 bg-customBodyColor">
                <div className="container border border-purple-600 rounded-xl p-4 w-full bg-customBgColor">
                  <Header />
                  <main className="flex-1 overflow-hidden">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/flights" element={<FlightsScreen />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
