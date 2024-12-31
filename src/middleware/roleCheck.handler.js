export const checkAdmin = async (req, res, next) => {
    try {
      const user = req.user
    //   console.log(user)
      if(user.role !== 'admin') {
        req.session.messages = "Necesitas credenciales de admin para acceder esta sección"
        res.status(400).redirect("/loginError")}
      else next();
    } catch (error) {
      next(error)
    }
  };

  export const checkUser = async (req, res, next) => {
    try {
      const user = req.user
      if(user.role !== "user") {
        req.session.messages = "Necesitas credenciales de user para acceder esta sección"
        res.status(401).redirect("/loginerror")
      } else next();
    } catch (error) {
      next(error)
    }
  };

