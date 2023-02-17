import { useState } from 'react';

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/layout.component';
import Home from './pages';
import ChangePassword from './pages/auth/change-password';
import ForgotPassword from './pages/auth/forgot-password';
import VerifyOTP from './pages/auth/verify-otp';
import Signin from './pages/auth/signin';
import Signup from './pages/auth/signup';
import Search from './pages/search';
import Post from './pages/post';
import BookDetails from './pages/book/[id]';
import PublisherDetails from './pages/publisher/[id]';
import AuthorDetails from './pages/author/[id]';
import CreateAuthor from './pages/author/create';
import CreatePublisher from './pages/publisher/create';
import Profile from './pages/profile';
import Saved from './pages/saved';

import usePortal from './hooks/use-portal';
import NotFound from './pages/not-found';

function App() {
  const Portal = usePortal();

  return (
    <>
      {Portal}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth">
            <Route path="signin" element={<Signin />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-otp" element={<VerifyOTP />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route path="/search" element={<Search />} />
          <Route path="/post" element={<Post />} />
          <Route path="book">
            <Route path=":id" element={<BookDetails />} />
          </Route>
          <Route path="publisher">
            <Route path=":id" element={<PublisherDetails />} />
            <Route path="create" element={<CreatePublisher />} />
          </Route>
          <Route path="author">
            <Route path=":id" element={<AuthorDetails />} />
            <Route path="create" element={<CreateAuthor />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
