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
import ProtectedRoute from './protectedRoute';
import { AuthProvider } from './AuthContext';
import Login from './login';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: 'visitor',
    element: (
      <ProtectedRoute>
        <PassportLayout />,
      </ProtectedRoute>
    ),
    children: [
      {
        path: ':id',
        element: (
          <ProtectedRoute>
            <VisitPage />,
          </ProtectedRoute>
        ),
      },
      {
        path: ':id/passport',
        element: (
          <ProtectedRoute>
            <Passport />,
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: 'visitor/appointment',
    element: (
      <ProtectedRoute>
        <VisitorAppointment />,
      </ProtectedRoute>
    ),
  },
  {
    path: 'visitor/appointment/list',
    element: (
      <ProtectedRoute>
        <VisitorListPage />,
      </ProtectedRoute>
    ),
  },
  {
    path: 'notification',
    element: (
      <ProtectedRoute>
        <NotificationPublishPage />
      </ProtectedRoute>
    ),
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
    <AuthProvider>
      <AppointmentProvider>
        <RouterProvider router={router} />
      </AppointmentProvider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
