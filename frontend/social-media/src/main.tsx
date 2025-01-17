import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from './src/components/ui/provider.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RegisterPage from './RegisterPage.tsx'
import { PublicLayout } from './layouts/PublicLayout.tsx'
import LoginPage from './LoginPage.tsx'
import HomePage from './HomePage.tsx'
import { PrivateLayout } from './layouts/PrivateLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LoginPage />}/>
            <Route path='/register' element={<RegisterPage />} />
          </Route>
          <Route element={<PrivateLayout />}>
            <Route path='/home'>
              <Route index element={<HomePage />} />
            </Route>
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)


