const Router = require('@koa/router');
const router = new Router({ prefix: '/category' });
const pool = require('../db/index');

router.get('/list', async (ctx) => {
    try {
        const sql = `
            SELECT c.id, c.name, c.icon, c.color, c.sort_order, 
                   DATE_FORMAT(c.create_time, '%Y-%m-%d %H:%i:%s') as create_time,
                   DATE_FORMAT(c.update_time, '%Y-%m-%d %H:%i:%s') as update_time,
                   COUNT(t.id) as task_count
            FROM category c
            LEFT JOIN task t ON c.id = t.category_id AND t.status = 1
            GROUP BY c.id
            ORDER BY c.sort_order ASC, c.id ASC
        `;
        const [categories] = await pool.query(sql);

        ctx.body = {
            code: 200,
            msg: 'success',
            data: categories
        };

    } catch (err) {
        console.error('查询分类列表失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.post('/create', async (ctx) => {
    const { name, icon, color, sort_order } = ctx.request.body;

    if (!name) {
        ctx.body = {
            code: 400,
            msg: '分类名称不能为空'
        };
        return;
    }

    try {
        const sql = `
            INSERT INTO category (name, icon, color, sort_order)
            VALUES (?, ?, ?, ?)
        `;

        const result = await pool.query(sql, [
            name,
            icon || 'default',
            color || '#FF6B00',
            sort_order || 0
        ]);

        ctx.body = {
            code: 200,
            msg: '创建成功',
            data: { id: result[0].insertId }
        };

    } catch (err) {
        console.error('创建分类失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.put('/:id', async (ctx) => {
    const categoryId = ctx.params.id;
    const { name, icon, color, sort_order } = ctx.request.body;

    try {
        const checkSql = `SELECT * FROM category WHERE id = ?`;
        const [categories] = await pool.query(checkSql, [categoryId]);

        if (categories.length === 0) {
            ctx.body = {
                code: 404,
                msg: '分类不存在'
            };
            return;
        }

        const currentCategory = categories[0];

        const updateSql = `
            UPDATE category 
            SET name = ?, icon = ?, color = ?, sort_order = ?
            WHERE id = ?
        `;

        await pool.query(updateSql, [
            name !== undefined ? name : currentCategory.name,
            icon !== undefined ? icon : currentCategory.icon,
            color !== undefined ? color : currentCategory.color,
            sort_order !== undefined ? sort_order : currentCategory.sort_order,
            categoryId
        ]);

        ctx.body = {
            code: 200,
            msg: '更新成功'
        };

    } catch (err) {
        console.error('更新分类失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.delete('/:id', async (ctx) => {
    const categoryId = ctx.params.id;

    try {
        const checkSql = `SELECT * FROM category WHERE id = ?`;
        const [categories] = await pool.query(checkSql, [categoryId]);

        if (categories.length === 0) {
            ctx.body = {
                code: 404,
                msg: '分类不存在'
            };
            return;
        }

        const deleteSql = `DELETE FROM category WHERE id = ?`;
        await pool.query(deleteSql, [categoryId]);

        ctx.body = {
            code: 200,
            msg: '删除成功'
        };

    } catch (err) {
        console.error('删除分类失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

module.exports = router;
