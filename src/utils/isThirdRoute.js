// 判断路由是否为三级路由
// 如果是，则返回其父路由的Name，及其自己的Name
export default function isThirdRoute(allRoutes, currentRoute, parentName = '') {
  const all = JSON.parse(JSON.stringify(allRoutes));
  const current = String(currentRoute);
  let parent = parentName;
  let res = {};

  all.some((route) => {
    if (route.name !== current) {
      if (route.children) {
        parent = route.name;
        res = isThirdRoute(route.children, current, parent);
        if (res) {
          return true;
        }
        return false;
      }
      return false;
    } if (parent) {
      res.parent = parent;
      res.current = current;
      return true;
    }
    return false;
  });
  return res;
}
