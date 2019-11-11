import Vue from 'vue'
import VueRouter from 'vue-router'
import SelectionsOverview from '@/views/selections-overview';
import CalculationConfiguration from '@/views/calculation-configuration';

const routes = [{
    path: '/',
    redirect: '/selection'
  },
  {
    path: '/selection',
    component: SelectionsOverview,
    name: 'selection',
    meta: { step: 1 }
  },
  {
    path: '/calculation',
    component: CalculationConfiguration,
    name: 'calculation',
    meta: { step: 2 }
  }
]

Vue.use(VueRouter)

export default new VueRouter({ routes })