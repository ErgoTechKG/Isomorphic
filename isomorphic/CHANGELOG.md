# Change Log:

# v4.0.

- package update and minor issue fixed

# v4.0.1

- isomorphic-nextjs build issue fixed

# v4.0.0

- React, React-dom updated to latest version
- Next.js updated to latest version
- Antd library updated to latest version
- Google map info window issue fixed
- Non monorepo next.js version added
- Calender error fixed
- Style improvement
- Next js route error fixed
- Next js style issues fixed
- 2x faster performance
- Docker files removed
- Youtube search removed
- 3x faster build in the next.js version
- Image broken issue fixed

V3.05:

1. Freeze/Hang issue fixed on window resize
2. Notification issue fixed
3. Removed npm libraries that is not open source

V3.04

1. Update code base according to latest `cra` config.

- Add browserlist config at package.json
- Change `serviceWorker` code and apply it in `index.js` file.
- Update index.html code to latest cra code.
- Add `robots.txt` file within public.

2. Replace deprecated `LocalProvider` by `ConfigProvider` (antd).
3. Add `route.constants.js` file.
4. Add `React.lazy and React.Suspence` support. Remove `asyncComponent`
5. Add `ErrorBoundary` Component.
6. Create `route.constants.js` file for route name.
7. Remove `react-window-size-listener` and `react-throttle` package in favour of custom `useWindowSize` hook.
8. Rename App Container to Dashboard.
9. Remove unnecessary `Provider's` from `Dashboard` container
10. Remove `global.css` file add `DashboardGlobalStyles`.
11. change `import Input from '@isomorphic/shared/isomorphic/components/uielements/input';` to `import Input from '@iso/components/uielements/input';`
12. Refactor `sidebar, AppRouter, and Other Routing` to `react-router-dom` v5.1.1
13. Convert class components to functional components .
14. replace `connect` with `useSelector, useDispatch` from `react-redux` hooks.
15. Move `redux and container` folder to shared/isomorphic/
16. Remove `"leaflet-routing-machine": "^3.2.12", "leaflet.markercluster": "^1.4.1"`.
17. Remove `accountKit` implementation.
18. Remove global `antd.css` file , use `babel-plugin-import`

## Features:

1. Isomorphic GraphQL boilerplate Added.
2. Isomorphic boilerplate single Added.

# v3.0.4

1. Remove Hotel and Hotel Next
2. Add Isomorphic Package(For Without monorepo users)
3. Fix Isomorphic Boilerplate Single Issues
4. Fix start:all command issues
