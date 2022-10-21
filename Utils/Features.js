class Features {
  constructor(query, querystr, stringSearchFields, numberSearchFields) {
    this.query = query;
    this.querystr = querystr;
    this.stringSearchFields = stringSearchFields;
    this.numberSearchFields = numberSearchFields;
  }
  searching() {
    const stringSearchFields = this.stringSearchFields;
    const numberSearchFields = this.numberSearchFields;
    if (numberSearchFields === null) {
      const returnquery = {
        $or: [
          ...stringSearchFields.map((field) => ({
            [field]: new RegExp("^" + this.querystr.keyword, "i")
          }))
        ]
      };

      this.query = this.query.find(returnquery);

      return this;
    } else if (stringSearchFields === null) {
      const returnquery = {
        $or: [
          ...numberSearchFields.map((field) => ({
            $where: `/^${this.querystr.keyword}.*/.test(this.${field})`
          }))
        ]
      };

      this.query = this.query.find(returnquery);

      return this;
    } else {
      const returnquery = {
        $or: [
          ...stringSearchFields.map((field) => ({
            [field]: new RegExp("^" + this.querystr.keyword, "i")
          })),
          ...numberSearchFields.map((field) => ({
            $where: `/^${this.querystr.keyword}.*/.test(this.${field})`
          }))
        ]
      };

      this.query = this.query.find(returnquery);

      return this;
    }
  }

  filter() {
    const queryCopy = { ...this.querystr };

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.querystr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = Features;
