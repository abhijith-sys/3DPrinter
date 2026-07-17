import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Workshop from './pages/Workshop'
import Upload from './pages/Upload'
import Configure from './pages/Configure'
import Review from './pages/Review'
import Capabilities from './pages/Capabilities'
import ResourceHub from './pages/ResourceHub'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/workshop" element={<Workshop />} />
      <Route path="/quote" element={<Upload />} />
      <Route path="/quote/configure" element={<Configure />} />
      <Route path="/quote/review" element={<Review />} />
      <Route path="/capabilities" element={<Capabilities />} />
      <Route path="/resources" element={<ResourceHub />} />
    </Routes>
  )
}
