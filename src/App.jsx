import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShowcaseBar from './components/ShowcaseBar';
import HubPage from './pages/HubPage';
import BarbershopPage from './pages/BarbershopPage';
import RestaurantPage from './pages/RestaurantPage';
import CoffeePage from './pages/CoffeePage';
import RenovationPage from './pages/RenovationPage';
import LightingPage from './pages/LightingPage';

// 1. Корневой компонент маршрутизации интерактивного шоурума (Хаб + 5 нишевых сайтов + глобальный ShowcaseBar)
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HubPage />} />
        <Route path="/barbershop" element={<BarbershopPage />} />
        <Route path="/restaurant" element={<RestaurantPage />} />
        <Route path="/coffee" element={<CoffeePage />} />
        <Route path="/renovation" element={<RenovationPage />} />
        <Route path="/lighting" element={<LightingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 2. Плавающая панель шоурума (отображается на всех роутах, кроме '/') */}
      <ShowcaseBar />
    </div>
  );
}
