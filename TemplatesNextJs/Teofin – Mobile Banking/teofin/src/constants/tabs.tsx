import {svg} from '@/assets/svg';
import {routes} from '@/constants/routes';

type Tab = {
  id: number;
  route: string;
  icon: any;
  name: string;
};

export const tabs: Tab[] = [
  {
    id: 1,
    name: 'Dashboard',
    route: routes.dashboard,
    icon: svg.DashboardIconSvg,
  },
  {
    id: 2,
    name: 'Deposits',
    route: routes.deposits,
    icon: svg.DepositIconSvg,
  },
  {
    id: 3,
    name: 'Loans',
    route: routes.loans,
    icon: svg.LoansIconSvg,
  },
  {
    id: 4,
    name: 'Notifications',
    route: routes.notifications,
    icon: svg.NotificationsIconSvg,
  },
  {
    id: 5,
    name: 'More',
    route: routes.more,
    icon: svg.MoreIconSvg,
  },
];
