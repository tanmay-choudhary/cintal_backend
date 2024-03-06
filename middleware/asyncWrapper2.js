const asyncWrapper2 = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

module.exports = asyncWrapper2;
