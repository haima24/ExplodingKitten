import { lazy, useSyncExternalStore } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/common/AppShell';
import { HomePage } from './features/home/HomePage';
import { NotFoundPage } from './features/home/NotFoundPage';
import { CreatePage } from './features/rooms/CreatePage';
import { JoinPage } from './features/rooms/JoinPage';
import { RoomPage } from './features/rooms/RoomPage';
import { getLocale, subscribeLocale } from './copy';
import { StoreProvider } from './net/context';

// Static pages are split out of the main bundle.
const RulesPage = lazy(() =>
  import('./features/rules/RulesViews').then((m) => ({ default: m.RulesPage })),
);
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPanel').then((m) => ({ default: m.SettingsPage })),
);
const PrivacyPage = lazy(() =>
  import('./features/home/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);

export function App(): JSX.Element {
  // Re-render the whole tree when the language changes (every `t()` call is plain
  // text, so a parent render is what refreshes it). State is kept.
  useSyncExternalStore(subscribeLocale, getLocale);
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="create" element={<CreatePage />} />
            <Route path="join" element={<JoinPage />} />
            <Route path="join/:code" element={<JoinPage />} />
            <Route path="room/:code" element={<RoomPage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}
