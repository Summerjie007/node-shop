const sqlExcute = require('../db')

const getNewsSql = `SELECT id, title, icon, description, views 
                    FROM news
                    WHERE del_state = 0
                    LIMIT ?, ?;
                    SELECT COUNT(*) as count 
                    FROM news
                    WHERE del_state = 0`

const getNewsByKeysSql = `SELECT id, title, icon, description, views 
                          FROM news
                          WHERE del_state = 0
                          AND CONCAT(title, description) LIKE ?
                          LIMIT ?, ?;
                          SELECT COUNT(*) as count 
                          FROM news
                          WHERE del_state = 0
                          AND CONCAT(title, description) LIKE ?`

const getNewsByCategoriesSql = `SELECT id, title, icon, description, views 
                          FROM news
                          WHERE del_state = 0
                          AND cate_id = ?
                          LIMIT ?, ?;
                          SELECT COUNT(*) as count 
                          FROM news
                          WHERE del_state = 0
                          AND cate_id = ?`

const getNewsCategoriesSql = `SELECT * FROM news_cate`
function checkNewsSql(req) {

  const pageSize = parseInt(req.query.pageSize)

  if ('cate' in req.query) {
    return sqlExcute(getNewsByCategoriesSql, [req.query.cate, (req.query.page - 1) * pageSize, pageSize, req.query.cate])
  }

  if (req.query.keys) {
    return sqlExcute(getNewsByKeysSql, ['%' + req.query.keys + '%', (req.query.page - 1) * pageSize, pageSize, '%' + req.query.keys + '%'])
  }

  return sqlExcute(getNewsSql, [(req.query.page - 1) * pageSize, pageSize])
}

module.exports = {
  getNewsAction(req, res) {

    const attrs = ['page', 'pageSize']
    if (!req.checkFormBody(attrs, res)) return

    // sqlExcute(getNewsSql, [req.query.page - 1, parseInt(req.query.pageSize)])
    checkNewsSql(req)
      .then(result => {
        // console.log(result[0])
        // console.log(result[1])
        res.sendSucc('获取新闻列表数据成功!', { news: result[0], totalCount: result[1][0].count })
      })
      .catch(e => {
        res.sendErr(400, e.message)
      })
  },
  getNewsCategoriesAction(req, res) {
    sqlExcute(getNewsCategoriesSql)
      .then(result => {
        res.sendSucc('获取新闻分类列表成功!', result)
      })
      .catch(e => {
        res.sendErr(400, e.message)
      })
  }
}