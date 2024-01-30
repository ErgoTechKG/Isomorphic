import React, { lazy, Suspense } from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import Loader from '@iso/components/utility/loader';

const routes = [
  {
    path: '',
    component: lazy(() => import('../DashboardHomePage')),
    exact: true,
  },

  {
    path: 'blankPage',
    component: lazy(() => import('../BlankPage')),
  },
  {
    path: 'authCheck',
    component: lazy(() => import('../AuthCheck')),
  },
  {
    path: 'user',
    component: lazy(() => import('../User')),
  },
  {
    path: 'productlist',
    component: lazy(() => import('../Product')),
  },
  {
    path: 'financialTransaction',
    component: lazy(() => import('../FinancialTransaction')),
  },
  {
    path: 'cargo',
    component: lazy(() => import('../Cargo')),
  },
  {
    path: 'calculator',
    component: lazy(() => import('../Calculator')),
  },
  {
    path: 'inkOrder',
    component: lazy(() => import('../InkOrder')),
  },
  {
    path: 'temporary',
    component: lazy(() => import('../Temporary')),
  },
  {
    path: 'roll',
    component: lazy(() => import('../Roll')),
  },
  {
    path: 'sale',
    component: lazy(() => import('../Sale')),
  },
  {
    path: 'client',
    component: lazy(() => import('../Client')),
  },
];

export default function AppRouter() {
  const { url } = useRouteMatch();
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {routes.map((route, idx) => (
          <Route exact={route.exact} key={idx} path={`${url}/${route.path}`}>
            <route.component />
          </Route>
        ))}
      </Switch>
    </Suspense>
  );
}
