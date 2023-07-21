/**
 * HTTP Response
 * @param {Object} res Express Response
 * @param {Number} statusCode HTTP Status Code
 * @param {Any} data Data to show
 * @param {Object} pagination Pagination
 * @param {String} message Message
 */

const httpRes = (res, statusCode, data, pagination, message = 'success') => {
    let total;
    if (!pagination && Array.isArray(data)) {
      total = data.length;
    }
  
    res.status(statusCode);
    return res.json({
      statusCode,
      message,
      total,
      data,
      pagination,
    });
  };
  
  module.exports = httpRes;
  