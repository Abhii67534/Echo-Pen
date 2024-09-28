import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Signup } from './pages/Signup'
import { Home } from './pages/Home'
import { RecoilRoot } from 'recoil'
import { BlogPost } from './pages/BlogPost'
import Navbar from './components/ui/navbar'


function App() {

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>

          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-post" element={<BlogPost />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
