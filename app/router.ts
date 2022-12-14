import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const isOnline = app.middleware.isOnline
  const isAdmin = app.middleware.isAdmin 

  //user
  router.post('/api/register', controller.user.register);
  router.post('/api/login', controller.user.login);
  router.post('/api/bus/select',isOnline, controller.bus.busChoose)

  router.get('/api/bus', isOnline,controller.user.busInfo)
  router.get('/api/schedule', isOnline,controller.bus.scheduldInfo)

  router.delete('/api/logout', isOnline, controller.user.logout);
  router.delete('/api/bus/delete/:id',isOnline, controller.bus.busDropOut)
  //admin
  router.post('/api/admin/addbus',isOnline,isAdmin, controller.admin.addBus)
  router.post('/api/admin/changeinfo',isOnline,isAdmin,controller.admin.changeBusInfo)

  router.get('/api/admin/userlist',isOnline,isAdmin,controller.admin.userList)
  router.get('/api/admin/achedule/user',isOnline,isAdmin,controller.admin.userScheduldInfo)
  router.get('/api/admin/schedule/bus',isOnline,isAdmin,controller.admin.busScheduleInfo)

  router.delete('/api/admin/delete/bus/:id',isOnline,isAdmin, controller.admin.deleteBus)

};
