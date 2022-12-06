import React from 'react';
import './Options.css';
import { Route, Routes, HashRouter } from 'react-router-dom';
import KeyWord from './components/KeyWord';
import { RecoilRoot } from 'recoil';
import CurrentJobs from './components/CurrentJobs';
const Options = () => {
  return (
    <div>
      <RecoilRoot>
        <HashRouter>
          <Routes>
            <Route path="/" element={<KeyWord />}></Route>
            <Route path="currentJobs/:id" element={<CurrentJobs />}></Route>
          </Routes>
        </HashRouter>
      </RecoilRoot>
    </div>
  );
};

export default Options;
