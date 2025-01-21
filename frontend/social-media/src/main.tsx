import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from './src/components/ui/provider.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RegisterPage from './RegisterPage.tsx'
import { PublicLayout } from './layouts/PublicLayout.tsx'
import LoginPage from './LoginPage.tsx'
import HomePage from './HomePage.tsx'
import { PrivateLayout } from './layouts/PrivateLayout.tsx'
import { AuthProviderWrapper } from './AuthProviderWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <AuthProviderWrapper>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LoginPage />}/>
            <Route path='/register' element={<RegisterPage />} />
          </Route>
          <Route element={<PrivateLayout />}>
            <Route path='/home' element={<HomePage />} />
          </Route>
        </Routes>
        </AuthProviderWrapper>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)


