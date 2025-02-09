import { ToastContainer } from 'react-toastify'
import './App.css'
import SorterTool from './components/sorter-tool/SorterTool'
import useThemeDetector from './hooks/ThemeDetector';

function App() {
  const isDarkTheme = useThemeDetector();
  return (
    <div className="bg-white dark:bg-gray-800 h-screen">
      <SorterTool />
      <ToastContainer newestOnTop={true} draggable={false} theme={isDarkTheme ? "dark" : "light"} />
    </div>
  )
}

export default App
