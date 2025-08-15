import {routes} from './routes';
import {svg} from '@/assets/svg';

export const tabs = [
  {
    id: 1,
    route: routes.home,
    icon: svg.HomeSvg,
  },
  {
    id: 2,
    route: routes.order,
    icon: svg.BagSvg,
  },
  {
    id: 3,
    route: routes.wishlist,
    icon: svg.HeartSvg,
  },
  {
    id: 4,
    route: routes.profile,
    icon: svg.UserSvg,
  },
];
