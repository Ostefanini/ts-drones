import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications';

import './index.css'
import './i18n';
import App from './App.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      forceColorScheme="dark"
    >
      <Notifications zIndex={9999999999999} />
      <App />
    </MantineProvider>
  </StrictMode>,
)
