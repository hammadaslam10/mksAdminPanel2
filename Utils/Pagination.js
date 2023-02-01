exports.getPagingData = (data1, page, limit) => {
  const { count: totalcount, rows: data } = data1;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalcount / limit);

  return { totalcount, data, totalPages, currentPage };
};
exports.getPagination = (page, size) => {
  const limit = size ? +size : 11;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
