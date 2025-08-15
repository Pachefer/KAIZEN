import {routes} from './routes';

import {svg} from '@/assets/svg';

export const tabs = [
  {
    id: 1,
    title: 'Home',
    route: routes.home,
    icon: svg.HomeSvg,
  },
  {
    id: 2,
    title: 'Search',
    route: routes.search,
    icon: svg.SearchSvg,
  },
  {
    id: 3,
    title: 'Order',
    route: routes.order,
    icon: svg.BagSvg,
  },
  {
    id: 4,
    title: 'Profile',
    route: routes.profile,
    icon: svg.UserSvg,
  },
];
