import { VeltPresence, VeltProvider } from '@veltdev/react'
import './App.css'
import CodeEditorTabs from './components/CodeEditorTabs'
import VeltCollaboration from './velt-components/VeltCollaboration'

function App() {

  return (
    <>
      <VeltProvider apiKey={'Emcfab4ysRXaC1CZ8hmG'}>
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">Velt Collaborative CodeMirror Editor</h1>
            <div className="login-section">
              <VeltPresence />
              <VeltCollaboration />
            </div>
          </header>
          <main className="app-content">
            <CodeEditorTabs />
          </main>
        </div>
      </VeltProvider>
    </>
  )
}

export default App
