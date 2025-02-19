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
import ProfilePage from './ProfilePage.tsx'
import Conversation from './Conversation.tsx'
import { SocketProviderWrapper } from './SocketProviderWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <AuthProviderWrapper>
        <SocketProviderWrapper>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LoginPage />}/>
            <Route path='/register' element={<RegisterPage />} />
          </Route>
          <Route element={<PrivateLayout />}>
            <Route path='/home' element={<HomePage />} />
            <Route path=':username' element={<ProfilePage />} />
            <Route path='/messages' element={<Conversation />} />
            <Route path='/messages/:conversationId' element={<Conversation />} />
          </Route>
        </Routes>
        </SocketProviderWrapper>
        </AuthProviderWrapper>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)


