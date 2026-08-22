// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import NotificationsPage from './pages/NotificationsPage';
import ConnectionsPage from './pages/ConnectionsPage';
import ChatPage from './pages/ChatPage';
import RequestsPage from './pages/RequestsPage';
import CallPage from './pages/CallPage';
import OnboardingPage from './pages/OnboardingPage';
import { Toaster } from 'react-hot-toast';
import useAuthUser from './hooks/useAuthUser';

function App() {
  const { authenticatedUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flexCenter">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const isAuth = !!authenticatedUser;
  const isOnboarded = authenticatedUser?.isOnboarded ?? false;

  return (
    <main>
      <Routes>
        <Route path='/signup' element = {isAuth ? <Navigate to = {isOnboarded? '/' : '/onboarding'} /> : <SignupPage />  }/>
        <Route path='/login' element = {isAuth ? <Navigate to = {isOnboarded? '/' : '/onboarding'} /> : <LoginPage />  }/>
        <Route path='/' element={isAuth && isOnboarded ? (<HomePage />) : (<Navigate to={isAuth ? '/onboarding' : '/login'} />)} />
        <Route path='/notifications' element={isAuth && isOnboarded ? (<NotificationsPage />) : (<Navigate to={isAuth ? '/onboarding' : '/login'} />)} />
        <Route path='/connections' element={isAuth && isOnboarded ? (<ConnectionsPage />) : (<Navigate to={isAuth ? '/onboarding' : '/login'} />)} />
        <Route path='/chat' element={isAuth && isOnboarded ? (<ChatPage />) : (<Navigate to={isAuth ? '/onboarding' : '/login'} />)} />
        <Route path='/requests' element={isAuth && isOnboarded ? (<RequestsPage />) : (<Navigate to={isAuth ? '/onboarding' : '/login'} />)} />
        <Route path='/call' element={isAuth && isOnboarded ? (<CallPage />) : (<Navigate to={isAuth ? '/onboarding' : '/login'} />)} />
        <Route path='/onboarding' element={isAuth ? (isOnboarded ? <Navigate to='/' /> : <OnboardingPage /> ) : (<LoginPage />)} />
      </Routes>
      <Toaster position='bottom-right' toastOptions={{ className: "!bg-base-100 !text-base-content" }} />
    </main>
  )
}

export default App
