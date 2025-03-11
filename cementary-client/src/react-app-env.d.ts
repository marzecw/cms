/// <reference types="react-scripts" />

declare module '@mui/x-date-pickers' {
  import * as React from 'react';
  export const LocalizationProvider: React.FC<{
    dateAdapter: any;
    children: React.ReactNode;
  }>;
}

declare module '@mui/x-date-pickers/AdapterDateFns' {
  export default class AdapterDateFns {}
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module './components/Layout' {
  import { FC } from 'react';
  const Layout: FC;
  export default Layout;
}

declare module './components/ProtectedRoute' {
  import { FC } from 'react';
  const ProtectedRoute: FC;
  export default ProtectedRoute;
}

declare module './pages/Login' {
  import { FC } from 'react';
  const Login: FC;
  export default Login;
}

declare module './pages/Dashboard' {
  import { FC } from 'react';
  const Dashboard: FC;
  export default Dashboard;
}

declare module './pages/Users' {
  import { FC } from 'react';
  const Users: FC;
  export default Users;
}

declare module './pages/Tenants' {
  import { FC } from 'react';
  const Tenants: FC;
  export default Tenants;
}

declare module './pages/Cemeteries' {
  import { FC } from 'react';
  const Cemeteries: FC;
  export default Cemeteries;
}

declare module './pages/Gardens' {
  import { FC } from 'react';
  const Gardens: FC;
  export default Gardens;
}

declare module './pages/Lots' {
  import { FC } from 'react';
  const Lots: FC;
  export default Lots;
}

declare module './pages/Spaces' {
  import { FC } from 'react';
  const Spaces: FC;
  export default Spaces;
}

declare module './pages/Customers' {
  import { FC } from 'react';
  const Customers: FC;
  export default Customers;
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
