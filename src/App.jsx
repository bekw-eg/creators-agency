import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShowcaseBar from './components/ShowcaseBar';
import HomePage from './home/HomePage';

// Демо-кейсы грузятся отдельными чанками, чтобы не утяжелять главную.
const BarbershopPage = lazy(() => import('./pages/BarbershopPage'));
const RestaurantPage = lazy(() => import('./pages/RestaurantPage'));
const CoffeePage = lazy(() => import('./pages/CoffeePage'));
const RenovationPage = lazy(() => import('./pages/RenovationPage'));
const LightingPage = lazy(() => import('./pages/LightingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Главная — сайт агентства Creators Digital; остальные маршруты — интерактивные демо-кейсы.
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="min-h-screen bg-[#0A0A0C]" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/barbershop" element={<BarbershopPage />} />
        <Route path="/restaurant" element={<RestaurantPage />} />
        <Route path="/coffee" element={<CoffeePage />} />
        <Route path="/renovation" element={<RenovationPage />} />
        <Route path="/lighting" element={<LightingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>

      {/* Плавающая панель шоурума (отображается на всех роутах, кроме '/') */}
      <ShowcaseBar />
    </div>
  );
}
