import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { VisitorAppointment } from './pages/visitor-appointment';
import { NotificationPublishPage } from './pages/publish-notification';
import { VisitPage } from './pages/visit';
import { Passport } from './pages/passport';
import { PassportLayout } from './layout/passport-layout';
import { AppointmentProvider } from './context/appointment-context';
import { VisitorListPage } from './pages/visitor-list';

const routes: RouteObject[] = [
  {
    path: 'visitor',
    element: <PassportLayout />,
    children: [
      {
        path: ':id',
        element: <VisitPage />,
      },
      {
        path: ':id/passport',
        element: <Passport />,
      },
    ],
  },
  {
    path: 'visitor/appointment',
    element: <VisitorAppointment />,
  },
  {
    path: 'visitor/appointment/list',
    element: <VisitorListPage />,
  },
  {
    path: 'notification',
    element: <NotificationPublishPage />,
    children: [
      {
        path: 'publisher',
        element: <NotificationPublishPage />,
      },
    ],
  },
  // leave it for a while in case I missed any pathes
  // <Route path='/notification'>
  //   <Route element={<NotificationPublishPage/>}></Route>
  //   <Route path='publisher' element={<NotificationPublishPage/>}></Route>
  // </Route>
  //   <Route path='/visitor' element={<VisitorAppointment/>}>
  //       <Route path='appointment' element={<VisitorAppointment/>}>
  //         <Route index element={<VisitorAppointment/>}></Route>
  //         <Route path='list' element={<VisitorListPage/>}></Route>
  //       </Route>
  //     <Route element={<PassportLayout/>}>
  //       <Route path=':id' element={<VisitPage/>}></Route>
  //       <Route path=':id/passport' element={<Passport/>}></Route>
  //     </Route>
  //   </Route>
];

// HASH_ROUTER should only be true for github pages deployment as for now
// for other host solution, need check if non-hash router is supported.
// refer https://github.com/volodalexey/test_swapi_ant
const router =
  import.meta.env.REACT_APP_HASH_ROUTER === 'true'
    ? createHashRouter(routes)
    : createBrowserRouter(routes);

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <AppointmentProvider>
      <RouterProvider router={router} />
    </AppointmentProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
