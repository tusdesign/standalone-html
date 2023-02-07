import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { VisitorAppointment } from './pages/visitor-appointment';
import { NotificationPublishPage } from './pages/publish-notification';
import { VisitorPass } from './pages/visitor-pass';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<VisitorAppointment/>}></Route>
        <Route path='/notification'>
          <Route index element={<NotificationPublishPage/>}></Route>
          <Route path='publisher' element={<NotificationPublishPage/>}></Route>
        </Route>
        <Route path='/visitor'>
          <Route path='passport/:id' element={<VisitorPass/>}></Route>
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
